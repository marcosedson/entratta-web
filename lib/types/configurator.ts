export interface ColorOption {
  id: string
  label: string
  hex: string
}

export interface Measurement {
  l: string
  w: number
  c: number
}

export interface BorderOption {
  id: string
  l: string
}

export interface ConfiguratorState {
  tapeteColor: string
  textColor: string
  borderColor: string
  size: string
  borderType: string
  customWidth: number
  customHeight: number
  userText: string
  design: 'none' | 'simple' | 'advanced'
  previewUrl?: string
}
