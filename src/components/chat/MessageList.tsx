'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import StreamingBubble from './StreamingBubble'

interface MessageListProps {
  messages: Message[]
  streamingContent: string
  isStreaming: boolean
  isLoading: boolean
  error: string | null
}

export default function MessageList({
  messages,
  streamingContent,
  isStreaming,
  isLoading,
  error,
}: MessageListProps) {
  // Ref to the scroll container — we use it to auto-scroll on new messages
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever messages or streaming content changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-300 rounded-full animate-pulse-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Send a message to start the conversation</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Render all saved messages */}
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index === messages.length - 1 ? 0 : 0 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming AI response — shown while tokens are coming in */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {streamingContent ? (
              // We have content — show it streaming in
              <StreamingBubble content={streamingContent} />
            ) : (
              // No content yet — show the typing dots
              <TypingIndicator />
            )}
          </motion.div>
        )}

        {/* Invisible div at the bottom — we scroll to this */}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
