/**
 * Google Analytics Config
 * Rastreamento de eventos, conversões, contexto regional e métricas UTM
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Tipos de eventos que rastreamos
export const ANALYTICS_EVENTS = {
  // Navegação
  PAGE_VIEW: 'page_view',
  CLICK_CTA: 'click_cta',
  CLICK_WHATSAPP: 'click_whatsapp',
  CLICK_PRODUCT: 'click_product',

  // Configurador
  CONFIGURADOR_VISIT: 'configurador_visit',
  CONFIGURADOR_CONFIG: 'configurador_config',
  CONFIGURADOR_ORDER: 'configurador_order',

  // Conversões (Padrão GA4 Key Events)
  LEAD_GENERATED: 'lead_generated',
  GENERATE_LEAD: 'generate_lead',
  ORDER_COMPLETED: 'order_completed',
  PURCHASE: 'purchase',

  // B2B & Parcerias
  PARTNER_INTEREST: 'partner_interest',
  SAMPLE_REQUEST: 'sample_request',

  // Engajamento
  READ_ARTICLE: 'read_article',
  WATCH_VIDEO: 'watch_video',
  SUBMIT_FORM: 'submit_form',
  SCROLL_DEPTH: 'scroll_depth',
} as const

// Helper para extrair contexto da página atual no navegador
function getBrowserContext() {
  if (typeof window === 'undefined') {
    return {}
  }

  const pathname = window.location.pathname || ''
  let targetCity = ''
  let targetSegment = ''

  // Extração inteligente de cidade / segmento da URL
  const cityMatch = pathname.match(/capacho-personalizado-([a-z0-9-]+)/)
  if (cityMatch) targetCity = cityMatch[1]

  const comboMatch = pathname.match(/capacho-para-([a-z0-9-]+)-em-([a-z0-9-]+)/)
  if (comboMatch) {
    targetSegment = comboMatch[1]
    targetCity = comboMatch[2]
  }

  const segmentMatch = pathname.match(/capacho-para-([a-z0-9-]+)/)
  if (segmentMatch && !comboMatch) {
    targetSegment = segmentMatch[1]
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ''
  )

  return {
    page_path: pathname,
    page_title: document.title || '',
    page_location: window.location.href,
    target_city: targetCity || 'global',
    target_segment: targetSegment || 'geral',
    device_type: isMobile ? 'mobile' : 'desktop',
    referrer: document.referrer || 'direct',
  }
}

// Rastreia um evento customizado com enriquecimento de contexto
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics ID não configurado')
    return
  }

  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    const context = getBrowserContext()
    const enrichedParams = {
      ...context,
      ...params,
      timestamp: new Date().toISOString(),
    }
    gtag('event', eventName, enrichedParams)
  }
}

// Rastreia clique em CTA
export function trackCTAClick(ctaType: 'whatsapp' | 'contact' | 'product', context?: string) {
  trackEvent(ANALYTICS_EVENTS.CLICK_CTA, {
    cta_type: ctaType,
    context: context || 'unknown',
    event_category: 'engagement',
    event_label: `CTA: ${ctaType} (${context || 'unknown'})`,
  })
}

// Rastreia clique WhatsApp (com dados enriquecidos para conversão no GA4)
export function trackWhatsAppClick(source: string, message?: string) {
  const browserCtx = getBrowserContext()

  // Dispara o evento customizado específico de WhatsApp
  trackEvent(ANALYTICS_EVENTS.CLICK_WHATSAPP, {
    source,
    message_type: message ? 'custom' : 'default',
    event_category: 'conversion',
    event_label: `WhatsApp: ${source}`,
    city_context: browserCtx.target_city,
    segment_context: browserCtx.target_segment,
  })

  // Dispara também o evento nativo do GA4 para Enhanced Lead Measurement
  trackEvent(ANALYTICS_EVENTS.GENERATE_LEAD, {
    currency: 'BRL',
    value: 1.0,
    lead_source: source,
    method: 'whatsapp',
  })
}

// Rastreia visita ao configurador
export function trackConfiguradorVisit() {
  trackEvent(ANALYTICS_EVENTS.CONFIGURADOR_VISIT, {
    event_category: 'configurator',
    event_label: 'Configurator Visit',
  })
}

// Rastreia configuração criada
export function trackConfiguradorConfig(medida: string, corTapete: string) {
  trackEvent(ANALYTICS_EVENTS.CONFIGURADOR_CONFIG, {
    medida,
    cor_tapete: corTapete,
    event_category: 'configurator',
    event_label: `Config: ${medida} - ${corTapete}`,
  })
}

// Rastreia pedido criado (conversão máxima!)
export function trackOrderCompleted(orderId: string, medida: string, valor?: number) {
  trackEvent(ANALYTICS_EVENTS.ORDER_COMPLETED, {
    order_id: orderId,
    medida,
    value: valor || 0,
    currency: 'BRL',
    event_category: 'ecommerce',
    event_label: `Order: ${orderId}`,
  })

  // Evento padrão GA4 Purchase
  trackEvent(ANALYTICS_EVENTS.PURCHASE, {
    transaction_id: orderId,
    value: valor || 0,
    currency: 'BRL',
    items: [
      {
        item_name: `Capacho Vinil CNC ${medida}`,
        item_category: 'Capacho Personalizado',
        price: valor || 0,
        quantity: 1,
      },
    ],
  })
}

// Rastreia lead (WhatsApp clicado ou formulário preenchido)
export function trackLeadGenerated(source: string, type: 'whatsapp' | 'contact_form') {
  trackEvent(ANALYTICS_EVENTS.LEAD_GENERATED, {
    source,
    type,
    event_category: 'lead',
    event_label: `Lead via ${type} from ${source}`,
  })
}

// Rastreia interesse de parceiro / arquiteto
export function trackPartnerInterest(source: string, partnerType: string = 'arquiteto') {
  trackEvent(ANALYTICS_EVENTS.PARTNER_INTEREST, {
    partner_type: partnerType,
    source,
    event_category: 'b2b_partners',
    event_label: `Partner: ${partnerType} from ${source}`,
  })
}

// Rastreia leitura de artigo do blog
export function trackArticleRead(slug: string, title: string) {
  trackEvent(ANALYTICS_EVENTS.READ_ARTICLE, {
    article_slug: slug,
    article_title: title,
    event_category: 'blog',
    event_label: `Read: ${title}`,
  })
}
