from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    """
    Modelo de persistência para a entidade User.
    O campo 'id' é a string do Clerk (ex: 'user_2abc...').
    Não armazena senha — autenticação é feita pelo Clerk.
    """
    __tablename__ = "usuarios"

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    role = Column(String, nullable=False, default="Confeiteiro")
    created_at = Column(DateTime, nullable=False, default=datetime.now)
