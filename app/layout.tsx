import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Cormorant_Garamond, Syne } from "next/font/google"
import "./globals.css"
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"

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
  title: "Capacho Personalizado com Logo | Fabricante | Entratta",
  description:
    "Fabricante de capachos personalizados em vinil com logo da sua empresa. Entrega em 3 dias para todo o Brasil. Orçamento grátis no WhatsApp.",
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
  openGraph: {
    title: "Capachos e Tapetes Personalizados com Logo | Entratta",
    description:
      "Configure seu capacho de vinil com logo da empresa. Preview ao vivo. Orçamento imediato no WhatsApp.",
    url: "https://entratta.com.br",
    siteName: "Entratta",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capachos Personalizados com Logo | Entratta",
    description:
      "Configure seu capacho de vinil. Preview ao vivo. Orçamento imediato no WhatsApp.",
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
  name: "ENTRATTA Capachos Personalizados",
  description:
    "Fabricante de capachos personalizados em vinil com logo para empresas, condomínios, indústrias e residências. Entrega em 3 dias para todo o Brasil.",
  url: "https://entratta.com.br",
  telephone: "+55-64-99206-6855",
  image: "https://entratta.com.br/opengraph-image.png",
  priceRange: "$",
  slogan: "O capacho personalizado mais barato do Brasil — fabricante direto, sem intermediários.",
  sameAs: [
    "https://www.instagram.com/entrattaofficial",
    "https://lista.mercadolivre.com.br/_CustId_3459954476"
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Urupema, Nº 236 - Planalto",
    addressLocality: "Itumbiara",
    addressRegion: "GO",
    postalCode: "75533-130",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -18.4186,
    longitude: -49.2155,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  areaServed: [
    { "@type": "City", name: "Itumbiara", addressRegion: "GO" },
    { "@type": "City", name: "Araporã", addressRegion: "MG" },
    { "@type": "City", name: "Morrinhos", addressRegion: "GO" },
    { "@type": "City", name: "Goiatuba", addressRegion: "GO" },
    { "@type": "City", name: "Buriti Alegre", addressRegion: "GO" },
    { "@type": "City", name: "Centralina", addressRegion: "MG" },
    { "@type": "City", name: "Caldas Novas", addressRegion: "GO" },
    { "@type": "City", name: "Rio Verde", addressRegion: "GO" },
    { "@type": "City", name: "Goiânia", addressRegion: "GO" },
    { "@type": "City", name: "Uberlândia", addressRegion: "MG" },
    { "@type": "City", name: "Uberaba", addressRegion: "MG" },
    { "@type": "City", name: "Ituiutaba", addressRegion: "MG" },
    { "@type": "City", name: "Araguari", addressRegion: "MG" },
    { "@type": "City", name: "Catalão", addressRegion: "GO" },
    { "@type": "City", name: "Aparecida de Goiânia", addressRegion: "GO" },
    { "@type": "City", name: "Anápolis", addressRegion: "GO" },
    { "@type": "City", name: "Senador Canedo", addressRegion: "GO" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "18",
    bestRating: "5",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-64-99206-6855",
    contactType: "customer service",
    availableLanguage: "Portuguese",
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
        <GoogleAnalytics />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
