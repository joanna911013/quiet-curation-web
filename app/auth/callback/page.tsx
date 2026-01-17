'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase v2에서는
    // redirect 도착만으로 세션이 이미 설정됨
    router.replace('/')
  }, [router])

  return <p>Signing you in…</p>
}
