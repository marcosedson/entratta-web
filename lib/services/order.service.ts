import { ConfiguratorState } from '@/lib/hooks'

interface CreateOrderResponse {
  success: boolean
  orderId: string
  message: string
  storageFolder: string
  tapFiles: string[]
  files?: {
    pdf: string
    cdr: string
    tap: string
  }
}

export class OrderService {
  static async createOrder(
    state: ConfiguratorState,
    svgPreview: string,
    clientName: string = 'Cliente',
    clientWhatsApp: string = ''
  ): Promise<CreateOrderResponse> {
    const response = await fetch('/api/orders/criar-pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
        svgPreview,
        clientName,
        clientWhatsApp,
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
    try {
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
    } catch (error) {
      console.error(`Erro ao baixar arquivo ${filename}:`, error)
    }
  }

  static async createAndDownloadOrder(
    state: ConfiguratorState,
    svgPreview: string,
    clientName: string = 'Cliente',
    clientWhatsApp: string = ''
  ): Promise<CreateOrderResponse> {
    try {
      const orderResponse = await this.createOrder(
        state,
        svgPreview,
        clientName,
        clientWhatsApp
      )

      if (orderResponse.success) {
        console.log('✅ Pedido criado com sucesso!')
        console.log(`📋 ID: ${orderResponse.orderId}`)
        console.log(`📁 Pasta: ${orderResponse.storageFolder}`)
        console.log(`📄 Arquivos .TAP gerados: ${orderResponse.tapFiles.length}`)

        // Notificações automáticas:
        // 1. Email enviado para administracao@entratta.com.br
        // 2. WhatsApp enviado para grupo "Novos Pedidos"
        // 3. Arquivos armazenados em: storage/pedidos/2026/junho/{orderId}/
      }

      return orderResponse
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }
}
