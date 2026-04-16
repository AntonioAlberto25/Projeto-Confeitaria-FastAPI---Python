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
        pedido.cliente_tel = model.cliente_telefone
        pedido.descricao = model.descricao
        pedido.observacoes = model.observacoes
        pedido.tipo_entrega = model.tipo_entrega
        pedido.endereco_entrega = model.endereco_entrega
        pedido.preco_total = model.preco_total
        pedido.data_entrega = model.data_entrega
        pedido.user_id = model.usuario_id
        pedido.receita_id = model.receita_id
        pedido.status = model.status
        pedido.data_criacao = model.data_criacao.isoformat() if model.data_criacao else None
        pedido.data_inicio_producao = model.data_inicio_producao.isoformat() if model.data_inicio_producao else None
        pedido.data_conclusao = model.data_conclusao.isoformat() if model.data_conclusao else None
        return pedido

    @staticmethod
    def to_model(entity: Pedido) -> PedidoModel:
        """
        Converte uma Entidade de Domínio (Pedido) para um objeto do ORM (PedidoModel).
        """
        return PedidoModel(
            id=entity.id,
            cliente_nome=entity.cliente_nome,
            cliente_telefone=entity.cliente_tel,
            descricao=entity.descricao,
            observacoes=entity.observacoes,
            tipo_entrega=entity.tipo_entrega,
            endereco_entrega=entity.endereco_entrega,
            preco_total=entity.preco_total,
            data_entrega=entity.data_entrega,
            usuario_id=entity.user_id,
            receita_id=entity.receita_id,
            status=entity.status,
            data_inicio_producao=entity.data_inicio_producao,
            data_conclusao=entity.data_conclusao
        )
