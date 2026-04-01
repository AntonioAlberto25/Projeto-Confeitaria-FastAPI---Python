from src.application.usecases.user.registrarUsuario import RegistrarUsuario
from src.application.usecases.user.buscarUsuarioPorId import BuscarUsuarioPorId
from src.domain.entity.user.user import User
from src.presentation.schemas.user_schema import UserCreate, UserResponse
from fastapi import HTTPException, status

class UserController:
    def __init__(
        self, 
        registrar_usuario_use_case: RegistrarUsuario,
        buscar_usuario_por_id_use_case: BuscarUsuarioPorId
    ):
        self.registrar_usuario_use_case = registrar_usuario_use_case
        self.buscar_usuario_por_id_use_case = buscar_usuario_por_id_use_case

    def registrar_novo_usuario_clerk(self, data: UserCreate) -> UserResponse:
        """
        Registra localmente um usuário vindo do Clerk seguindo o padrão de Use Case e DTOs.
        """
        try:
            # Mapeamento DTO -> Domínio
            user = User()
            user.id = data.id
            user.email = str(data.email)
            user.first_name = data.first_name
            user.last_name = data.last_name
            user.role = data.role
            
            resultado = self.registrar_usuario_use_case.executar(user)
            
            # Mapeamento Domínio -> DTO de Resposta
            return UserResponse(
                id=resultado.id,
                email=resultado.email,
                first_name=resultado.first_name,
                last_name=resultado.last_name,
                role=resultado.role,
                created_at=resultado.created_at
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao registrar usuário: {str(e)}"
            )

    def buscar_por_id(self, user_id: str) -> UserResponse:
        try:
            resultado = self.buscar_usuario_por_id_use_case.executar(user_id)
            if not resultado:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
            
            return UserResponse(
                id=resultado.id,
                email=resultado.email,
                first_name=resultado.first_name,
                last_name=resultado.last_name,
                role=resultado.role,
                created_at=resultado.created_at
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao buscar usuário: {str(e)}"
            )
