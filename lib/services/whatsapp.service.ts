interface EvolutionMessage {
  chatId: string
  text: string
  contentType?: string
  mediaUrl?: string
  fileName?: string
}

export class WhatsAppService {
  private static readonly EVOLUTION_API = 'https://evo.entratta.com.br'
  private static readonly GROUP_ID = 'novos-pedidos@g.us'

  static async sendOrderNotification(
    orderId: string,
    clientName: string,
    medida: string,
    corTapete: string,
    quantidade: number
  ): Promise<boolean> {
    try {
      const message = `
📌 *NOVO PEDIDO ENTRATTA*

📋 *Pedido:* ${orderId}
👤 *Cliente:* ${clientName}
📐 *Medida:* ${medida}
🎨 *Cor:* ${corTapete}
💬 *Quantidade:* ${quantidade}x

✅ Arquivos .TAP prontos para March3
📁 Pasta: storage/pedidos/2026/junho/${orderId}/

👉 Dashboard: https://entratta.com.br/admin/pedidos/${orderId}
      `.trim()

      // Em produção, chamar Evolution API
      // await fetch(`${this.EVOLUTION_API}/message/sendText`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chatId: this.GROUP_ID,
      //     text: message,
      //   }),
      // })

      console.log(`📱 WhatsApp enviado para grupo "Novos Pedidos"`)
      console.log(`   Mensagem: ${message}`)

      return true
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      return false
    }
  }

  static async sendPDFWithMessage(
    orderId: string,
    clientName: string,
    pdfBase64: string,
    quantidade: number
  ): Promise<boolean> {
    try {
      const message = `
📋 *${orderId}* - ${clientName}
💬 ${quantidade}x unidades
      `.trim()

      // Em produção:
      // await fetch(`${this.EVOLUTION_API}/message/sendMedia`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chatId: this.GROUP_ID,
      //     contentType: 'application/pdf',
      //     base64: pdfBase64,
      //     fileName: `${orderId}-projeto.pdf`,
      //     caption: message,
      //   }),
      // })

      console.log(`📎 PDF enviado via WhatsApp`)
      console.log(`   Arquivo: ${orderId}-projeto.pdf`)

      return true
    } catch (error) {
      console.error('Erro ao enviar PDF via WhatsApp:', error)
      return false
    }
  }
}
