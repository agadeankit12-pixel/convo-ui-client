'use client'

import { use } from 'react'
import { useChat } from '@/hooks/useChat'
import MessageList from '@/components/chat/MessageList'
import ChatInput from '@/components/chat/ChatInput'

// ─── Chat Conversation Page ───────────────────────────────────────────────────
// Renders when user visits /chat/[id]
// - Loads messages for this conversation via useChat
// - Displays them in MessageList
// - Shows ChatInput at the bottom

interface PageProps {
  params: { id: string }
}

export default function ConversationPage({ params }: PageProps) {
  // Next.js 14 App Router: params is a Promise in newer Next.js
  const { id } = params

  const {
    messages,
    streamingContent,
    isStreaming,
    isLoadingMessages,
    error,
    sendMessage,
    stopStreaming,
  } = useChat(id)

  return (
    <div className="flex flex-col h-full">
      {/* Message area — scrollable, takes all available space */}
      <MessageList
        messages={messages}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
        isLoading={isLoadingMessages}
        error={error}
      />

      {/* Input — fixed at bottom */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        disabled={isLoadingMessages}
      />
    </div>
  )
}
