'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  value: string
  label: string
  detail: string
  // Para o count-up: número alvo e sufixo
  countTo: number
  decimals: number
  suffix: string
  prefix: string
}

const STATS: Stat[] = [
  { value: '500+', label: 'pedidos entregues',  detail: 'em todo o Brasil',        countTo: 500, decimals: 0, suffix: '+', prefix: '' },
  { value: '4.9',  label: 'nota dos clientes',  detail: 'Mercado Livre',  countTo: 4.9, decimals: 1, suffix: '',  prefix: '' },
  { value: '3',    label: 'dias de produção',   detail: 'após confirmação',        countTo: 3,   decimals: 0, suffix: '',  prefix: '' },
  { value: '100%', label: 'vinil nacional',     detail: 'com base antiderrapante', countTo: 100, decimals: 0, suffix: '%', prefix: '' },
]

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLSpanElement>('[data-count]')
    if (!els?.length) return

    const ctx = gsap.context(() => {
      els.forEach(el => {
        const target   = parseFloat(el.dataset.count!)
        const decimals = parseInt(el.dataset.decimals!)
        const suffix   = el.dataset.suffix ?? ''
        const proxy    = { val: 0 }

        gsap.to(proxy, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate() {
            el.textContent = proxy.val.toFixed(decimals) + suffix
          },
          onComplete() {
            el.textContent = target.toFixed(decimals) + suffix
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#F0FDF4',
        borderTop: '1px solid #BBF7D0',
        borderBottom: '1px solid #BBF7D0',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => {
            const isLastInRow = i === 1 || i === 3
            const isBottomRow = i >= 2
            return (
              <div
                key={stat.label}
                style={{
                  padding: '28px 20px',
                  textAlign: 'center',
                  borderRight: !isLastInRow ? '1px solid #BBF7D0' : 'none',
                  borderBottom: !isBottomRow ? '1px solid #BBF7D0' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                    fontWeight: 800,
                    color: '#22C55E',
                    lineHeight: 1,
                    marginBottom: '6px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {stat.prefix}
                  <span
                    data-count={stat.countTo}
                    data-decimals={stat.decimals}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', letterSpacing: '0.2px' }}>
                  {stat.detail}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
