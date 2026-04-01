from sqlalchemy.orm import Session
from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel
from typing import Optional, List

class ReceitaRepository:
    def __init__(self, db: Session):
        self.db = db

    def save(self, receita: Receita) -> Receita:
        receita_model = ReceitaModel(
            nome=receita.nome,
            preco=receita.preco,
            descricao=receita.descricao,
            rendimento=receita.rendimento,
            id_usuario=str(receita.idUsuario)
        )
        self.db.add(receita_model)
        self.db.commit()
        self.db.refresh(receita_model)
        # Note: mapping back id if generated
        return receita

    def find_by_id(self, receita_id: int) -> Optional[Receita]:
        model = self.db.query(ReceitaModel).filter(ReceitaModel.id == receita_id).first()
        if not model:
            return None
        
        receita = Receita()
        receita.nome = model.nome
        receita.preco = float(model.preco) if model.preco else None
        receita.descricao = model.descricao
        receita.rendimento = model.rendimento
        receita.idUsuario = model.id_usuario
        return receita

    def find_all_by_user(self, user_id: str) -> List[Receita]:
        models = self.db.query(ReceitaModel).filter(ReceitaModel.id_usuario == user_id).all()
        receitas = []
        for model in models:
            receita = Receita()
            receita.nome = model.nome
            receita.preco = float(model.preco) if model.preco else None
            receita.descricao = model.descricao
            receita.rendimento = model.rendimento
            receita.idUsuario = model.id_usuario
            receitas.append(receita)
        return receitas

    def delete(self, receita_id: int) -> bool:
        model = self.db.query(ReceitaModel).filter(ReceitaModel.id == receita_id).first()
        if model:
            self.db.delete(model)
            self.db.commit()
            return True
        return False
