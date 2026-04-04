'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Conversation } from '@/types'

// ─── useConversations ─────────────────────────────────────────────────────────
// Manages the list of conversations shown in the sidebar.
// Handles: fetching, creating, deleting, renaming.

export function useConversations() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ─── Fetch All ─────────────────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.get<Conversation[]>('/conversations')
      setConversations(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load on mount
  useEffect(() => { fetchConversations() }, [fetchConversations])

  // ─── Create ────────────────────────────────────────────────────────────────
  const createConversation = useCallback(async (): Promise<Conversation | null> => {
    try {
      const newConv = await api.post<Conversation>('/conversations', {})
      // Optimistic update: add to local list immediately
      setConversations(prev => [newConv, ...prev])
      router.push(`/chat/${newConv.id}`)
      return newConv
    } catch (err) {
      setError((err as Error).message)
      return null
    }
  }, [router])

  // ─── Rename ────────────────────────────────────────────────────────────────
  const renameConversation = useCallback(async (id: string, title: string) => {
    // Optimistic update — update UI immediately, sync with server after
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c))
    )
    try {
      await api.patch(`/conversations/${id}`, { title })
    } catch {
      // Rollback on failure by refetching
      fetchConversations()
    }
  }, [fetchConversations])

  // ─── Delete ────────────────────────────────────────────────────────────────
  const deleteConversation = useCallback(async (id: string) => {
    // Optimistic update
    setConversations(prev => prev.filter(c => c.id !== id))
    try {
      await api.delete(`/conversations/${id}`)
      router.push('/chat')
    } catch {
      fetchConversations() // rollback
    }
  }, [router, fetchConversations])

  // ─── Update title locally (called after auto-title from AI) ───────────────
  const updateLocalTitle = useCallback((id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c))
    )
  }, [])

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    renameConversation,
    deleteConversation,
    updateLocalTitle,
    refresh: fetchConversations,
  }
}
