from fastapi import HTTPException, status
from src.application.usecases.receita.criarReceita import CriarReceita
# Import other use cases
from src.application.usecases.receita.editarReceita import EditarReceita
from src.application.usecases.receita.excluirReceita import ExcluirReceita
from src.application.usecases.receita.listarReceitas import ListarReceitas
from src.application.usecases.receita.buscarReceitaPorId import BuscarReceitaPorId
from src.application.usecases.receita.buscarReceitaPorNome import BuscarReceitaPorNome

from src.domain.entity.receita.receita import Receita
from src.presentation.schemas.receita_schema import ReceitaCreate, ReceitaResponse
from typing import Dict, List

class ReceitaController:
    def __init__(
        self, 
        criar_receita_use_case: CriarReceita,
        editar_receita_use_case: EditarReceita,
        excluir_receita_use_case: ExcluirReceita,
        listar_receitas_use_case: ListarReceitas,
        buscar_receita_por_id_use_case: BuscarReceitaPorId,
        buscar_receita_por_nome_use_case: BuscarReceitaPorNome
    ):
        self.criar_receita_use_case = criar_receita_use_case
        self.editar_receita_use_case = editar_receita_use_case
        self.excluir_receita_use_case = excluir_receita_use_case
        self.listar_receitas_use_case = listar_receitas_use_case
        self.buscar_receita_por_id_use_case = buscar_receita_por_id_use_case
        self.buscar_receita_por_nome_use_case = buscar_receita_por_nome_use_case

    def handle_criar_receita(self, data: ReceitaCreate, user_id: str) -> ReceitaResponse:
        try:
            receita = Receita()
            receita.nome = data.nome
            receita.preco_venda_sugerido = data.preco_venda_sugerido
            receita.descricao = data.descricao
            receita.rendimento = data.rendimento
            receita.tempo_preparo = data.tempo_preparo
            receita.modo_preparo = data.modo_preparo
            receita.ingredientes = data.ingredientes
            receita.idUsuario = user_id
            
            resultado = self.criar_receita_use_case.executar(receita)
            
            return ReceitaResponse(
                id=str(resultado.id),
                nome=resultado.nome,
                preco_venda_sugerido=resultado.preco_venda_sugerido,
                descricao=resultado.descricao,
                rendimento=resultado.rendimento,
                tempo_preparo=resultado.tempo_preparo,
                modo_preparo=resultado.modo_preparo,
                ingredientes=resultado.ingredientes,
                id_usuario=str(resultado.idUsuario)
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao criar receita: {str(e)}")

    def handle_listar_receitas(self, user_id: str) -> List[ReceitaResponse]:
        try:
            resultado = self.listar_receitas_use_case.executar(user_id)
            return [
                ReceitaResponse(
                    id=str(r.id),
                    nome=r.nome,
                    preco_venda_sugerido=r.preco_venda_sugerido,
                    descricao=r.descricao,
                    rendimento=r.rendimento,
                    tempo_preparo=r.tempo_preparo,
                    modo_preparo=r.modo_preparo,
                    ingredientes=r.ingredientes,
                    id_usuario=str(r.idUsuario)
                ) for r in resultado
            ]
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_buscar_por_id(self, id: str) -> ReceitaResponse:
        try:
            resultado = self.buscar_receita_por_id_use_case.executar(id)
            if not resultado:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receita não encontrada")
            return ReceitaResponse(
                id=str(resultado.id),
                nome=resultado.nome,
                preco_venda_sugerido=resultado.preco_venda_sugerido,
                descricao=resultado.descricao,
                rendimento=resultado.rendimento,
                tempo_preparo=resultado.tempo_preparo,
                modo_preparo=resultado.modo_preparo,
                ingredientes=resultado.ingredientes,
                id_usuario=str(resultado.idUsuario)
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_excluir_receita(self, id: str) -> Dict[str, str]:
        try:
            # First fetch to ensure it exists and belongs to the user (simplifying check here)
            receita = self.buscar_receita_por_id_use_case.executar(id)
            if not receita:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receita não encontrada")
            
            self.excluir_receita_use_case.executar(receita)
            return {"message": "Receita excluída com sucesso"}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
