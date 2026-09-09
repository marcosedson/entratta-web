'use client'

import { trackWhatsAppClick, trackLeadGenerated, trackPartnerInterest } from '@/lib/analytics'

interface ArchitectCTAButtonProps {
  text: string
  source: string
  message: string
  primary?: boolean
}

export function ArchitectCTAButton({
  text,
  source,
  message,
  primary = false,
}: ArchitectCTAButtonProps) {
  const handleClick = () => {
    trackWhatsAppClick(source, message)
    trackLeadGenerated(source, 'whatsapp')
    trackPartnerInterest(source, 'arquiteto_especificador')

    const encodedMsg = encodeURIComponent(message)
    const url = `https://wa.me/5564992066855?text=${encodedMsg}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (primary) {
    return (
      <button
        onClick={handleClick}
        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm md:text-base shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span>💬</span>
        <span>{text}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-sm md:text-base hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
    >
      <span>📐</span>
      <span>{text}</span>
    </button>
  )
}
