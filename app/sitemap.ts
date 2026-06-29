import { MetadataRoute } from "next"
import { getAllCitySlugs } from "@/lib/data"
import { getAllSegmentSlugs } from "@/lib/segments"
import { getAllBlogPosts } from "@/lib/blog"
import { getAllCitySegmentCombos } from "@/lib/city-segment"

const baseUrl = "https://entratta.com.br"

const staticPages = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  },
  {
    url: `${baseUrl}/como-funciona`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${baseUrl}/lojas`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${baseUrl}/depoimentos`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
]

const cityPages = getAllCitySlugs().map((slug) => ({
  url: `${baseUrl}/capacho-personalizado-${slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
}))

const segmentPages = getAllSegmentSlugs().map((slug) => ({
  url: `${baseUrl}/capacho-para-${slug}`,
  lastModified: new Date(),
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
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.5,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticPages, ...cityPages, ...segmentPages, ...blogPages, ...citySegmentPages]
}
