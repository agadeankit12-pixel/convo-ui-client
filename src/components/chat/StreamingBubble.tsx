'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ─── StreamingBubble ──────────────────────────────────────────────────────────
// Renders the AI message WHILE it is being streamed.
// Unlike MessageBubble which renders a saved Message object, this
// takes a raw string (streamingContent) that grows with each token.
//
// We show a blinking cursor at the end to signal text is still coming.

interface StreamingBubbleProps {
  content: string
}

export default function StreamingBubble({ content }: StreamingBubbleProps) {
  return (
    <div className="flex gap-3 px-2 py-1.5 rounded-xl">
      {/* AI avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-0.5">
          <span className="text-xs font-medium text-gray-700">ConvoAI</span>
        </div>

        {/* Render markdown as it streams in */}
        <div className="chat-prose max-w-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
          {/* Blinking cursor — signals text is still arriving */}
          <span className="inline-block w-0.5 h-4 bg-brand-600 ml-0.5 animate-pulse align-middle" />
        </div>
      </div>
    </div>
  )
}
