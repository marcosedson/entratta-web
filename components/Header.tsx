'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const WPP_URL = 'https://wa.me/5564992066855'

const NAV_LINKS = [
  { href: '/#produtos', label: 'Produtos' },
  { href: '/como-funciona', label: 'Como Funciona' },
  { href: '/depoimentos', label: 'Depoimentos' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 px-4 md:px-6 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.06)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image src="/logo.png" alt="Entratta" width={40} height={40} className="rounded-xl flex-shrink-0" priority />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.4rem',
                letterSpacing: '3px',
                color: '#0F172A',
                lineHeight: 1,
              }}
            >
              ENTRATTA
            </div>
            <div
              style={{
                fontSize: '0.6rem',
                color: '#22C55E',
                fontWeight: 700,
                letterSpacing: '1px',
                lineHeight: 1.4,
              }}
            >
              Tapetes e Capachos de Vinil
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0F172A')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#475569')}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#22C55E,#15803D)' }}
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#334155' }}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid #E2E8F0', animation: 'slide-down 0.2s ease', background: '#fff' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium"
              style={{ color: '#334155' }}
            >
              {label}
            </a>
          ))}
          <a
            href={WPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black mt-1"
            style={{ background: 'linear-gradient(135deg,#22C55E,#15803D)' }}
          >
            <WhatsAppIcon size={16} />
            Pedir pelo WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
