'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Message, CardData, TableData, ListData } from '@/types'
import { cn, timeAgo, copyToClipboard, getInitials } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

// ─── Import code highlight CSS ────────────────────────────────────────────────
// This adds syntax colors to code blocks
import 'highlight.js/styles/github.css'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { state } = useApp()
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const [showTimestamp, setShowTimestamp] = useState(false)

  async function handleCopy() {
    await copyToClipboard(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex gap-3 px-2 py-1.5 rounded-xl group hover:bg-gray-50 transition-colors',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      onClick={() => setShowTimestamp(!showTimestamp)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {getInitials(state.user?.name || 'U')}
            </span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={cn('flex-1 min-w-0', isUser ? 'flex flex-col items-end' : '')}>
        {/* Sender name + timestamp */}
        <div className={cn('flex items-center gap-2 mb-0.5', isUser ? 'flex-row-reverse' : '')}>
          <span className="text-xs font-medium text-gray-700">
            {isUser ? 'You' : 'ConvoAI'}
          </span>
          {showTimestamp && (
            <span className="text-xs text-gray-400">{timeAgo(message.createdAt)}</span>
          )}
        </div>

        {/* Bubble */}
        {isUser ? (
          // User message — simple styled bubble
          <div className="bg-brand-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        ) : (
          // AI message — markdown rendered
          <div className="max-w-2xl w-full">
            <div className="chat-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom code block with copy button
                  pre({ children, ...props }) {
                    return (
                      <div className="relative group/code">
                        <pre {...props}>{children}</pre>
                        <CopyCodeButton code={extractCode(children)} />
                      </div>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* ─── Schema-driven component rendering ───────────────────────────
                If the AI included a componentType, render the matching UI component.
                This is the "schema-driven UI" pattern from the JD.
                Backend decides what to show; frontend renders the right component.
            */}
            {message.componentType && message.componentData && (
              <div className="mt-3">
                <SchemaComponent
                  type={message.componentType}
                  data={message.componentData as Record<string, unknown>}
                />
              </div>
            )}

            {/* Copy message button */}
            <button
              onClick={handleCopy}
              className="mt-1 text-xs text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Code block copy button ───────────────────────────────────────────────────
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600
                 text-gray-300 rounded opacity-0 group-hover/code:opacity-100 transition-opacity"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// Extract text content from React children (for code blocks)
function extractCode(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractCode).join('')
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractCode((children as { props?: { children?: React.ReactNode } }).props?.children)
  }
  return ''
}

// ─── Schema-Driven Component Renderer ────────────────────────────────────────
// This is the KEY concept from the JD. The backend sends a componentType string
// and componentData object. This component reads the type and renders the
// appropriate UI. New component types can be added here without touching anything else.
function SchemaComponent({ type, data }: { type: string; data: Record<string, unknown> }) {
  switch (type) {
    case 'card':
      return <CardComponent data={data as unknown as CardData} />
    case 'table':
      return <TableComponent data={data as unknown as TableData} />
    case 'list':
      return <ListComponent data={data as unknown as ListData} />
    default:
      return null
  }
}

// ─── Card Component ───────────────────────────────────────────────────────────
function CardComponent({ data }: { data: CardData }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-brand-50 border-b border-gray-200 px-4 py-3">
        <h3 className="font-medium text-gray-900 text-sm">{data.title}</h3>
        {data.subtitle && <p className="text-xs text-gray-500 mt-0.5">{data.subtitle}</p>}
      </div>
      <div className="divide-y divide-gray-100">
        {data.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Table Component ──────────────────────────────────────────────────────────
function TableComponent({ data }: { data: TableData }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {data.headers?.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-medium text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.rows?.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── List Component ───────────────────────────────────────────────────────────
function ListComponent({ data }: { data: ListData }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
      {data.items?.map((item, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-700 text-xs font-medium">{i + 1}</span>
          </div>
          <span className="text-sm text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  )
}
