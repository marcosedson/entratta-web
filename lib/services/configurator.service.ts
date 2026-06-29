import { ConfiguratorState } from '@/lib/hooks'
import { MEASUREMENTS, WPP_PHONE } from '@/lib/constants'

export class ConfiguratorService {
  static calculatePrice(state: ConfiguratorState): number | null {
    if (state.medida === 'custom') {
      const l = parseFloat(state.customL) || 0
      const c = parseFloat(state.customC) || 0
      return l > 0 && c > 0 ? Math.round((l / 100) * (c / 100) * 300) : null
    }

    const measurement = MEASUREMENTS[state.medida]
    if (!measurement) return null
    return Math.round(measurement.w * measurement.c * 300)
  }

  static getMeasurementLabel(state: ConfiguratorState): string {
    if (state.medida === 'custom') {
      return `${state.customL || '?'}×${state.customC || '?'} cm`
    }
    return MEASUREMENTS[state.medida]?.l || 'Sob medida'
  }

  static validateCustomMeasurements(
    customL: string,
    customC: string
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    const l = parseFloat(customL)
    const c = parseFloat(customC)

    if (!customL) {
      errors.push('Largura é obrigatória')
    } else if (isNaN(l) || l <= 0) {
      errors.push('Largura deve ser um número positivo')
    } else if (l > 500) {
      errors.push('Largura não pode exceder 500 cm')
    }

    if (!customC) {
      errors.push('Comprimento é obrigatório')
    } else if (isNaN(c) || c <= 0) {
      errors.push('Comprimento deve ser um número positivo')
    } else if (c > 500) {
      errors.push('Comprimento não pode exceder 500 cm')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  static validateText(text: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (text.length > 40) {
      errors.push('Texto não pode exceder 40 caracteres')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  static buildWhatsAppMessage(
    state: ConfiguratorState,
    medidaLabel: string,
    corTapeteLabel: string,
    corTextoLabel: string,
    bordaLabel: string,
    corBordaLabel: string | undefined,
    preco: number | null
  ): string {
    const msg = `Olá! Quero montar meu capacho personalizado 🚪\n\n👤 Nome: ${state.nome || 'não informado'}\n📐 Medida: ${medidaLabel}\n🎨 Cor do tapete: ${corTapeteLabel}\n✏️ Texto: ${state.texto || 'sem texto'}\n🖊️ Cor do texto: ${corTextoLabel}\n🔲 Borda: ${bordaLabel}${state.borda !== 'sem' ? ` — Cor: ${corBordaLabel}` : ''}\n🖼️ Logo: ${state.logoSrc ? 'SIM — envio no próximo passo' : 'não'}\n💰 Preço estimado: ${preco ? `R$ ${preco.toLocaleString('pt-BR')}` : 'a calcular'}\n\nAguardo o orçamento! 😊`
    return `https://wa.me/${WPP_PHONE}?text=${encodeURIComponent(msg)}`
  }

  static buildOrderSummary(
    state: ConfiguratorState,
    medidaLabel: string,
    corTapeteLabel: string,
    bordaLabel: string,
    preco: number | null
  ): string {
    const msg = `ENTRATTA Capachos — Pedido\nMedida: ${medidaLabel}\nCor: ${corTapeteLabel}\nTexto: ${state.texto || '—'}\nLogo: ${state.logoSrc ? 'Sim' : 'Não'}\nPreço estimado: ${preco ? 'R$' + preco : 'a calcular'}\nBorda: ${bordaLabel}\nWhatsApp: (64) 99206-6855`
    return msg
  }
}
