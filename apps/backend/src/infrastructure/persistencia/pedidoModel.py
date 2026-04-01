from sqlalchemy import Column, Integer, String, Text, Numeric, Date
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PedidoModel(Base):
    """
    Modelo de persistência para a entidade Pedido.
    Mapeia a tabela 'pedidos' no PostgreSQL (Supabase).
    O campo user_id é o ID do Clerk (string).
    """
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cliente_nome = Column(String, nullable=False)
    descricao = Column(Text, nullable=True)
    tipo_entrega = Column(String, nullable=True)
    preco_total = Column(Numeric(10, 2), nullable=True)
    data_entrega = Column(Date, nullable=True)
    user_id = Column(Integer, nullable=False)
    status = Column(String, nullable=True, default="Pendente")
