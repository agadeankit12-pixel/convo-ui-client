import { redirect } from 'next/navigation'

// The root "/" route just redirects.
// The middleware handles auth — if no token → /login, if token → /chat
export default function HomePage() {
  redirect('/chat')
}
