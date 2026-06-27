'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    name: 'Dra. Fernanda Oliveira',
    role: 'Clínica Odontológica FO',
    text: 'O capacho com a logo da nossa clínica ficou incrível! Os pacientes chegam e já percebem o cuidado que temos com cada detalhe. Recomendo demais a Entratta.',
    stars: 5,
  },
  {
    name: 'Carlos Mendes',
    role: 'CrossFit Força Total',
    text: 'Encomendamos 2 capachos para nossas unidades. Qualidade absurda, cores vivas e entregaram antes do prazo. Vai ter mais pedidos chegando!',
    stars: 5,
  },
  {
    name: 'Patrícia Souza',
    role: 'Imobiliária Souza e Silva',
    text: 'Nossa entrada ficou completamente diferente. Os visitantes que chegam para reunião já entram com a percepção certa da nossa empresa. Valeu cada centavo.',
    stars: 5,
  },
  {
    name: 'Juliana Morais',
    role: 'Cliente residencial — Goiânia, GO',
    text: 'Pedi com o nome da nossa família para a entrada do apartamento. Ficou lindo, muito melhor do que esperava! Todo mundo que visita pergunta onde comprei.',
    stars: 5,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: '#EAB308', fontSize: '0.9rem' }}>★</span>
      ))}
    </div>
  )
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testi-heading', {
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testi-heading',
          start: 'top 85%',
        },
      })

      gsap.from('.testi-card', {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.testi-card',
          start: 'top 88%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="depoimentos" className="px-4 py-20 md:py-28" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto" style={{ position: 'relative' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20px',
            right: '0',
            fontFamily: 'var(--font-heading)',
            fontSize: '10rem',
            lineHeight: 1,
            color: '#22C55E',
            opacity: 0.07,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          &ldquo;
        </div>
        <div className="testi-heading text-center mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            DEPOIMENTOS
          </span>
          <h2
            className="section-title-glow"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#0F172A',
              letterSpacing: 0,
            }}
          >
            O que nossos clientes{' '}
            <span style={{ color: '#16A34A', fontStyle: 'italic' }}>estão dizendo</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(({ name, role, text, stars }, index) => (
            <blockquote
              key={name}
              className="testi-card rounded-2xl p-7 flex flex-col glass-card"
              style={{ marginTop: index % 2 !== 0 ? '28px' : '0' }}
            >
              <Stars n={stars} />
              <p className="text-sm leading-relaxed my-5 flex-1" style={{ color: '#334155' }}>
                &ldquo;{text}&rdquo;
              </p>
              <footer>
                <cite className="not-italic">
                  <div className="font-bold text-sm" style={{ color: '#0F172A' }}>{name}</div>
                  <div style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: 600 }}>{role}</div>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
