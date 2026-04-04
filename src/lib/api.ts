// ─── API Client ───────────────────────────────────────────────────────────────
// A thin wrapper around fetch() that:
//   1. Prefixes all URLs with the API base URL
//   2. Always includes credentials (cookies) — needed for JWT auth
//   3. Sets JSON headers automatically
//   4. Parses responses and throws on errors
//
// Why centralize this? If the API URL changes or you need to add a header
// everywhere (e.g. CSRF token), you change it in ONE place.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}/api${endpoint}`

  const config: RequestInit = {
    ...options,
    credentials: 'include', // ALWAYS send cookies with every request
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(url, config)
  const data = await response.json()

  // Our API always returns { success, data?, error? }
  // If success is false or HTTP status is error, throw
  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error || 'Something went wrong',
      response.status
    )
  }

  return data.data as T
}

// ─── Convenience Methods ──────────────────────────────────────────────────────
export const api = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

// ─── SSE Streaming Client ─────────────────────────────────────────────────────
// SSE via POST isn't standard (EventSource only supports GET).
// We use fetch() with a ReadableStream reader instead.
// This gives us streaming + ability to send a POST body.

export interface StreamCallbacks {
  onToken: (token: string) => void           // called for each streamed token
  onDone: (message: unknown) => void         // called when stream completes
  onError: (error: string) => void           // called on error
  onMessageSaved?: (message: unknown) => void // called when user msg is confirmed
}

export async function streamMessage(
  content: string,
  conversationId: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal  // pass this to allow cancellation
): Promise<void> {
  const url = `${BASE_URL}/api/messages`

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, conversationId }),
    signal,
  })

  if (!response.ok) {
    const err = await response.json()
    callbacks.onError(err.error || 'Failed to send message')
    return
  }

  // Read the stream using the Web Streams API
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Decode the chunk (may contain multiple SSE events)
      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n')

      // Parse SSE format: "event: type\ndata: {...}\n\n"
      let eventType = ''
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim()
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (eventType === 'token') callbacks.onToken(data.token)
            else if (eventType === 'done') callbacks.onDone(data.message)
            else if (eventType === 'message_saved') callbacks.onMessageSaved?.(data.message)
            else if (eventType === 'error') callbacks.onError(data.message)
          } catch {
            // Ignore malformed JSON lines
          }
        }
      }
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      callbacks.onError('Stream interrupted')
    }
  } finally {
    reader.releaseLock()
  }
}

export { ApiError }
