import { ConfiguratorState } from '@/lib/hooks'

interface ManifestItem {
  number: number
  file: string
  layer: 'BASE' | 'OVERLAY' | 'BORDA' | 'CASCATA'
  color: string
  instruction: string
  estimatedTime: string
}

interface ProductionManifest {
  orderId: string
  cliente: string
  whatsapp: string
  medida: string
  totalTaps: number
  sequence: ManifestItem[]
  estimatedTime: string
  createdAt: string
  qualityChecklist: string[]
}

export class ProductionQueueService {
  private static readonly QUEUE_PATH = 'storage/fila-producao'
  private static readonly COMPLETED_PATH = 'storage/producao-completa'

  static generateManifest(
    orderId: string,
    state: ConfiguratorState,
    clientName: string,
    clientWhatsApp: string,
    tapFiles: string[]
  ): ProductionManifest {
    const sequence: ManifestItem[] = []
    let itemNumber = 1

    // 1. Base layer (tapete)
    sequence.push({
      number: itemNumber++,
      file: `${String(itemNumber - 1).padStart(3, '0')}-tapete-${state.corTapete}.tap`,
      layer: 'BASE',
      color: state.corTapete,
      instruction: `Corte a base de vinil ${state.corTapete.toLowerCase()}`,
      estimatedTime: '4 minutos',
    })

    // 2. Texto overlay (se houver)
    if (state.texto) {
      sequence.push({
        number: itemNumber++,
        file: `${String(itemNumber - 1).padStart(3, '0')}-texto-${state.corTexto}.tap`,
        layer: 'OVERLAY',
        color: state.corTexto,
        instruction: `Sobreponha o texto "${state.texto}" em ${state.corTexto.toLowerCase()}`,
        estimatedTime: '3 minutos',
      })
    }

    // 3. Borda (se houver)
    if (state.borda !== 'sem') {
      sequence.push({
        number: itemNumber++,
        file: `${String(itemNumber - 1).padStart(3, '0')}-borda-${state.corBorda}.tap`,
        layer: 'BORDA',
        color: state.corBorda,
        instruction: `Aplique borda ${state.borda} em ${state.corBorda.toLowerCase()}`,
        estimatedTime: '3 minutos',
      })
    }

    // 4. Cascata (produção em lote)
    sequence.push({
      number: itemNumber++,
      file: `${String(itemNumber - 1).padStart(3, '0')}-cascata-5x.tap`,
      layer: 'CASCATA',
      color: state.corTapete,
      instruction: '5 unidades em cascata (sem reset entre cortes)',
      estimatedTime: '20 minutos',
    })

    const estimatedMinutes = sequence.reduce((sum, item) => {
      const match = item.estimatedTime.match(/\d+/)
      return sum + (match ? parseInt(match[0]) : 0)
    }, 0)

    return {
      orderId,
      cliente: clientName,
      whatsapp: clientWhatsApp,
      medida: `${state.medida === 'custom' ? `${state.customL}×${state.customC}` : state.medida} cm`,
      totalTaps: sequence.length,
      sequence,
      estimatedTime: `${estimatedMinutes} minutos`,
      createdAt: new Date().toISOString(),
      qualityChecklist: [
        'Cores corretas aplicadas',
        'Dimensões dentro da tolerância (±2mm)',
        'Bordas limpas e precisas',
        'Sem enrugamentos ou bolhas',
        'Alinhamento correto',
        'Sobreposições bem feitas',
      ],
    }
  }

  static generateQueueFolder(orderId: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                       'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const monthName = monthNames[date.getMonth()]

    return `${this.QUEUE_PATH}/${year}/${monthName}/${orderId}`
  }

  static generateCompletedFolder(orderId: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                       'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const monthName = monthNames[date.getMonth()]

    return `${this.COMPLETED_PATH}/${year}/${monthName}/${orderId}`
  }

  static async enqueueOrder(
    orderId: string,
    state: ConfiguratorState,
    clientName: string,
    clientWhatsApp: string,
    tapFiles: string[]
  ): Promise<{ success: boolean; queueFolder: string; manifest: ProductionManifest }> {
    try {
      const queueFolder = this.generateQueueFolder(orderId)
      const manifest = this.generateManifest(orderId, state, clientName, clientWhatsApp, tapFiles)

      // Em produção, aqui você:
      // 1. Criaria a pasta queueFolder
      // 2. Copiaria os arquivos .TAP para lá
      // 3. Salvaria o manifest.json
      // 4. March3 monitoraria e carregaria automaticamente

      console.log(`
✅ PEDIDO ENFILEIRADO PARA MARCH3
├─ Pedido: ${orderId}
├─ Cliente: ${clientName}
├─ Pasta fila: ${queueFolder}
├─ Total .TAP: ${manifest.totalTaps}
├─ Tempo estimado: ${manifest.estimatedTime}
└─ Status: Aguardando March3 processar

Arquivos (sequência):
${manifest.sequence.map((item) => `  ${item.number}. ${item.file} — ${item.instruction}`).join('\n')}

March3 deve auto-carregar e exibir as instruções.
      `)

      return {
        success: true,
        queueFolder,
        manifest,
      }
    } catch (error) {
      console.error('Erro ao enfileirar pedido:', error)
      throw error
    }
  }

  static async moveToCompleted(
    orderId: string
  ): Promise<{ success: boolean; completedFolder: string }> {
    try {
      const queueFolder = this.generateQueueFolder(orderId)
      const completedFolder = this.generateCompletedFolder(orderId)

      // Em produção, aqui você:
      // 1. Moveria a pasta de fila para completed
      // 2. Atualizaria o status no banco de dados
      // 3. Notificaria administração

      console.log(`✅ Pedido ${orderId} movido para PRODUCAO_COMPLETA`)
      console.log(`   De: ${queueFolder}`)
      console.log(`   Para: ${completedFolder}`)

      return {
        success: true,
        completedFolder,
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error)
      throw error
    }
  }
}
