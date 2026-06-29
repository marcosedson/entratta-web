export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
}

export class SEOService {
  static generateTitle(main: string, brand: string = 'Entratta'): string {
    if (main.length + brand.length > 60) {
      return main
    }
    return `${main} | ${brand}`
  }

  static generateDescription(
    text: string,
    maxLength: number = 160
  ): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  static sanitizeUrl(path: string): string {
    return path
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-|\-$/g, '')
  }

  static generateBreadcrumbs(
    segments: Array<{ label: string; path: string }>
  ): Array<{ name: string; item: string }> {
    const breadcrumbs: Array<{ name: string; item: string }> = [
      { name: 'Home', item: '/' },
    ]

    for (const segment of segments) {
      breadcrumbs.push({
        name: segment.label,
        item: segment.path,
      })
    }

    return breadcrumbs
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static buildCanonical(pathname: string, domain: string = 'entratta.com.br'): string {
    return `https://${domain}${pathname}`
  }
}
