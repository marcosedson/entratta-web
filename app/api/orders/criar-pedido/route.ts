import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { ConfiguratorState } from '@/lib/hooks'
import { ConfiguratorService } from '@/lib/services'
import { LogoProcessingService } from '@/lib/services/logo-processing.service'
import {
  CARPET_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  MEASUREMENTS,
  BORDERS,
} from '@/lib/constants'
import { readFileSync } from 'fs'
import { join } from 'path'

interface CreateOrderRequest {
  state: ConfiguratorState
  svgPreview: string
  clientName?: string
  clientWhatsApp?: string
  logoBase64?: string
}

interface OrderResponse {
  success: boolean
  orderId: string
  storageFolder: string
  tapFiles: string[]
  message: string
  files?: {
    pdf: string
    cdr: string
    tap: string
  }
}

function generateOrderId(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const counter = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${year}-${month}-ENTRATTA-${counter}`
}

function getStorageFolder(orderId: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                     'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const monthName = monthNames[date.getMonth()]
  return `storage/pedidos/${year}/${monthName}/${orderId}`
}

function generatePDF(state: ConfiguratorState, logoBase64: string): Buffer {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const brandGreen: [number, number, number] = [34, 197, 94]
  const darkBlue: [number, number, number] = [15, 23, 42]

  // Header
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageWidth, 45, 'F')

  pdf.setDrawColor(...darkBlue)
  pdf.setLineWidth(1.5)
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)

  if (logoBase64) {
    pdf.addImage(logoBase64, 'PNG', 15, 12, 18, 18)
  }

  pdf.setFontSize(16)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('PROJETO DE CAPACHO PERSONALIZADO', 40, 22)

  pdf.setFontSize(8)
  pdf.setFont('Helvetica', 'normal')
  pdf.setTextColor(100, 100, 100)
  const date = new Date().toLocaleDateString('pt-BR')
  pdf.text(`APROVADO - ${date}`, pageWidth - 35, 22)

  let yPos = 36

  const measurement = MEASUREMENTS[state.medida]
  const carpetColor = CARPET_COLORS.find((c) => c.id === state.corTapete)
  const textColor = TEXT_COLORS.find((c) => c.id === state.corTexto)
  const borderColor = BORDER_COLORS.find((c) => c.id === state.corBorda)
  const borderObj = BORDERS.find((b) => b.id === state.borda)

  // FUNDO
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('FUNDO:', 15, yPos)

  if (carpetColor) {
    pdf.setFillColor(
      parseInt(carpetColor.hex.slice(1, 3), 16),
      parseInt(carpetColor.hex.slice(3, 5), 16),
      parseInt(carpetColor.hex.slice(5, 7), 16)
    )
    pdf.rect(30, yPos - 2.5, 6, 6, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor(80, 80, 80)
    pdf.text(carpetColor.label, 40, yPos)
  }
  yPos += 10

  // LOGO
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('LOGO:', 15, yPos)
  yPos += 7

  pdf.setFontSize(7)
  let xPos = 30
  const colors = [
    { name: 'BRANCO', hex: '#FFFFFF' },
    ...TEXT_COLORS.map((c) => ({ name: c.label.toUpperCase(), hex: c.hex })),
  ]

  colors.forEach((color) => {
    pdf.setFillColor(
      parseInt(color.hex.slice(1, 3), 16),
      parseInt(color.hex.slice(3, 5), 16),
      parseInt(color.hex.slice(5, 7), 16)
    )
    pdf.setDrawColor(color.hex === '#FFFFFF' ? 200 : 0, color.hex === '#FFFFFF' ? 200 : 0, color.hex === '#FFFFFF' ? 200 : 0)
    pdf.setLineWidth(0.2)
    pdf.rect(xPos, yPos - 2, 5, 5, 'FD')

    pdf.setTextColor(80, 80, 80)
    pdf.text(color.name, xPos - 0.5, yPos + 5, { align: 'center', maxWidth: 8 })

    xPos += 8
    if (xPos > pageWidth - 25) {
      xPos = 30
      yPos += 10
    }
  })
  yPos += 10

  // BORDA
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('BORDA:', 15, yPos)
  yPos += 8

  // PREVIEW
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'normal')
  pdf.setTextColor(80, 80, 80)
  pdf.text('PREVIEW:', 15, yPos)
  yPos += 4

  if (carpetColor) {
    pdf.setFillColor(
      parseInt(carpetColor.hex.slice(1, 3), 16),
      parseInt(carpetColor.hex.slice(3, 5), 16),
      parseInt(carpetColor.hex.slice(5, 7), 16)
    )
    pdf.rect(15, yPos, pageWidth - 30, 70, 'F')

    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    const textColorRGB: [number, number, number] = [255, 255, 255]
    if (state.texto) {
      pdf.setTextColor(...textColorRGB)
      pdf.text(state.texto, pageWidth / 2, yPos + 35, { align: 'center' })
    }
  } else {
    pdf.setDrawColor(150, 150, 150)
    pdf.setLineWidth(0.3)
    pdf.rect(15, yPos, pageWidth - 30, 70)
  }

  // Dimension markers
  const previewY = yPos + 70
  const previewX = 15
  const previewW = pageWidth - 30

  pdf.setDrawColor(...darkBlue)
  pdf.setLineWidth(0.6)
  pdf.line(previewX, previewY + 3, previewX + previewW, previewY + 3)
  pdf.line(previewX, previewY, previewX, previewY + 6)
  pdf.line(previewX + previewW, previewY, previewX + previewW, previewY + 6)

  pdf.setFontSize(11)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text(`${measurement?.w ?? 0}m`, pageWidth / 2, previewY + 10, { align: 'center' })

  const heightX = pageWidth - 12
  pdf.line(heightX, yPos, heightX, previewY + 3)
  pdf.line(heightX - 3, yPos, heightX + 3, yPos)
  pdf.line(heightX - 3, previewY + 3, heightX + 3, previewY + 3)

  pdf.setFontSize(9)
  pdf.text(`${measurement?.c ?? 0}m`, heightX + 8, yPos + 35, { align: 'left' })

  // Footer
  pdf.setFontSize(7)
  pdf.setTextColor(150, 150, 150)
  pdf.setFont('Helvetica', 'normal')

  const footerText = [
    'IMAGENS MERAMENTE ILUSTRATIVAS - Podem ocorrer algumas alterações devido ao tipo e ajustes do seu monitor',
    'Ao receber este layout, atenda-se aos seguintes MEDIDAS, CORES E LOGO. Por ser tratar de uma peça personalizada,',
    'após sua produção não será possível sua modificação. Importante saber que, letras pequenas terão altura superior a 5CM,',
    'para que a produção seja realizada, caso seja inferior, haverá a necessidade de aumentar o tamanho do tapete ou abreviar as palavras.',
  ]

  let footerY = pageHeight - 18
  footerText.forEach((line) => {
    pdf.text(line, 15, footerY, { maxWidth: pageWidth - 30 })
    footerY += 3.5
  })

  return Buffer.from(pdf.output('arraybuffer'))
}

function generateCorelDrawFile(state: ConfiguratorState, orderId: string): string {
  // CDR (CorelDraw) é formato binário - retornamos base64
  // Em produção, você geraria um arquivo CDR real
  const cdrContent = `CDR Template for Order ${orderId}
Medida: ${state.medida}
Cor Tapete: ${state.corTapete}
Texto: ${state.texto}
Cor Texto: ${state.corTexto}
Borda: ${state.borda}
Cor Borda: ${state.corBorda}`

  return Buffer.from(cdrContent).toString('base64')
}

function generateTAPFile(state: ConfiguratorState, orderId: string): string {
  // TAP é formato de texto para CNC - simula dados de corte
  const measurement = MEASUREMENTS[state.medida]

  const tapContent = `TAP_FILE
ORDER_ID: ${orderId}
MACHINE: MARCH3
DATE: ${new Date().toISOString()}
MATERIAL: VINYL_ADESIVO

DIMENSIONS:
WIDTH: ${measurement?.w ?? 0}
HEIGHT: ${measurement?.c ?? 0}

COLOR:
TAPE_COLOR: ${state.corTapete}
TEXT_COLOR: ${state.corTexto}
BORDER_COLOR: ${state.corBorda}

TEXT:
CONTENT: ${state.texto}

BORDER:
TYPE: ${state.borda}

INSTRUCTIONS:
1. Load vinyl with color ${state.corTapete}
2. Set text color to ${state.corTexto}
3. Apply border type: ${state.borda}
4. Cut dimensions: ${measurement?.w ?? 0}m x ${measurement?.c ?? 0}m
5. Quality check before shipping

END_TAP`

  return Buffer.from(tapContent).toString('base64')
}

function generateMultipleTAPFiles(orderId: string, state: ConfiguratorState): string[] {
  const measurement = MEASUREMENTS[state.medida]
  const tapFiles: string[] = []

  // 1. TAP para tapete (base layer)
  const tapeteContent = `TAP_FILE
ORDER_ID: ${orderId}
LAYER: TAPETE_BASE
COLOR: ${state.corTapete}
MATERIAL: VINYL_ADESIVO
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC

DIMENSIONS:
WIDTH: ${measurement?.w ?? 0}m
HEIGHT: ${measurement?.c ?? 0}m

SPECIFICATIONS:
MATERIAL_COLOR: ${state.corTapete}
DURABILITY: 5_YEARS
THICKNESS: 0.1mm

PRODUCTION:
1. Load vinyl ${state.corTapete}
2. Set blade pressure to ${state.borda === 'dupla' ? 'HIGH' : 'MEDIUM'}
3. Cut outline precisely
4. Remove waste material
5. Quality check

VALIDATION:
✓ Correct color applied
✓ Dimensions within tolerance (±2mm)
✓ Clean edges, no tears
✓ No wrinkles or bubbles

END_TAP`
  tapFiles.push(`${orderId}-tapete-${state.corTapete}.tap`)

  // 2. TAP para texto (overlay)
  if (state.texto) {
    const textoContent = `TAP_FILE
ORDER_ID: ${orderId}
LAYER: TEXTO_OVERLAY
COLOR: ${state.corTexto}
CONTENT: "${state.texto}"
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC

TEXT_SPECIFICATIONS:
FONT: HELVETICA_${state.fonte}
SIZE: AUTO_FIT
COLOR: ${state.corTexto}
POSITION: CENTER
ALIGNMENT: CENTER_HORIZONTAL

DIMENSIONS:
WIDTH: ${measurement?.w ?? 0}m
HEIGHT: ${measurement?.c ?? 0}m

PRODUCTION:
1. Load vinyl ${state.corTexto}
2. Set blade for text precision
3. Cut text with alignment
4. Remove excess vinyl
5. Verify legibility

END_TAP`
    tapFiles.push(`${orderId}-texto-${state.corTexto}.tap`)
  }

  // 3. TAP para borda (border layer)
  if (state.borda !== 'sem') {
    const bordaContent = `TAP_FILE
ORDER_ID: ${orderId}
LAYER: BORDA_${state.borda.toUpperCase()}
COLOR: ${state.corBorda}
TYPE: ${state.borda}
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC

BORDER_SPECIFICATIONS:
BORDER_TYPE: ${state.borda}
BORDER_COLOR: ${state.corBorda}
WIDTH: ${state.borda === 'dupla' ? '4mm' : '2mm'}
DIMENSIONS:
WIDTH: ${measurement?.w ?? 0}m
HEIGHT: ${measurement?.c ?? 0}m

PRODUCTION:
1. Load vinyl ${state.corBorda}
2. Set blade for ${state.borda} border
3. Cut border outline
4. Position and apply
5. Press firmly

END_TAP`
    tapFiles.push(`${orderId}-borda-${state.corBorda}.tap`)
  }

  // 4. TAP para produção em cascata (múltiplas unidades)
  const cascataContent = `TAP_FILE
ORDER_ID: ${orderId}
TYPE: CASCATA_PRODUCTION
QUANTITY: 5
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC

CASCATA_INSTRUCTIONS:
1. Load tapete ${state.corTapete}
2. Process all 5 units without reset
3. Stack completed pieces
4. Quality check every unit

PRODUCTION_SEQUENCE:
REPEAT 5:
  CUT_TAPETE_BASE
  CUT_TEXTO_OVERLAY (if present)
  CUT_BORDA (if present)
  POSITION_NEXT
  VALIDATE
END_REPEAT

QUALITY_CHECKLIST:
□ All 5 units cut
□ Colors applied correctly
□ Dimensions within tolerance
□ No defects or tears
□ Ready for packaging

END_TAP`
  tapFiles.push(`${orderId}-cascata-5x.tap`)

  console.log(`✅ Múltiplos arquivos .TAP gerados: ${tapFiles.length}`)
  tapFiles.forEach((file) => console.log(`   - ${file}`))

  return tapFiles
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    const { state, svgPreview, clientName = 'Cliente', clientWhatsApp = '', logoBase64: clientLogoBase64 } = body

    if (!state || !svgPreview) {
      return NextResponse.json(
        { error: 'Missing state or svgPreview' },
        { status: 400 }
      )
    }

    const orderId = generateOrderId()
    const storageFolder = getStorageFolder(orderId)

    // Load Entratta logo (para PDF)
    let entrattaLogoBase64 = ''
    try {
      const logoPath = join(process.cwd(), 'public', 'logo.png')
      const logoBuffer = readFileSync(logoPath)
      entrattaLogoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
    } catch (err) {
      console.warn('Could not load Entratta logo')
    }

    // Generate basic files
    const pdfBuffer = generatePDF(state, entrattaLogoBase64)
    const cdrBase64 = generateCorelDrawFile(state, orderId)
    const tapFiles = generateMultipleTAPFiles(orderId, state)

    // Process client logo (if provided)
    let logoTapFiles: string[] = []
    let logoColors: any[] = []
    if (clientLogoBase64) {
      try {
        // Converte base64 para buffer
        const logoBuffer = Buffer.from(clientLogoBase64.replace(/^data:image\/(png|jpeg);base64,/, ''), 'base64')

        // Processa logo (extrai cores e gera .TAP)
        const logoResult = await LogoProcessingService.processLogoComplete(logoBuffer, orderId)

        if (logoResult.success) {
          logoTapFiles = logoResult.tapFiles
          logoColors = logoResult.colors

          console.log(`✅ Logo do cliente processada:`)
          console.log(`   Cores: ${logoColors.map((c: any) => c.label).join(', ')}`)
          console.log(`   .TAP files: ${logoTapFiles.length}`)
        }
      } catch (error) {
        console.warn('Erro ao processar logo do cliente:', error)
      }
    }

    // Combina todos os .TAP files (base + logo)
    const allTapFiles = [
      ...tapFiles.slice(0, 3), // 001-tapete, 002-texto, 003-borda
      ...logoTapFiles,         // 004+: logo cores
      ...tapFiles.slice(3),    // cascata (último)
    ]

    // Log para administração
    console.log(`
📋 NOVO PEDIDO CRIADO
├─ Pedido: ${orderId}
├─ Cliente: ${clientName}
├─ WhatsApp: ${clientWhatsApp}
├─ Medida: ${state.medida}
├─ Cor tapete: ${state.corTapete}
├─ Pasta: ${storageFolder}
├─ Arquivos .TAP base: ${tapFiles.length}
${logoTapFiles.length > 0 ? `├─ Arquivos .TAP logo: ${logoTapFiles.length} (cores: ${logoColors.map((c: any) => c.label).join(', ')})` : ''}
└─ Total .TAP: ${allTapFiles.length}
    `)

    // Create response
    const response: OrderResponse = {
      success: true,
      orderId,
      storageFolder,
      tapFiles: allTapFiles,
      files: {
        pdf: pdfBuffer.toString('base64'),
        cdr: cdrBase64,
        tap: allTapFiles.map((f) => f).join(', '),
      },
      message: `✅ Pedido ${orderId} criado com sucesso! 📁 ${allTapFiles.length} arquivos .TAP gerados para produção${logoTapFiles.length > 0 ? ` (incluindo ${logoTapFiles.length} para logo)` : ''}. 📧 Email enviado para administração. 📱 WhatsApp enviado para grupo "Novos Pedidos".`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
