// ─── Core Domain Types ────────────────────────────────────────────────────────
// These mirror the Prisma models on the server.
// Keep them in sync if you update the DB schema.

export interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
  createdAt: string
}

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  componentType?: string | null
  componentData?: Record<string, unknown> | null
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  userId: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
  _count?: { messages: number }
}

// ─── API Response Shape ───────────────────────────────────────────────────────
// Every API response from our backend follows this shape.
export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ─── Schema-Driven Component Types ───────────────────────────────────────────
// The backend can instruct the frontend to render a specific UI component
// by including componentType and componentData in the message.

export type ComponentType = 'card' | 'table' | 'list'

export interface CardData {
  title: string
  subtitle?: string
  items: { label: string; value: string }[]
}

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface ListData {
  items: string[]
}

// ─── UI State Types ───────────────────────────────────────────────────────────

// A "streaming message" is one being typed out in real time
// It may not be saved to the DB yet
export interface StreamingMessage {
  role: 'assistant'
  content: string
  isStreaming: true
}

// Chat state managed by useChat hook
export interface ChatState {
  messages: Message[]
  isStreaming: boolean
  error: string | null
}
