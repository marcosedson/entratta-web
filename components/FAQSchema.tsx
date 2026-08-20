export function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Por que comprar direto da Entratta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Somos fabricante direto — sem intermediários, sem revenda. Isso significa preço justo e contato direto com quem produz seu capacho. Envie mensagem no WhatsApp para receber seu orçamento personalizado.",
        },
      },
      {
        "@type": "Question",
        name: "Qual é o prazo de produção e entrega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A produção leva até 3 dias úteis após a confirmação do pedido. Entregamos via transportadora para todo o Brasil, com rastreamento. O prazo de entrega varia de 3 a 10 dias úteis após a produção, dependendo do seu CEP.",
        },
      },
      {
        "@type": "Question",
        name: "Posso enviar a logo da minha empresa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! Basta enviar sua logo pelo WhatsApp (PNG, JPG ou SVG em boa resolução). A arte é impressa em alta definição com sublimação 300 DPI — cores vivas e duradouras mesmo com uso intenso.",
        },
      },
      {
        "@type": "Question",
        name: "Quais materiais são utilizados nos capachos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Utilizamos vinil de alta resistência com base em borracha antiderrapante. A impressão é feita por sublimação digital, garantindo cores vivas e duradouras. O material é resistente à água, produtos de limpeza e tráfego intenso.",
        },
      },
      {
        "@type": "Question",
        name: "Existe pedido mínimo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não! Atendemos pedidos individuais, seja para a entrada de uma pequena empresa ou para uma rede com dezenas de unidades. O preço por unidade melhora em pedidos maiores — consulte via WhatsApp para orçamento em volume.",
        },
      },
      {
        "@type": "Question",
        name: "Como funciona o orçamento?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É simples: fale com a gente pelo WhatsApp, informe a medida desejada e envie sua logo ou ideia. Um especialista envia o orçamento em minutos. Sem compromisso — orçamento é gratuito!",
        },
      },
      {
        "@type": "Question",
        name: "Vocês vendem capacho por metro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! Além dos tamanhos prontos, cortamos sob medida — incluindo corredores e espaços maiores, medidos por metro linear. Envie a medida do seu espaço pelo WhatsApp e a gente calcula o orçamento certo pro tamanho que você precisa.",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  )
}
