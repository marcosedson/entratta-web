import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { ConfiguratorState } from '@/lib/hooks'
import { ConfiguratorService } from '@/lib/services'
import {
  CARPET_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  MEASUREMENTS,
  BORDERS,
} from '@/lib/constants'
import { readFileSync } from 'fs'
import { join } from 'path'

interface LayoutPDFRequest {
  state: ConfiguratorState
  svgPreview: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LayoutPDFRequest = await request.json()
    const { state, svgPreview } = body

    if (!state || !svgPreview) {
      return NextResponse.json(
        { error: 'Missing state or svgPreview' },
        { status: 400 }
      )
    }

    // Load logo
    let logoBase64 = ''
    try {
      const logoPath = join(process.cwd(), 'public', 'logo.png')
      const logoBuffer = readFileSync(logoPath)
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
    } catch (err) {
      console.warn('Could not load logo:', err)
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Color palette
    const brandGreen: [number, number, number] = [34, 197, 94] // #22C55E
    const darkBlue: [number, number, number] = [15, 23, 42] // #0F172A
    const lightGray: [number, number, number] = [243, 244, 246]

    // ═════════════════════════════════════════════════════════════
    // HEADER SECTION - Similar to projeto.jpg
    // ═════════════════════════════════════════════════════════════
    pdf.setFillColor(255, 255, 255)
    pdf.rect(0, 0, pageWidth, 45, 'F')

    // Border
    pdf.setDrawColor(...darkBlue)
    pdf.setLineWidth(1.5)
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Logo
    if (logoBase64) {
      pdf.addImage(logoBase64, 'PNG', 15, 12, 18, 18)
    }

    // Title - similar to TAPMAQ
    pdf.setFontSize(16)
    pdf.setFont('Helvetica', 'bold')
    pdf.setTextColor(...darkBlue)
    pdf.text('PROJETO DE CAPACHO PERSONALIZADO', 40, 22)

    pdf.setFontSize(8)
    pdf.setFont('Helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    const date = new Date().toLocaleDateString('pt-BR')
    pdf.text(`APROVADO - ${date}`, pageWidth - 35, 22)

    // ═════════════════════════════════════════════════════════════
    // CONTENT - Following projeto.jpg pattern
    // ═════════════════════════════════════════════════════════════
    let yPos = 36

    const measurement = MEASUREMENTS[state.medida]
    const carpetColor = CARPET_COLORS.find((c) => c.id === state.corTapete)
    const textColor = TEXT_COLORS.find((c) => c.id === state.corTexto)
    const borderColor = BORDER_COLORS.find((c) => c.id === state.corBorda)
    const borderObj = BORDERS.find((b) => b.id === state.borda)

    // FUNDO Section
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

    // LOGO Section
    pdf.setFontSize(9)
    pdf.setFont('Helvetica', 'bold')
    pdf.setTextColor(...darkBlue)
    pdf.text('LOGO:', 15, yPos)
    yPos += 7

    // Color swatches
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

    // BORDA Section
    pdf.setFontSize(9)
    pdf.setFont('Helvetica', 'bold')
    pdf.setTextColor(...darkBlue)
    pdf.text('BORDA:', 15, yPos)
    yPos += 8

    // ═════════════════════════════════════════════════════════════
    // PREVIEW AREA - Large and prominent
    // ═════════════════════════════════════════════════════════════
    pdf.setFontSize(9)
    pdf.setFont('Helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    pdf.text('PREVIEW:', 15, yPos)
    yPos += 4

    // Preview box with color background
    if (carpetColor) {
      pdf.setFillColor(
        parseInt(carpetColor.hex.slice(1, 3), 16),
        parseInt(carpetColor.hex.slice(3, 5), 16),
        parseInt(carpetColor.hex.slice(5, 7), 16)
      )
      pdf.rect(15, yPos, pageWidth - 30, 70, 'F')

      // Text overlay
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

    // Width dimension (bottom)
    pdf.setDrawColor(...darkBlue)
    pdf.setLineWidth(0.6)
    pdf.line(previewX, previewY + 3, previewX + previewW, previewY + 3)
    pdf.line(previewX, previewY, previewX, previewY + 6)
    pdf.line(previewX + previewW, previewY, previewX + previewW, previewY + 6)

    pdf.setFontSize(11)
    pdf.setFont('Helvetica', 'bold')
    pdf.setTextColor(...darkBlue)
    pdf.text(`${measurement?.w ?? 0}m`, pageWidth / 2, previewY + 10, { align: 'center' })

    // Height dimension (right side)
    const heightX = pageWidth - 12
    pdf.line(heightX, yPos, heightX, previewY + 3)
    pdf.line(heightX - 3, yPos, heightX + 3, yPos)
    pdf.line(heightX - 3, previewY + 3, heightX + 3, previewY + 3)

    pdf.setFontSize(9)
    pdf.text(`${measurement?.c ?? 0}m`, heightX + 8, yPos + 35, { align: 'left' })

    yPos = previewY + 18

    // ═════════════════════════════════════════════════════════════
    // FOOTER - Important information (like projeto.jpg)
    // ═════════════════════════════════════════════════════════════
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

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="projeto-tapete-personalizado.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
