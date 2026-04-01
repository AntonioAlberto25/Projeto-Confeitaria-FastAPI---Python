from sqlalchemy.orm import Session
from src.domain.entity.user.user import User
from src.infrastructure.persistencia.userModel import UserModel
from typing import Optional, List

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def save(self, user: User) -> User:
        user_model = UserModel(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            created_at=user.created_at
        )
        self.db.add(user_model)
        self.db.commit()
        self.db.refresh(user_model)
        return user

    def find_by_id(self, user_id: str) -> Optional[User]:
        user_model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user_model:
            return None
        
        user = User()
        user.id = user_model.id
        user.email = user_model.email
        user.first_name = user_model.first_name
        user.last_name = user_model.last_name
        user.role = user_model.role
        # user.created_at is handled in __init__ for now but we could map it if needed
        return user

    def find_all(self) -> List[User]:
        user_models = self.db.query(UserModel).all()
        users = []
        for model in user_models:
            user = User()
            user.id = model.id
            user.email = model.email
            user.first_name = model.first_name
            user.last_name = model.last_name
            user.role = model.role
            users.append(user)
        return users

    def delete(self, user_id: str) -> bool:
        user_model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if user_model:
            self.db.delete(user_model)
            self.db.commit()
            return True
        return False
