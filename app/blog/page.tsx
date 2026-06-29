import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"
import { getAllBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog | Entratta — Capachos Personalizados",
  description:
    "Leia artigos sobre capachos personalizados, design, dicas de escolha, processos de fabricação e muito mais.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Entratta",
    description:
      "Dicas e guias sobre capachos personalizados, branding e design para empresas e residências.",
    url: "https://entratta.com.br/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Entratta",
    description: "Guias práticos sobre capachos personalizados e branding.",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Entratta",
  description: "Guias e artigos sobre capachos personalizados",
  url: "https://entratta.com.br/blog",
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      <main>
        <section
          className="px-4 pt-20 pb-12 text-center"
          style={{
            background: "linear-gradient(180deg,#030810 0%,#060E16 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#22C55E",
                letterSpacing: "1.5px",
              }}
            >
              GUIAS E DICAS
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                color: "#fff",
                letterSpacing: 0,
                lineHeight: 1.1,
              }}
            >
              Blog Entratta
              <span style={{ color: "#4ADE80", fontStyle: "italic" }}>
                {" "}
                — Seu Guia Completo
              </span>
            </h1>
            <p
              className="mt-4"
              style={{ color: "#94A3B8", lineHeight: 1.7, maxWidth: "480px", margin: "1rem auto 0" }}
            >
              Artigos sobre capachos personalizados, design, dicas de escolha e muito mais.
            </p>
          </div>
        </section>

        <section className="px-4 py-16" style={{ background: "#fff" }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
                  style={{ background: "#FFFFFF" }}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-3">
                      <span
                        className="inline-block px-2 py-1 rounded text-xs font-bold"
                        style={{
                          background: "rgba(34,197,94,0.1)",
                          color: "#22C55E",
                        }}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h2
                      className="text-xl font-bold mb-3 line-clamp-2"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "#0F172A",
                      }}
                    >
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                      {post.description}
                    </p>

                    <div
                      className="flex items-center gap-4 text-xs text-gray-500 mb-4"
                      style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1rem" }}
                    >
                      <span>{post.publishedAt.toLocaleDateString("pt-BR")}</span>
                      <span>•</span>
                      <span>{post.readingTime} min de leitura</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block px-4 py-2 rounded font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg,#22C55E,#15803D)",
                        color: "#000",
                        textDecoration: "none",
                        alignSelf: "flex-start",
                      }}
                    >
                      Ler Artigo →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Confira nossos artigos, escolha o segmento ideal e solicite seu orçamento.
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
