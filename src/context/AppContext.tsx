'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { User } from '@/types'
import { api } from '@/lib/api'

// ─── State Shape ──────────────────────────────────────────────────────────────
interface AppState {
  user: User | null
  isLoading: boolean  // true while checking if user is already logged in
  isAuthenticated: boolean
}

// ─── Actions ──────────────────────────────────────────────────────────────────
// Using a discriminated union — TypeScript will narrow the type based on `type`
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }

// ─── Reducer ──────────────────────────────────────────────────────────────────
// Pure function: takes current state + action, returns new state.
// Never mutate state directly — always return a new object.
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case 'CLEAR_USER':
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

// ─── Context Types ────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState
  setUser: (user: User) => void
  clearUser: () => void
}

// ─── Create Context ───────────────────────────────────────────────────────────
// undefined default — we'll throw if used outside provider
const AppContext = createContext<AppContextValue | undefined>(undefined)

// ─── Provider Component ───────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    isLoading: true,  // start as loading — we check auth on mount
    isAuthenticated: false,
  })

  // On app load, check if there's a valid session (cookie is still valid)
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await api.get<User>('/auth/me')
        dispatch({ type: 'SET_USER', payload: user })
      } catch {
        // No valid session — that's fine, user just needs to log in
        dispatch({ type: 'CLEAR_USER' })
      }
    }
    checkAuth()
  }, [])

  const setUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  const clearUser = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' })
  }, [])

  return (
    <AppContext.Provider value={{ state, setUser, clearUser }}>
      {children}
    </AppContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Throws a helpful error if used outside of AppProvider
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside <AppProvider>')
  }
  return context
}
