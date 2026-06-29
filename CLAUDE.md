# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production (validates all routes)
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Reference Documentation

- **@AGENTS.md** — Stack versions, component rules, file map, business context, SEO strategy
- **@ARCHITECTURE.md** — Current state analysis, SRP violations, DRY violations, refactoring plan (SOLID + DRY)
- **Memory** — Check `/Users/marcosmarcon/.claude/projects/-Users-marcosmarcon-projetos-entratta-web/memory/` for project context from prior sessions

## Core Stack & Patterns

### Next.js 16 App Router (Critical)
- All routes in `app/` directory
- Dynamic routes use `[param]` syntax: `app/blog/[slug]/page.tsx`
- Layout files: `app/layout.tsx` (root), `app/*/layout.tsx` (nested)
- `generateStaticParams()` for ISR and pre-rendering
- `dynamicParams: true` to allow unlisted slugs
- Metadata via `generateMetadata()` or `export const metadata`
- Use `generateMetadata` for dynamic pages, `export const metadata` for static

### React 19 & TypeScript
- Strict mode enabled
- Use `useCallback` to prevent re-renders in event handlers
- Refs with `useRef<HTMLElement>(null)`
- Client components must have `'use client'` at top
- No optional chaining on refs: check before access

### Tailwind v4 (CSS-Native)
- No `tailwind.config.js` — all tokens inline in `globals.css` via `@theme`
- Colors, fonts, spacing defined in `:root` or `@theme inline`
- Utility-first: use Tailwind classes, avoid custom CSS when possible

### GSAP Animations (Law of the Land)
- **Scroll smooth** → **Lenis** (not CSS `scroll-behavior`)
- **Element motion** → **GSAP** (not CSS `transition`/`animation`)
- Register `ScrollTrigger` per component: `gsap.registerPlugin(ScrollTrigger)`
- Always use `gsap.context()` + `ctx.revert()` in cleanup
- Easing: `power3.out` or `expo.out`
- No eases shorter than 0.6s
- Mobile: `gsap.matchMedia()` to disable pin, use simple reveals

## URL Structure & Dynamic Routes

### Dynamic City Pages
- Route: `app/capacho-personalizado-[slug]/page.tsx`
- Slugs generated from `lib/data.ts` via `getAllCitySlugs()`
- 50+ Brazilian cities with local SEO

### Dynamic Segment Pages
- Route: `app/capacho-para-[slug]/page.tsx`
- Segments: clínica, empresa, lazer, segurança, residência, etc.
- Generated from `lib/segments.ts`

### City + Segment Combinations
- Route: `app/capacho-para-[segment]-em-[cidade]/page.tsx`
- Long-tail SEO targeting specific use cases

### Special Pages
- `/melhor-preco` — Psychological positioning (best price, no numbers)
- `/como-funciona` — Static process explanation
- `/depoimentos` — Testimonials with Review schema
- `/blog` — Blog landing, `/blog/[slug]` for articles

## Blog System

**Location:** `lib/blog.ts`

- 5 hand-crafted articles (not AI-generic)
- Each article: title, description, keywords, content, category, readingTime
- Content structure:
  - Main separator: `═══ TITLE ═══`
  - Section separator: `─── Section Name ───`
  - Subtitles in CAPS: `Do Seu Pedido até o Capacho na Porta`
  - Lists: `→ Item` or `- Item` or `✓ Item` or `1. Item`
  - Tables: pipe-delimited rows
  
**ArticleContent Component** (`app/blog/[slug]/page.tsx`):
- Parses blog content and renders with proper spacing
- Handles separators, lists, tables, headings
- No markdown — use UPPERCASE and special characters for structure

## SEO & Schema Strategy

**No explicit prices on site** — psychological positioning as "most affordable" without numbers
- Captures leads via WhatsApp instead
- Maintains price flexibility across channels (ML, Shopee, etc.)

**Key Schema Types:**
- `LocalBusiness` (in `app/layout.tsx`) — priceRange "$", slogan, address, areaServed
- `BlogPosting` (in blog pages) — headline, author, datePublished
- `BreadcrumbList` (in blog pages) — Home > Blog > Article
- `FAQPage` (in `components/FAQSchema.tsx`) — First Q: "Vocês são realmente os mais baratos?"
- `Offer` (in `/melhor-preco`) — no visible price, but schema structure

**Open Graph & Twitter Cards:**
- All pages have og:title, og:description, og:image
- Twitter card type: summary_large_image
- Metadata API generates per-route

**Robots & Sitemap:**
- `robots.ts` — index everything, follow all links
- `sitemap.ts` — includes all cities, segments, blogs, combinations with priority levels
- Update Google Search Console after major changes

## Code Patterns to Avoid

- ✗ Event handlers in Server Components (TypeScript error)
- ✗ CSS `scroll-behavior: smooth` (use Lenis instead)
- ✗ CSS `transition`/`animation` for page reveals (use GSAP)
- ✗ Easing durations < 0.6s (jarring UX)
- ✗ `find` without filter (use `-name "*.tsx"` always)
- ✗ Read entire large files (use offset+limit)
- ✗ Generic error handling for impossible scenarios
- ✗ Comments on obvious code
- ✗ Docstrings longer than one line
- ✗ Features beyond the request

## Investigation Protocol (Token Economy)

1. **grep before read:** `grep -rn "symbol" app/ components/ --include="*.tsx" -l`
2. **Map first:** AGENTS.md answers 80% of location questions
3. **Read smart:** use offset+limit for large files
4. **Parallel calls:** all independent queries at once
5. **API routes:** always `app/api/<resource>/<action>/route.ts`
6. **Filter finds:** never `find /` or unfiltered — use `-name "*.tsx"` + directory

## Commit Style

- New features: "feat: what was added"
- Fixes: "fix: what was fixed"  
- Refactors: "refactor: what changed and why"
- One commit per logical change (don't batch unrelated work)
- No force-push to main unless explicitly authorized

## Architecture Standards (SOLID + DRY)

### File Size Limits
- Components: max 200 lines (use composition if larger)
- Utilities: max 300 lines
- Data files: data-only, separate from logic
- Use `index.ts` to re-export and create module boundaries

### Adding New Code
When adding features, apply SOLID:
- **S**: One reason to change per file
  - Colors go in `lib/constants/colors.ts`, not in component
  - Component logic goes in `useMyComponent.ts` hook, not inline
  - Business rules go in `lib/services/`, not in component
  
- **O**: Open for extension, closed for modification
  - Add new city? Edit `lib/data/cities.ts`, not `app/capacho-personalizado-[slug]/page.tsx`
  - New color? Add to `lib/constants/colors.ts`, don't touch components
  
- **L**: Components are interchangeable
  - `<ColorPicker color={color} onChange={setColor} />` can be swapped for different UI
  
- **I**: Segregate interfaces
  - Don't pass entire `ConfiguratorState` to `ColorPicker` — just `{ color, onChange }`
  
- **D**: Depend on abstractions
  - Pass functions/callbacks, not concrete instances
  - Use custom hooks to abstract complexity

### DRY Checklist Before Committing
- [ ] No hardcoded colors (use `lib/constants/colors.ts`)
- [ ] No hardcoded measurements (use `lib/constants/measurements.ts`)
- [ ] Data separated from logic (`lib/data/` vs `lib/services/`)
- [ ] Component < 200 lines (use sub-components if not)
- [ ] Reusable logic extracted to hooks (`lib/hooks/`)
- [ ] Types in `lib/types/`, not in components
- [ ] Constants in `lib/constants/`, not scattered

### Example: Adding a New Feature
```typescript
// ❌ DON'T: Put everything in one component file
export function NewFeature() {
  const COLORS = [...] // ← Data here
  function calculate() { ... } // ← Logic here
  return <div>...</div> // ← UI here
}

// ✅ DO: Separate concerns
// components/NewFeature/index.tsx (50 lines, orchestrator)
import { useNewFeature } from '@/lib/hooks/useNewFeature'
import { NewFeatureContent } from './NewFeatureContent'
export function NewFeature() {
  const { state, update } = useNewFeature()
  return <NewFeatureContent {...state} onChange={update} />
}

// lib/hooks/useNewFeature.ts (100 lines, state + logic)
export function useNewFeature() { ... }

// lib/constants/newFeature.ts (30 lines, data)
export const COLORS = [...]

// lib/services/newFeature.service.ts (80 lines, business rules)
export class NewFeatureService { ... }

// lib/types/newFeature.ts (20 lines, types)
export interface NewFeatureState { ... }
```

## Browser Testing

- Always test in Chrome/Firefox at localhost:3000
- Check responsive (mobile, tablet, desktop)
- Validate animations run smoothly (no janky GSAP)
- Test WhatsApp links with actual phone for verification
- For blog changes: verify ArticleContent renders dividers and spacing correctly
