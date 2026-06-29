'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Ring { x: number; y: number; born: number }

gsap.registerPlugin(ScrollTrigger)

const WPP_URL = 'https://wa.me/5564992066855'

function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.28,
      y: (e.clientY - (r.top + r.height / 2)) * 0.28,
    })
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseMove={handleMove}
      onMouseLeave={() => { setActive(false); setPos({ x: 0, y: 0 }) }}
      style={{ display: 'inline-flex' }}
    >
      <div
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: active
            ? 'transform 0.12s ease'
            : 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Hero() {
  const heroRef    = useRef<HTMLElement>(null)
  const carpetRef  = useRef<HTMLDivElement>(null)
  const rippleRef  = useRef<HTMLCanvasElement>(null)
  const ringsRef   = useRef<Ring[]>([])
  const rippleRaf  = useRef<number>(0)
  const lastRipple = useRef(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quickX = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quickY = useRef<any>(null)

  useEffect(() => {
    if (carpetRef.current) {
      quickX.current = gsap.quickTo(carpetRef.current, 'x', { duration: 0.9, ease: 'power3.out' })
      quickY.current = gsap.quickTo(carpetRef.current, 'y', { duration: 0.9, ease: 'power3.out' })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      tl.from('.hero-price-badge', { opacity: 0, scale: 0.8, duration: 0.6, ease: 'power3.out' })
        .from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-h1', { opacity: 0, y: 70, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .from('.hero-desc', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.55')
        .from('.hero-cta', { opacity: 0, y: 30, duration: 0.75, ease: 'power3.out' }, '-=0.5')
        .from('.hero-trust span', { opacity: 0, y: 16, stagger: 0.07, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .from('.hero-platforms a', { opacity: 0, y: 12, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, '-=0.45')
        .from('.hero-carpet', { opacity: 0, scale: 0.84, y: 50, duration: 1.1, ease: 'expo.out' }, '-=0.85')

      tl.from('.hero-scroll-indicator', { opacity: 0, y: -10, duration: 0.7, ease: 'power3.out' }, '-=0.2')

      gsap.to('.hero-scroll-inner', {
        y: 10, duration: 0.9, repeat: -1, yoyo: true, ease: 'power1.inOut',
      })

      gsap.to('.hero-scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=180',
          scrub: true,
        },
      })
    }, heroRef)

    return () => {
      ctx.revert()
      if (carpetRef.current) gsap.set(carpetRef.current, { x: 0, y: 0 })
    }
  }, [])

  // Canvas ripple — simula pressão no vinil
  useEffect(() => {
    const canvas = rippleRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const size = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width  = r.width  || 380
      canvas.height = r.height || 240
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()
      ringsRef.current = ringsRef.current.filter(r => now - r.born < 900)

      for (const ring of ringsRef.current) {
        const t = (now - ring.born) / 900
        const radius = t * 58
        const alpha  = Math.pow(1 - t, 2.4) * 0.5
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      rippleRaf.current = requestAnimationFrame(draw)
    }

    rippleRaf.current = requestAnimationFrame(draw)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rippleRaf.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 1023px)').matches) return
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    quickX.current?.(nx * -22)
    quickY.current?.(ny * -12)
  }, [])

  const handleMouseLeave = useCallback(() => {
    quickX.current?.(0)
    quickY.current?.(0)
  }, [])

  const handleCarpetMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = rippleRef.current
    if (!canvas) return
    const now = Date.now()
    if (now - lastRipple.current < 85) return
    const rect = canvas.getBoundingClientRect()
    ringsRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, born: now })
    lastRipple.current = now
  }, [])

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden px-4 pt-20 pb-32 md:pt-28 md:pb-44"
      style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FFFFFF 45%, #F8FAFC 100%)' }}
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(34,197,94,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      {/* Watermark decorativo */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-accent)',
          fontSize: '20vw',
          lineHeight: 1,
          color: '#0F172A',
          opacity: 0.025,
          letterSpacing: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        ENTRATTA
      </div>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: copy */}
        <div>
          <div
            className="hero-price-badge mb-4"
            style={{
              display: 'inline-block',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '24px',
              padding: '8px 16px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              color: '#22C55E',
              marginBottom: '1rem',
            }}
          >
            🎯 MAIS BARATO DO MERCADO
          </div>

          <div
            className="hero-badge mb-6"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span
              style={{
                display: 'block',
                width: '32px',
                height: '1.5px',
                background: '#22C55E',
                opacity: 0.6,
              }}
            />
            <span
              style={{
                color: '#22C55E',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '3px',
                opacity: 0.9,
              }}
            >
              DESDE O PRIMEIRO PASSO
            </span>
          </div>

          <h1
            className="hero-h1 mb-5 leading-none"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              color: '#0F172A',
              letterSpacing: 0,
              lineHeight: 1.08,
            }}
          >
            A primeira impressão{' '}
            <span style={{ color: '#16A34A', fontStyle: 'italic' }}>começa no chão.</span>
          </h1>

          <p
            className="hero-desc mb-8 text-lg leading-relaxed"
            style={{ color: '#475569', maxWidth: '520px' }}
          >
            Capachos de vinil lisos, com artes prontas ou totalmente personalizados com a sua logo.{' '}
            <strong style={{ color: '#0F172A' }}>
              Para a entrada da sua empresa ou da sua casa.
            </strong>
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-3 mb-8">
            <MagneticWrap>
              <a
                href="https://wa.me/5564992066855?text=Ol%C3%A1!%20Quero%20pedir%20meu%20capacho%20personalizado.%20Podem%20me%20ajudar%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-black text-base active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg,#22C55E,#15803D)',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
                }}
              >
                Pedir meu capacho
              </a>
            </MagneticWrap>
            <a
              href={WPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.12)',
                color: '#334155',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar no WhatsApp
            </a>
          </div>

          <div className="hero-trust flex flex-wrap gap-x-5 gap-y-2 mb-4">
            {[
              '3 dias úteis',
              'Todo o Brasil',
              'Sem compromisso',
              'Orçamento imediato',
            ].map(t => (
              <span key={t} className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#166534' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
          <div className="hero-platforms flex flex-wrap gap-2">
            <a
              href="https://lista.mercadolivre.com.br/_CustId_3459954476"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(52,131,250,0.08)',
                border: '1px solid rgba(52,131,250,0.2)',
                color: '#3483FA',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#FFE600"/><circle cx="24" cy="14" r="5" fill="#3483FA"/><path d="M14 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#3483FA" strokeWidth="4" strokeLinecap="round" fill="none"/></svg>
              Ver loja no Mercado Livre
            </a>
          </div>
        </div>

        {/* Right: carpet mockup */}
        <div className="hero-carpet flex items-center justify-center">
          <div ref={carpetRef} style={{ width: '100%', maxWidth: '460px' }}>
            <div
              className="relative"
              style={{ animation: 'float 4s ease-in-out infinite' }}
              onMouseMove={handleCarpetMove}
            >
              <div
                className="absolute inset-0 rounded-3xl blur-3xl"
                style={{ background: 'rgba(34,197,94,0.15)', transform: 'scale(1.15)' }}
              />
              <Image
                src="/hero-tapete.png"
                alt="Capacho personalizado Entratta — tapetes de vinil com sua logo"
                width={1536}
                height={1024}
                priority
                className="relative rounded-2xl"
                style={{ width: '100%', height: 'auto', mixBlendMode: 'multiply' }}
              />

              {/* Canvas de ripple — simula pressão na superfície de vinil */}
              <canvas
                ref={rippleRef}
                style={{
                  position: 'absolute', inset: 0,
                  pointerEvents: 'none', borderRadius: '16px',
                  width: '100%', height: '100%',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="hero-scroll-indicator absolute left-1/2 pointer-events-none select-none"
        style={{ bottom: '108px', transform: 'translateX(-50%)' }}
      >
        <div className="hero-scroll-inner flex flex-col items-center gap-2">
          <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
            <rect x="1" y="1" width="20" height="32" rx="10" stroke="rgba(15,23,42,0.15)" strokeWidth="1.5"/>
            <rect x="9.25" y="6" width="3.5" height="8" rx="1.75" fill="#22C55E" opacity="0.8"/>
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '0.55rem',
              letterSpacing: '3px',
              color: '#94A3B8',
              fontWeight: 700,
            }}
          >
            SCROLL
          </span>
        </div>
      </div>

      {/* Curva de saída */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '80px', display: 'block' }}>
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF"/>
        </svg>
      </div>
    </section>
  )
}
