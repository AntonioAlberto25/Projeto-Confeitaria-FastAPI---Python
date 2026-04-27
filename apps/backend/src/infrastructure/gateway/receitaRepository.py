from sqlalchemy.orm import Session
from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel
from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from typing import Optional, List

import uuid

class ReceitaRepository(RepositorioDeReceita):
    def __init__(self, db: Session):
        self.db = db

    def criar_receita(self, receita: Receita) -> Receita:
        # Gera o ID manualmente
        novo_id = str(uuid.uuid4())
        receita_model = ReceitaModel(
            id=novo_id,
            nome=receita.nome,
            preco_venda_sugerido=receita.preco_venda_sugerido,
            descricao=receita.descricao,
            rendimento=receita.rendimento,
            tempo_preparo=receita.tempo_preparo,
            modo_preparo=receita.modo_preparo,
            usuario_id=receita.idUsuario
        )
        self.db.add(receita_model)
        self.db.commit()
        self.db.refresh(receita_model)
        
        # O ID é gerado pelo banco (UUID no Supabase)
        receita.id = receita_model.id
        return receita

    def editar_receita(self, receita: Receita) -> Receita:
        receita_model = self.db.query(ReceitaModel).filter(
            ReceitaModel.id == str(receita.id),
            ReceitaModel.usuario_id == receita.idUsuario
        ).first()
        
        if receita_model:
            receita_model.nome = receita.nome
            receita_model.preco_venda_sugerido = receita.preco_venda_sugerido
            receita_model.descricao = receita.descricao
            receita_model.rendimento = receita.rendimento
            receita_model.tempo_preparo = receita.tempo_preparo
            receita_model.modo_preparo = receita.modo_preparo
            
            self.db.commit()
            self.db.refresh(receita_model)
        
        return receita

    def excluir_receita(self, receita: Receita) -> None:
        receita_model = self.db.query(ReceitaModel).filter(
            ReceitaModel.id == str(receita.id),
            ReceitaModel.usuario_id == receita.idUsuario
        ).first()
        
        if receita_model:
            self.db.delete(receita_model)
            self.db.commit()

    def buscar_por_id(self, id: str) -> Optional[Receita]:
        model = self.db.query(ReceitaModel).filter(ReceitaModel.id == str(id)).first()
        if not model:
            return None
        
        receita = Receita()
        receita.id = model.id
        receita.nome = model.nome
        receita.descricao = model.descricao
        receita.modo_preparo = model.modo_preparo
        receita.idUsuario = model.usuario_id
        # Bypass os setters com validação para não falhar em dados históricos do banco
        try:
            receita._Receita__preco_venda_sugerido = float(model.preco_venda_sugerido) if model.preco_venda_sugerido is not None else None
        except (ValueError, TypeError):
            receita._Receita__preco_venda_sugerido = None
        try:
            receita._Receita__rendimento = int(model.rendimento) if model.rendimento is not None else None
        except (ValueError, TypeError):
            receita._Receita__rendimento = None
        try:
            receita._Receita__tempo_preparo = int(model.tempo_preparo) if model.tempo_preparo is not None else None
        except (ValueError, TypeError):
            receita._Receita__tempo_preparo = None
        return receita

    def listar_por_usuario(self, user_id: str, limit: int = 100, skip: int = 0, q: Optional[str] = None) -> tuple[List[Receita], int]:
        query = self.db.query(ReceitaModel).filter(ReceitaModel.usuario_id == user_id)
        
        if q:
            query = query.filter(ReceitaModel.nome.ilike(f"%{q}%"))
            
        total = query.count()
        models = query.offset(skip).limit(limit).all()
        
        receitas = []
        for model in models:
            receita = Receita()
            receita.id = model.id
            receita.nome = model.nome
            receita.descricao = model.descricao
            receita.modo_preparo = model.modo_preparo
            receita.idUsuario = model.usuario_id
            # Bypass os setters com validação para não falhar em dados históricos do banco
            try:
                receita._Receita__preco_venda_sugerido = float(model.preco_venda_sugerido) if model.preco_venda_sugerido is not None else None
            except (ValueError, TypeError):
                receita._Receita__preco_venda_sugerido = None
            try:
                receita._Receita__rendimento = int(model.rendimento) if model.rendimento is not None else None
            except (ValueError, TypeError):
                receita._Receita__rendimento = None
            try:
                receita._Receita__tempo_preparo = int(model.tempo_preparo) if model.tempo_preparo is not None else None
            except (ValueError, TypeError):
                receita._Receita__tempo_preparo = None
            receitas.append(receita)
        return receitas, total

    def buscar_por_nome(self, user_id: str, nome: str) -> List[Receita]:
        models = self.db.query(ReceitaModel).filter(
            ReceitaModel.usuario_id == user_id, 
            ReceitaModel.nome.ilike(f"%{nome}%")
        ).all()
        
        receitas = []
        for model in models:
            r = self.buscar_por_id(model.id)
            if r:
                receitas.append(r)
        return receitas
