from fastapi import HTTPException, status
from src.application.usecases.receita.criarReceita import CriarReceita
from src.domain.entity.receita.receita import Receita
from typing import Dict, Any

class ReceitaController:
    def __init__(self, criar_receita_use_case: CriarReceita):
        self.criar_receita_use_case = criar_receita_use_case

    def handle_criar_receita(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Lógica de controle para criação de receita.
        Mapeia o payload para a entidade de domínio e chama o use case.
        """
        try:
            receita = Receita()
            receita.nome = data.get("nome")
            receita.preco = data.get("preco")
            receita.descricao = data.get("descricao")
            receita.rendimento = data.get("rendimento")
            receita.idUsuario = user_id
            
            # Executa use case
            resultado = self.criar_receita_use_case.criar_receita(receita)
            
            return {
                "mensagem": "Receita criada com sucesso!",
                "data": {
                    "nome": resultado.nome,
                    "idUsuario": resultado.idUsuario
                }
            }
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_VALUE,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro interno ao criar receita: {str(e)}"
            )
