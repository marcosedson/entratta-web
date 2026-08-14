import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/rotas-internas"],
      },
    ],
    sitemap: "https://entratta.com.br/sitemap.xml",
  }
}
