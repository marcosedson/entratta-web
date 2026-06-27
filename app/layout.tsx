import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Cormorant_Garamond, Syne } from "next/font/google"
import "./globals.css"
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  style: ["normal", "italic"],
})

const syne = Syne({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Capachos e Tapetes Personalizados com Logo | Entratta",
  description:
    "Monte seu capacho de vinil com logo, texto e cores da sua empresa. Preview realista em tempo real. Orçamento imediato pelo WhatsApp. Entrega em todo o Brasil em 7 dias úteis.",
  keywords: [
    "tapete vinil personalizado",
    "capacho personalizado empresa",
    "tapete entrada comercial",
    "capacho com logo",
    "tapete borracha personalizado",
    "tapete personalizado entrega brasil",
    "capacho de vinil",
    "tapete personalizado logo empresa",
    "capacho vinil empresarial",
    "tapete entrada escritório",
    "capacho personalizado presente",
    "tapete personalizado casa",
    "capacho vinil shopee",
    "tapete personalizado mercado livre",
    "capacho bem-vindo personalizado",
    "presente de casamento tapete",
    "capacho liso",
    "capacho simples",
    "tapete bem-vindo",
    "capacho arte pronta",
    "tapete capacho pronto entrega",
    "capacho vinil cor sólida",
    "tapete capacho resistente",
    "capacho antiderrapante",
  ],
  authors: [{ name: "Entratta" }],
  creator: "Entratta",
  metadataBase: new URL("https://entratta.com.br"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Capachos e Tapetes Personalizados com Logo | Entratta",
    description:
      "Configure seu capacho de vinil com logo da empresa. Preview ao vivo. Orçamento imediato no WhatsApp.",
    url: "https://entratta.com.br",
    siteName: "Entratta",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Entratta — Capachos e Tapetes Personalizados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capachos Personalizados com Logo | Entratta",
    description:
      "Configure seu capacho de vinil. Preview ao vivo. Orçamento imediato no WhatsApp.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Entratta",
  description:
    "Capachos e tapetes de vinil lisos, com artes prontas ou personalizados com logo para empresas e residências. Entrega em todo o Brasil.",
  url: "https://entratta.com.br",
  telephone: "+5564992066855",
  priceRange: "$$",
  sameAs: ["https://www.instagram.com/entrattaofficial"],
  areaServed: { "@type": "Country", name: "Brasil" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
    bestRating: "5",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+5564992066855",
    contactType: "customer service",
    availableLanguage: "Portuguese",
    contactOption: "TollFree",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Capachos e Tapetes de Vinil",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Capacho Liso de Vinil",
          description: "Capacho de vinil cor sólida com base antiderrapante, resistente ao tráfego intenso",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Capacho com Arte Pronta",
          description: "Capacho de vinil com design pronto — bem-vindo, patas, monogramas e outras artes",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Capacho de Vinil Personalizado com Logo",
          description: "Capacho de vinil com logo e texto personalizados, impressão 300 DPI, base antiderrapante",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Tapete de Vinil Personalizado Sob Medida",
          description: "Tapete de vinil com medidas customizadas para a entrada da sua empresa ou residência",
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${cormorant.variable} ${syne.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
