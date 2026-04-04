'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Conversation } from '@/types'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'
import { groupByDate, getInitials, truncate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SidebarProps {
  conversations: Conversation[]
  isLoading: boolean
  createConversation: () => Promise<unknown>
  renameConversation: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
}

export default function Sidebar({
  conversations,
  isLoading,
  createConversation,
  renameConversation,
  deleteConversation,
}: SidebarProps) {
  const pathname = usePathname()
  const { state } = useApp()
  const { logout } = useAuth()

  // Track which conversation is being renamed
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Track which conversation has its context menu open
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const grouped = groupByDate(conversations)
  const activeId = pathname.split('/chat/')[1]

  function startRename(conv: Conversation) {
    setRenamingId(conv.id)
    setRenameValue(conv.title)
    setMenuOpenId(null)
  }

  async function submitRename(id: string) {
    if (renameValue.trim()) {
      await renameConversation(id, renameValue.trim())
    }
    setRenamingId(null)
  }

  return (
    <aside
      className="flex flex-col bg-gray-50 border-r border-gray-200"
      style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)' }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={createConversation}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                     bg-white border border-gray-200 hover:border-brand-300 hover:bg-brand-50
                     text-sm font-medium text-gray-700 transition-all group"
        >
          <span className="text-lg leading-none">+</span>
          <span>New chat</span>
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-1 px-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          // Conversations grouped by date
          grouped.map(({ label, items }) => (
            <div key={label} className="mb-3">
              {/* Date group label */}
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 py-1">
                {label}
              </p>

              {/* Items */}
              <AnimatePresence>
                {items.map(conv => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="relative group"
                    onMouseLeave={() => setMenuOpenId(null)}
                  >
                    {renamingId === conv.id ? (
                      // Inline rename input
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => submitRename(conv.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') submitRename(conv.id)
                          if (e.key === 'Escape') setRenamingId(null)
                        }}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-brand-400
                                   focus:outline-none bg-white text-gray-900"
                      />
                    ) : (
                      <Link
                        href={`/chat/${conv.id}`}
                        className={cn(
                          'flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors',
                          'hover:bg-gray-200',
                          activeId === conv.id
                            ? 'bg-white border border-gray-200 text-gray-900 font-medium shadow-sm'
                            : 'text-gray-600'
                        )}
                      >
                        <span className="flex-1 truncate">
                          {truncate(conv.title, 28)}
                        </span>

                        {/* 3-dot menu button — only visible on hover or when active */}
                        <button
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMenuOpenId(menuOpenId === conv.id ? null : conv.id)
                          }}
                          className={cn(
                            'opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded',
                            'hover:bg-gray-300 text-gray-500 transition-opacity',
                            menuOpenId === conv.id && 'opacity-100'
                          )}
                        >
                          ···
                        </button>
                      </Link>
                    )}

                    {/* Context menu */}
                    <AnimatePresence>
                      {menuOpenId === conv.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 top-8 z-50 bg-white border border-gray-200
                                     rounded-lg shadow-lg py-1 w-36 text-sm"
                        >
                          <button
                            onClick={() => startRename(conv)}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
                          >
                            ✏️ Rename
                          </button>
                          <button
                            onClick={() => {
                              deleteConversation(conv.id)
                              setMenuOpenId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                          >
                            🗑 Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 cursor-default">
          {/* Avatar circle */}
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">
              {getInitials(state.user?.name || 'U')}
            </span>
          </div>
          <span className="flex-1 text-sm text-gray-700 font-medium truncate">
            {state.user?.name}
          </span>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 text-xs"
            title="Sign out"
          >
            ↪
          </button>
        </div>
      </div>
    </aside>
  )
}
