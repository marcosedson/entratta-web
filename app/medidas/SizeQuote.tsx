'use client'

import { SIZE_GUIDE, ML_STORE_URL } from '@/lib/constants'
import { useSizeQuote, CUSTOM_SIZE_ID } from '@/lib/hooks'
import { trackWhatsAppClick, trackLeadGenerated } from '@/lib/analytics'
import { SizeShape } from './SizeShape'
import { LinePicker, CustomSizeFields, QuantityCepFields } from './QuoteFields'

const stepTitle = 'text-xs font-bold uppercase tracking-[1.5px] text-slate mb-3'

export function SizeQuote() {
  const q = useSizeQuote()

  const handleSubmit = () => {
    trackWhatsAppClick('guia_medidas', q.message)
    trackLeadGenerated('guia_medidas', 'whatsapp')
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] rounded-2xl border border-border bg-white p-4 md:p-8 shadow-sm">
      <div>
        <p className={stepTitle}>1. Escolha a medida</p>
        <ul className="grid gap-2" role="radiogroup" aria-label="Medida do capacho">
          {SIZE_GUIDE.map((s) => {
            const active = s.id === q.sizeId
            return (
              <li key={s.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => q.setSizeId(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left cursor-pointer ${
                    active ? 'border-brand-solid bg-surface-2' : 'border-border bg-white'
                  }`}
                >
                  <SizeShape widthCm={s.widthCm} heightCm={s.heightCm} active={active} />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-dark">{s.label}</span>
                    <span className="block text-xs text-slate">{s.fitsDoor} · {s.bestFor}</span>
                  </span>
                </button>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              role="radio"
              aria-checked={q.isCustom}
              onClick={() => q.setSizeId(CUSTOM_SIZE_ID)}
              className={`w-full rounded-xl border border-dashed p-3 text-left text-sm font-bold cursor-pointer ${
                q.isCustom ? 'border-brand-solid bg-surface-2 text-dark' : 'border-slate/40 text-slate'
              }`}
            >
              + Sob medida (calculado por m²)
            </button>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-5">
        {q.isCustom && (
          <div>
            <p className={stepTitle}>Sua medida</p>
            <CustomSizeFields
              width={q.customWidth}
              height={q.customHeight}
              onWidth={q.updateCustomWidth}
              onHeight={q.updateCustomHeight}
            />
          </div>
        )}
        <div>
          <p className={stepTitle}>2. Escolha a linha</p>
          <LinePicker value={q.line} onChange={q.setLine} />
        </div>
        <div>
          <p className={stepTitle}>3. Quantidade e CEP</p>
          <QuantityCepFields quantity={q.quantity} onQuantity={q.updateQuantity} cep={q.cep} onCep={q.updateCep} />
        </div>

        {q.canSubmit ? (
          <a
            href={q.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSubmit}
            className="block rounded-xl bg-brand-solid px-6 py-4 text-center text-sm font-bold text-white hover:bg-brand-dark"
          >
            Receber orçamento com frete no WhatsApp
          </a>
        ) : (
          <button type="button" disabled className="rounded-xl bg-border px-6 py-4 text-sm font-bold text-slate cursor-not-allowed">
            {q.isCustom && !q.customValid ? 'Informe largura e altura' : 'Informe o CEP para continuar'}
          </button>
        )}
        <p className="text-xs leading-relaxed text-slate">
          Valor e frete informados antes de fechar, sem compromisso. Prefere parcelar?{' '}
          <a href={ML_STORE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark underline">
            Compre pelo Mercado Livre
          </a>
          .
        </p>
      </div>
    </div>
  )
}
