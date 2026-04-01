from fastapi import APIRouter, Depends, status
from src.infrastructure.auth.clerk import get_current_user_id
from src.presentation.schemas.receita_schema import ReceitaCreate, ReceitaResponse
from src.presentation.controllers.receitaController import ReceitaController

# Para este exemplo em código, abstraímos a injeção do controller
# Em um projeto real, você usaria o depende() para injetar o DB, Repo e UseCase

router = APIRouter(prefix="/receitas", tags=["receitas"])

@router.post("/", response_model=ReceitaResponse, status_code=status.HTTP_201_CREATED)
async def criar_receita(
    payload: ReceitaCreate, 
    user_id: str = Depends(get_current_user_id)
):
    """
    Cria uma nova receita para o usuário autenticado via Clerk.
    O FastAPI validará automaticamente o payload contra o ReceitaCreate.
    """
    # Exemplo de como chamaria o controller (lógica delegada)
    # return controller.handle_criar_receita(payload, user_id)
    
    return {
        "id": 1,
        "nome": payload.nome,
        "preco": payload.preco,
        "descricao": payload.descricao,
        "rendimento": payload.rendimento,
        "id_usuario": user_id
    }
