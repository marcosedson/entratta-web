import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const CONFIG_PATH = join(process.cwd(), 'data', 'config.json')

export interface AdminConfig {
  diasUteis: number
  coresDisponiveis: string[]
  aviso: string
}

const DEFAULT: AdminConfig = {
  diasUteis: 7,
  coresDisponiveis: ['preto', 'cinza', 'verde', 'azul', 'vermelho', 'marrom', 'bege'],
  aviso: '',
}

export function getAdminConfig(): AdminConfig {
  try {
    if (!existsSync(CONFIG_PATH)) return DEFAULT
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  } catch {
    return DEFAULT
  }
}

export function saveAdminConfig(config: AdminConfig): void {
  const dir = dirname(CONFIG_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}
