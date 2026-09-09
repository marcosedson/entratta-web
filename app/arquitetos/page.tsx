import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { ArchitectCTAButton } from './ArchitectCTAButton'

export const metadata: Metadata = {
  title: 'Programa para Arquitetos, Designers e Especificadores | ENTRATTA',
  description:
    'Seja um parceiro especificador ENTRATTA. Capachos personalizados e tapetes de vinil CNC sob medida para seus projetos corporativos, comerciais e residenciais. Solicite mostruário físico.',
  alternates: {
    canonical: 'https://entratta.com.br/arquitetos',
  },
  openGraph: {
    title: 'Programa para Arquitetos e Especificadores | ENTRATTA',
    description:
      'Soluções sob medida para projetos corporativos e residenciais. Corte CNC milimétrico, mais de 20 cores de vinil e suporte direto de fábrica.',
    url: 'https://entratta.com.br/arquitetos',
    type: 'website',
  },
}

function ArchitectSchemas() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://entratta.com.br',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Programa para Arquitetos e B2B',
        item: 'https://entratta.com.br/arquitetos',
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Programa de Especificação Técnica para Arquitetos e Designers',
    provider: {
      '@type': 'LocalBusiness',
      name: 'ENTRATTA Capachos Personalizados',
      telephone: '+55-64-99206-6855',
      url: 'https://entratta.com.br',
    },
    description:
      'Fornecimento direto de fábrica de capachos e tapetes de vinil CNC sob medida para escritórios de arquitetura, construtoras e designers de interiores.',
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Como funciona o envio do mostruário físico para escritórios de arquitetura?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enviamos o kit de amostras físicas com a paleta de cores de vinil 6mm, espessuras e demonstração de vulcanização CNC para escritórios de arquitetura e design de interiores parceiros.',
        },
      },
      {
        '@type': 'Question',
        name: 'A ENTRATTA produz capachos com cortes especiais e geometrias customizadas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Graças à nossa tecnologia de corte e vulcanização CNC de alta precisão, executamos curvas, chanfros, rebaixos em pisos e encaixes perfeitos em alvenaria e porcelanato.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual o prazo de produção para projetos corporativos e condomínios?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fabricamos em até 3 a 5 dias úteis direto na fábrica em Itumbiara (GO) com logística ágil para todo o Centro-Oeste, Minas Gerais, São Paulo e demais estados do Brasil.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

export default function ArquitetosPage() {
  return (
    <>
      <ArchitectSchemas />
      <Header />

      <main className="flex-1 bg-[#060D1A] text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-20 px-4 md:px-8 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-6">
              <span>📐</span> Programa de Parceria e Especificação B2B
            </div>

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Leve Precisão Milimétrica e Design aos Capachos do Seu Projeto
            </h1>

            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
              Fabricação direta em vinil 6mm vulcanizado com usinagem CNC computadorizada. 
              Garantimos fidelidade de cores, encaixes sob medida e acabamento de alto padrão para escritórios de arquitetura, 
              construtoras e designers de interiores.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ArchitectCTAButton
                text="Solicitar Mostruário de Amostras"
                source="architect_hero_sample"
                message="Olá! Sou arquiteto(a)/especificador(a) e gostaria de solicitar o mostruário físico de vinil e conhecer as condições para parceiros."
                primary
              />
              <ArchitectCTAButton
                text="Enviar Projeto / Planta para Orçamento"
                source="architect_hero_quote"
                message="Olá! Gostaria de cotar um projeto sob medida para um cliente com a fábrica ENTRATTA."
              />
            </div>
          </div>
        </section>

        {/* Diferenciais para Especificadores */}
        <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-2xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Por Que Arquitetos e Construtoras Especificam a ENTRATTA?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Elimine dores de cabeça com tapetes mal cortados ou logos desbotados. Fornecemos suporte técnico do projeto à entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-green-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mb-5">
                ⚡
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Usinagem CNC & Vulcanização</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Não usamos silk-screen nem tinta superficial que desgasta com o uso. As peças são recortadas a laser/fresa CNC e vulcanizadas a quente, tornando o logo eterno.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-green-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mb-5">
                🎨
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Paleta Completa & Sob Medida</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mais de 20 opções de cores em vinil 100% PVC (6mm e 10mm). Desenvolvemos formatos geométricos, curvas, recortes de pilares e caixas de embutir em pisos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-green-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mb-5">
                📦
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Mostruário Físico & Condições B2B</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receba o mostruário de amostras reais no seu escritório para apresentar aos clientes com segurança, além de tabela diferenciada direto da fábrica.
              </p>
            </div>
          </div>
        </section>

        {/* Tipos de Aplicação */}
        <section className="py-16 px-4 md:px-8 bg-black/40 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-10 text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Aplicações Frequentes em Projetos de Arquitetura
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Halls de Condomínios',
                  desc: 'Tapetes de grande porte para portarias e recepções de edifícios residenciais e comerciais.',
                },
                {
                  title: 'Clínicas & Consultórios',
                  desc: 'Higiene hospitalar, fácil esterilização e visual premium com o nome do profissional.',
                },
                {
                  title: 'Lojas & Boutiques',
                  desc: 'Identidade visual marcante no acesso principal, compatível com tráfego intenso.',
                },
                {
                  title: 'Sedes Corporativas & Agro',
                  desc: 'Demarcações robustas e capachos com brasões para sedes de empresas e fazendas.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-bold text-green-400 text-base mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-10 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dúvidas Frequentes de Arquitetos e Designers
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <h3 className="font-bold text-white mb-2">Como solicitar o mostruário físico para meu escritório?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Basta clicar no botão de WhatsApp nesta página informando seu nome, cidade e endereço do escritório. Enviamos o kit completo de amostras e cores sem burocracia.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <h3 className="font-bold text-white mb-2">Vocês fornecem arquivo técnico / mockup 3D para aprovação do cliente?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sim! Antes de iniciar a produção, nossa equipe de engenharia gera uma prova digital em alta resolução com as medidas exatas e paleta de cores para inclusão na sua apresentação.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <h3 className="font-bold text-white mb-2">Qual a logística de entrega para cidades fora de Itumbiara?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Atendemos com entregas rápidas todo o estado de Goiás, Triângulo Mineiro (Uberlândia, Uberaba, Araguari), Brasília (DF), São Paulo e transportadoras expressas para todo o território nacional.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner Final */}
        <section className="py-16 px-4 md:px-8 text-center bg-gradient-to-t from-green-950/40 to-transparent border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Pronto para Especificar Capachos com Padrão de Excelência?
            </h2>
            <p className="text-slate-300 text-sm md:text-base mb-8">
              Fale agora com nosso time técnico e receba atendimento exclusivo para profissionais.
            </p>
            <ArchitectCTAButton
              text="Falar com Especialista de Fábrica via WhatsApp"
              source="architect_bottom_banner"
              message="Olá! Sou especificador(a) e gostaria de tirar dúvidas técnicas para um projeto."
              primary
            />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
