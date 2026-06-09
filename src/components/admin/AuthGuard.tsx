import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

interface Props {
  children: ReactNode
}

export default function AuthGuard({ children }: Props) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAuthed(true)
        } else {
          router.navigate({ to: '/login' })
        }
      })
      .catch(() => {
        router.navigate({ to: '/login' })
      })
  }, [router])

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
