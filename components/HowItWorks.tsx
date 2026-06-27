const STEPS = [
  {
    num: '01',
    title: 'Fale pelo WhatsApp',
    desc: 'Mande a medida, sua logo e o que você quer. Um especialista responde em minutos com orçamento sem compromisso.',
  },
  {
    num: '02',
    title: 'Aprove o Preview',
    desc: 'Nossa equipe cria o layout do seu capacho e envia para aprovação. Ajuste o que precisar antes de produzir.',
  },
  {
    num: '03',
    title: 'Receba em Casa',
    desc: 'Produção em até 3 dias úteis. Entregamos em todo o Brasil com rastreamento e embalagem reforçada.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-20 md:py-28" style={{ background: '#0B1520' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            SIMPLES ASSIM
          </span>
          <h2
            className="section-title-glow"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#fff',
              letterSpacing: 0,
            }}
          >
            Seu capacho personalizado em{' '}
            <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>3 passos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] h-px"
            style={{ background: 'rgba(34,197,94,0.2)' }}
          />

          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="relative flex flex-col items-center text-center">
              <div
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg,#0B1E14,#0F2D18)',
                  border: '2px solid rgba(34,197,94,0.3)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#22C55E',
                    letterSpacing: '-1px',
                  }}
                >
                  {num}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
