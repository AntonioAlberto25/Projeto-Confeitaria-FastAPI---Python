from sqlalchemy.orm import Session
from src.domain.entity.user.user import User
from src.infrastructure.persistencia.userModel import UserModel
from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from typing import Optional

class UserRepository(RepositorioDeUsuario):
    def __init__(self, db: Session):
        self.db = db

    def registrar_usuario(self, user: User) -> User:
        user_model = self.db.query(UserModel).filter(UserModel.id == user.id).first()
        
        if not user_model:
            user_model = UserModel(
                id=user.id,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                role=user.role
            )
            self.db.add(user_model)
        else:
            user_model.email = user.email
            user_model.first_name = user.first_name
            user_model.last_name = user.last_name
            # role could also be updated if needed
            
        self.db.commit()
        self.db.refresh(user_model)
        return user

    def buscar_por_id(self, id: str) -> Optional[User]:
        user_model = self.db.query(UserModel).filter(UserModel.id == id).first()
        if not user_model:
            return None
        
        user = User()
        user.id = user_model.id
        user.email = user_model.email
        user.first_name = user_model.first_name
        user.last_name = user_model.last_name
        user.role = user_model.role
        return user
