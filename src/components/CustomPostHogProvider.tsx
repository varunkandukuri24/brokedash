'use client'

import React from 'react'
import posthog from 'posthog-js'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function CustomPostHogProvider({ children }: PostHogProviderProps) {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
      })
    }
  }, [])

  return <>{children}</>
}
