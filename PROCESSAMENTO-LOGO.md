# Automatização: Processamento de Logo (CorelDraw → .TAP)

## 🔴 Problema Atual

```
HOJE (Manual):
Cliente envia logo (PNG 72dpi, baixa qualidade)
    ↓
Pessoal abre CorelDraw manualmente
    ↓
Converte para vetor (TRAÇADO)
    ↓
Valida cores
    ↓
Exporta para March3
    ↓
⏱️ Tempo: 15-20 minutos por logo
⚠️ Dependência de skill (CorelDraw)
⚠️ Qualidade varia
```

## ✅ Solução: Automatização Full Stack

```
NOVO (Automatizado):
Cliente envia logo (qualquer qualidade)
    ↓
API recebe arquivo
    ↓
PIPELINE AUTOMÁTICO:
  1. Validar arquivo (dimensões, formato)
  2. Redimensionar se necessário
  3. Aplicar filtros (contraste, clareza)
  4. Vetorizar (Potrace/Autotrace)
  5. Extrair cores
  6. Validar cores vs inventário
  7. Gerar SVG vetorizado
  8. Gerar múltiplos .TAP (1 por cor)
    ↓
Retorna ao cliente:
✓ Logo vetorizada (pronta)
✓ Cores identificadas
✓ Múltiplos .TAP (1 por cor)
    ↓
⏱️ Tempo: <5 segundos
✅ 100% automático
✅ Qualidade garantida
```

---

## 🛠️ Tecnologias Necessárias

### **1. Vetorização de Imagem (Raster → Vetor)**

#### Opção A: Potrace (RECOMENDADA) ⭐⭐⭐
```
O que faz:
- Converte imagem raster (PNG/JPG) para vetor (SVG)
- Automático e rápido
- Handles baixa qualidade bem
- Open source (free)

Instalação:
  brew install potrace  # macOS
  apt-get install potrace  # Linux

Node.js wrapper:
  npm install potrace
  
Uso:
  import { potrace } from 'potrace'
  
  const svg = await potrace('logo.png', {
    threshold: 0.5,  // sensibilidade
    color: 'auto',   // detecta cores
    alphamax: 1,     // suavidade
  })
```

#### Opção B: Autotrace
- Similar ao Potrace
- Bom para logos com múltiplas cores
- Mais lento

#### Opção C: ImageMagick + Custom Script
- Mais controle
- Mais complexo
- Menos automático

**Recomendação:** Potrace — melhor custo-benefício

---

### **2. Análise de Cores (Extrair Paleta)**

```typescript
// npm install sharp
import sharp from 'sharp'
import { quantize } from 'quantize'

async function extractColors(logoPath: string): Promise<string[]> {
  const image = sharp(logoPath)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  
  // Quantiza para N cores principais
  const colors = quantize(data, 8)  // 8 cores máximo
  
  return colors.map(c => `#${c.hex()}`)
}

// Resultado: ['#000000', '#FFFFFF', '#FF0000', ...]
```

---

### **3. Validação de Cores vs Inventário**

```typescript
interface LogoColor {
  hex: string
  label: string
  available: boolean
  matches: string[]  // cores similares no inventário
}

function validateLogoColors(
  extractedColors: string[],
  availableVinyls: VinylColor[]
): LogoColor[] {
  return extractedColors.map(hex => {
    const match = findClosestColor(hex, availableVinyls)
    return {
      hex,
      label: match.label,
      available: !!match,
      matches: [match.hex, ...findSimilar(hex, availableVinyls)]
    }
  })
}
```

---

## 📋 Fluxo Completo: Logo → Múltiplos .TAP

### **PASSO 1: Cliente Envia Logo**

```
/monte-o-seu/Configurador.tsx

<input 
  type="file" 
  accept="image/*"
  onChange={handleLogoUpload}
/>

Client envia: logo.png (500×500px, 72dpi, qualquer qualidade)
```

### **PASSO 2: API Processa**

```typescript
// POST /api/logo/process
async function handleLogoUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/logo/process', {
    method: 'POST',
    body: formData,
  })
  
  const result = await response.json()
  // Retorna:
  // {
  //   logo_id: "ABC123",
  //   svg_vectorized: "<svg>...</svg>",
  //   colors: [
  //     { hex: "#000000", label: "Preto", available: true },
  //     { hex: "#FFFFFF", label: "Branco", available: true },
  //     { hex: "#FF0000", label: "Vermelho", available: true },
  //   ],
  //   tapFiles: [
  //     "logo-preto.tap",
  //     "logo-branco.tap",
  //     "logo-vermelho.tap"
  //   ]
  // }
}
```

### **PASSO 3: Backend Processing**

```typescript
// lib/services/logo-processing.service.ts

export class LogoProcessingService {
  // 1. Recebe arquivo
  static async uploadLogo(file: File, orderId: string): Promise<string> {
    const logoPath = `storage/pedidos/${orderId}/logo.png`
    // Salva arquivo original
    return logoPath
  }

  // 2. Vetoriza imagem
  static async vectorizeLogo(logoPath: string): Promise<string> {
    // Potrace: PNG → SVG
    const svg = await potrace(logoPath, {
      threshold: 0.5,
      color: 'auto',
      alphamax: 1.0,
      turnpolicy: 'minority',
    })
    
    return svg  // Retorna SVG vetorizado
  }

  // 3. Extrai cores
  static async extractColors(logoPath: string): Promise<string[]> {
    const colors = await extractColorsFromImage(logoPath)
    return colors.slice(0, 8)  // Máximo 8 cores
  }

  // 4. Valida cores vs inventário
  static async validateColors(
    colors: string[],
    availableVinyls: VinylColor[]
  ): Promise<LogoColor[]> {
    return colors.map(hex => {
      const closest = this.findClosestColor(hex, availableVinyls)
      return {
        hex,
        label: closest.label,
        available: true,
        vinyl_hex: closest.hex,
      }
    })
  }

  // 5. Gera múltiplos .TAP (1 por cor)
  static generateLogoTAPFiles(
    orderId: string,
    logoSvg: string,
    colors: LogoColor[]
  ): string[] {
    const tapFiles: string[] = []
    
    colors.forEach((color, index) => {
      const tap = `TAP_FILE
ORDER_ID: ${orderId}
LAYER: LOGO_${index + 1}
COLOR: ${color.label}
TYPE: VECTOR_TRACED

LOGO_SPECIFICATIONS:
SOURCE: logo-${color.label.toLowerCase()}.svg
DIMENSIONS: AUTO_FIT (60×90cm)
COLOR: ${color.hex}
VINYL: ${color.vinyl_hex}

VECTORIZATION:
✓ Auto-traced from original
✓ Optimized for March3
✓ Ready for multi-color cut

PRODUCTION:
1. Load vinyl ${color.label}
2. Load trace file (SVG embedded)
3. Set blade for vinyl color
4. Cut precisely
5. Remove waste
6. Stack with other layers

VALIDATION:
□ Color applied correctly
□ Outline precise
□ No discontinuities
□ Clean edges

END_TAP`
      
      const filename = `${orderId}-logo-${index + 1}-${color.label.toLowerCase()}.tap`
      tapFiles.push(filename)
    })
    
    return tapFiles
  }

  // 6. Processa tudo (pipeline)
  static async processLogoComplete(
    file: File,
    orderId: string,
    availableVinyls: VinylColor[]
  ): Promise<{
    svg: string
    colors: LogoColor[]
    tapFiles: string[]
  }> {
    // 1. Upload
    const logoPath = await this.uploadLogo(file, orderId)
    
    // 2. Vetoriza
    const svg = await this.vectorizeLogo(logoPath)
    
    // 3. Extrai cores
    const extractedColors = await this.extractColors(logoPath)
    
    // 4. Valida
    const validatedColors = await this.validateColors(extractedColors, availableVinyls)
    
    // 5. Gera .TAP
    const tapFiles = this.generateLogoTAPFiles(orderId, svg, validatedColors)
    
    return {
      svg,
      colors: validatedColors,
      tapFiles,
    }
  }
}
```

---

## 🎨 Exemplo: Logo com 3 Cores

### **Input (Cliente envia)**
```
logo.png (500×500px, 72dpi, qualidade baixa)

Visualmente:
┌─────────────────┐
│   ACME CORP     │  ← Preto
│   [Logo]        │  ← Vermelho + Azul
└─────────────────┘
```

### **Processing Pipeline**

```
1. UPLOAD
   └─ storage/pedidos/2026-06-ENTRATTA-ABC123/logo.png

2. VETORIZAÇÃO (Potrace)
   PNG → SVG (vetorizado, sem pixelização)

3. EXTRAÇÃO DE CORES
   Detected: ["#000000", "#FF0000", "#0000FF"]
   
4. VALIDAÇÃO vs INVENTÁRIO
   ✓ #000000 → Preto (disponível)
   ✓ #FF0000 → Vermelho (disponível)
   ✓ #0000FF → Azul (disponível)

5. GERAÇÃO DE .TAP
   ├─ 2026-06-ENTRATTA-ABC123-logo-1-preto.tap
   ├─ 2026-06-ENTRATTA-ABC123-logo-2-vermelho.tap
   └─ 2026-06-ENTRATTA-ABC123-logo-3-azul.tap
```

### **Output (API retorna)**

```json
{
  "logo_id": "ABC123",
  "svg_vectorized": "<svg>... (vetorizado) ...</svg>",
  "colors": [
    {
      "hex": "#000000",
      "label": "Preto",
      "vinyl_hex": "#000000",
      "available": true
    },
    {
      "hex": "#FF0000",
      "label": "Vermelho",
      "vinyl_hex": "#FF0000",
      "available": true
    },
    {
      "hex": "#0000FF",
      "label": "Azul",
      "vinyl_hex": "#0000FF",
      "available": true
    }
  ],
  "tapFiles": [
    "2026-06-ENTRATTA-ABC123-logo-1-preto.tap",
    "2026-06-ENTRATTA-ABC123-logo-2-vermelho.tap",
    "2026-06-ENTRATTA-ABC123-logo-3-azul.tap"
  ]
}
```

---

## 📊 Fluxo Completo do Pedido (COM Logo Automatizada)

```
CLIENTE CONFIGURA:
  ✓ Cor tapete: Preto
  ✓ Texto: "Bem-vindo"
  ✓ Cor texto: Branco
  ✓ Borda: Dupla Verde
  ✓ Logo: (upload logo.png)
       ↓
API PROCESSA:
  ✓ Vetoriza logo (Potrace)
  ✓ Extrai 3 cores (preto, vermelho, azul)
  ✓ Valida vs inventário
  ✓ Gera 3 .TAP (1 por cor logo)
       ↓
API GERA PEDIDO COMPLETO:
  ├─ 001-tapete-preto.tap           (base)
  ├─ 002-texto-branco.tap           (texto)
  ├─ 003-borda-verde.tap            (borda)
  ├─ 004-logo-1-preto.tap           (logo cor 1)
  ├─ 005-logo-2-vermelho.tap        (logo cor 2)
  ├─ 006-logo-3-azul.tap            (logo cor 3)
  ├─ 007-cascata-5x.tap             (cascata)
  ├─ logo-vectorized.svg            (referência)
  ├─ projeto.pdf                     (visual final)
  └─ manifest.json                   (instrucional)
       ↓
OPERADOR NO MARCH3:
  ✓ Auto-carrega 001 → corta tapete
  ✓ Auto-carrega 002 → corta texto
  ✓ Auto-carrega 003 → corta borda
  ✓ Auto-carrega 004, 005, 006 → cortam logo (3 cores)
  ✓ Auto-carrega 007 → 5x cascata
       ↓
✅ TAPETE COM LOGO PRONTO
```

---

## 💾 Armazenamento Final

```
storage/pedidos/2026/junho/2026-06-ENTRATTA-ABC123/
├─ metadata.json
├─ projeto.pdf
├─ logo.png                    (original)
├─ logo-vectorized.svg         (vetorizado)
├─ 001-tapete-preto.tap
├─ 002-texto-branco.tap
├─ 003-borda-verde.tap
├─ 004-logo-1-preto.tap        ← Logo cor 1
├─ 005-logo-2-vermelho.tap     ← Logo cor 2
├─ 006-logo-3-azul.tap         ← Logo cor 3
└─ 007-cascata-5x.tap

fila-producao/2026/junho/2026-06-ENTRATTA-ABC123/
├─ 001-tapete-preto.tap
├─ 002-texto-branco.tap
├─ 003-borda-verde.tap
├─ 004-logo-1-preto.tap
├─ 005-logo-2-vermelho.tap
├─ 006-logo-3-azul.tap
├─ 007-cascata-5x.tap
└─ manifest.json               ← O que operador vê
```

---

## 🎯 Validação: O que o Operador Vê

### **PDF (Referência Visual)**
```
┌─────────────────────────────┐
│  PROJETO: 2026-06-ENTRATTA  │
│  Cliente: Acme Corp         │
│                             │
│  Cores usadas:              │
│  🟩 TAPETE: PRETO           │
│  🟨 TEXTO: BRANCO           │
│  🟩 BORDA: VERDE DUPLA      │
│  🟫 LOGO:                   │
│    - PRETO                  │
│    - VERMELHO               │
│    - AZUL                   │
│                             │
│  ┌──────────────────────┐   │
│  │ ACME CORP            │   │ ← Logo vetorizada
│  │ Bem-vindo!           │   │ ← Texto branco
│  │ ============         │   │ ← Borda verde dupla
│  └──────────────────────┘   │
│  (PRETO base)               │
│                             │
│  Sequência March3:          │
│  1. Tapete Preto           │
│  2. Texto Branco           │
│  3. Borda Verde            │
│  4. Logo Preto             │
│  5. Logo Vermelho          │
│  6. Logo Azul              │
│  7. Cascata 5x             │
│                             │
└─────────────────────────────┘
```

### **Manifest.json (Instrucional)**
```json
{
  "sequence": [
    {
      "number": 1,
      "file": "001-tapete-preto.tap",
      "instruction": "Corte base preto"
    },
    {
      "number": 2,
      "file": "002-texto-branco.tap",
      "instruction": "Sobrepça texto branco"
    },
    {
      "number": 3,
      "file": "003-borda-verde.tap",
      "instruction": "Aplique borda verde dupla"
    },
    {
      "number": 4,
      "file": "004-logo-1-preto.tap",
      "instruction": "Aplique logo cor 1: PRETO"
    },
    {
      "number": 5,
      "file": "005-logo-2-vermelho.tap",
      "instruction": "Aplique logo cor 2: VERMELHO"
    },
    {
      "number": 6,
      "file": "006-logo-3-azul.tap",
      "instruction": "Aplique logo cor 3: AZUL"
    },
    {
      "number": 7,
      "file": "007-cascata-5x.tap",
      "instruction": "Produção em cascata: 5 unidades"
    }
  ]
}
```

---

## 🔧 Implementação (Checklist)

### Fase 1: Setup
- [ ] `npm install potrace sharp quantize`
- [ ] Criar `lib/services/logo-processing.service.ts`
- [ ] Criar `app/api/logo/process/route.ts`
- [ ] Criar `lib/constants/vinyl-inventory.ts` (cores disponíveis)

### Fase 2: Backend
- [ ] Implementar `vectorizeLogo()`
- [ ] Implementar `extractColors()`
- [ ] Implementar `validateColors()`
- [ ] Implementar `generateLogoTAPFiles()`
- [ ] Pipeline completo

### Fase 3: Frontend
- [ ] Input file para logo no Configurador
- [ ] Preview de logo após upload
- [ ] Mostrar cores detectadas
- [ ] Validação em tempo real

### Fase 4: Integration
- [ ] Integrar com `createAndDownloadOrder()`
- [ ] Gerar .TAP múltiplos
- [ ] Incluir no PDF e manifest.json
- [ ] Testar end-to-end

---

## ✅ Benefícios

| Antes | Depois |
|-------|--------|
| ❌ Manual no CorelDraw (15-20 min) | ✅ Automático (< 5 seg) |
| ❌ Depende de skill | ✅ 100% automático |
| ❌ Qualidade varia | ✅ Qualidade garantida |
| ❌ 1 arquivo .TAP (confuso) | ✅ Múltiplos .TAP (claro) |
| ❌ Validação manual | ✅ Validação automática |
| ❌ Erros de cor comuns | ✅ Cores garantidas |

---

## 🎯 Resultado Final

Cliente envia logo (qualidade ruim, baixa resolução)
    ↓
Sistema AUTOMATICAMENTE:
  ✓ Vetoriza (Potrace)
  ✓ Identifica cores
  ✓ Valida disponibilidade
  ✓ Gera múltiplos .TAP
    ↓
Operador no March3: segue sequência simples
    ↓
✅ Logo GARANTIDAMENTE boa qualidade no tapete final
