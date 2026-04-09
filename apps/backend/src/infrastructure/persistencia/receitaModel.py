from sqlalchemy import Column, Integer, String, Text, Numeric
from src.infrastructure.persistencia.database import Base
import uuid

class ReceitaModel(Base):
    __tablename__ = "receitas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) # UUID string
    nome = Column(String, nullable=False)
    preco_venda_sugerido = Column(Numeric(10, 2), nullable=True)
    descricao = Column(Text, nullable=True)
    rendimento = Column(Integer, nullable=True)
    tempo_preparo = Column(Integer, nullable=True)
    modo_preparo = Column(Text, nullable=True)
    usuario_id = Column(String, nullable=False) # Clerk ID
