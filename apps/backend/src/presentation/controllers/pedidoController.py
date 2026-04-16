from fastapi import HTTPException, status
from src.application.usecases.pedido.criarPedido import CriarPedido
from src.application.usecases.pedido.editarPedido import EditarPedido
from src.application.usecases.pedido.excluirPedido import ExcluirPedido
from src.application.usecases.pedido.listarPedidos import ListarPedidos
from src.application.usecases.pedido.buscarPedidoPorId import BuscarPedidoPorId
from src.application.usecases.pedido.buscarPedidoPorNomeCliente import BuscarPedidoPorNomeCliente

from src.domain.entity.pedido.pedido import Pedido
from src.presentation.schemas.pedido_schema import PedidoCreate, PedidoResponse
from typing import List, Dict

class PedidoController:
    def __init__(
        self, 
        criar_pedido_use_case: CriarPedido,
        editar_pedido_use_case: EditarPedido,
        excluir_pedido_use_case: ExcluirPedido,
        listar_pedidos_use_case: ListarPedidos,
        buscar_pedido_por_id_use_case: BuscarPedidoPorId,
        buscar_pedido_por_nome_cliente_use_case: BuscarPedidoPorNomeCliente
    ):
        self.criar_pedido_use_case = criar_pedido_use_case
        self.editar_pedido_use_case = editar_pedido_use_case
        self.excluir_pedido_use_case = excluir_pedido_use_case
        self.listar_pedidos_use_case = listar_pedidos_use_case
        self.buscar_pedido_por_id_use_case = buscar_pedido_por_id_use_case
        self.buscar_pedido_por_nome_cliente_use_case = buscar_pedido_por_nome_cliente_use_case

    def handle_criar_pedido(self, data: PedidoCreate, user_id: str) -> PedidoResponse:
        try:
            pedido = Pedido()
            pedido.cliente_nome = data.cliente_nome
            pedido.cliente_tel = data.cliente_tel
            pedido.descricao = data.descricao
            pedido.tipo_entrega = data.tipo_entrega
            pedido.endereco_entrega = data.endereco_entrega
            pedido.data_entrega = data.data_entrega
            pedido.preco_total = data.preco_total
            pedido.observacoes = data.observacoes
            pedido.user_id = user_id
            pedido.receita_id = data.receita_id
            pedido.status = data.status or "pendente"
            pedido.data_inicio_producao = data.data_inicio_producao
            pedido.data_conclusao = data.data_conclusao
            
            resultado = self.criar_pedido_use_case.executar(pedido)
            
            return PedidoResponse(
                id=str(resultado.id),
                cliente_nome=resultado.cliente_nome,
                cliente_tel=resultado.cliente_tel,
                descricao=resultado.descricao,
                tipo_entrega=resultado.tipo_entrega,
                endereco_entrega=resultado.endereco_entrega,
                preco_total=resultado.preco_total,
                data_entrega=resultado.data_entrega,
                observacoes=resultado.observacoes,
                user_id=str(resultado.user_id),
                receita_id=resultado.receita_id,
                status=resultado.status,
                data_criacao=resultado.data_criacao,
                data_inicio_producao=resultado.data_inicio_producao,
                data_conclusao=resultado.data_conclusao
            )
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_editar_pedido(self, id: str, data: PedidoCreate, user_id: str) -> PedidoResponse:
        try:
            pedido = Pedido()
            pedido.id = id
            pedido.cliente_nome = data.cliente_nome
            pedido.cliente_tel = data.cliente_tel
            pedido.descricao = data.descricao
            pedido.tipo_entrega = data.tipo_entrega
            pedido.endereco_entrega = data.endereco_entrega
            pedido.data_entrega = data.data_entrega
            pedido.preco_total = data.preco_total
            pedido.observacoes = data.observacoes
            pedido.user_id = user_id
            pedido.receita_id = data.receita_id
            pedido.status = data.status or "pendente"
            pedido.data_inicio_producao = data.data_inicio_producao
            pedido.data_conclusao = data.data_conclusao
            
            resultado = self.editar_pedido_use_case.executar(pedido)
            
            return PedidoResponse(
                id=str(resultado.id),
                cliente_nome=resultado.cliente_nome,
                cliente_tel=resultado.cliente_tel,
                descricao=resultado.descricao,
                tipo_entrega=resultado.tipo_entrega,
                endereco_entrega=resultado.endereco_entrega,
                preco_total=resultado.preco_total,
                data_entrega=resultado.data_entrega,
                observacoes=resultado.observacoes,
                user_id=str(resultado.user_id),
                receita_id=resultado.receita_id,
                status=resultado.status,
                data_criacao=resultado.data_criacao,
                data_inicio_producao=resultado.data_inicio_producao,
                data_conclusao=resultado.data_conclusao
            )
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_listar_meus_pedidos(self, user_id: str) -> List[PedidoResponse]:
        try:
            pedidos = self.listar_pedidos_use_case.executar(user_id)
            return [
                PedidoResponse(
                    id=str(p.id),
                    cliente_nome=p.cliente_nome,
                    cliente_tel=p.cliente_tel,
                    descricao=p.descricao,
                    tipo_entrega=p.tipo_entrega,
                    endereco_entrega=p.endereco_entrega,
                    preco_total=p.preco_total,
                    data_entrega=p.data_entrega,
                    observacoes=p.observacoes,
                    user_id=str(p.user_id),
                    receita_id=p.receita_id,
                    status=p.status,
                    data_criacao=p.data_criacao,
                    data_inicio_producao=p.data_inicio_producao,
                    data_conclusao=p.data_conclusao
                ) for p in pedidos
            ]
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_buscar_pedido_por_id(self, id: str) -> PedidoResponse:
        try:
            p = self.buscar_pedido_por_id_use_case.executar(id)
            if not p:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado")
            return PedidoResponse(
                id=str(p.id),
                cliente_nome=p.cliente_nome,
                cliente_tel=p.cliente_tel,
                descricao=p.descricao,
                tipo_entrega=p.tipo_entrega,
                endereco_entrega=p.endereco_entrega,
                preco_total=p.preco_total,
                data_entrega=p.data_entrega,
                observacoes=p.observacoes,
                user_id=str(p.user_id),
                receita_id=p.receita_id,
                status=p.status,
                data_criacao=p.data_criacao,
                data_inicio_producao=p.data_inicio_producao,
                data_conclusao=p.data_conclusao
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def handle_excluir_pedido(self, id: str) -> Dict[str, str]:
        try:
            self.excluir_pedido_use_case.executar(id)
            return {"message": "Pedido excluído com sucesso"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
