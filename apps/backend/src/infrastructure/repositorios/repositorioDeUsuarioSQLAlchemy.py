from typing import Optional
from sqlalchemy.orm import Session
from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from src.domain.entity.user.user import User
from src.infrastructure.persistencia.userModel import UserModel
from src.infrastructure.mappers.userMapper import UserMapper


class RepositorioDeUsuarioSQLAlchemy(RepositorioDeUsuario):
    def __init__(self, session: Session):
        self._session = session

    def registrar_usuario(self, user: User) -> User:
        user_model = UserMapper.to_model(user)
        
        self._session.add(user_model)
        self._session.commit()
        self._session.refresh(user_model)
        
        return UserMapper.to_domain(user_model)

    def buscar_por_id(self, id: int) -> Optional[User]:
        user_model = self._session.query(UserModel).filter(UserModel.id == id).first()
        if not user_model:
            return None
        return UserMapper.to_domain(user_model)
