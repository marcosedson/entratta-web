'use client'

import { PRODUCT_LINES } from '@/lib/constants'
import type { ProductLine } from '@/lib/types'

const inputClass =
  'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-brand-solid'

interface LinePickerProps {
  value: ProductLine
  onChange: (line: ProductLine) => void
}

export function LinePicker({ value, onChange }: LinePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Linha do capacho">
      {PRODUCT_LINES.map((l) => {
        const active = l.id === value
        return (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l.id)}
            className={`rounded-lg border px-2 py-2.5 text-left cursor-pointer ${
              active ? 'border-brand-solid bg-surface-2' : 'border-border bg-white'
            }`}
          >
            <span className="block text-sm font-bold text-dark">{l.label}</span>
            <span className="block text-[11px] leading-tight text-slate">{l.hint}</span>
          </button>
        )
      })}
    </div>
  )
}

interface CustomSizeFieldsProps {
  width: string
  height: string
  onWidth: (v: string) => void
  onHeight: (v: string) => void
}

export function CustomSizeFields({ width, height, onWidth, onHeight }: CustomSizeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="text-xs font-semibold text-slate">
        Largura (cm)
        <input inputMode="numeric" value={width} onChange={(e) => onWidth(e.target.value)} className={`${inputClass} mt-1`} placeholder="150" />
      </label>
      <label className="text-xs font-semibold text-slate">
        Altura (cm)
        <input inputMode="numeric" value={height} onChange={(e) => onHeight(e.target.value)} className={`${inputClass} mt-1`} placeholder="100" />
      </label>
    </div>
  )
}

interface QuantityCepFieldsProps {
  quantity: number
  onQuantity: (delta: number) => void
  cep: string
  onCep: (v: string) => void
}

export function QuantityCepFields({ quantity, onQuantity, cep, onCep }: QuantityCepFieldsProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
      <div className="text-xs font-semibold text-slate">
        Quantidade
        <div className="mt-1 flex items-center rounded-lg border border-border bg-white">
          <button type="button" onClick={() => onQuantity(-1)} className="px-3 py-2.5 text-dark cursor-pointer" aria-label="Diminuir quantidade">−</button>
          <span className="w-8 text-center text-sm font-bold text-dark" aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => onQuantity(1)} className="px-3 py-2.5 text-dark cursor-pointer" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <label className="text-xs font-semibold text-slate">
        CEP para calcular o frete
        <input inputMode="numeric" autoComplete="postal-code" value={cep} onChange={(e) => onCep(e.target.value)} className={`${inputClass} mt-1`} placeholder="00000-000" />
      </label>
    </div>
  )
}
