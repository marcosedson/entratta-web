interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType: string
  }>
}

export class EmailService {
  static async sendOrderNotification(
    orderId: string,
    clientName: string,
    clientWhatsApp: string,
    medida: string,
    corTapete: string,
    quantidade: number,
    pdfBuffer: Buffer
  ): Promise<boolean> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .header { border-bottom: 3px solid #22C55E; padding-bottom: 15px; }
            .header h1 { color: #0F172A; margin: 0 0 5px 0; }
            .content { margin: 20px 0; }
            .info-box { background: #F0FDF4; border-left: 4px solid #22C55E; padding: 15px; margin: 15px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .label { font-weight: bold; color: #0F172A; }
            .value { color: #666; }
            .files { background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .files h3 { margin-top: 0; color: #0F172A; }
            .file-item { padding: 8px 0; color: #666; }
            .cta-button { display: inline-block; background: #22C55E; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 15px 0; }
            .footer { border-top: 1px solid #e5e5e5; margin-top: 20px; padding-top: 15px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Novo Pedido Entratta</h1>
              <p>Um novo pedido foi criado e está pronto para produção</p>
            </div>

            <div class="content">
              <div class="info-box">
                <div class="info-row">
                  <span class="label">📋 Pedido:</span>
                  <span class="value"><strong>${orderId}</strong></span>
                </div>
                <div class="info-row">
                  <span class="label">👤 Cliente:</span>
                  <span class="value">${clientName}</span>
                </div>
                <div class="info-row">
                  <span class="label">📞 WhatsApp:</span>
                  <span class="value">${clientWhatsApp}</span>
                </div>
              </div>

              <div class="info-box">
                <div class="info-row">
                  <span class="label">📐 Medida:</span>
                  <span class="value">${medida}</span>
                </div>
                <div class="info-row">
                  <span class="label">🎨 Cor Tapete:</span>
                  <span class="value">${corTapete}</span>
                </div>
                <div class="info-row">
                  <span class="label">💬 Quantidade:</span>
                  <span class="value">${quantidade} unidade(s)</span>
                </div>
              </div>

              <div class="files">
                <h3>📁 Arquivos para Produção:</h3>
                <div class="file-item">✓ PDF do Projeto (anexado)</div>
                <div class="file-item">✓ Arquivo .TAP (Base - Tapete)</div>
                <div class="file-item">✓ Arquivo .TAP (Overlay - Texto/Logo)</div>
                <div class="file-item">✓ Arquivo .TAP (Borda)</div>
              </div>

              <a href="https://entratta.com.br/admin/pedidos/${orderId}" class="cta-button">
                Ver Pedido no Dashboard
              </a>

              <p style="color: #666; font-size: 14px;">
                Os arquivos .TAP estão salvos em: <code>storage/pedidos/2026/junho/${orderId}/</code>
              </p>
            </div>

            <div class="footer">
              <p>Este é um email automático. Não responda diretamente.</p>
              <p>Sistema de Pedidos Entratta © 2026</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Em produção, use um serviço real como Resend, SendGrid ou Nodemailer
      // Por enquanto, simulamos o envio
      console.log(`📧 Email enviado para: administracao@entratta.com.br`)
      console.log(`   Assunto: Novo Pedido ${orderId}`)
      console.log(`   Cliente: ${clientName}`)

      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }
}
