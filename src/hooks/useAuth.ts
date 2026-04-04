'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useApp } from '@/context/AppContext'
import { User } from '@/types'

// ─── useAuth ──────────────────────────────────────────────────────────────────
// Encapsulates all authentication actions.
// Components just call login(), register(), logout() — no fetch logic in UI.
//
// RULE: Hooks handle logic. Components handle display.

export function useAuth() {
  const { setUser, clearUser } = useApp()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Login ─────────────────────────────────────────────────────────────────
  async function login(email: string, password: string) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await api.post<User>('/auth/login', { email, password })
      setUser(user)
      router.push('/chat')    // redirect to chat on success
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Register ──────────────────────────────────────────────────────────────
  async function register(email: string, name: string, password: string) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await api.post<User>('/auth/register', { email, name, password })
      setUser(user)
      router.push('/chat')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  async function logout() {
    try {
      await api.post('/auth/logout', {})
    } finally {
      // Clear local state regardless of server response
      clearUser()
      router.push('/login')
    }
  }

  return { login, register, logout, isLoading, error, setError }
}
