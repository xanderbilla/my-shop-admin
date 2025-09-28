"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { data, error } = useMe()

  useEffect(() => {
    if (error) {
      const status = error.response?.status
      // Redirect to login for 401 (Unauthorized) or 503 (Service Unavailable) errors
      if (status === 401 || status === 503) {
        router.push('/login')
      }
    }
  }, [error, router])

  if (error) {
    const status = error.response?.status
    if (status === 401 || status === 503) {
      return null // Will redirect
    }
  }

  return <>{children}</>
}