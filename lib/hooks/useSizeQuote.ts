'use client'

import { useCallback, useMemo, useState } from 'react'
import type { ProductLine } from '@/lib/types'
import { SIZE_GUIDE, PRODUCT_LINES, WPP_URL } from '@/lib/constants'

export const CUSTOM_SIZE_ID = 'custom'

const onlyDigits = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max)

export function formatCep(value: string) {
  const digits = onlyDigits(value, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function useSizeQuote() {
  const [sizeId, setSizeId] = useState(SIZE_GUIDE[2].id)
  const [line, setLine] = useState<ProductLine>('personalizado')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState('')

  const isCustom = sizeId === CUSTOM_SIZE_ID
  const cepValid = onlyDigits(cep, 8).length === 8
  const customValid = Number(customWidth) > 0 && Number(customHeight) > 0
  const canSubmit = cepValid && (!isCustom || customValid)

  const sizeLabel = isCustom
    ? `${customWidth || '?'} × ${customHeight || '?'} cm (sob medida)`
    : SIZE_GUIDE.find((s) => s.id === sizeId)?.label ?? ''

  const message = useMemo(() => {
    const lineLabel = PRODUCT_LINES.find((l) => l.id === line)?.label ?? line
    return [
      'Olá! Vim pelo guia de medidas do site e quero um orçamento:',
      `• Linha: ${lineLabel}`,
      `• Medida: ${sizeLabel}`,
      `• Quantidade: ${quantity}`,
      `• CEP para frete: ${formatCep(cep)}`,
    ].join('\n')
  }, [line, sizeLabel, quantity, cep])

  const whatsappHref = `${WPP_URL}?text=${encodeURIComponent(message)}`

  const updateCep = useCallback((value: string) => setCep(formatCep(value)), [])
  const updateCustomWidth = useCallback((value: string) => setCustomWidth(onlyDigits(value, 3)), [])
  const updateCustomHeight = useCallback((value: string) => setCustomHeight(onlyDigits(value, 3)), [])
  const updateQuantity = useCallback((delta: number) => setQuantity((q) => Math.max(1, q + delta)), [])

  return {
    sizeId, setSizeId, isCustom,
    line, setLine,
    customWidth, customHeight, updateCustomWidth, updateCustomHeight,
    quantity, updateQuantity,
    cep, updateCep, customValid,
    canSubmit, message, whatsappHref,
  }
}
