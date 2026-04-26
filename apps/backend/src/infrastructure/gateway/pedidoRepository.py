from sqlalchemy.orm import Session
from src.domain.entity.pedido.pedido import Pedido
from src.infrastructure.persistencia.pedidoModel import PedidoModel
from src.application.gateways.repositorioDePedido import RepositorioDePedido
from sqlalchemy import desc
from typing import Optional, List
from decimal import Decimal


import uuid

class PedidoRepository(RepositorioDePedido):
    def __init__(self, db: Session):
        self.db = db

    def criar_pedido(self, pedido: Pedido) -> Pedido:
        # Gera o ID manualmente se não existir
        novo_id = str(uuid.uuid4())
        pedido_model = PedidoModel(
            id=novo_id,
            cliente_nome=pedido.cliente_nome,
            cliente_telefone=pedido.cliente_tel,
            descricao=pedido.descricao,
            tipo_entrega=pedido.tipo_entrega,
            preco_total=pedido.preco_total,
            data_entrega=pedido.data_entrega,
            observacoes=pedido.observacoes,
            usuario_id=str(pedido.user_id),
            receita_id=pedido.receita_id,
            quantidade=pedido.quantidade,
            status=pedido.status
        )
        self.db.add(pedido_model)
        self.db.commit()
        self.db.refresh(pedido_model)
        
        pedido.id = pedido_model.id
        pedido.data_criacao = pedido_model.data_criacao.isoformat() if pedido_model.data_criacao else None
        pedido.data_inicio_producao = pedido_model.data_inicio_producao.isoformat() if pedido_model.data_inicio_producao else None
        pedido.data_conclusao = pedido_model.data_conclusao.isoformat() if pedido_model.data_conclusao else None
        return pedido

    def editar_pedido(self, pedido: Pedido) -> Pedido:
        pedido_model = self.db.query(PedidoModel).filter(
            PedidoModel.id == str(pedido.id),
            PedidoModel.usuario_id == str(pedido.user_id)
        ).first()
        
        if pedido_model:
            pedido_model.cliente_nome = pedido.cliente_nome
            pedido_model.cliente_telefone = pedido.cliente_tel
            pedido_model.descricao = pedido.descricao
            pedido_model.tipo_entrega = pedido.tipo_entrega
            pedido_model.preco_total = pedido.preco_total
            pedido_model.data_entrega = pedido.data_entrega
            pedido_model.observacoes = pedido.observacoes
            pedido_model.receita_id = pedido.receita_id
            pedido_model.quantidade = pedido.quantidade
            pedido_model.status = pedido.status
            if pedido.data_inicio_producao:
                pedido_model.data_inicio_producao = pedido.data_inicio_producao
            if pedido.data_conclusao:
                pedido_model.data_conclusao = pedido.data_conclusao
            
            self.db.commit()
            self.db.refresh(pedido_model)
            
            pedido.data_criacao = pedido_model.data_criacao.isoformat() if pedido_model.data_criacao else None
            pedido.data_inicio_producao = pedido_model.data_inicio_producao.isoformat() if pedido_model.data_inicio_producao else None
            pedido.data_conclusao = pedido_model.data_conclusao.isoformat() if pedido_model.data_conclusao else None
            
        return pedido

    def excluir_pedido(self, id: str) -> None:
        pedido_model = self.db.query(PedidoModel).filter(PedidoModel.id == str(id)).first()
        if pedido_model:
            self.db.delete(pedido_model)
            self.db.commit()

    def buscar_pedido_por_id(self, id: str) -> Optional[Pedido]:
        model = self.db.query(PedidoModel).filter(PedidoModel.id == str(id)).first()
        if not model:
            return None
        
        pedido = Pedido()
        pedido.id = model.id
        pedido.cliente_nome = model.cliente_nome
        pedido.cliente_tel = model.cliente_telefone
        pedido.descricao = model.descricao
        pedido.tipo_entrega = model.tipo_entrega
        pedido.preco_total = Decimal(str(model.preco_total)) if model.preco_total else None
        pedido.data_entrega = model.data_entrega
        pedido.observacoes = model.observacoes
        pedido.user_id = model.usuario_id
        pedido.receita_id = model.receita_id
        pedido.quantidade = model.quantidade
        pedido.status = model.status
        pedido.data_criacao = model.data_criacao.isoformat() if model.data_criacao else None
        pedido.data_inicio_producao = model.data_inicio_producao.isoformat() if model.data_inicio_producao else None
        pedido.data_conclusao = model.data_conclusao.isoformat() if model.data_conclusao else None
        return pedido

    def listar_por_usuario(self, user_id: str) -> List[Pedido]:
        models = self.db.query(PedidoModel)\
            .filter(PedidoModel.usuario_id == user_id)\
            .order_by(desc(PedidoModel.data_criacao))\
            .all()
        pedidos = []
        for model in models:
            pedido = Pedido()
            pedido.id = model.id
            pedido.cliente_nome = model.cliente_nome
            pedido.cliente_tel = model.cliente_telefone
            pedido.descricao = model.descricao
            pedido.tipo_entrega = model.tipo_entrega
            pedido.preco_total = Decimal(str(model.preco_total)) if model.preco_total else None
            pedido.data_entrega = model.data_entrega
            pedido.observacoes = model.observacoes
            pedido.user_id = model.usuario_id
            pedido.receita_id = model.receita_id
            pedido.quantidade = model.quantidade
            pedido.status = model.status
            pedido.data_criacao = model.data_criacao.isoformat() if model.data_criacao else None
            pedido.data_inicio_producao = model.data_inicio_producao.isoformat() if model.data_inicio_producao else None
            pedido.data_conclusao = model.data_conclusao.isoformat() if model.data_conclusao else None
            pedidos.append(pedido)
        return pedidos

    def buscar_por_nome_cliente(self, user_id: str, nome_cliente: str) -> List[Pedido]:
        models = self.db.query(PedidoModel).filter(
            PedidoModel.usuario_id == user_id,
            PedidoModel.cliente_nome.ilike(f"%{nome_cliente}%")
        ).order_by(desc(PedidoModel.data_criacao)).all()
        
        pedidos = []
        for model in models:
            p = self.buscar_pedido_por_id(model.id)
            if p:
                pedidos.append(p)
        return pedidos
