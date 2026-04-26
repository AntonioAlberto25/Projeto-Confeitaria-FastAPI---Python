from sqlalchemy import Column, String, Text, Numeric, Date, DateTime
from sqlalchemy.sql import func
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
    endereco_entrega = Column(Text, nullable=True)
    preco_total = Column(Numeric(10, 2), nullable=True)
    data_entrega = Column(Date, nullable=True)
    usuario_id = Column(String, nullable=False) # Clerk ID
    receita_id = Column(String, nullable=True) # Optional link to recipe
    status = Column(String, nullable=True, default="pendente")
    quantidade = Column(Integer, nullable=True, default=1)
    
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    data_inicio_producao = Column(DateTime(timezone=True), nullable=True)
    data_conclusao = Column(DateTime(timezone=True), nullable=True)
