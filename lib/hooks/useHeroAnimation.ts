import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Ring {
  x: number
  y: number
  born: number
}

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimation() {
  const heroRef = useRef<HTMLElement>(null)
  const carpetRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLCanvasElement>(null)
  const ringsRef = useRef<Ring[]>([])
  const rippleRaf = useRef<number>(0)
  const lastRipple = useRef(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quickX = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quickY = useRef<any>(null)

  useEffect(() => {
    if (carpetRef.current) {
      quickX.current = gsap.quickTo(carpetRef.current, 'x', {
        duration: 0.9,
        ease: 'power3.out',
      })
      quickY.current = gsap.quickTo(carpetRef.current, 'y', {
        duration: 0.9,
        ease: 'power3.out',
      })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      tl.from('.hero-price-badge', {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '.hero-badge',
          { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .from(
          '.hero-h1',
          { opacity: 0, y: 70, duration: 0.9, ease: 'power3.out' },
          '-=0.5'
        )
        .from(
          '.hero-desc',
          { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        .from(
          '.hero-cta',
          { opacity: 0, y: 30, duration: 0.75, ease: 'power3.out' },
          '-=0.5'
        )
        .from(
          '.hero-trust span',
          {
            opacity: 0,
            y: 16,
            stagger: 0.07,
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.45'
        )
        .from(
          '.hero-platforms a',
          {
            opacity: 0,
            y: 12,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.45'
        )
        .from(
          '.hero-carpet',
          {
            opacity: 0,
            scale: 0.84,
            y: 50,
            duration: 1.1,
            ease: 'expo.out',
          },
          '-=0.85'
        )

      tl.from(
        '.hero-scroll-indicator',
        { opacity: 0, y: -10, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )

      gsap.to('.hero-scroll-inner', {
        y: 10,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
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

  useEffect(() => {
    const canvas = rippleRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const size = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width || 380
      canvas.height = r.height || 240
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()
      ringsRef.current = ringsRef.current.filter((r) => now - r.born < 900)

      for (const ring of ringsRef.current) {
        const t = (now - ring.born) / 900
        const radius = t * 58
        const alpha = Math.pow(1 - t, 2.4) * 0.5
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
    ringsRef.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      born: now,
    })
    lastRipple.current = now
  }, [])

  return {
    heroRef,
    carpetRef,
    rippleRef,
    handleMouseMove,
    handleMouseLeave,
    handleCarpetMove,
  }
}
