from pydantic import BaseModel
from typing import Optional

class InsumoBase(BaseModel):
    nome: str
    categoria: Optional[str] = None
    quantidade_atual: float = 0.0
    estoque_minimo: float = 0.0
    unidade_medida: Optional[str] = None

class InsumoCreate(InsumoBase):
    pass

class Insumo(InsumoBase):
    id: str
    id_usuario: str

    class Config:
        from_attributes = True
