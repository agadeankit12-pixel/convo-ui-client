'use client'

// ─── TypingIndicator ──────────────────────────────────────────────────────────
// Shown after user sends a message, before the first token arrives.
// Three dots that animate in sequence — the classic "AI is thinking" indicator.

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 px-2 py-1.5">
      {/* AI avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-1">
          <span className="text-xs font-medium text-gray-700">ConvoAI</span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1 py-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
