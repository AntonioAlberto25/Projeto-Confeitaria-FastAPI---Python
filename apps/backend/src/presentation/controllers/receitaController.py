from fastapi import HTTPException, status
from src.application.usecases.receita.criarReceita import CriarReceita
from src.domain.entity.receita.receita import Receita
from src.presentation.schemas.receita_schema import ReceitaCreate, ReceitaResponse
from typing import Dict, Any

class ReceitaController:
    def __init__(self, criar_receita_use_case: CriarReceita):
        self.criar_receita_use_case = criar_receita_use_case

    def handle_criar_receita(self, data: ReceitaCreate, user_id: str) -> ReceitaResponse:
        """
        Lógica de controle para criação de receita usando DTOs Pydantic.
        Mapeia o DTO para a entidade de domínio e chama o use case.
        """
        try:
            # 1. Mapear DTO (Pydantic) para Entidade (Domínio)
            receita = Receita()
            receita.nome = data.nome
            receita.preco = data.preco
            receita.descricao = data.descricao
            receita.rendimento = data.rendimento
            receita.idUsuario = user_id
            
            # 2. Executar Lógica de Negócio (Use Case)
            resultado = self.criar_receita_use_case.criar_receita(receita)
            
            # 3. Retornar DTO de Resposta (Pydantic)
            return ReceitaResponse(
                id=1, # No mundo real viria do retorno do banco
                nome=resultado.nome,
                preco=resultado.preco,
                descricao=resultado.descricao,
                rendimento=resultado.rendimento,
                id_usuario=str(resultado.idUsuario)
            )
            
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro interno ao criar receita: {str(e)}"
            )
