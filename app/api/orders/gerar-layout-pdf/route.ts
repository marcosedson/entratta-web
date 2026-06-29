import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { ConfiguratorState } from '@/lib/hooks'
import { ConfiguratorService } from '@/lib/services'
import {
  CARPET_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  MEASUREMENTS,
} from '@/lib/constants'

interface LayoutPDFRequest {
  state: ConfiguratorState
  svgPreview: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LayoutPDFRequest = await request.json()
    const { state, svgPreview } = body

    // Validate input
    if (!state || !svgPreview) {
      return NextResponse.json(
        { error: 'Missing state or svgPreview' },
        { status: 400 }
      )
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Set font and colors
    pdf.setFont('Helvetica')
    pdf.setDrawColor(70, 130, 180) // Steel blue border
    pdf.setLineWidth(0.5)

    // Draw border
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Header with logo area
    pdf.setFontSize(16)
    pdf.setTextColor(70, 130, 180)
    pdf.text('TAPMAQ', pageWidth - 30, 20, { align: 'right' })

    let yPosition = 30

    // FUNDO section
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    pdf.text('FUNDO:', 15, yPosition)

    const carpetColor = CARPET_COLORS.find((c) => c.id === state.corTapete)
    if (carpetColor) {
      pdf.setFillColor(
        parseInt(carpetColor.hex.slice(1, 3), 16),
        parseInt(carpetColor.hex.slice(3, 5), 16),
        parseInt(carpetColor.hex.slice(5, 7), 16)
      )
      pdf.rect(30, yPosition - 3, 8, 8, 'F')
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(8)
      pdf.text(carpetColor.label, 42, yPosition + 1)
    }

    yPosition += 12

    // LOGO section
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    pdf.text('LOGO:', 15, yPosition)

    // Draw logo color swatches
    const logoColors = [
      { name: 'BRANCO', color: '#FFFFFF', border: '#CCCCCC' },
      ...TEXT_COLORS.map((c) => ({
        name: c.label.toUpperCase(),
        color: c.hex,
        border: '#000000',
      })),
    ]

    let xPos = 30
    logoColors.forEach((color) => {
      const rgb = color.color.slice(1)
      const r = parseInt(rgb.slice(0, 2), 16)
      const g = parseInt(rgb.slice(2, 4), 16)
      const b = parseInt(rgb.slice(4, 6), 16)

      // Draw color swatch
      pdf.setFillColor(r, g, b)
      if (color.color === '#FFFFFF') {
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.3)
      } else {
        pdf.setDrawColor(0, 0, 0)
        pdf.setLineWidth(0.2)
      }
      pdf.rect(xPos, yPosition - 3, 6, 6, 'FD')

      // Draw label
      pdf.setFontSize(7)
      pdf.setTextColor(80, 80, 80)
      pdf.text(color.name, xPos, yPosition + 8, { align: 'center' })

      xPos += 10
      if (xPos > pageWidth - 30) {
        xPos = 30
        yPosition += 15
      }
    })

    yPosition += 20

    // BORDA section
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    pdf.text('BORDA:', 15, yPosition)
    yPosition += 8

    // Preview section
    pdf.setFontSize(9)
    pdf.text('PREVIEW:', 15, yPosition)
    yPosition += 5

    // Add SVG preview (simplified - just a placeholder box for now)
    pdf.setDrawColor(100, 100, 100)
    pdf.setLineWidth(0.3)
    pdf.rect(15, yPosition, pageWidth - 30, 80)
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('[Tapete Preview]', pageWidth / 2, yPosition + 40, {
      align: 'center',
    })

    // Add dimensions
    const measurement = MEASUREMENTS[state.medida]
    if (measurement) {
      // Width dimension
      pdf.setLineWidth(0.4)
      pdf.setDrawColor(0, 0, 0)

      // Bottom arrow line
      const bottomY = yPosition + 85
      pdf.line(20, bottomY, pageWidth - 20, bottomY)
      pdf.line(20, bottomY - 2, 20, bottomY + 2) // Left arrow
      pdf.line(pageWidth - 20, bottomY - 2, pageWidth - 20, bottomY + 2) // Right arrow

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${measurement.w}m`, pageWidth / 2, bottomY + 5, {
        align: 'center',
      })

      // Height dimension
      const rightX = pageWidth - 15
      const topY = yPosition + 5
      pdf.line(rightX, topY, rightX, bottomY)
      pdf.line(rightX - 2, topY, rightX + 2, topY) // Top arrow
      pdf.line(rightX - 2, bottomY, rightX + 2, bottomY) // Bottom arrow

      pdf.setFontSize(8)
      pdf.text(`${measurement.c}m`, rightX + 8, (topY + bottomY) / 2, {
        align: 'left',
      })
    }

    yPosition += 90

    // Specifications section
    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)

    const specs = [
      `Fundo: ${carpetColor?.label || state.corTapete}`,
      `Texto: ${state.texto || '(sem texto)'}`,
      `Logo: ${state.logoSrc ? 'Enviado' : 'Não enviado'}`,
      `Borda: ${BORDER_COLORS.find((b) => b.id === state.corBorda)?.label || 'Nenhuma'}`,
      `Medida: ${ConfiguratorService.getMeasurementLabel(state)}`,
    ]

    pdf.setFontSize(8)
    specs.forEach((spec, index) => {
      pdf.text(spec, 15, yPosition + index * 4)
    })

    // Footer text
    pdf.setFontSize(7)
    pdf.setTextColor(150, 150, 150)
    yPosition += specs.length * 4 + 8

    const footerText = [
      'IMAGENS MERAMENTE ILUSTRATIVAS - Podem ocorrer algumas alterações devido ao tipo e ajustes do seu monitor',
      'Ao receber este layout, atenda-se aos seguintes MEDIDAS, CORES E LOGO. Por ser tratar de uma peça',
      'personalizada, após sua produção não será possível sua modificação. Importante saber que, letras',
      'pequenas terão altura superior a 5CM, para que a produção seja realizada, caso seja inferior, haverá',
      'a necessidade de aumentar o tamanho do tapete ou abreviar as palavras.',
    ]

    footerText.forEach((line, index) => {
      pdf.text(line, 15, yPosition + index * 3, { maxWidth: pageWidth - 30 })
    })

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="layout-tapete.pdf"',
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
