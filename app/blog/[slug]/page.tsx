import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return { title: "Artigo não encontrado" }
  }

  const pageUrl = `https://entratta.com.br/blog/${post.slug}`

  return {
    title: `${post.title} | Entratta Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: pageUrl,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = true

function BlogArticleSchemas({ post }: { post: ReturnType<typeof getBlogPostBySlug> }) {
  if (!post) return null

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `https://entratta.com.br/opengraph-image.png`,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://entratta.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "ENTRATTA",
      url: "https://entratta.com.br",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://entratta.com.br/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://entratta.com.br",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://entratta.com.br/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://entratta.com.br/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

function ArticleContent({ content }: { content: string }) {
  const sections = content.split("\n\n").filter((s) => s.trim())

  return (
    <div className="prose prose-lg max-w-none">
      {sections.map((section, idx) => {
        if (section.startsWith("# ")) {
          const text = section.replace(/^# /, "")
          return (
            <h1
              key={idx}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.5rem",
                color: "#0F172A",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              {text}
            </h1>
          )
        }

        if (section.startsWith("## ")) {
          const text = section.replace(/^## /, "")
          return (
            <h2
              key={idx}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                color: "#0F172A",
                marginTop: "1.5rem",
                marginBottom: "0.75rem",
              }}
            >
              {text}
            </h2>
          )
        }

        if (section.startsWith("| ")) {
          return (
            <div key={idx} className="overflow-x-auto">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <tbody>
                  {section.split("\n").map((row, ridx) => {
                    if (row.startsWith("|") && !row.includes("---")) {
                      const cells = row.split("|").filter((c) => c.trim())
                      return (
                        <tr
                          key={ridx}
                          style={{
                            borderBottom: "1px solid #E2E8F0",
                          }}
                        >
                          {cells.map((cell, cidx) => (
                            <td
                              key={cidx}
                              style={{
                                padding: "0.75rem",
                                textAlign: "left",
                              }}
                            >
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      )
                    }
                    return null
                  })}
                </tbody>
              </table>
            </div>
          )
        }

        if (section.startsWith("✓") || section.startsWith("-")) {
          return (
            <ul key={idx} style={{ marginLeft: "1.5rem", color: "#475569" }}>
              {section.split("\n").map((item, iidx) => (
                <li key={iidx} style={{ marginBottom: "0.5rem" }}>
                  {item.replace(/^[✓-]\s*/, "")}
                </li>
              ))}
            </ul>
          )
        }

        if (section.match(/^[0-9]\./)) {
          return (
            <ol key={idx} style={{ marginLeft: "1.5rem", color: "#475569" }}>
              {section.split("\n").map((item, iidx) => (
                <li key={iidx} style={{ marginBottom: "0.5rem" }}>
                  {item.replace(/^[0-9]\.\s*/, "")}
                </li>
              ))}
            </ol>
          )
        }

        return (
          <p key={idx} style={{ color: "#475569", lineHeight: "1.8" }}>
            {section}
          </p>
        )
      })}
    </div>
  )
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <BlogArticleSchemas post={post} />
      <Header />
      <main>
        <article>
          <section
            className="px-4 pt-16 pb-12"
            style={{
              background: "linear-gradient(180deg,#030810 0%,#060E16 100%)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#94A3B8" }}>
                <Link href="/" style={{ color: "#22C55E", textDecoration: "none" }}>
                  Home
                </Link>
                <span>/</span>
                <Link href="/blog" style={{ color: "#22C55E", textDecoration: "none" }}>
                  Blog
                </Link>
                <span>/</span>
                <span>{post.title}</span>
              </nav>

              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22C55E",
                  letterSpacing: "1.5px",
                }}
              >
                {post.category}
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: "1.5rem",
                }}
              >
                {post.title}
              </h1>

              <div
                className="flex items-center gap-6 flex-wrap"
                style={{ color: "#94A3B8", fontSize: "0.9rem" }}
              >
                <span>{post.publishedAt.toLocaleDateString("pt-BR")}</span>
                <span>•</span>
                <span>{post.readingTime} min de leitura</span>
                <span>•</span>
                <span>Por {post.author}</span>
              </div>
            </div>
          </section>

          <section className="px-4 py-16" style={{ background: "#fff" }}>
            <div className="max-w-3xl mx-auto">
              <ArticleContent content={post.content} />
            </div>
          </section>
        </article>

        <section
          className="px-4 py-16"
          style={{
            background: "linear-gradient(180deg,#F0FDF4 0%,#FFFFFF 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                color: "#0F172A",
                marginBottom: "1.5rem",
              }}
            >
              Pronto para seu Capacho Personalizado?
            </h2>
            <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "2rem" }}>
              Agora que você sabe tudo sobre capachos personalizados, solicite seu orçamento
              gratuito e transforme sua entrada.
            </p>
            <a
              href="https://wa.me/5564992066855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#22C55E,#15803D)",
                color: "#000",
                boxShadow: "0 8px 28px rgba(34,197,94,0.3)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitar Orçamento
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
