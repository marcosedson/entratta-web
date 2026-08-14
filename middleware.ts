import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Next.js 16 App Router: rotas na raiz de app/ que misturam texto fixo
// com [colchete] no mesmo segmento (ex: capacho-personalizado-[slug])
// redirecionam para "/" em vez de renderizar. O código real dessas
// páginas vive em app/rotas-internas/** (segmentos dinâmicos limpos, sem bug).
// Este middleware reescreve internamente sem alterar a URL pública —
// nenhuma URL indexada muda.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const combo = pathname.match(/^\/capacho-para-(.+)-em-(.+)$/)
  if (combo) {
    const url = request.nextUrl.clone()
    url.pathname = `/rotas-internas/combo/${combo[1]}/${combo[2]}`
    return NextResponse.rewrite(url)
  }

  const segmento = pathname.match(/^\/capacho-para-(.+)$/)
  if (segmento) {
    const url = request.nextUrl.clone()
    url.pathname = `/rotas-internas/segmento/${segmento[1]}`
    return NextResponse.rewrite(url)
  }

  const cidade = pathname.match(/^\/capacho-personalizado-(.+)$/)
  if (cidade) {
    const url = request.nextUrl.clone()
    url.pathname = `/rotas-internas/cidade/${cidade[1]}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
