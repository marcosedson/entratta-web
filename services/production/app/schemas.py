"""Contrato JSON dos endpoints /preview e /generate (espelho dos schemas Zod do Next.js)."""
from pydantic import BaseModel, Field, field_validator

from .palette import VALID_ACI

# Limite generoso da mesa; ajustar quando a producao confirmar o curso real da CNC.
MAX_MESA_MM = {"largura": 2000, "altura": 3000}


class TamanhoMm(BaseModel):
    largura: float = Field(gt=0, le=MAX_MESA_MM["largura"])
    altura: float = Field(gt=0, le=MAX_MESA_MM["altura"])


class ViewboxPx(BaseModel):
    w: float = Field(gt=0)
    h: float = Field(gt=0)


class Fundo(BaseModel):
    cor_id: str = "cinza"


class Borda(BaseModel):
    estilo: str = Field(pattern="^(sem|fina|dupla)$")
    aci: int = 9

    @field_validator("aci")
    @classmethod
    def aci_valido(cls, v: int) -> int:
        if v not in VALID_ACI:
            raise ValueError(f"ACI {v} fora da paleta {sorted(VALID_ACI)}")
        return v


class TextoDesign(BaseModel):
    texto: str = Field(min_length=1, max_length=120)
    fonte_id: str
    aci: int
    x: float
    y: float
    tamanho_px: float = Field(gt=0)

    @field_validator("aci")
    @classmethod
    def aci_valido(cls, v: int) -> int:
        if v not in VALID_ACI:
            raise ValueError(f"ACI {v} fora da paleta {sorted(VALID_ACI)}")
        return v


class PoligonoRegiao(BaseModel):
    externo: list[tuple[float, float]] = Field(min_length=3)
    furos: list[list[tuple[float, float]]] = []


class RegiaoLogo(BaseModel):
    aci: int
    poligonos: list[PoligonoRegiao]

    @field_validator("aci")
    @classmethod
    def aci_valido(cls, v: int) -> int:
        if v not in VALID_ACI:
            raise ValueError(f"ACI {v} fora da paleta {sorted(VALID_ACI)}")
        return v


class LogoDesign(BaseModel):
    x: float
    y: float
    scale: float = Field(gt=0, default=1.0)
    rotacao: float = 0.0
    # bounding box original do vetor no espaco proprio do logo (para centrar transformacoes)
    largura_px: float = Field(gt=0)
    altura_px: float = Field(gt=0)
    regioes: list[RegiaoLogo]


class DesignPayload(BaseModel):
    pedido_id: str = "SEM-ID"
    tamanho_mm: TamanhoMm
    viewbox_px: ViewboxPx
    fundo: Fundo = Fundo()
    borda: Borda = Borda(estilo="sem")
    textos: list[TextoDesign] = []
    logos: list[LogoDesign] = []
