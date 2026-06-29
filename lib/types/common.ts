export interface MenuItem {
  href: string
  label: string
}

export interface LocalBusiness {
  name: string
  description: string
  url: string
  telephone: string
  priceRange: string
  slogan: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
}

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
}
