/**
 * Google Analytics Config
 * Rastreamento de eventos, conversões e métricas UTM
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

  // Conversões
  LEAD_GENERATED: 'lead_generated',
  ORDER_COMPLETED: 'order_completed',

  // Engajamento
  READ_ARTICLE: 'read_article',
  WATCH_VIDEO: 'watch_video',
  SUBMIT_FORM: 'submit_form',
} as const

// Rastreia um evento customizado
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics ID não configurado')
    return
  }

  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', eventName, params || {})
  }
}

// Rastreia clique em CTA
export function trackCTAClick(ctaType: 'whatsapp' | 'contact' | 'product', context?: string) {
  trackEvent(ANALYTICS_EVENTS.CLICK_CTA, {
    cta_type: ctaType,
    context: context || 'unknown',
    timestamp: new Date().toISOString(),
  })
}

// Rastreia clique WhatsApp
export function trackWhatsAppClick(source: string, message?: string) {
  trackEvent(ANALYTICS_EVENTS.CLICK_WHATSAPP, {
    source,
    message_type: message ? 'custom' : 'default',
    timestamp: new Date().toISOString(),
  })
}

// Rastreia visita ao configurador
export function trackConfiguradorVisit() {
  trackEvent(ANALYTICS_EVENTS.CONFIGURADOR_VISIT, {
    timestamp: new Date().toISOString(),
  })
}

// Rastreia configuração criada
export function trackConfiguradorConfig(medida: string, corTapete: string) {
  trackEvent(ANALYTICS_EVENTS.CONFIGURADOR_CONFIG, {
    medida,
    cor_tapete: corTapete,
    timestamp: new Date().toISOString(),
  })
}

// Rastreia pedido criado (conversão!)
export function trackOrderCompleted(orderId: string, medida: string, valor?: number) {
  trackEvent(ANALYTICS_EVENTS.ORDER_COMPLETED, {
    order_id: orderId,
    medida,
    value: valor || 0,
    currency: 'BRL',
    timestamp: new Date().toISOString(),
  })
}

// Rastreia lead (WhatsApp clicado = lead)
export function trackLeadGenerated(source: string, type: 'whatsapp' | 'contact_form') {
  trackEvent(ANALYTICS_EVENTS.LEAD_GENERATED, {
    source,
    type,
    timestamp: new Date().toISOString(),
  })
}

// Rastreia leitura de artigo
export function trackArticleRead(slug: string, title: string) {
  trackEvent(ANALYTICS_EVENTS.READ_ARTICLE, {
    article_slug: slug,
    article_title: title,
    timestamp: new Date().toISOString(),
  })
}
