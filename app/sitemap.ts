import { MetadataRoute } from "next"
import { getAllCitySlugs } from "@/lib/data"
import { getAllSegmentSlugs } from "@/lib/segments"
import { getAllBlogPosts } from "@/lib/blog"
import { getAllCitySegmentCombos } from "@/lib/city-segment"

const baseUrl = "https://entratta.com.br"
const staticLastModified = new Date("2026-07-06")

const staticPages = [
  {
    url: baseUrl,
    lastModified: staticLastModified,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  },
  {
    url: `${baseUrl}/melhor-preco`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: `${baseUrl}/como-funciona`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${baseUrl}/lojas`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${baseUrl}/depoimentos`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: `${baseUrl}/blog`,
    lastModified: staticLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    url: `${baseUrl}/atendemos`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${baseUrl}/contato`,
    lastModified: staticLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
]

const cityPages = getAllCitySlugs().map((slug) => ({
  url: `${baseUrl}/capacho-personalizado-${slug}`,
  lastModified: staticLastModified,
  changeFrequency: "monthly" as const,
  priority: 0.8,
}))

const segmentPages = getAllSegmentSlugs().map((slug) => ({
  url: `${baseUrl}/capacho-para-${slug}`,
  lastModified: staticLastModified,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}))

const blogPages = getAllBlogPosts().map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.publishedAt,
  changeFrequency: "monthly" as const,
  priority: 0.6,
}))

const citySegmentPages = getAllCitySegmentCombos().map((combo) => ({
  url: `${baseUrl}/capacho-para-${combo.segment.slug}-em-${combo.city.slug}`,
  lastModified: staticLastModified,
  changeFrequency: "monthly" as const,
  priority: 0.5,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticPages, ...cityPages, ...segmentPages, ...blogPages, ...citySegmentPages]
}
