import type { SizeGuideItem, ProductLine } from '@/lib/types'

export const SIZE_GUIDE: SizeGuideItem[] = [
  { id: '60x40', label: '60 × 40 cm', widthCm: 60, heightCm: 40, fitsDoor: 'Porta de apartamento', bestFor: 'Entrada interna, lavanderia, varanda' },
  { id: '80x50', label: '80 × 50 cm', widthCm: 80, heightCm: 50, fitsDoor: 'Porta padrão de 80 cm', bestFor: 'Porta de casa, sala comercial' },
  { id: '90x60', label: '90 × 60 cm', widthCm: 90, heightCm: 60, fitsDoor: 'Porta padrão com folga lateral', bestFor: 'Entrada principal, consultório' },
  { id: '120x60', label: '120 × 60 cm', widthCm: 120, heightCm: 60, fitsDoor: 'Porta dupla ou portão social', bestFor: 'Loja, clínica, escritório' },
  { id: '120x90', label: '120 × 90 cm', widthCm: 120, heightCm: 90, fitsDoor: 'Entrada comercial larga', bestFor: 'Recepção, alto fluxo de pessoas' },
]

export const MAX_GUIDE_WIDTH_CM = 120

export const PRODUCT_LINES: { id: ProductLine; label: string; hint: string }[] = [
  { id: 'liso', label: 'Liso', hint: 'Cor sólida' },
  { id: 'arte-pronta', label: 'Arte pronta', hint: 'Bem-vindo, patas, monograma' },
  { id: 'personalizado', label: 'Personalizado', hint: 'Sua logo ou texto' },
]

export const SIZE_FAQ: { q: string; a: string }[] = [
  {
    q: 'Qual o tamanho ideal de capacho para porta?',
    a: 'O capacho deve ter pelo menos a largura da porta. Para a porta padrão de 80 cm, use 80 × 50 cm ou 90 × 60 cm. Portas duplas e entradas comerciais pedem 120 × 60 cm ou maior.',
  },
  {
    q: 'Capacho é vendido por metro?',
    a: 'Além das medidas da tabela, fabricamos sob medida, com valor calculado por metro quadrado. Informe largura e altura e o orçamento sai pelo WhatsApp.',
  },
  {
    q: 'Como meço o espaço para o capacho?',
    a: 'Meça a largura do vão da porta e a profundidade livre na frente dela, descontando o arco de abertura se a porta abrir para fora.',
  },
  {
    q: 'O frete está incluso?',
    a: 'O frete é calculado pelo seu CEP e informado junto com o orçamento, antes de você fechar o pedido. Entregamos em todo o Brasil.',
  },
]
