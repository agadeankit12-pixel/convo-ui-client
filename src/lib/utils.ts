import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns'

// ─── Class Name Helper ────────────────────────────────────────────────────────
// Merges class names, handles conditionals cleanly.
// Usage: cn('base-class', isActive && 'active-class', { 'other': condition })
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

// For message timestamps: "2 minutes ago", "1 hour ago"
export function timeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
}

// For sidebar grouping: "Today", "Yesterday", "Jan 15"
export function formatChatDate(dateString: string): string {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

// Group conversations by date category
export function groupByDate<T extends { updatedAt: string }>(
  items: T[]
): { label: string; items: T[] }[] {
  const groups: Record<string, T[]> = {}

  items.forEach(item => {
    const label = formatChatDate(item.updatedAt)
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })

  return Object.entries(groups).map(([label, items]) => ({ label, items }))
}

// ─── String Helpers ───────────────────────────────────────────────────────────

// Get initials from a name: "John Doe" → "JD"
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Truncate long strings
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

// ─── Copy to Clipboard ────────────────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
