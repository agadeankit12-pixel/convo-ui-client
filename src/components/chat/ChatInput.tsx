'use client'

import { useState, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (content: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled?: boolean
}

// ─── ChatInput ────────────────────────────────────────────────────────────────
// The message input bar at the bottom of the chat.
// Features:
//   - Auto-resizing textarea (grows with content, up to 5 rows)
//   - Enter to send, Shift+Enter for newline
//   - Shows "Stop" button while AI is responding
//   - Disabled while messages are loading

export default function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = value.trim().length > 0 && !isStreaming && !disabled

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return

    onSend(trimmed)
    setValue('')  // clear input after sending

    // Refocus the textarea so user can keep typing
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter = send (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()  // prevent newline
      handleSend()
    }
    // Shift+Enter = newline (default textarea behavior, we just don't prevent it)
  }

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            'flex items-end gap-2 bg-white border rounded-2xl px-4 py-3 transition-shadow',
            isStreaming
              ? 'border-brand-300 shadow-sm shadow-brand-100'
              : 'border-gray-200 focus-within:border-brand-300 focus-within:shadow-sm focus-within:shadow-brand-100'
          )}
        >
          {/* Textarea — auto-resizes from 1 to 5 rows */}
          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || disabled}
            placeholder={isStreaming ? 'AI is responding...' : 'Message ConvoAI...'}
            minRows={1}
            maxRows={5}
            className={cn(
              'flex-1 resize-none bg-transparent text-sm text-gray-900',
              'placeholder:text-gray-400 focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'leading-relaxed py-0.5'
            )}
          />

          {/* Action button: Stop (while streaming) or Send (otherwise) */}
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 hover:bg-gray-700
                         flex items-center justify-center transition-colors"
              title="Stop generating"
            >
              {/* Stop icon: filled square */}
              <div className="w-3 h-3 bg-white rounded-sm" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                canSend
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              )}
              title="Send message (Enter)"
            >
              {/* Send icon: arrow up */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12V2M7 2L3 6M7 2L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Hint text */}
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
