import { ConfiguratorState } from '@/lib/hooks'

interface CreateOrderResponse {
  success: boolean
  orderId: string
  files: {
    pdf: string
    cdr: string
    tap: string
  }
  message: string
}

export class OrderService {
  static async createOrder(
    state: ConfiguratorState,
    svgPreview: string
  ): Promise<CreateOrderResponse> {
    const response = await fetch('/api/orders/criar-pedido', {
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
      throw new Error('Falha ao criar pedido')
    }

    return response.json()
  }

  static downloadFile(
    base64Content: string,
    filename: string,
    mimeType: string = 'application/octet-stream'
  ): void {
    const binaryString = atob(base64Content)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static downloadAllOrderFiles(
    orderId: string,
    files: {
      pdf: string
      cdr: string
      tap: string
    }
  ): void {
    // Download PDF
    this.downloadFile(files.pdf, `${orderId}-projeto.pdf`, 'application/pdf')

    // Download CDR (CorelDraw)
    setTimeout(() => {
      this.downloadFile(
        files.cdr,
        `${orderId}-design.cdr`,
        'application/x-coreldraw'
      )
    }, 500)

    // Download TAP (CNC/March3)
    setTimeout(() => {
      this.downloadFile(
        files.tap,
        `${orderId}-march3.tap`,
        'text/plain'
      )
    }, 1000)
  }

  static async createAndDownloadOrder(
    state: ConfiguratorState,
    svgPreview: string
  ): Promise<CreateOrderResponse> {
    const orderResponse = await this.createOrder(state, svgPreview)

    if (orderResponse.success) {
      // Start downloads after a short delay
      setTimeout(() => {
        this.downloadAllOrderFiles(orderResponse.orderId, orderResponse.files)
      }, 500)
    }

    return orderResponse
  }
}
