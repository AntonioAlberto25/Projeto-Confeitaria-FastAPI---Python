from src.domain.entity.user.user import User
from src.infrastructure.persistencia.userModel import UserModel


class UserMapper:

    @staticmethod
    def to_domain(model: UserModel) -> User:
        """
        Converte um objeto do ORM (UserModel) para a Entidade de Domínio (User).
        """
        user = User()
        user.id = model.id
        user.email = model.email
        user.first_name = model.first_name
        user.last_name = model.last_name
        user.role = model.role
        # Nota: entity tem property created_at mas o setter não está exposto (é gerado no __init__). 
        # Dependendo da implementação, pode ser necessário setar private variable.
        user._User__created_at = model.created_at # Hack para popular campos ocultos read-only do DB se preciso.
        
        return user

    @staticmethod
    def to_model(entity: User) -> UserModel:
        """
        Converte uma Entidade de Domínio (User) para um objeto do ORM (UserModel).
        """
        return UserModel(
            id=entity.id,
            email=entity.email,
            first_name=entity.first_name,
            last_name=entity.last_name,
            role=entity.role,
            created_at=entity.created_at
        )
