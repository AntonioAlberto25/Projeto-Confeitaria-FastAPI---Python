from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from src.domain.entity.user.user import User
from src.presentation.schemas.user_schema import UserCreate, UserResponse

class UserController:
    def __init__(self, repository: RepositorioDeUsuario):
        self.repository = repository

    def registrar_novo_usuario_clerk(self, data: UserCreate) -> UserResponse:
        """
        Registra localmente um usuário vindo do Clerk seguindo o padrão de DTOs.
        """
        # Mapeamento DTO -> Domínio
        user = User()
        user.id = data.id
        user.email = str(data.email) # EmailStr para string
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.role = data.role
        
        resultado = self.repository.registrar_usuario(user)
        
        # Mapeamento Domínio -> DTO de Resposta
        return UserResponse(
            id=resultado.id,
            email=resultado.email,
            first_name=resultado.first_name,
            last_name=resultado.last_name,
            role=resultado.role,
            created_at=resultado.created_at
        )
