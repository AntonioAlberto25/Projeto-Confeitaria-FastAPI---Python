from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Any
from datetime import date
from decimal import Decimal

class PedidoBase(BaseModel):
    cliente_nome: str
    cliente_tel: Optional[str] = None
    descricao: Optional[str] = None
    observacoes: Optional[str] = None
    tipo_entrega: Optional[str] = "Entrega"
    preco_total: Optional[Decimal] = Field(None, ge=0)
    data_entrega: Optional[date] = None
    receita_id: Optional[str] = None

    @field_validator('data_entrega', mode='before')
    @classmethod
    def empty_str_to_none(cls, v: Any) -> Any:
        if v == "":
            return None
        return v

    @field_validator('preco_total', mode='before')
    @classmethod
    def empty_price_to_none(cls, v: Any) -> Any:
        if v == "" or v is None:
            return None
        return v

class PedidoCreate(PedidoBase):
    status: Optional[str] = "pendente"

class PedidoResponse(PedidoBase):
    id: str
    user_id: str
    status: str = "pendente"

    model_config = ConfigDict(from_attributes=True)
