from typing import List, Optional
from sqlalchemy.orm import Session
from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel
from src.infrastructure.mappers.receitaMapper import ReceitaMapper


class RepositorioDeReceitaSQLAlchemy(RepositorioDeReceita):
    def __init__(self, session: Session):
        self._session = session

    def criar_receita(self, receita: Receita) -> Receita:
        receita_model = ReceitaMapper.to_model(receita)
        
        self._session.add(receita_model)
        self._session.commit()
        self._session.refresh(receita_model)
        
        return ReceitaMapper.to_domain(receita_model)

    def editar_receita(self, receita: Receita) -> Receita:
        # Nota: assumindo que a entidade receita agora possui um campo id (ou mapeamos via outro identificador local)
        # O modelo atual (ReceitaModel) tem ID inteiro gerado pelo banco.
        # Caso a Entidade Receita precise do ID exposto, você precisaria adicioná-lo.
        # Por enquanto vamos simular a atualização caso a entidade contenha 'id'.
        
        if not hasattr(receita, 'id'):
            raise ValueError("Entidade Receita precisa de um ID para ser editada no banco")

        receita_model = self._session.query(ReceitaModel).filter(ReceitaModel.id == receita.id).first()
        if not receita_model:
            raise ValueError("Receita não encontrada")
        
        novo_model = ReceitaMapper.to_model(receita)
        receita_model.nome = novo_model.nome
        receita_model.preco = novo_model.preco
        receita_model.descricao = novo_model.descricao
        receita_model.rendimento = novo_model.rendimento
        
        self._session.commit()
        self._session.refresh(receita_model)
        
        domain_result = ReceitaMapper.to_domain(receita_model)
        # Hack rápido temporário se a entidade não tiver ID nativo
        setattr(domain_result, 'id', receita_model.id) 
        
        return domain_result

    def excluir_receita(self, receita: Receita) -> None:
        if not hasattr(receita, 'id'):
            raise ValueError("A interface requer uma receita com ID para excluir")
            
        receita_model = self._session.query(ReceitaModel).filter(ReceitaModel.id == receita.id).first()
        if receita_model:
            self._session.delete(receita_model)
            self._session.commit()

    def buscar_por_id(self, id: int) -> Optional[Receita]:
        receita_model = self._session.query(ReceitaModel).filter(ReceitaModel.id == id).first()
        if not receita_model:
            return None
            
        domain = ReceitaMapper.to_domain(receita_model)
        setattr(domain, 'id', receita_model.id)
        return domain

    def listar_por_usuario(self, user_id: int) -> List[Receita]:
        receitas_model = self._session.query(ReceitaModel).filter(ReceitaModel.id_usuario == user_id).all()
        result = []
        for rm in receitas_model:
            domain = ReceitaMapper.to_domain(rm)
            setattr(domain, 'id', rm.id)
            result.append(domain)
        return result

    def buscar_por_nome(self, user_id: int, nome: str) -> List[Receita]:
        receitas_model = self._session.query(ReceitaModel).filter(
            ReceitaModel.id_usuario == user_id,
            ReceitaModel.nome.ilike(f"%{nome}%")
        ).all()
        
        result = []
        for rm in receitas_model:
            domain = ReceitaMapper.to_domain(rm)
            setattr(domain, 'id', rm.id)
            result.append(domain)
        return result
