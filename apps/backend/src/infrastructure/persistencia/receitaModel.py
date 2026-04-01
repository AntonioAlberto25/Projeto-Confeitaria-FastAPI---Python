from sqlalchemy import Column, Integer, String, Text, Numeric
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class ReceitaModel(Base):
    """
    Modelo de persistência para a entidade Receita.
    Mapeia a tabela 'receitas' no PostgreSQL (Supabase).
    O campo id_usuario é o ID do Clerk (string).
    """
    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    preco = Column(Numeric(10, 2), nullable=True)
    descricao = Column(Text, nullable=True)
    rendimento = Column(Integer, nullable=True)
    id_usuario = Column(String, nullable=False)
