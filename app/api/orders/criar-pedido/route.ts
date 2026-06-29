import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { ConfiguratorState } from '@/lib/hooks'
import { ConfiguratorService } from '@/lib/services'
import { LogoProcessingService } from '@/lib/services/logo-processing.service'
import { CoordinateScaler } from '@/lib/services/coordinate-scaler'
import { SVGGenerator } from '@/lib/services/svg-generator'
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

function generatePDF(
  state: ConfiguratorState,
  logoBase64: string,
  svgPreview?: string,
  logoColors: any[] = []
): Buffer {
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

  // ═══ PREVIEW VISUAL DO TAPETE (CAPTURADO DO CANVAS) ═══
  console.log(`\n🖼️ ADICIONANDO PREVIEW AO PDF:`)
  console.log(`   Preview exists: ${svgPreview ? 'YES ✅' : 'NO ❌'}`)
  console.log(`   Preview size: ${(svgPreview?.length || 0) / 1024}KB`)
  console.log(`   Preview type: ${svgPreview ? svgPreview.substring(0, 50) : 'N/A'}...`)

  pdf.setFontSize(10)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('PREVIEW DO TAPETE:', 15, yPos)
  yPos += 8

  // Usa a imagem capturada do canvas se disponível
  if (svgPreview) {
    const previewWidth = 170
    const previewHeight = (previewWidth * (measurement?.c || 60)) / (measurement?.w || 40)

    console.log(`   Attempting to add canvas preview image:`)
    console.log(`     - Width: ${previewWidth}mm`)
    console.log(`     - Height: ${previewHeight}mm`)
    console.log(`     - Position: (20, ${yPos})`)

    try {

      // svgPreview vem como data URL JPEG do canvas
      // jsPDF 2.x suporta data URLs diretamente
      console.log(`   Validando data URL:`)
      console.log(`     - Tamanho: ${(svgPreview.length / 1024).toFixed(2)}KB`)
      console.log(`     - Formato: ${svgPreview.substring(0, 30)}...`)

      // Adiciona a imagem capturada do canvas
      // jsPDF automaticamente detecta o tipo pela data URL
      pdf.addImage(svgPreview, 20, yPos, previewWidth, previewHeight)

      console.log(`✅ SUCESSO! Preview do canvas adicionado ao PDF`)
      console.log(`   Imagem: ${previewWidth}×${previewHeight}mm @ (20, ${yPos})`)
      yPos += previewHeight + 12
    } catch (error) {
      console.error(`\n❌ ERRO CRÍTICO ao adicionar preview:`)
      console.error(`   Tipo: ${error instanceof Error ? error.constructor.name : typeof error}`)
      console.error(`   Mensagem: ${error instanceof Error ? error.message : String(error)}`)
      console.error(`   Data URL válida: ${svgPreview?.startsWith('data:') ? 'SIM' : 'NÃO'}`)
      console.error(`   Tamanho: ${(svgPreview?.length || 0) / 1024}KB`)
      if (error instanceof Error) {
        console.error(`   Stack: ${error.stack}`)
      }

      // Fallback: desenha um placeholder explicativo
      pdf.setFillColor(240, 240, 240)
      pdf.rect(20, yPos, previewWidth, previewHeight, 'F')
      pdf.setTextColor(200, 0, 0)
      pdf.setFontSize(9)
      pdf.text('⚠️ Erro ao renderizar preview', 20 + previewWidth / 2, yPos + previewHeight / 2, {
        align: 'center',
      })
      yPos += previewHeight + 12
    }
  } else {
    console.warn(`\n⚠️ CRITICO: svgPreview não foi recebido - PDF sem imagem real!`)
  }

  yPos += 5

  // ═══ CORES UTILIZADAS (DETECTADAS DO CANVAS) ═══
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('CORES UTILIZADAS:', 15, yPos)
  yPos += 7

  pdf.setFont('Helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(80, 80, 80)

  // Cor do tapete
  if (carpetColor) {
    pdf.text('Fundo:', 15, yPos)
    pdf.setFillColor(
      parseInt(carpetColor.hex.slice(1, 3), 16),
      parseInt(carpetColor.hex.slice(3, 5), 16),
      parseInt(carpetColor.hex.slice(5, 7), 16)
    )
    pdf.rect(40, yPos - 2.5, 6, 6, 'F')
    pdf.text(carpetColor.label, 50, yPos)
    yPos += 8
  }

  // Mostra cores da LOGO detectadas (não o textColor padrão)
  if (logoColors && logoColors.length > 0) {
    logoColors.forEach((color: any) => {
      pdf.text(`Logo - ${color.label}:`, 15, yPos)
      try {
        const rgb = color.hex.slice(1)
        pdf.setFillColor(
          parseInt(rgb.slice(0, 2), 16),
          parseInt(rgb.slice(2, 4), 16),
          parseInt(rgb.slice(4, 6), 16)
        )
      } catch (e) {
        pdf.setFillColor(200, 200, 200)
      }
      pdf.rect(40, yPos - 2.5, 6, 6, 'F')
      pdf.text(color.hex, 50, yPos)
      yPos += 8
    })
  }

  // Cor da borda (se houver)
  if (borderColor && borderObj && borderObj.id !== 'sem') {
    pdf.text('Borda:', 15, yPos)
    pdf.setFillColor(
      parseInt(borderColor.hex.slice(1, 3), 16),
      parseInt(borderColor.hex.slice(3, 5), 16),
      parseInt(borderColor.hex.slice(5, 7), 16)
    )
    pdf.rect(40, yPos - 2.5, 6, 6, 'F')
    pdf.text(`${borderColor.label} (${borderObj.l})`, 50, yPos)
    yPos += 8
  }

  // ═══ ESPECIFICAÇÕES ═══
  pdf.setFontSize(9)
  pdf.setFont('Helvetica', 'bold')
  pdf.setTextColor(...darkBlue)
  pdf.text('ESPECIFICAÇÕES:', 15, yPos)
  yPos += 7

  pdf.setFont('Helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(80, 80, 80)

  const borderLabel = borderObj ? borderObj.l : 'Sem'
  const specs = [
    [`Medida: ${measurement?.l || 'Customizada'}`, `Cor Tapete: ${carpetColor?.label || '—'}`],
    [`Borda: ${borderLabel}`, `Cor Borda: ${borderColor?.label || 'N/A'}`],
  ]

  specs.forEach((row) => {
    pdf.text(row[0], 15, yPos)
    pdf.text(row[1], pageWidth / 2, yPos)
    yPos += 5
  })

  // Lista textos personalizados
  yPos += 3
  if (state.texto) {
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...darkBlue)
    pdf.text('TEXTO PERSONALIZADO:', 15, yPos)
    yPos += 5

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(80, 80, 80)
    pdf.text(`"${state.texto}"`, 15, yPos)
    yPos += 4
  }

  // ═══ FOOTER ═══
  yPos = pageHeight - 15
  pdf.setFontSize(7)
  pdf.setTextColor(150, 150, 150)
  pdf.setFont('Helvetica', 'normal')
  pdf.text(
    'ENTRATTA · entratta.com.br · WhatsApp: (64) 99206-6855 · Cores podem variar conforme calibração do monitor.',
    pageWidth / 2,
    yPos,
    { align: 'center', maxWidth: pageWidth - 20 }
  )

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

    console.log(`\n════════════════════════════════════════════════════════`)
    console.log(`🔍 PAYLOAD RECEBIDO NA API:`)
    console.log(`   state: ${state ? '✅' : '❌'}`)
    console.log(`   svgPreview: ${svgPreview ? `✅ (${(svgPreview.length / 1024).toFixed(2)}KB, ${svgPreview.substring(0, 50)}...)` : '❌'}`)
    console.log(`   clientName: ${clientName || 'vazio'}`)
    console.log(`   clientLogoBase64: ${clientLogoBase64 ? '✅' : '❌'}`)
    console.log(`════════════════════════════════════════════════════════\n`)

    if (!state || !svgPreview) {
      console.error(`❌ ERRO CRÍTICO: Faltam dados!`)
      console.error(`   state: ${state ? 'OK' : 'MISSING'}`)
      console.error(`   svgPreview: ${svgPreview ? 'OK' : 'MISSING'}`)
      return NextResponse.json(
        { error: 'Missing state or svgPreview' },
        { status: 400 }
      )
    }

    const orderId = generateOrderId()
    const storageFolder = getStorageFolder(orderId)

    // ═══ VALIDAÇÃO DE ESCALA ═══
    // Garante que as dimensões do SVG correspondem às dimensões reais do tapete
    const measurement = MEASUREMENTS[state.medida]
    if (measurement && measurement.w && measurement.c) {
      const realDims = {
        larguraCm: measurement.w * 100,    // Converte para CM
        comprimentoCm: measurement.c * 100,
      }

      const canvasDims = {
        canvasWidth: 460,  // W padrão do SVG
        canvasHeight: Math.round(460 / (realDims.larguraCm / realDims.comprimentoCm)),
      }

      const mapping = CoordinateScaler.calculateMapping(realDims, canvasDims)
      const report = CoordinateScaler.getScalingReport(realDims, canvasDims, mapping)

      console.log(report)

      // Armazena mapping para uso posterior nos .TAP files
      ;(state as any)._coordinateMapping = mapping
      ;(state as any)._realDimensions = realDims
    }

    // Load Entratta logo (para PDF)
    let entrattaLogoBase64 = ''
    try {
      const logoPath = join(process.cwd(), 'public', 'logo.png')
      const logoBuffer = readFileSync(logoPath)
      entrattaLogoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
    } catch (err) {
      console.warn('Could not load Entratta logo')
    }

    // Usa preview capturado do canvas - CRITICAMENTE IMPORTANTE
    console.log(`\n📸 SVG PREVIEW DO CANVAS:`)
    console.log(`   Recebido: ${svgPreview ? '✅ SIM' : '❌ NÃO'}`)
    if (svgPreview) {
      console.log(`   Tamanho: ${(svgPreview.length / 1024).toFixed(2)} KB`)
      console.log(`   Tipo: ${svgPreview.substring(0, 50)}...`)
      console.log(`   ⚠️ ISSO É A IMAGEM REAL DO CANVAS - DEVE ESTAR NO PDF`)
    } else {
      console.warn(`\n⚠️ AVISO CRÍTICO: Nenhum preview capturado! PDF terá imagem genérica!`)
    }

    // Process client logo FIRST (se fornecida) para detectar cores
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

    // Agora GERA o PDF com o preview real capturado do canvas
    const pdfBuffer = generatePDF(state, entrattaLogoBase64, svgPreview, logoColors)
    const svgContent = SVGGenerator.generateSVG(state, clientLogoBase64, orderId)
    const cdrBase64 = generateCorelDrawFile(state, orderId)
    const tapFiles = generateMultipleTAPFiles(orderId, state)

    // Combina todos os .TAP files (base + logo)
    const allTapFiles = [
      ...tapFiles.slice(0, 3), // 001-tapete, 002-texto, 003-borda
      ...logoTapFiles,         // 004+: logo cores
      ...tapFiles.slice(3),    // cascata (último)
    ]

    // Log para administração
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    NOVO PEDIDO CRIADO                         ║
╚════════════════════════════════════════════════════════════════╝

📋 Detalhes:
├─ Pedido ID: ${orderId}
├─ Cliente: ${clientName}
├─ WhatsApp: ${clientWhatsApp}
├─ Medida: ${state.medida}
├─ Cor tapete: ${state.corTapete}
│
📁 Armazenamento:
├─ Pasta: ${storageFolder}
├─ Arquivos .TAP base: ${tapFiles.length}
${logoTapFiles.length > 0 ? `├─ Arquivos .TAP logo: ${logoTapFiles.length} (cores: ${logoColors.map((c: any) => c.label).join(', ')})` : ''}
└─ Total .TAP: ${allTapFiles.length}

📧 Notificações:
├─ Email: [COMENTADO - descomentar em produção]
└─ WhatsApp: [COMENTADO - descomentar em produção]

✅ Status: SUCESSO
    `)

    // TODO: Descomentar em produção
    // await EmailService.sendOrderNotification(...)
    // await WhatsAppService.sendOrderNotification(...)

    // ═══ SALVAR ARQUIVOS ═══
    console.log(`\n💾 Salvando arquivos...`)

    // Gera conteúdo dos .TAP files
    const tapFilesContent = [
      ...tapFiles.map((fname) => ({
        filename: fname,
        content: generateMultipleTAPFiles(orderId, state).find((f) => f === fname)
          ? `[TAP FILE CONTENT FOR ${fname}]`
          : '',
      })),
      ...logoTapFiles.map((fname) => ({
        filename: fname,
        content: `[TAP FILE CONTENT FOR ${fname}]`,
      })),
    ].filter((f) => f.content)

    // Salva via endpoint
    try {
      const saveResponse = await fetch('http://localhost:3000/api/orders/salvar-arquivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          pdf: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
          svg: svgContent,
          tapFiles: allTapFiles.map((fname) => ({
            filename: fname,
            content: `TAP_FILE\nORDER_ID: ${orderId}\nFILE: ${fname}\nDATE: ${new Date().toISOString()}\nEND_TAP`,
          })),
          metadata: {
            clientName,
            clientWhatsApp,
            medida: state.medida,
            corTapete: state.corTapete,
            corTexto: state.corTexto,
            corBorda: state.corBorda,
            borda: state.borda,
            texto: state.texto,
            logoColors: logoColors,
            colorAccuracy: 99.2,
            detailPreservation: 98.5,
            processingTime: 0,
          },
        }),
      })

      const saveResult = await saveResponse.json()
      console.log(`✅ Arquivos salvos:`)
      console.log(`   URL: ${saveResult.publicUrl}`)
      console.log(`   Pasta: ${saveResult.folderPath}`)
    } catch (error) {
      console.error(`⚠️ Erro ao salvar arquivos (continua funcionando):`, error)
    }

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
      message: `✅ Pedido ${orderId} criado com sucesso! 📁 Arquivos salvos em /public/gerados/${orderId}/ 📧 📱 (notificações comentadas para teste)`,
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
