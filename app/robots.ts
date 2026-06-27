import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/resultado-simulacao', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://entratta.com.br/sitemap.xml',
  }
}
