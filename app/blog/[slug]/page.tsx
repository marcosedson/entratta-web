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
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }

    // Main separator (═══)
    if (line.includes("═══")) {
      i++
      continue
    }

    // Section separator (───)
    if (line.includes("───")) {
      elements.push(
        <hr
          key={`sep-${i}`}
          style={{
            borderTop: "2px solid #E2E8F0",
            marginTop: "2rem",
            marginBottom: "2rem",
            borderBottom: "none",
          }}
        />
      )
      i++
      continue
    }

    // Main title (all caps, after ═══)
    if (line.match(/^[A-ZÁÉÍÓÚ\s\?]+$/) && line.length > 20) {
      elements.push(
        <h1
          key={`h1-${i}`}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "3rem",
            color: "#0F172A",
            marginTop: "3rem",
            marginBottom: "1.5rem",
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          {line}
        </h1>
      )
      i++
      continue
    }

    // Subtitle (smaller caps text)
    if (
      line.match(/^[A-ZÁÉÍÓÚ\s\:]+$/) &&
      line.length < 80 &&
      line.length > 10 &&
      !line.startsWith("PASSO")
    ) {
      elements.push(
        <p
          key={`subtitle-${i}`}
          style={{
            fontSize: "1.1rem",
            color: "#64748B",
            marginBottom: "2rem",
            fontStyle: "italic",
          }}
        >
          {line}
        </p>
      )
      i++
      continue
    }

    // Section header (PASSO, ERRO, etc)
    if (line.match(/^(PASSO|ERRO|RAZÃO|VANTAGEM|FATOR|EXEMPLO|OPÇÃO)[\s\d\:]/)) {
      elements.push(
        <h2
          key={`h2-${i}`}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            color: "#0F172A",
            marginTop: "2rem",
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          {line}
        </h2>
      )
      i++
      continue
    }

    // Table
    if (line.trim().startsWith("|")) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i])
        i++
      }

      elements.push(
        <div
          key={`table-${i}`}
          className="overflow-x-auto"
          style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <tbody>
              {tableLines.map((row, ridx) => {
                if (row.includes("---")) return null
                const cells = row.split("|").filter((c) => c.trim())
                return (
                  <tr
                    key={ridx}
                    style={{
                      backgroundColor: ridx % 2 === 0 ? "#F8FAFC" : "#fff",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    {cells.map((cell, cidx) => (
                      <td
                        key={cidx}
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "#0F172A",
                          fontWeight: ridx === 0 ? 600 : 400,
                        }}
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Bulleted lists (✓ or →)
    if (line.match(/^(✓|→|-)/)) {
      const listItems = []
      while (i < lines.length && lines[i].match(/^(✓|→|-)/)) {
        listItems.push(lines[i].replace(/^(✓|→|-)\s*/, ""))
        i++
      }

      elements.push(
        <ul
          key={`list-${i}`}
          style={{
            marginLeft: "1.5rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            color: "#475569",
          }}
        >
          {listItems.map((item, lidx) => (
            <li
              key={lidx}
              style={{
                marginBottom: "0.5rem",
                lineHeight: "1.6",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered lists
    if (line.match(/^\d+\./)) {
      const listItems = []
      while (i < lines.length && lines[i].match(/^\d+\./)) {
        listItems.push(lines[i].replace(/^\d+\.\s*/, ""))
        i++
      }

      elements.push(
        <ol
          key={`olist-${i}`}
          style={{
            marginLeft: "1.5rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            color: "#475569",
          }}
        >
          {listItems.map((item, lidx) => (
            <li
              key={lidx}
              style={{
                marginBottom: "0.5rem",
                lineHeight: "1.6",
              }}
            >
              {item}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Regular paragraph
    if (line.trim()) {
      elements.push(
        <p
          key={`p-${i}`}
          style={{
            color: "#475569",
            lineHeight: "1.8",
            marginBottom: "1rem",
            fontSize: "0.95rem",
          }}
        >
          {line}
        </p>
      )
    }

    i++
  }

  return (
    <div
      style={{
        maxWidth: "100%",
      }}
    >
      {elements}
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
