from fastapi import APIRouter, Depends, status
from src.infrastructure.auth.clerk import get_current_user_id
from src.presentation.schemas.pedido_schema import PedidoCreate, PedidoResponse
from src.presentation.controllers.pedidoController import PedidoController
from src.infrastructure.dependencies import get_pedido_controller
from typing import List

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

@router.post("/", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
async def criar_pedido(
    payload: PedidoCreate,
    user_id: str = Depends(get_current_user_id),
    controller: PedidoController = Depends(get_pedido_controller)
):
    """Cria um novo pedido para o usuário logado."""
    return controller.handle_criar_pedido(payload, user_id)

@router.get("/", response_model=List[PedidoResponse])
async def listar_meus_pedidos(
    user_id: str = Depends(get_current_user_id),
    controller: PedidoController = Depends(get_pedido_controller)
):
    """Retorna a lista de todos os pedidos do usuário autenticado."""
    return controller.handle_listar_meus_pedidos(user_id)

@router.get("/{id}", response_model=PedidoResponse)
async def buscar_por_id(
    id: str,
    controller: PedidoController = Depends(get_pedido_controller)
):
    """Recupera os detalhes de um pedido específico por seu ID."""
    return controller.handle_buscar_pedido_por_id(id)

@router.put("/{id}", response_model=PedidoResponse)
async def editar_pedido(
    id: str,
    payload: PedidoCreate,
    user_id: str = Depends(get_current_user_id),
    controller: PedidoController = Depends(get_pedido_controller)
):
    """Edita um pedido existente."""
    return controller.handle_editar_pedido(id, payload, user_id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir_pedido(
    id: str,
    controller: PedidoController = Depends(get_pedido_controller)
):
    """Remove um pedido do sistema pelo identificador."""
    controller.handle_excluir_pedido(id)
    return None
