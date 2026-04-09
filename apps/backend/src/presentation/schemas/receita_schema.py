from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Any

class ReceitaBase(BaseModel):
    nome: str = Field(..., min_length=1)
    preco_venda_sugerido: Optional[float] = Field(None, gt=0)
    descricao: Optional[str] = None
    rendimento: Optional[str] = None
    tempo_preparo: Optional[int] = None
    modo_preparo: Optional[str] = None

    @field_validator('preco_venda_sugerido', 'rendimento', 'tempo_preparo', mode='before')
    @classmethod
    def empty_str_to_none(cls, v: Any) -> Any:
        if v == "" or v is None:
            return None
        return v

class ReceitaCreate(ReceitaBase):
    pass 

class ReceitaResponse(ReceitaBase):
    id: str
    id_usuario: str

    model_config = ConfigDict(from_attributes=True)
