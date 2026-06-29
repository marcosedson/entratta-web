import { ConfiguratorState } from '@/lib/hooks'

export class PDFService {
  static async generateLayoutPDF(
    state: ConfiguratorState,
    svgPreview: string
  ): Promise<Blob> {
    const response = await fetch('/api/orders/gerar-layout-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
        svgPreview,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    return response.blob()
  }

  static downloadPDF(blob: Blob, filename: string = 'layout-tapete.pdf'): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static async generateAndDownloadPDF(
    state: ConfiguratorState,
    svgPreview: string,
    filename: string = 'layout-tapete.pdf'
  ): Promise<void> {
    try {
      const blob = await this.generateLayoutPDF(state, svgPreview)
      this.downloadPDF(blob, filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }
}
