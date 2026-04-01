from fastapi import APIRouter, Depends, status
from src.infrastructure.auth.clerk import get_current_user_id
from src.presentation.schemas.user_schema import UserCreate, UserResponse
from src.presentation.controllers.userController import UserController
from src.infrastructure.dependencies import get_user_controller

router = APIRouter(prefix="/perfil", tags=["perfil"])

@router.post("/sincronizar", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def sincronizar_perfil(
    payload: UserCreate, 
    controller: UserController = Depends(get_user_controller)
):
    """Sincroniza os dados vindo do Clerk (webhook ou client call) com o banco local."""
    return controller.registrar_novo_usuario_clerk(payload)

@router.get("/me", response_model=UserResponse)
async def ver_meu_perfil(
    user_id: str = Depends(get_current_user_id),
    controller: UserController = Depends(get_user_controller)
):
    """Busca o perfil completo do usuário autenticado logado no momento."""
    return controller.buscar_por_id(user_id)
