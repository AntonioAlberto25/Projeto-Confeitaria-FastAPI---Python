from sqlalchemy import Column, String, Text, Numeric, Date
from src.infrastructure.persistencia.database import Base
import uuid

class PedidoModel(Base):
    __tablename__ = "pedidos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) # UUID string
    cliente_nome = Column(String, nullable=False)
    cliente_telefone = Column(String, nullable=True) # Matched with DB
    descricao = Column(Text, nullable=True)
    observacoes = Column(Text, nullable=True)
    tipo_entrega = Column(String, nullable=True)
    preco_total = Column(Numeric(10, 2), nullable=True)
    data_entrega = Column(Date, nullable=True)
    usuario_id = Column(String, nullable=False) # Clerk ID
    receita_id = Column(String, nullable=True) # Optional link to recipe
    status = Column(String, nullable=True, default="pendente")
