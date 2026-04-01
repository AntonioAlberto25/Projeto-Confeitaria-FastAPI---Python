from typing import List, Optional
from sqlalchemy.orm import Session
from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido
from src.infrastructure.persistencia.pedidoModel import PedidoModel
from src.infrastructure.mappers.pedidoMapper import PedidoMapper


class RepositorioDePedidoSQLAlchemy(RepositorioDePedido):
    def __init__(self, session: Session):
        self._session = session

    def criar_pedido(self, pedido: Pedido) -> Pedido:
        pedido_model = PedidoMapper.to_model(pedido)
        
        self._session.add(pedido_model)
        self._session.commit()
        self._session.refresh(pedido_model)
        
        return PedidoMapper.to_domain(pedido_model)

    def editar_pedido(self, pedido: Pedido) -> Pedido:
        pedido_model = self._session.query(PedidoModel).filter(PedidoModel.id == pedido.id).first()
        if not pedido_model:
            raise ValueError("Pedido não encontrado")
            
        # Atualiza os dados usando o mapper para sincronizar os campos
        novo_model = PedidoMapper.to_model(pedido)
        pedido_model.cliente_nome = novo_model.cliente_nome
        pedido_model.descricao = novo_model.descricao
        pedido_model.tipo_entrega = novo_model.tipo_entrega
        pedido_model.preco_total = novo_model.preco_total
        pedido_model.data_entrega = novo_model.data_entrega
        pedido_model.status = novo_model.status
        # user_id geralmente não muda em edição
        
        self._session.commit()
        self._session.refresh(pedido_model)
        
        return PedidoMapper.to_domain(pedido_model)

    def excluir_pedido(self, id: int) -> None:
        pedido_model = self._session.query(PedidoModel).filter(PedidoModel.id == id).first()
        if pedido_model:
            self._session.delete(pedido_model)
            self._session.commit()

    def buscar_pedido_por_id(self, id: int) -> Optional[Pedido]:
        pedido_model = self._session.query(PedidoModel).filter(PedidoModel.id == id).first()
        if not pedido_model:
            return None
        return PedidoMapper.to_domain(pedido_model)

    def listar_por_usuario(self, user_id: int) -> List[Pedido]:
        pedidos_model = self._session.query(PedidoModel).filter(PedidoModel.user_id == user_id).all()
        return [PedidoMapper.to_domain(pm) for pm in pedidos_model]

    def buscar_por_nome_cliente(self, user_id: int, nome_cliente: str) -> List[Pedido]:
        pedidos_model = self._session.query(PedidoModel).filter(
            PedidoModel.user_id == user_id,
            PedidoModel.cliente_nome.ilike(f"%{nome_cliente}%")
        ).all()
        return [PedidoMapper.to_domain(pm) for pm in pedidos_model]
