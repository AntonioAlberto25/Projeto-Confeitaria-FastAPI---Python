from sqlalchemy import Column, Integer, String, Text, Numeric, Date
from src.infrastructure.persistencia.database import Base

class PedidoModel(Base):
    """
    Modelo de persistência para a entidade Pedido.
    O campo user_id é o ID do Clerk (string).
    """
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cliente_nome = Column(String, nullable=False)
    descricao = Column(Text, nullable=True)
    tipo_entrega = Column(String, nullable=True)
    preco_total = Column(Numeric(10, 2), nullable=True)
    data_entrega = Column(Date, nullable=True)
    user_id = Column(String, nullable=False) # Clerk ID
    status = Column(String, nullable=True, default="Pendente")
