'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Vocês são realmente os mais baratos do mercado?',
    a: 'Sim! Somos fabricante direto, sem intermediários. Comparamos com 10+ concorrentes — sempre ofrecemos o melhor custo-benefício. Envie mensagem no WhatsApp para verificar seu orçamento específico.',
  },
  {
    q: 'Qual é o prazo de produção e entrega?',
    a: 'A produção leva até 3 dias úteis após a confirmação do pedido. Entregamos via transportadora para todo o Brasil, com rastreamento. O prazo de entrega varia de 3 a 10 dias úteis após a produção, dependendo do seu CEP.',
  },
  {
    q: 'Posso enviar a logo da minha empresa?',
    a: 'Sim! Basta enviar sua logo pelo WhatsApp (PNG, JPG ou SVG em boa resolução). A arte é impressa em alta definição com sublimação 300 DPI — cores vivas e duradouras mesmo com uso intenso.',
  },
  {
    q: 'Quais materiais são utilizados nos capachos?',
    a: 'Utilizamos vinil de alta resistência com base em borracha antiderrapante. A impressão é feita por sublimação digital, garantindo cores vivas e duradouras. O material é resistente à água, produtos de limpeza e tráfego intenso.',
  },
  {
    q: 'Existe pedido mínimo?',
    a: 'Não! Atendemos pedidos individuais, seja para a entrada de uma pequena empresa ou para uma rede com dezenas de unidades. O preço por unidade melhora em pedidos maiores — consulte via WhatsApp para orçamento em volume.',
  },
  {
    q: 'Como funciona o orçamento?',
    a: 'É simples: fale com a gente pelo WhatsApp, informe a medida desejada e envie sua logo ou ideia. Um especialista envia o orçamento em minutos. Sem compromisso — orçamento é gratuito!',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${open ? 'rgba(34,197,94,0.4)' : '#E2E8F0'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm leading-snug" style={{ color: '#0F172A' }}>{q}</span>
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
          style={{
            background: open ? '#22C55E' : '#F1F5F9',
            color: open ? '#000' : '#64748B',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ↓
        </span>
      </button>
      {open && (
        <div
          className="px-5 pb-5"
          style={{ animation: 'slide-down 0.2s ease', borderTop: '1px solid #F1F5F9' }}
        >
          <p className="pt-4 text-sm leading-relaxed" style={{ color: '#475569' }}>
            {a}
          </p>
        </div>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <section className="px-4 py-20 md:py-28" style={{ background: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            DÚVIDAS FREQUENTES
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#0F172A',
              letterSpacing: 0,
            }}
          >
            Todas as respostas que você{' '}
            <span style={{ color: '#16A34A', fontStyle: 'italic' }}>precisa</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  )
}
