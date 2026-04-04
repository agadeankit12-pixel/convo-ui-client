'use client'

import { useConversations } from '@/hooks/useConversations'
import Sidebar from '@/components/chat/Sidebar'

// ─── Chat Layout ──────────────────────────────────────────────────────────────
// This layout wraps both /chat and /chat/[id].
// It creates the sidebar + main content split layout.
// The conversations are loaded here once and passed to the sidebar.
//
// Why load conversations in the layout? So the sidebar is always visible
// and up-to-date regardless of which chat page you're on.

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const conversationsHook = useConversations()

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar — fixed width, full height */}
      <Sidebar {...conversationsHook} />

      {/* Main content area — takes remaining space */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
