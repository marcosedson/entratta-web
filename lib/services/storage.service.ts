import { ConfiguratorState } from '@/lib/hooks'
import { MEASUREMENTS } from '@/lib/constants'

interface OrderMetadata {
  orderId: string
  createdAt: string
  clientName: string
  clientWhatsApp: string
  medida: string
  corTapete: string
  corTexto: string
  corBorda: string
  texto: string
  quantidade: number
  producaoMode: 'cascata' | 'batch'
  colors: {
    tapete: { id: string; label: string; hex: string }
    texto: { id: string; label: string; hex: string }
    borda: { id: string; label: string; hex: string }
  }
  tapFiles: string[]
}

export class StorageService {
  static generateOrderFolder(orderId: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date)

    return `storage/pedidos/${year}/${monthName}/${orderId}`
  }

  static generateTAPFile(
    orderId: string,
    colorId: string,
    colorLabel: string,
    state: ConfiguratorState,
    type: 'tapete' | 'texto' | 'borda' | 'cascata'
  ): string {
    const measurement = MEASUREMENTS[state.medida]

    let tapContent = ''

    if (type === 'cascata') {
      // TAP para impressão em cascata (múltiplas unidades)
      tapContent = `TAP_FILE
ORDER_ID: ${orderId}
MACHINE: MARCH3_CNC
DATE: ${new Date().toISOString()}
TYPE: CASCATA_PRODUCTION
QUANTITY: ${state.wpp ? '5' : '1'}
MATERIAL: VINYL_ADESIVO

DESIGN_CONFIG:
WIDTH: ${measurement?.w ?? 0}m
HEIGHT: ${measurement?.c ?? 0}m
TAPE_COLOR: ${state.corTapete}
TEXT_COLOR: ${state.corTexto}
BORDER_COLOR: ${state.corBorda}

PRODUCTION_SEQUENCE:
REPEAT ${state.wpp ? '5' : '1'}
  LOAD_MATERIAL ${state.corTapete}
  CUT_DESIGN ${orderId}
  POSITION_NEXT
  VALIDATE_QUALITY
END_REPEAT

QUALITY_CHECKLIST:
□ Cores corretas
□ Dimensões precisas
□ Borda bem definida
□ Texto legível
□ Sem defeitos

END_TAP`
    } else {
      // TAP para cada camada de cor
      tapContent = `TAP_FILE
ORDER_ID: ${orderId}
MACHINE: MARCH3_CNC
DATE: ${new Date().toISOString()}
TYPE: LAYER_${type.toUpperCase()}
COLOR: ${colorLabel}
MATERIAL: VINYL_ADESIVO

DIMENSIONS:
WIDTH: ${measurement?.w ?? 0}m
HEIGHT: ${measurement?.c ?? 0}m

LAYER_CONFIG:
LAYER_TYPE: ${type}
COLOR_ID: ${colorId}
COLOR_HEX: #${colorId}

${
  type === 'tapete'
    ? `TAPETE_SETTINGS:
MATERIAL: VINYL_ADESIVO_${colorLabel.toUpperCase()}
THICKNESS: 0.1mm
DURABILITY: 5_YEARS`
    : type === 'texto'
    ? `TEXT_SETTINGS:
CONTENT: "${state.texto}"
FONT: ${state.corTexto}
SIZE: AUTO
POSITION: CENTER`
    : `BORDER_SETTINGS:
TYPE: ${state.borda}
COLOR: ${colorLabel}
WIDTH: 2mm`
}

CUT_INSTRUCTIONS:
1. Load ${colorLabel} material
2. Set blade pressure for ${state.borda === 'dupla' ? 'HEAVY' : 'NORMAL'}
3. Cut outline with precision
4. Remove excess material
5. Validate with template

VALIDATION:
□ Correct color applied
□ Dimensions within tolerance (±2mm)
□ Clean edges
□ No wrinkles or bubbles

END_TAP`
    }

    return tapContent
  }

  static generateMetadataJSON(
    orderId: string,
    state: ConfiguratorState,
    clientName: string,
    clientWhatsApp: string,
    tapFiles: string[]
  ): OrderMetadata {
    const colorTapete = { id: state.corTapete, label: state.corTapete, hex: '#1a1a1a' }
    const colorTexto = { id: state.corTexto, label: state.corTexto, hex: '#FFFFFF' }
    const colorBorda = { id: state.corBorda, label: state.corBorda, hex: '#22C55E' }

    return {
      orderId,
      createdAt: new Date().toISOString(),
      clientName,
      clientWhatsApp,
      medida: state.medida,
      corTapete: state.corTapete,
      corTexto: state.corTexto,
      corBorda: state.corBorda,
      texto: state.texto,
      quantidade: 1, // Default, será atualizado com base em estado
      producaoMode: 'cascata',
      colors: {
        tapete: colorTapete,
        texto: colorTexto,
        borda: colorBorda,
      },
      tapFiles,
    }
  }

  static getStoragePath(): string {
    // Em produção, seria um servidor com sistema de arquivos real
    // Por agora, retornamos o caminho virtual
    return 'storage/pedidos'
  }
}
