/**
 * Paleta fixa de tintas ENTRATTA — códigos ACI imutáveis (padrão da empresa toda).
 * Espelho de services/production/app/palette.py. NÃO alterar os códigos.
 */
export const ACI_PALETTE = [
  { aci: 9, nome: 'BRANCO', label: 'Branco', hex: '#EBEBEB' },
  { aci: 230, nome: 'AMARELO', label: 'Amarelo', hex: '#F5C828' },
  { aci: 166, nome: 'AZUL_ROYAL', label: 'Azul Royal', hex: '#1E3C96' },
  { aci: 30, nome: 'LARANJA', label: 'Laranja', hex: '#EB6E1E' },
  { aci: 114, nome: 'VERDE_BANDEIRA', label: 'Verde Bandeira', hex: '#1E7837' },
] as const

export type AciColor = (typeof ACI_PALETTE)[number]
export type AciCode = AciColor['aci']

export const ACI_CODES = ACI_PALETTE.map((c) => c.aci) as AciCode[]

export function aciByCode(aci: number): AciColor | undefined {
  return ACI_PALETTE.find((c) => c.aci === aci)
}
