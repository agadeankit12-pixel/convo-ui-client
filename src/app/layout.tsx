import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'

export const metadata: Metadata = {
  title: 'ConvoAI',
  description: 'A modern conversational AI interface',
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
// This wraps EVERY page in the app.
// The AppProvider gives all pages access to auth state via useApp() hook.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
