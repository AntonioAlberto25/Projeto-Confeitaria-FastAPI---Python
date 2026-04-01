from pydantic import BaseModel, Field
from typing import Optional

class ReceitaBase(BaseModel):
    nome: str = Field(..., min_length=1)
    preco: Optional[float] = Field(None, gt=0)
    descricao: Optional[str] = None
    rendimento: Optional[int] = Field(None, gt=0)

class ReceitaCreate(ReceitaBase):
    pass # id_usuario will be injected from the auth token in the router

class ReceitaResponse(ReceitaBase):
    id: int
    id_usuario: str

    class Config:
        from_attributes = True
