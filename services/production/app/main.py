"""Microservico de producao ENTRATTA — stateless.

/vectorize: logo raster/SVG -> regioes vetoriais + ACI sugerido
/preview:   design JSON -> PNG fotorrealista (o que o cliente aprova)
/generate:  design JSON -> ZIP com um .tap por cor (o que a maquina pinta)
Preview e G-code saem dos MESMOS poligonos (regions.py) — prévia == produção.
"""
import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import Response

from .gcode.spiral import all_chains_for_geom
from .gcode.writer import build_zip
from .geometry.regions import regions_by_aci_mm
from .preview.renderer import render_preview
from .schemas import DesignPayload
from .vectorize import vectorize_raster, vectorize_svg

app = FastAPI(title="entratta-production", version="0.1.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/preview")
def preview(payload: DesignPayload) -> Response:
    img = render_preview(payload)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")


@app.post("/generate")
def generate(payload: DesignPayload) -> Response:
    regions_mm = regions_by_aci_mm(payload)
    if not regions_mm:
        raise HTTPException(status_code=422, detail="Design sem regioes pintaveis")
    chains_by_aci = {aci: all_chains_for_geom(geom) for aci, geom in regions_mm.items()}
    zip_bytes = build_zip(payload.pedido_id, chains_by_aci)
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{payload.pedido_id}-producao.zip"'},
    )


@app.post("/vectorize")
async def vectorize(file: UploadFile = File(...)) -> dict:
    data = await file.read()
    if not data:
        raise HTTPException(status_code=422, detail="Arquivo vazio")
    filename = (file.filename or "").lower()
    is_svg = filename.endswith(".svg") or (file.content_type or "") == "image/svg+xml"
    try:
        result = vectorize_svg(data) if is_svg else vectorize_raster(data)
    except Exception as exc:  # imagem corrompida/formato nao suportado
        raise HTTPException(status_code=422, detail=f"Falha na vetorizacao: {exc}") from exc
    if not result["regioes"]:
        raise HTTPException(status_code=422, detail="Nenhuma regiao vetorizavel encontrada")
    return result
