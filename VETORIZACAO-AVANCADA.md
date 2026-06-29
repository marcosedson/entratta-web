# Vetorização Avançada: Estratégia Ultra-Qualidade

## 🎯 Objetivo

Criar sistema de vetorização que:
- ✅ Processa múltiplos elementos (textos + logos)
- ✅ Qualidade superior ao CorelDraw manual
- ✅ Cores 100% precisas
- ✅ Segmentação automática por camada
- ✅ Geração de .TAP otimizados para March3

---

## 📊 Análise: O Que Existe vs O Que Queremos

### Configurador Atual (tipos.ts)
```typescript
interface TextoItem {
  id: string
  texto: string        // ← Texto (já separado)
  corId: string
  fonteId: string
  x: number | null     // ← Posição (já separado!)
  y: number | null
  tamanho: number
}

interface LogoItem {
  id: string
  src: string          // ← Logo URL
  x: number | null     // ← Posição (já separado!)
  y: number | null
  scale: number
  rotacao: number
  removingBg: boolean  // ← Remove fundo! (importante)
}
```

### Estado do Configurador
```typescript
const [textos, setTextos] = useState<TextoItem[]>([])
const [logos, setLogos] = useState<LogoItem[]>([])
// ✅ Já suporta múltiplos!
```

**Conclusão:** O frontend YÁ ESTÁ preparado para múltiplos elementos!

---

## 🚀 Estratégia: Vetorização Ultra-Qualidade

### Problema com Potrace (simples)
```
Logo raster (72dpi, ruim)
    ↓
Potrace (algoritmo simples)
    ↓
SVG vetorizado (OK, mas não é ótimo)
    ↓
Perde detalhes
Cores não precisas
Sem camadas separadas
```

### Solução Proposta: Multi-Stage Processing

```
INPUT (múltiplos elementos):
├─ Logo.png (qualidade ruim)
├─ Texto: "Empresa XYZ" (cor branco)
└─ Logo: [outra imagem]
    ↓
STAGE 1: PREPROCESSING
├─ Normalização de resolução
├─ Correção de contraste (CLAHE)
├─ Denoising (bilateral filter)
└─ Upscaling (super-resolution se necessário)
    ↓
STAGE 2: SEGMENTAÇÃO POR COR
├─ K-means clustering (identifica cores principais)
├─ Cria máscara por cor
├─ Remove fundo (se LogoItem.removingBg = true)
└─ Valida contra inventário de vinil
    ↓
STAGE 3: VETORIZAÇÃO AVANÇADA
├─ Para cada cor/máscara:
│  ├─ Contour detection (OpenCV)
│  ├─ Douglas-Peucker simplification
│  ├─ Bezier curve fitting
│  └─ Gera SVG de alta qualidade
└─ Merge todas as camadas
    ↓
STAGE 4: OTIMIZAÇÃO
├─ Remove caminhos redundantes
├─ Simplifica curvas (mantém qualidade)
├─ Valida que cada cor existe no inventário
└─ Gera SVG final otimizado
    ↓
STAGE 5: GERAÇÃO DE .TAP
├─ Para cada camada de cor:
│  ├─ Converte SVG em instruções CNC
│  ├─ Calcula dimensões precisas
│  └─ Gera .TAP otimizado para March3
└─ Cria manifest com sequência perfeita
    ↓
OUTPUT: Múltiplos .TAP (1 por cor, alta qualidade)
```

---

## 🔧 Tecnologias Necessárias

### 1. **OpenCV.js** (para processamento avançado)
```bash
npm install opencv.js
```

Oferece:
- ✅ Contour detection
- ✅ Morphological operations
- ✅ Image filtering (CLAHE, bilateral)
- ✅ Color space conversion (RGB → Lab)
- ✅ K-means clustering

### 2. **Potrace via WASM** (para vetorização)
```bash
npm install potrace
```

Mas com pré-processamento avançado!

### 3. **SVG.js** (para manipulação de SVG)
```bash
npm install svg.js
```

### 4. **Sharp** (já instalado)
Para redimensionamento e transformações

### Stack Final:
```
OpenCV.js          → Análise avançada de imagem
Sharp              → Processamento rápido
Potrace            → Vetorização (com inputs melhores!)
SVG.js             → Construção de SVG
Custom g-code gen  → .TAP otimizado
```

---

## 📐 Arquitetura Proposta

### File Structure
```
lib/services/
└─ image-processing/
    ├─ index.ts                          (orquestra tudo)
    ├─ stages/
    │  ├─ 01-preprocessing.ts            (normalização + denoising)
    │  ├─ 02-segmentation.ts             (segmentação por cor)
    │  ├─ 03-vectorization.ts            (contours + vetorização)
    │  ├─ 04-optimization.ts             (simplificação)
    │  └─ 05-tap-generation.ts           (.TAP para March3)
    ├─ algorithms/
    │  ├─ color-clustering.ts            (K-means)
    │  ├─ contour-extraction.ts          (OpenCV contours)
    │  ├─ bezier-fitting.ts              (Bezier curves)
    │  ├─ svg-optimization.ts            (SVGO)
    │  └─ tap-optimizer.ts               (otimização para CNC)
    └─ utils/
        ├─ color-distance.ts             (espaço Lab)
        ├─ svg-tools.ts                  (manipulação SVG)
        └─ tap-tools.ts                  (geração G-code)
```

### Main Service
```typescript
// lib/services/image-processing/index.ts

interface ProcessingConfig {
  quality: 'normal' | 'high' | 'ultra'  // ← Define nível
  preserveColors: boolean               // ← Cores exatas
  removeBackground: boolean
  segmentByColor: boolean
  targetVinylInventory: VinylColor[]
}

export class AdvancedImageProcessingService {
  static async processMultiElement(
    elements: {
      logos: LogoItem[]
      textos: TextoItem[]
    },
    config: ProcessingConfig
  ): Promise<{
    svgLayers: SVGLayer[]
    tapFiles: TAPFile[]
    colorReport: ColorReport[]
    qualityMetrics: QualityMetrics
  }> {
    // 1. Preprocessing
    const preprocessed = await PreprocessingStage.run(elements, config)
    
    // 2. Segmentation
    const segmented = await SegmentationStage.run(preprocessed, config)
    
    // 3. Vectorization
    const vectorized = await VectorizationStage.run(segmented, config)
    
    // 4. Optimization
    const optimized = await OptimizationStage.run(vectorized, config)
    
    // 5. TAP Generation
    const tapFiles = await TAPGenerationStage.run(optimized, config)
    
    return {
      svgLayers: optimized.svgLayers,
      tapFiles,
      colorReport: segmented.colorReport,
      qualityMetrics: optimized.metrics
    }
  }
}
```

---

## 🎨 Exemplo: Múltiplas Logos + Texto

### Input
```
LogoItem 1: acme-logo.png
  ├─ Cores: Vermelho, Preto, Branco
  ├─ Scale: 100%
  └─ removingBg: true

TextoItem: "Acme Corp"
  ├─ Cor: Branco
  ├─ Fonte: Bold
  └─ Tamanho: Auto

LogoItem 2: star.png
  ├─ Cores: Ouro
  └─ removingBg: true
```

### Processing Pipeline
```
STAGE 1: PREPROCESSING
├─ Upscale acme-logo.png (72dpi → 300dpi)
├─ Denoise + contrast enhancement
└─ Normaliza texto "Acme Corp" (renderiza com fonte)

STAGE 2: SEGMENTAÇÃO
├─ acme-logo.png:
│  ├─ Remove fundo branco
│  ├─ K-means: identifica 3 cores (vermelho, preto, outro)
│  └─ Cria 3 máscaras
├─ Texto "Acme Corp":
│  ├─ Renderiza com fonte Bold + cor branca
│  └─ Cria máscara de texto
└─ star.png:
   ├─ Remove fundo
   └─ Identifica cor ouro

STAGE 3: VETORIZAÇÃO
├─ Para cada máscara/cor:
│  ├─ Detecta contornos (OpenCV)
│  ├─ Simplifica (Douglas-Peucker)
│  ├─ Ajusta Bezier curves
│  └─ Gera SVG de camada
└─ Resultado: 6 SVG layers (3 logo + 1 texto + 1 star + 1 fundo)

STAGE 4: OTIMIZAÇÃO
├─ Remove caminhos redundantes
├─ Merge camadas mesma cor
├─ Valida contra inventário:
│  ├─ Vermelho → existe (ENTRATTA-VRM-001)
│  ├─ Preto → existe (ENTRATTA-PTO-001)
│  ├─ Branco → existe (ENTRATTA-BCO-001)
│  └─ Ouro → existe (ENTRATTA-OUR-001)
└─ Final: 4 camadas (vermelho, preto, branco, ouro)

STAGE 5: TAP GENERATION
├─ 001-logo1-vermelho.tap
├─ 002-logo1-preto.tap
├─ 003-logo2-texto-branco.tap
├─ 004-star-ouro.tap
└─ Manifest: sequência de aplicação com cores
```

---

## ⚙️ Configurable Quality Levels

### QUALITY: 'normal' (rápido)
```
- Resolução: 150dpi
- Potrace threshold: 0.5
- Bezier precision: básica
- Tempo: < 5 segundos
```

### QUALITY: 'high' (recomendado)
```
- Resolução: 300dpi
- Preprocessing: CLAHE + denoising
- Potrace threshold: 0.8
- Bezier precision: alta
- Tempo: 10-15 segundos
```

### QUALITY: 'ultra' (EXCLUSIVO ENTRATTA)
```
- Resolução: 600dpi (super-resolution se necessário)
- Preprocessing: CLAHE + bilateral filter + morphological ops
- Contour detection: OpenCV com múltiplos passes
- Bezier precision: ultra (mantém curvatura exata)
- Color accuracy: Lab color space (ΔE < 2)
- Tempo: 20-30 segundos
- Resultado: MELHOR QUE COREL DRAW MANUAL!
```

---

## 🎯 Exemplo de Código: Ultra Quality

```typescript
const result = await AdvancedImageProcessingService.processMultiElement(
  {
    logos: [
      {
        id: 'logo1',
        src: 'data:image/png;base64,...',
        x: 50,
        y: 50,
        scale: 100,
        rotacao: 0,
        removingBg: true,
      }
    ],
    textos: [
      {
        id: 'texto1',
        texto: 'Acme Corp',
        corId: 'branco',
        fonteId: 'bold',
        x: 50,
        y: 150,
        tamanho: 0, // auto
      }
    ]
  },
  {
    quality: 'ultra',              // ← EXCLUSIVO!
    preserveColors: true,          // ← Cores exatas
    removeBackground: true,
    segmentByColor: true,
    targetVinylInventory: VINYL_INVENTORY
  }
)

// Resultado:
console.log(result)
// {
//   svgLayers: [
//     { color: 'vermelho', svg: '<svg>...</svg>' },
//     { color: 'preto', svg: '<svg>...</svg>' },
//     { color: 'branco', svg: '<svg>...</svg>' },
//   ],
//   tapFiles: [
//     '001-logo-vermelho.tap',
//     '002-logo-preto.tap',
//     '003-texto-branco.tap',
//   ],
//   colorReport: [
//     { color: '#FF0000', label: 'Vermelho', confidence: 99.2%, vinyl: 'ENTRATTA-VRM-001' },
//     // ...
//   ],
//   qualityMetrics: {
//     colorAccuracy: 99.2,    // ← 99%+ precisão!
//     detailPreservation: 98.5,
//     processingTime: 22.3,   // segundos
//     estimatedPrintQuality: 'ULTRA_HD'
//   }
// }
```

---

## 💡 Diferenciais: O Que Ninguém Tem

1. **Multi-Element Processing**
   - Processa múltiplos logos + textos simultaneamente
   - Cada elemento em sua própria camada

2. **Ultra Quality Output**
   - 600dpi + algoritmos avançados
   - Qualidade superior a manual CorelDraw
   - Color accuracy ΔE < 2 (imperceptível a olho nu)

3. **Automatic Color Validation**
   - Valida automaticamente contra inventário
   - Sugere cores substitutas se necessário
   - Relatório de confiança por cor

4. **Segmentação Inteligente**
   - Separação automática por cor
   - Remove fundos sem perder detalhe
   - Merge automático de camadas mesma cor

5. **Otimização para March3**
   - .TAP files otimizados para velocidade de corte
   - Caminhos simplificados mas precisos
   - Ordem de camadas automatizada

6. **Quality Metrics**
   - Relatório de qualidade pós-processamento
   - Estimativa de resultado final
   - Recomendação de quality level

---

## 📊 Comparativo: Entratta vs Concorrentes

| Feature | CorelDraw (Manual) | Potrace (Simples) | Entratta (Ultra) |
|---------|-------------------|-------------------|-----------------|
| **Tempo por logo** | 20-30 min | <5 seg | 20-30 seg |
| **Qualidade** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Múltiplos elementos** | ✅ Manual | ❌ Não | ✅ Automático |
| **Segmentação por cor** | ✅ Manual | ❌ Não | ✅ Automático |
| **Remoção fundo** | ✅ Manual | ❌ Não | ✅ Automático |
| **Validação cores** | ❌ Não | ❌ Não | ✅ Automático |
| **Geração .TAP** | ❌ Não | ❌ Não | ✅ Otimizado |
| **Escalabilidade** | ❌ Limitada | ❌ Não | ✅ Ilimitada |

---

## 🚀 Implementação (Fases)

### Fase 1: Core Pipeline (1-2 semanas)
- [ ] Stage 1: Preprocessing
- [ ] Stage 2: Segmentation (K-means)
- [ ] Stage 3: Vectorization (Potrace + OpenCV)
- [ ] Unit tests

### Fase 2: Optimization (1 semana)
- [ ] Stage 4: Optimization
- [ ] Stage 5: TAP Generation
- [ ] Quality metrics

### Fase 3: Integration (1 semana)
- [ ] Integrar com /api/orders/criar-pedido
- [ ] Suporte a múltiplos elementos
- [ ] Frontend quality selector

### Fase 4: Advanced (opcional)
- [ ] Super-resolution (upscaling)
- [ ] AI-powered color correction
- [ ] Batch processing

---

## ✅ Resultado Final

```
ANTES:
Cliente envia logo ruim
  → Pessoal abre CorelDraw
  → 20-30 minutos manual
  → 1 logo por pedido
  → Qualidade depende de skill

DEPOIS (Entratta Ultra):
Cliente envia múltiplas logos
  → Sistema processa automaticamente
  → 20-30 segundos (SEM MANUAL!)
  → Múltiplas logos + textos
  → Qualidade GARANTIDA
  → Saída: .TAP pronto para March3
  → Operador: apenas clica "iniciar"

= REVOLUCIONÁRIO PARA A INDÚSTRIA
```

---

## 🎯 Próximo Passo

1. **Confirmar**: Quer implementar a abordagem "Ultra Quality"?
2. **Scope**: Começar com Fase 1 completo?
3. **Timeline**: 2-3 semanas para versão completa?

Isso vai criar uma **vantagem competitiva REAL** que ninguém tem! 🚀
