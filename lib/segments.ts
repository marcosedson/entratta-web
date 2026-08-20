export interface Segment {
  slug: string
  name: string
  title: string
  description: string
  useCases: string[]
  benefits: string[]
  diferencial: string
}

// Inline segments data — guaranteed to be bundled
export const SEGMENTS_DATA: Segment[] = [
  {
    slug: "empresa",
    name: "Empresa",
    title: "Capacho Personalizado para Empresa",
    description: "Crie uma primeira impressão profissional com capachos personalizados que reforçam a identidade da sua marca desde a entrada.",
    useCases: [
      "Escritórios comerciais",
      "Sedes administrativas",
      "Centros de negócios",
      "Salas de espera",
    ],
    benefits: [
      "Reforça identidade corporativa",
      "Melhora percepção de profissionalismo",
      "Impacto na primeira impressão do cliente",
      "Durável e fácil de limpar",
    ],
    diferencial: "Empresas confiam na ENTRATTA para criar uma entrada que comunica seriedade e qualidade.",
  },
  {
    slug: "condominio",
    name: "Condomínio",
    title: "Capacho Personalizado para Condomínio",
    description: "Valorize a entrada do condomínio com capachos que elevam o padrão arquitetônico e protegem os pisos internos.",
    useCases: [
      "Lobby de condomínios",
      "Entradas de torres",
      "Áreas comuns",
      "Portarias",
    ],
    benefits: [
      "Reduz sujeira nos corredores",
      "Integra-se ao design arquitetônico",
      "Sinalização clara para visitantes",
      "Antiderrapante e seguro",
    ],
    diferencial: "Condomínios de alto padrão usam capachos ENTRATTA para marcar diferença nas áreas comuns.",
  },
  {
    slug: "industria",
    name: "Indústria",
    title: "Demarcação e Capacho Industrial",
    description: "Capachos industriais duráveis com demarcações de segurança, apropriados para ambientes de alto tráfego e uso intenso.",
    useCases: [
      "Linhas de produção",
      "Áreas de almoxarifado",
      "Entradas de fábrica",
      "Salas de máquinas",
    ],
    benefits: [
      "Vinil reforçado 6mm de espessura",
      "Resistente a produtos químicos",
      "Demarcações de segurança integradas",
      "Reduz fadiga dos colaboradores",
    ],
    diferencial: "Indústrias aprovam nossos capachos por durabilidade em ambientes de alto estresse.",
  },
  {
    slug: "supermercado",
    name: "Supermercado",
    title: "Capacho Comercial para Varejo",
    description: "Capachos que aumentam o fluxo de frequência e criam um ambiente acolhedor na entrada do seu estabelecimento.",
    useCases: [
      "Entradas de lojas",
      "Áreas de circulação",
      "Check-out",
      "Seções de atendimento",
    ],
    benefits: [
      "Comunica marca e promoções",
      "Melhora limpeza do piso",
      "Impacto visual na entrada",
      "Fácil customização sazonal",
    ],
    diferencial: "Varejistas aumentam conversão com capachos que reforçam a identidade da loja.",
  },
  {
    slug: "clinica",
    name: "Clínica",
    title: "Capacho Personalizado para Clínica",
    description: "Capachos higiênicos e profissionais que transmitem confiança e qualidade em ambientes de saúde.",
    useCases: [
      "Entradas de clínicas",
      "Recepção de consultórios",
      "Salas de espera",
      "Áreas de atendimento",
    ],
    benefits: [
      "Fácil limpeza e higiene",
      "Reduz contaminação de pisos",
      "Reforça profissionalismo",
      "Conforto visual para pacientes",
    ],
    diferencial: "Clínicas e consultórios escolhem ENTRATTA pela higiene e profissionalismo garantidos.",
  },
  {
    slug: "hotel",
    name: "Hotel",
    title: "Capacho Luxo para Hotelaria",
    description: "Capachos premium que elevam a experiência do hóspede e reforçam o conceito de luxo desde o primeiro passo.",
    useCases: [
      "Entradas de hotéis",
      "Lobbies",
      "Salas de eventos",
      "Acessos de suítes",
    ],
    benefits: [
      "Design sofisticado",
      "Branding diferenciado",
      "Sensação premium ao toque",
      "Reduz sujeira nas áreas internas",
    ],
    diferencial: "Hotéis e resorts escolhem ENTRATTA para criar uma experiência memorável na entrada.",
  },
  {
    slug: "demarcacao-piso-industrial",
    name: "Demarcação Piso",
    title: "Demarcação de Piso Industrial",
    description: "Sinalização visual e proteção de piso para ambientes industriais, com demarcações de segurança em vinil durável.",
    useCases: [
      "Identificação de zonas",
      "Demarcações de segurança",
      "Sinalização de trânsito",
      "Proteção de pisos especiais",
    ],
    benefits: [
      "Vinil antiderrapante",
      "Alta visibilidade",
      "Conforme normas ABNT",
      "Durabilidade garantida",
    ],
    diferencial: "Indústrias confiam em demarcações ENTRATTA para segurança e conformidade regulatória.",
  },
  {
    slug: "residencial",
    name: "Residencial",
    title: "Capacho Personalizado para Casa",
    description: "Dê personalidade à entrada da sua casa com capachos que combinam com o seu estilo — do clássico \"bem-vindo\" ao nome da família.",
    useCases: [
      "Portas de apartamento",
      "Entrada de casa",
      "Presente de casa nova",
      "Varanda e área externa",
    ],
    benefits: [
      "Design exclusivo para sua casa",
      "Resistente à chuva e ao sol",
      "Fácil de limpar",
      "Base antiderrapante",
    ],
    diferencial: "Famílias escolhem ENTRATTA para transformar a entrada de casa em algo só delas.",
  },
  {
    slug: "churrasco",
    name: "Churrasco",
    title: "Capacho Personalizado para Área de Churrasco",
    description: "Capacho com humor e personalidade para área gourmet, churrasqueira ou varanda — presente certeiro para quem ama receber.",
    useCases: [
      "Área gourmet",
      "Churrasqueira",
      "Varanda e quintal",
      "Presente para o churrasqueiro da casa",
    ],
    benefits: [
      "Frases divertidas e exclusivas",
      "Resistente a gordura e respingos",
      "Base antiderrapante",
      "Presente que sempre agrada",
    ],
    diferencial: "O presente perfeito para quem manda no churrasco — personalizado do jeito que só a ENTRATTA faz.",
  },
  {
    slug: "nautico",
    name: "Náutico",
    title: "Capacho Personalizado para Barcos e Lanchas",
    description: "Tapete de vinil sob medida para o convés da sua embarcação — antiderrapante, resistente à água e com o nome do barco personalizado.",
    useCases: [
      "Convés de lancha",
      "Canoas e caiaques",
      "Plataforma de popa",
      "Marinas e ancoradouros",
    ],
    benefits: [
      "Nome da embarcação personalizado",
      "Antiderrapante mesmo molhado",
      "Resistente à água e ao sol",
      "Sob medida para o casco",
    ],
    diferencial: "Proprietários de embarcação escolhem ENTRATTA para dar identidade ao convés com segurança.",
  },
  {
    slug: "motorista-aplicativo",
    name: "Motorista de Aplicativo",
    title: "Tapete Personalizado para Carro de Aplicativo",
    description: "Tapete de vinil sob medida para o carro que protege o forro original e passa profissionalismo para o passageiro do Uber, 99 ou InDriver.",
    useCases: [
      "Carro de aplicativo",
      "Táxi",
      "Frota de transporte executivo",
      "Presente para motorista",
    ],
    benefits: [
      "Protege o forro original do carro",
      "Fácil de limpar entre corridas",
      "Base antiderrapante",
      "Sob medida para o modelo do veículo",
    ],
    diferencial: "Motoristas de aplicativo escolhem ENTRATTA para manter o carro limpo e com cara de profissional.",
  },
  {
    slug: "futebol",
    name: "Time de Futebol",
    title: "Capacho Personalizado Time de Futebol",
    description: "Capacho com escudo e cores do seu time do coração — o jeito certo de receber a torcida na porta de casa ou no bar do jogo.",
    useCases: [
      "Entrada de casa do torcedor",
      "Bar e área de jogo",
      "Presente para torcedor",
      "Área de churrasco e lazer",
    ],
    benefits: [
      "Escudo e cores do seu time",
      "Vinil resistente ao uso diário",
      "Presente certeiro pra torcedor",
      "Base antiderrapante",
    ],
    diferencial: "Torcedores escolhem ENTRATTA para levar a paixão pelo time até a porta de casa.",
  },
  {
    slug: "escola-infantil",
    name: "Escola Infantil",
    title: "Tapete Personalizado para Escola Infantil",
    description: "Tapete de vinil com desenhos lúdicos — amarelinha, alfabeto, mapa-múndi, estrada — que transforma o chão da sala em espaço de aprendizado.",
    useCases: [
      "Salas de aula infantil",
      "Brinquedoteca",
      "Berçário",
      "Área de recreação",
    ],
    benefits: [
      "Desenhos lúdicos e educativos sob medida",
      "Vinil lavável, resistente ao uso diário",
      "Seguro e antiderrapante para os pequenos",
      "Estimula aprendizado através da brincadeira",
    ],
    diferencial: "Escolas infantis escolhem ENTRATTA para transformar o chão da sala em espaço de aprendizado.",
  },
]

export function getSegmentBySlug(slug: string): Segment | undefined {
  return SEGMENTS_DATA.find((segment) => segment.slug === slug)
}

export function getAllSegmentSlugs(): string[] {
  return SEGMENTS_DATA.map((segment) => segment.slug)
}

export function getSegmentUrl(slug: string): string {
  return `/capacho-para-${slug}`
}
