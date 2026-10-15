# ARCHITECTURE.md — Análise e Padrões de Código

## Status Atual da Arquitetura

### ✅ Pontos Fortes
- **App Router estruturado** — Rotas dinâmicas bem organizadas (`capacho-para-[slug]`, `capacho-personalizado-[slug]`)
- **Type-safe** — TypeScript strict mode em todo projeto
- **SEO otimizado** — Metadata API, Schema.org, sitemap.ts, robots.ts
- **Componentes reutilizáveis** — Header, Footer, FAQ, CTA reutilizados em múltiplas páginas
- **Padrão data-driven** — Cities, segments, blog em `lib/`

### ❌ Problemas Identificados

#### 1. **SRP Violation — Single Responsibility Principle**

**Problema:** Arquivos muito grandes com múltiplas responsabilidades

| Arquivo | Linhas | Problemas |
|---------|--------|----------|
| `components/Configurator.tsx` | 1030 | UI + estado + cálculos + dados + SVG geração |
| `lib/blog.ts` | 1227 | Tipos + dados (5 artigos) + funções helper |
| `lib/cities.ts` | 566 | 50+ cidades inline + tipos + funções |
| `components/Hero.tsx` | 421 | UI + GSAP + canvas ripple + lógica magnética |

**Impacto:** Difícil manutenção, testes complexos, reuso limitado

#### 2. **DRY Violation — Don't Repeat Yourself**

- **Cores:** `CORES_TAPETE`, `CORES_TEXTO`, `CORES_BORDA` em Configurator — devem ser `lib/constants/colors.ts`
- **Medidas:** `MEDIDAS` em Configurator — devem ser `lib/constants/measurements.ts`
- **Bordas:** `BORDAS` em Configurator — devem ser `lib/constants/borders.ts`
- **Tipos:** `City`, `Segment`, `BlogPost` espalhados — centralizar em `lib/types/`

#### 3. **Lack of Abstraction**

Não há camadas claras:
```
app/             ← Rotas (apresentação)
components/      ← Componentes (UI)
lib/             ← Tudo misturado (dados + funções + tipos)
  ├─ data.ts      (dados raw)
  ├─ blog.ts      (dados + tipos + funções)
  ├─ cities.ts    (dados + tipos)
  ├─ svg-generator.ts (lógica)
  └─ ...
```

Deveria ser:
```
app/             ← Rotas
components/      ← Componentes de UI
lib/
  ├─ types/       ← Tipos compartilhados
  ├─ constants/   ← Dados estáticos (cores, medidas)
  ├─ schemas/     ← Validação (Zod)
  ├─ hooks/       ← Custom hooks
  ├─ utils/       ← Funções helpers
  ├─ services/    ← Lógica de negócio
  └─ data/        ← Dados raw/modelos
```

#### 4. **File Organization Issues**

- `app/(cidades)/` — Diretório agrupador vazio, não usado efetivamente
- Dados do blog inline — 1227 linhas em um arquivo
- Sem separação entre dados (estáticos) e lógica (dinâmica)

#### 5. **Component Cohesion**

**Configurator.tsx** (1030 linhas):
- 200+ linhas: Dados de cores, medidas, bordas
- 300+ linhas: Lógica de estado (color, size, border, text, design)
- 300+ linhas: Renderização e interação
- 200+ linhas: Geração SVG

Deveria ser:
```
components/
  └─ Configurator/
      ├─ index.tsx           (orquestrador, 150-200 linhas)
      ├─ ColorPicker.tsx     (seleção de cores, 100 linhas)
      ├─ SizePicker.tsx      (seleção de tamanho, 80 linhas)
      ├─ BorderPicker.tsx    (seleção de borda, 80 linhas)
      ├─ TextInput.tsx       (entrada de texto, 100 linhas)
      ├─ Preview.tsx        (renderização, 150 linhas)
      ├─ useConfigurator.ts  (lógica de estado, 150 linhas)
      └─ types.ts           (tipos locais, 50 linhas)
```

#### 6. **Data Management**

Sem validação estruturada — dados crus em arrays
```typescript
// ❌ Ruim — dados sem validação
const CORES = [{ id: 'preto', label: 'Preto', hex: '#1a1a1a' }]

// ✅ Melhor — com Zod
export const ColorSchema = z.object({
  id: z.enum(['preto', 'cinza', ...]),
  label: z.string().min(1),
  hex: z.string().regex(/^#[0-9A-F]{6}$/i),
})
```

## Plano de Refatoração (SOLID + DRY)

### Fase 1: Estrutura Base (Baixo Risco)

#### 1.1 Criar `lib/types/index.ts`
Centralizar todos os tipos:
```typescript
export type { City } from './city'
export type { Segment } from './segment'
export type { BlogPost } from './blog'
export type { ConfiguratorState, ColorOption, Measurement } from './configurator'
export type { MenuItem, Schema, LocalBusiness } from './common'
```

#### 1.2 Criar `lib/constants/`
```
lib/constants/
  ├─ colors.ts         (CORES_TAPETE, CORES_TEXTO, CORES_BORDA)
  ├─ measurements.ts   (MEDIDAS)
  ├─ borders.ts        (BORDAS)
  ├─ navigation.ts     (NAV_LINKS para Header)
  └─ index.ts          (re-exports)
```

#### 1.3 Extrair dados de blog.ts
```
lib/blog/
  ├─ data.ts          (5 artigos apenas — 800+ linhas)
  ├─ types.ts         (BlogPost, interface)
  ├─ utils.ts         (getBlogPostBySlug, getAllBlogPosts, etc)
  └─ index.ts         (re-exports)
```

**Benefício:** `blog.ts` de 1227 → 3 arquivos com ~400 linhas cada

#### 1.4 Extrair dados de cities.ts
```
lib/data/
  ├─ cities.ts        (50+ cidades — dados brutos)
  ├─ segments.ts      (segmentos — dados brutos)
  └─ index.ts         (re-exports)

lib/repositories/
  ├─ city.repo.ts     (getAllCitySlugs, getCityBySlug, etc)
  ├─ segment.repo.ts  (getAllSegmentSlugs, getSegmentBySlug, etc)
  └─ index.ts         (re-exports)
```

**Benefício:** Separação entre dados (imutáveis) e queries (lógica)

### Fase 2: Componentes (Médio Risco)

#### 2.1 Decomposição de Configurator
Dividir em sub-componentes com responsabilidades únicas:
```
components/Configurator/
  ├─ index.tsx               (orquestrador)
  ├─ ColorSection.tsx        (seleção de cores)
  ├─ SizeSection.tsx         (seleção de tamanho)
  ├─ BorderSection.tsx       (seleção de borda)
  ├─ TextInputSection.tsx    (texto personalizado)
  ├─ PreviewCanvas.tsx       (renderização)
  ├─ useConfigurator.ts      (lógica de estado)
  ├─ types.ts               (tipos locais)
  └─ constants.ts           (valores padrão)
```

**Benefício:** Cada componente < 200 linhas, testável, reutilizável

#### 2.2 Extrair lógica de Hero.tsx
```
components/Hero/
  ├─ index.tsx               (orquestrador)
  ├─ HeroContent.tsx         (texto, badges, CTAs)
  ├─ CarpetMockup.tsx        (imagem + ripple)
  ├─ RippleCanvas.tsx        (canvas ripple effect)
  ├─ MagneticButton.tsx      (botão magnético)
  ├─ ScrollIndicator.tsx     (scroll indicator)
  ├─ useRipple.ts           (hook para ripple)
  └─ useHeroAnimation.ts    (hook para GSAP)
```

**Benefício:** Hero < 200 linhas, lógica isolada, animações testáveis

### Fase 3: Validação e Tipos (Baixo Risco)

#### 3.1 Criar `lib/schemas/` com Zod
```typescript
// lib/schemas/index.ts
import { z } from 'zod'

export const ColorSchema = z.object({
  id: z.string(),
  label: z.string(),
  hex: z.string().regex(/^#[0-9A-F]{6}$/i),
})

export const MeasurementSchema = z.object({
  l: z.string(),
  w: z.number().min(0),
  c: z.number().min(0),
})

export const CitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  state: z.string(),
  region: z.string(),
  // ... mais campos
})
```

**Benefício:** Type safety em runtime, validação de dados

#### 3.2 Criar `lib/hooks/` para lógica reutilizável
```
lib/hooks/
  ├─ useConfigurator.ts      (estado do configurador)
  ├─ useRipple.ts           (efeito ripple)
  ├─ useHeroAnimation.ts    (animações hero)
  ├─ useMediaQuery.ts       (media queries)
  └─ index.ts               (re-exports)
```

### Fase 4: Services e Camada de Negócio (Médio Risco)

#### 4.1 Criar `lib/services/`
```
lib/services/
  ├─ blog.service.ts        (lógica de blog)
  ├─ city.service.ts        (lógica de cidades)
  ├─ configurator.service.ts (lógica do configurador)
  └─ index.ts
```

Exemplo:
```typescript
// lib/services/configurator.service.ts
export class ConfiguratorService {
  static generateSVG(config: ConfiguratorState): string { ... }
  static calculatePreview(config: ConfiguratorState): Preview { ... }
  static validateConfiguration(config: ConfiguratorState): ValidationResult { ... }
}
```

## Implementação Passo a Passo

### Semana 1: Estrutura Base
```bash
# Dia 1: Tipos
mkdir -p lib/types
# Criar: city.ts, segment.ts, blog.ts, configurator.ts, common.ts, index.ts

# Dia 2: Constantes
mkdir -p lib/constants
# Criar: colors.ts, measurements.ts, borders.ts, navigation.ts, index.ts

# Dia 3: Data layer
mkdir -p lib/data lib/repositories
# Extrair cities.ts, segments.ts
# Criar city.repo.ts, segment.repo.ts

# Dia 4: Blog refactor
mkdir -p lib/blog
# Dividir blog.ts em data.ts, types.ts, utils.ts, index.ts

# Dia 5: Validação
mkdir -p lib/schemas
# Criar schemas com Zod
```

### Semana 2: Componentes
```bash
# Dia 1-2: Decomposição Hero
mkdir -p components/Hero
# Dividir Hero.tsx em componentes

# Dia 3-4: Decomposição Configurator
mkdir -p components/Configurator
# Dividir Configurator.tsx em componentes

# Dia 5: Hooks
mkdir -p lib/hooks
# Extrair useConfigurator, useRipple, useHeroAnimation
```

### Semana 3: Services e Testes
```bash
# Dia 1-2: Services
mkdir -p lib/services
# Criar camada de negócio

# Dia 3-5: Testes e ajustes finais
```

## SOLID Principles Aplicados

### S — Single Responsibility
✅ Cada arquivo tem UMA razão para mudar
- `colors.ts` muda se cores mudam
- `ColorPicker.tsx` muda se UI de cores muda
- `color.repo.ts` muda se acesso a dados muda

### O — Open/Closed
✅ Aberto para extensão, fechado para modificação
- Novos tipos de borda? Apenas adicione em `borders.ts`
- Novo segmento? Apenas adicione em `lib/data/segments.ts`
- Novo componente? Não precisa alterar Configurator

### L — Liskov Substitution
✅ Componentes são intercambiáveis
- `ColorPicker` pode ser substituído sem quebrar `Configurator`
- Hooks podem ser compostos em qualquer contexto

### I — Interface Segregation
✅ Tipos pequenos e específicos
- Não use `Configurator State` em `ColorPicker`
- Use `{ color: string; onChange: (c: string) => void }`

### D — Dependency Inversion
✅ Depender de abstrações, não implementações
```typescript
// ❌ Ruim
function Hero() {
  const ripple = new RippleEffect()
}

// ✅ Melhor
function Hero({ ripple }: { ripple: RippleEffect }) {
  // ...
}
```

## DRY Checklist

- [ ] Cores centralizadas em `lib/constants/colors.ts`
- [ ] Medidas centralizadas em `lib/constants/measurements.ts`
- [ ] Bordas centralizadas em `lib/constants/borders.ts`
- [ ] Tipos centralizados em `lib/types/`
- [ ] Nenhum arquivo > 300 linhas (exceto data raw)
- [ ] Dados e lógica separados (`lib/data/` vs `lib/repositories/`)
- [ ] Componentes com < 200 linhas
- [ ] Hooks para lógica reutilizável
- [ ] Services para regras de negócio

## Rollout Strategy

1. **Feature flag:** Não necessário — refatoração é interna
2. **Backward compatibility:** Manter exports de `lib/index.ts`
3. **Testing:** Testar cada componente isolado antes de integrar
4. **Migration:** Atualizar imports gradualmente
5. **Validation:** Build deve passar em todas as etapas

## Métricas de Sucesso

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Arquivo maior | 1227 (blog.ts) | 450 (max) | ✅ |
| Média de linhas/arquivo | ~300 | ~150 | ✅ |
| Arquivos > 300 linhas | 4 | 0 | ✅ |
| Type coverage | ~95% | 100% | ✅ |
| Duração build | ~1.3s | ~1.2s | ✅ |

## Próximos Passos

1. Apresentar PRD ao time
2. Começar com Fase 1 (tipos + constantes)
3. Revisar e testar a cada mudança
4. Documentar padrões em CLAUDE.md
5. Aplicar padrão a novos componentes desde já
