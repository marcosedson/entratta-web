import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://entratta.com.br'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/monte-o-seu`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/como-funciona`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/depoimentos`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/lojas`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
