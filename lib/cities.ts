export interface City {
  slug: string
  name: string
  state: string
  region: string
  nearCities: string
  demanda: string
  diferencial: string
  lat: number
  lng: number
}

export const cities: City[] = [
  {
    slug: "itumbiara",
    name: "Itumbiara",
    state: "GO",
    region: "sul de Goiás",
    nearCities: "Araporã, Centralina e Morrinhos",
    demanda: "empresas, indústrias, condomínios e supermercados",
    diferencial: "Somos fabricantes locais em Itumbiara — prazo menor e sem frete de longa distância para a região.",
    lat: -18.4186,
    lng: -49.2155,
  },
  {
    slug: "arapora",
    name: "Araporã",
    state: "MG",
    region: "Triângulo Mineiro",
    nearCities: "Itumbiara e Centralina",
    demanda: "empresas e residências da região do Paranaíba",
    diferencial: "Entregamos em Araporã em até 1 dia útil a partir da nossa fábrica em Itumbiara.",
    lat: -18.4408,
    lng: -49.1669,
  },
  {
    slug: "morrinhos",
    name: "Morrinhos",
    state: "GO",
    region: "sul de Goiás",
    nearCities: "Caldas Novas e Goiatuba",
    demanda: "empresas, supermercados e condomínios",
    diferencial: "Atendemos Morrinhos com entrega rápida e orçamento personalizado via WhatsApp.",
    lat: -17.7333,
    lng: -49.1,
  },
  {
    slug: "goiatuba",
    name: "Goiatuba",
    state: "GO",
    region: "sul de Goiás",
    nearCities: "Morrinhos e Caldas Novas",
    demanda: "empresas do agronegócio, comércio local e condomínios",
    diferencial: "Capachos industriais para fazendas e empresas do agronegócio de Goiatuba.",
    lat: -18.0136,
    lng: -49.3613,
  },
  {
    slug: "centralina",
    name: "Centralina",
    state: "MG",
    region: "Triângulo Mineiro",
    nearCities: "Itumbiara e Araporã",
    demanda: "empresas e residências",
    diferencial: "Fabricante mais próximo de Centralina — entrega em 1 dia útil.",
    lat: -18.5836,
    lng: -49.1933,
  },
  {
    slug: "caldas-novas",
    name: "Caldas Novas",
    state: "GO",
    region: "sudeste de Goiás",
    nearCities: "Morrinhos e Rio Quente",
    demanda: "hotéis, pousadas, centros turísticos, SPAs e resorts",
    diferencial: "Capachos para hotelaria e turismo — identidade visual para entrada de hotéis e pousadas de Caldas Novas.",
    lat: -17.7394,
    lng: -48.6253,
  },
  {
    slug: "rio-verde",
    name: "Rio Verde",
    state: "GO",
    region: "sudoeste de Goiás",
    nearCities: "Jataí e Santa Helena",
    demanda: "empresas do agronegócio, cooperativas e comércio",
    diferencial: "Capachos personalizados para Rio Verde com entrega em 5 dias úteis.",
    lat: -17.8159,
    lng: -50.9192,
  },
  {
    slug: "goiania",
    name: "Goiânia",
    state: "GO",
    region: "centro de Goiás",
    nearCities: "Aparecida de Goiânia e Senador Canedo",
    demanda: "empresas, condomínios, clínicas, shopping centers e hospitais",
    diferencial: "Fabricante direto em Goiás — sem intermediários, entregamos em Goiânia com preço de fábrica.",
    lat: -16.6869,
    lng: -49.2648,
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug)
}

export function getAllCitySlugs(): string[] {
  return cities.map((city) => city.slug)
}
