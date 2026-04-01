from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal

class PedidoBase(BaseModel):
    cliente_nome: str
    descricao: Optional[str] = None
    tipo_entrega: Optional[str] = "Entrega"
    preco_total: Optional[Decimal] = Field(None, ge=0)
    data_entrega: Optional[date] = None

class PedidoCreate(PedidoBase):
    pass # user_id will be added from the token

class PedidoResponse(PedidoBase):
    id: int
    user_id: str
    status: str = "Pendente"

    class Config:
        from_attributes = True
