'use client'

import type { ReactNode } from 'react'
import { WPP_URL } from '@/lib/constants'
import { trackWhatsAppClick, trackLeadGenerated } from '@/lib/analytics'

interface TrackedWhatsAppLinkProps {
  source: string
  message: string
  className?: string
  children: ReactNode
}

export function TrackedWhatsAppLink({ source, message, className, children }: TrackedWhatsAppLinkProps) {
  const handleClick = () => {
    trackWhatsAppClick(source, message)
    trackLeadGenerated(source, 'whatsapp')
  }

  return (
    <a
      href={`${WPP_URL}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
