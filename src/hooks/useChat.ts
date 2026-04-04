'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { api, streamMessage } from '@/lib/api'
import { Message, Conversation } from '@/types'

// ─── useChat ──────────────────────────────────────────────────────────────────
// The heart of the chat feature. Manages:
//   - Loading messages for a conversation
//   - Sending messages and streaming the AI response
//   - Streaming state (token accumulation)
//   - Abort / stop generation
//
// Everything in here is pure logic — no JSX, no UI code.

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingContent, setStreamingContent] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AbortController ref — lets us cancel a running stream
  // We use a ref (not state) because changing it shouldn't trigger re-renders
  const abortControllerRef = useRef<AbortController | null>(null)

  // ─── Load messages when conversationId changes ────────────────────────────
  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    async function loadMessages() {
      setIsLoadingMessages(true)
      setError(null)
      try {
        const conv = await api.get<Conversation>(`/conversations/${conversationId}`)
        setMessages(conv.messages || [])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    loadMessages()

    // Cleanup: abort any running stream when switching conversations
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [conversationId])

  // ─── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || isStreaming) return
    setError(null)

    // 1. Optimistic update: add user message to UI immediately
    //    The real message (with DB id) comes back from the server
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMessage])

    // 2. Start streaming state
    setIsStreaming(true)
    setStreamingContent('')

    // 3. Create an AbortController to allow stop generation
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      await streamMessage(
        content,
        conversationId,
        {
          // Replace the temp user message with the real one from DB
          onMessageSaved: (savedMessage) => {
            setMessages(prev =>
              prev.map(m => m.id === tempUserMessage.id ? savedMessage as Message : m)
            )
          },

          // Append each incoming token to streamingContent
          onToken: (token) => {
            setStreamingContent(prev => prev + token)
          },

          // Streaming complete — replace streaming content with saved message
          onDone: (savedAiMessage) => {
            setMessages(prev => [...prev, savedAiMessage as Message])
            setStreamingContent('')
            setIsStreaming(false)
          },

          onError: (errMsg) => {
            setError(errMsg)
            setStreamingContent('')
            setIsStreaming(false)
            // Remove the optimistic user message on error
            setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
          },
        },
        controller.signal
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Failed to send message')
        setIsStreaming(false)
        setStreamingContent('')
      }
    }
  }, [conversationId, isStreaming])

  // ─── Stop Generation ──────────────────────────────────────────────────────
  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
    // Keep whatever was streamed so far as a message
    if (streamingContent) {
      const partialMessage: Message = {
        id: `partial-${Date.now()}`,
        conversationId: conversationId!,
        role: 'assistant',
        content: streamingContent + ' _(generation stopped)_',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, partialMessage])
      setStreamingContent('')
    }
  }, [streamingContent, conversationId])

  return {
    messages,
    streamingContent,
    isStreaming,
    isLoadingMessages,
    error,
    sendMessage,
    stopStreaming,
  }
}
