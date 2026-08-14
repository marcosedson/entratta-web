'use client'

import { trackWhatsAppClick, trackLeadGenerated } from '@/lib/analytics'

const WPP_URL = 'https://wa.me/5564992066855?text=Ol%C3%A1!%20Quero%20montar%20meu%20capacho%20personalizado'

const handleCTAClick = (type: 'direct_factory' | 'specialist') => {
  trackWhatsAppClick(`cta_final_${type}`)
  trackLeadGenerated('cta_final', 'whatsapp')
}

export function CTAFinal() {
  return (
    <section
      className="px-4 py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F1F38 0%, #1E3A5F 100%)', borderTop: '1px solid rgba(34,197,94,0.15)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(34,197,94,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="mb-6" style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.8 }}>
          ENTRATTA · CAPACHOS DE VINIL
        </p>

        <h2
          className="section-title-glow mb-5"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            color: '#fff',
            letterSpacing: 0,
            lineHeight: 1.1,
          }}
        >
          Pronto para comprar{' '}
          <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>direto da fábrica?</span>
        </h2>

        <p className="mb-10 text-lg" style={{ color: '#94A3B8', maxWidth: '480px', margin: '0 auto 40px' }}>
          Orçamento grátis em minutos, sem intermediários e sem compromisso.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://wa.me/5564992066855?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20comprar%20direto%20da%20f%C3%A1brica.%20Pode%20me%20ajudar%20com%20um%20or%C3%A7amento%3F"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCTAClick('direct_factory')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-lg transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg,#22C55E,#15803D)',
              boxShadow: '0 10px 40px rgba(34,197,94,0.4)',
            }}
          >
            Pedir Orçamento Agora
          </a>
          <a
            href={WPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCTAClick('specialist')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#E2E8F0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Falar com especialista
          </a>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {[
            'Orçamento sem compromisso',
            'Resposta em minutos',
            '3 dias úteis de produção',
            'Entrega em todo o Brasil',
          ].map(t => (
            <span key={t} className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#3D7A57' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
