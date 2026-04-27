from fastapi import APIRouter, Depends, status
from src.infrastructure.auth.clerk import get_current_user_id
from src.presentation.schemas.receita_schema import ReceitaCreate, ReceitaResponse, ReceitaPaginatedResponse
from src.presentation.controllers.receitaController import ReceitaController
from src.infrastructure.dependencies import get_receita_controller
from typing import Optional

router = APIRouter(prefix="/receitas", tags=["receitas"])

@router.post("", response_model=ReceitaResponse, status_code=status.HTTP_201_CREATED)
async def criar_receita(
    payload: ReceitaCreate, 
    user_id: str = Depends(get_current_user_id),
    controller: ReceitaController = Depends(get_receita_controller)
):
    """Cria uma nova receita para o usuário autenticado via Clerk."""
    return controller.handle_criar_receita(payload, user_id)

@router.get("", response_model=ReceitaPaginatedResponse)
async def listar_receitas(
    limit: int = 100,
    skip: int = 0,
    q: Optional[str] = None,
    user_id: str = Depends(get_current_user_id),
    controller: ReceitaController = Depends(get_receita_controller)
):
    """Lista todas as receitas do usuário autenticado de forma paginada."""
    return controller.handle_listar_receitas(user_id, limit, skip, q)

@router.get("/{id}", response_model=ReceitaResponse)
async def buscar_por_id(
    id: str,
    controller: ReceitaController = Depends(get_receita_controller)
):
    """Busca os detalhes de uma receita por ID."""
    return controller.handle_buscar_por_id(id)

@router.put("/{id}", response_model=ReceitaResponse)
async def editar_receita(
    id: str,
    payload: ReceitaCreate,
    user_id: str = Depends(get_current_user_id),
    controller: ReceitaController = Depends(get_receita_controller)
):
    """Edita uma receita existente do usuário autenticado."""
    return controller.handle_editar_receita(id, payload, user_id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir_receita(
    id: str,
    controller: ReceitaController = Depends(get_receita_controller)
):
    """Exclui uma receita pelo seu identificador."""
    controller.handle_excluir_receita(id)
    return None
