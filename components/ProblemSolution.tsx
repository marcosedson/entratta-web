'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    // Desktop: pin scroll — elementos entram em sequência como câmera avançando
    mm.add('(min-width: 768px)', () => {
      gsap.from(
        ['.ps-label', '.ps-title', '.ps-desc', '.ps-card-before', '.ps-card-after', '.ps-quote'],
        {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        },
      )
    })

    // Mobile: sem pin, reveal suave por viewport
    mm.add('(max-width: 767px)', () => {
      gsap.from(
        ['.ps-label', '.ps-title', '.ps-desc', '.ps-card-before', '.ps-card-after', '.ps-quote'],
        {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        },
      )
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-4 py-20 md:py-28" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="ps-label inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            O PROBLEMA
          </span>
          <h2
            className="ps-title section-title-glow mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#0F172A',
              letterSpacing: 0,
            }}
          >
            Sua entrada comercial já está{' '}
            <span style={{ color: '#16A34A', fontStyle: 'italic' }}>vendendo por você?</span>
          </h2>
          <p
            className="ps-desc"
            style={{ color: '#475569', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}
          >
            A primeira impressão acontece antes do cliente falar com qualquer pessoa da sua equipe.
            Começa no chão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Before — foto real de entrada sem identidade */}
          <div className="ps-card-before rounded-2xl overflow-hidden relative" style={{ minHeight: '360px' }}>
            <Image
              src="/ps-antes.jpg"
              alt="Entrada sem identidade de marca"
              fill
              style={{ objectFit: 'cover', objectPosition: 'bottom center', filter: 'grayscale(30%)' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(15,10,10,0.55) 0%, rgba(10,5,5,0.80) 100%)' }} />
            <div className="relative p-8 h-full flex flex-col justify-between" style={{ minHeight: '360px' }}>
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                  style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)' }}
                >
                  <span style={{ color: '#FCA5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>
                    SEM PERSONALIZAÇÃO
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Entrada genérica</h3>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Qualquer tapete. Nenhuma mensagem. Nenhuma memória.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Sem identificação da empresa',
                    'Entrada que não comunica nada',
                    'Oportunidade de branding desperdiçada',
                    'Cliente entra e já esquece onde está',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      <span style={{ color: '#F87171', flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>
                  REALIDADE DA MAIORIA DAS EMPRESAS
                </p>
              </div>
            </div>
          </div>

          {/* After — foto real gerada: lobby premium com capacho Entratta */}
          <div className="ps-card-after rounded-2xl overflow-hidden relative" style={{ minHeight: '360px' }}>
            <Image
              src="/ps-depois.png"
              alt="Entrada com capacho personalizado Entratta"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(2,18,8,0.45) 0%, rgba(4,28,12,0.72) 100%)' }} />
            <div className="relative p-8 h-full flex flex-col justify-between" style={{ minHeight: '360px' }}>
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                  style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.4)' }}
                >
                  <span style={{ color: '#4ADE80', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>
                    COM ENTRATTA
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Entrada com identidade</h3>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Sua marca no chão. Cliente entra e já sabe onde está.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Logo e nome em destaque na entrada',
                    'Cores e identidade visual da sua marca',
                    'Marketing sensorial 24h por dia',
                    'Cliente lembra e recomenda sua empresa',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <span style={{ color: '#4ADE80', flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(34,197,94,0.25)' }}>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                  VINIL CNC · SOB MEDIDA · ENTREGA EM TODO O BRASIL
                </p>
              </div>
            </div>
          </div>
        </div>

        <blockquote
          className="ps-quote text-center max-w-2xl mx-auto"
          style={{
            background: 'rgba(34,197,94,0.05)',
            border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: '16px',
            padding: '28px 32px',
          }}
        >
          <p className="text-xl font-semibold leading-relaxed mb-3" style={{ color: '#0F172A' }}>
            "Colocamos o capacho com nossa logo na entrada da clínica e os pacientes sempre
            comentam — parece um detalhe pequeno, mas faz toda a diferença na primeira impressão."
          </p>
          <cite style={{ color: '#22C55E', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', fontStyle: 'normal' }}>
            — Dra. Fernanda R., Odontologia Jardins
          </cite>
        </blockquote>
      </div>
    </section>
  )
}
