'use client'

import { useConversations } from '@/hooks/useConversations'
import { useApp } from '@/context/AppContext'

// Shown when no conversation is selected (/chat with no id)
const SUGGESTIONS = [
  { icon: '✍️', text: 'Help me write a cover letter' },
  { icon: '🧮', text: 'Explain how async/await works' },
  { icon: '📊', text: 'Compare SQL vs NoSQL databases' },
  { icon: '🔍', text: 'Review my code for improvements' },
]

export default function ChatIndexPage() {
  const { state } = useApp()
  const { createConversation } = useConversations()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">

      {/* Greeting */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">C</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Hello, {state.user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500 mt-1 text-sm">What would you like to talk about?</p>
      </div>

      {/* Suggestion chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={async () => {
              // Create a new conversation and it will redirect automatically
              await createConversation()
            }}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl
                       border border-gray-200 hover:border-brand-300 hover:bg-brand-50
                       text-sm text-gray-700 transition-all group"
          >
            <span className="text-lg">{s.icon}</span>
            <span className="flex-1">{s.text}</span>
            <span className="text-gray-300 group-hover:text-brand-400 transition-colors">→</span>
          </button>
        ))}
      </div>

      {/* New chat button */}
      <button
        onClick={createConversation}
        className="mt-8 bg-brand-600 hover:bg-brand-700 text-white
                   px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        + New conversation
      </button>
    </div>
  )
}
