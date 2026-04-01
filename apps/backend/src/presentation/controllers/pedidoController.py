from fastapi import HTTPException, status
from src.domain.entity.pedido.pedido import Pedido
from src.presentation.schemas.pedido_schema import PedidoCreate, PedidoResponse
from src.application.gateways.repositorioDePedido import RepositorioDePedido
from typing import List

class PedidoController:
    def __init__(self, repository: RepositorioDePedido):
        self.repository = repository

    def handle_criar_pedido(self, data: PedidoCreate, user_id: str) -> PedidoResponse:
        """
        Lógica para criação de pedido usando DTOs Pydantic.
        """
        try:
            # DTO -> Entity
            pedido = Pedido()
            pedido.cliente_nome = data.cliente_nome
            pedido.descricao = data.descricao
            pedido.tipo_entrega = data.tipo_entrega
            pedido.data_entrega = data.data_entrega
            pedido.preco_total = data.preco_total
            pedido.user_id = user_id
            pedido.status = "Pendente"
            
            resultado = self.repository.criar_pedido(pedido)
            
            # Entity -> DTO Response
            return PedidoResponse(
                id=resultado.id,
                cliente_nome=resultado.cliente_nome,
                descricao=resultado.descricao,
                tipo_entrega=resultado.tipo_entrega,
                preco_total=resultado.preco_total,
                data_entrega=resultado.data_entrega,
                user_id=str(resultado.user_id),
                status=resultado.status
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    def handle_listar_meus_pedidos(self, user_id: str) -> List[PedidoResponse]:
        """
        Busca todos os pedidos associados ao user_id autenticado no Clerk e retorna via DTO.
        """
        pedidos = self.repository.listar_por_usuario(user_id)
        return [
            PedidoResponse(
                id=p.id,
                cliente_nome=p.cliente_nome,
                descricao=p.descricao,
                tipo_entrega=p.tipo_entrega,
                preco_total=p.preco_total,
                data_entrega=p.data_entrega,
                user_id=str(p.user_id),
                status=p.status
            ) for p in pedidos
        ]
