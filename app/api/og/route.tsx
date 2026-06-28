import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "Entratta"
  const state = searchParams.get("state") || "GO"

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #15803D 0%, #0A1628 100%)",
          padding: "60px",
          justifyContent: "space-between",
          color: "white",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <div>
          <div style={{ fontSize: "72px", fontWeight: "bold", marginBottom: "20px" }}>
            Capacho Personalizado em {city}
          </div>
          <div style={{ fontSize: "36px", color: "#22C55E", marginBottom: "20px" }}>
            {state} • ENTRATTA Fabricante
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
              ✓ Fabricante Direto
            </div>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
              ✓ Entrega em 3 dias úteis
            </div>
            <div style={{ fontSize: "28px" }}>
              ✓ Orçamento Grátis
            </div>
          </div>

          <div style={{ fontSize: "18px", opacity: "0.8" }}>
            entratta.com.br
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
