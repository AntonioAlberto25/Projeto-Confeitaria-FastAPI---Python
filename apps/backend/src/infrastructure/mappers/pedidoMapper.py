from src.domain.entity.pedido.pedido import Pedido
from src.infrastructure.persistencia.pedidoModel import PedidoModel


class PedidoMapper:

    @staticmethod
    def to_domain(model: PedidoModel) -> Pedido:
        """
        Converte um objeto do ORM (PedidoModel) para a Entidade de Domínio (Pedido).
        """
        pedido = Pedido()
        pedido.id = model.id
        pedido.cliente_nome = model.cliente_nome
        pedido.descricao = model.descricao
        pedido.tipo_entrega = model.tipo_entrega
        pedido.preco_total = model.preco_total
        pedido.data_entrega = model.data_entrega
        pedido.user_id = model.usuario_id
        pedido.status = model.status
        return pedido

    @staticmethod
    def to_model(entity: Pedido) -> PedidoModel:
        """
        Converte uma Entidade de Domínio (Pedido) para um objeto do ORM (PedidoModel).
        """
        return PedidoModel(
            id=entity.id,
            cliente_nome=entity.cliente_nome,
            descricao=entity.descricao,
            tipo_entrega=entity.tipo_entrega,
            preco_total=entity.preco_total,
            data_entrega=entity.data_entrega,
            usuario_id=entity.user_id,
            status=entity.status
        )
