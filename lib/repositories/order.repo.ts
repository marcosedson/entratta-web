import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import type { PedidoRecord, PedidoStatus } from '@/lib/types/producao'

/**
 * Persistência de pedidos em PEDIDOS_DIR (pasta compartilhada via Samba com a produção).
 * Layout: PEDIDOS_DIR/{ano}/{mes}/{orderId}/{pedido.json, preview.png, producao.zip}
 */
const PEDIDOS_DIR = () => process.env.PEDIDOS_DIR ?? join(process.cwd(), 'pedidos')

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

/** ID no padrão ENTR-AAMMDD-NNN com contador diário atômico. */
export function gerarOrderId(now = new Date()): string {
  const stamp = `${pad(now.getFullYear() % 100, 2)}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`
  const counterPath = join(PEDIDOS_DIR(), '.contador')
  mkdirSync(PEDIDOS_DIR(), { recursive: true })

  let counter = { dia: stamp, seq: 0 }
  try {
    const raw = JSON.parse(readFileSync(counterPath, 'utf-8'))
    if (raw.dia === stamp) counter = raw
  } catch {
    // primeiro pedido do dia (ou contador inexistente)
  }
  counter.seq += 1
  writeFileSync(counterPath, JSON.stringify(counter))
  return `ENTR-${stamp}-${pad(counter.seq, 3)}`
}

export class OrderRepository {
  static dirFor(orderId: string): string {
    // ENTR-AAMMDD-NNN → ano/mes vêm do próprio ID
    const stamp = orderId.split('-')[1] ?? ''
    const ano = `20${stamp.slice(0, 2)}`
    const mes = stamp.slice(2, 4)
    return join(PEDIDOS_DIR(), ano, mes, orderId)
  }

  static salvar(record: PedidoRecord, previewPng: Buffer, producaoZip: Buffer): void {
    const dir = this.dirFor(record.orderId)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'preview.png'), previewPng)
    writeFileSync(join(dir, 'producao.zip'), producaoZip)
    writeFileSync(join(dir, 'pedido.json'), JSON.stringify(record, null, 2))
  }

  static buscar(orderId: string): PedidoRecord | null {
    try {
      return JSON.parse(readFileSync(join(this.dirFor(orderId), 'pedido.json'), 'utf-8'))
    } catch {
      return null
    }
  }

  static lerArquivo(orderId: string, nome: 'preview.png' | 'producao.zip'): Buffer | null {
    try {
      return readFileSync(join(this.dirFor(orderId), nome))
    } catch {
      return null
    }
  }

  static atualizarStatus(orderId: string, status: PedidoStatus): PedidoRecord | null {
    const record = this.buscar(orderId)
    if (!record) return null
    record.status = status
    writeFileSync(
      join(this.dirFor(orderId), 'pedido.json'),
      JSON.stringify(record, null, 2)
    )
    return record
  }

  static listar(): PedidoRecord[] {
    const records: PedidoRecord[] = []
    const root = PEDIDOS_DIR()
    let anos: string[] = []
    try {
      anos = readdirSync(root).filter((d) => /^\d{4}$/.test(d))
    } catch {
      return []
    }
    for (const ano of anos) {
      let meses: string[] = []
      try {
        meses = readdirSync(join(root, ano)).filter((d) => /^\d{2}$/.test(d))
      } catch {
        continue
      }
      for (const mes of meses) {
        let ids: string[] = []
        try {
          ids = readdirSync(join(root, ano, mes)).filter((d) => d.startsWith('ENTR-'))
        } catch {
          continue
        }
        for (const id of ids) {
          const record = this.buscar(id)
          if (record) records.push(record)
        }
      }
    }
    return records.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  }
}
