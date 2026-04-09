from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entity.receita.receita import Receita


class RepositorioDeReceita(ABC):

    @abstractmethod
    def criar_receita(self, receita: Receita) -> Receita:
        pass

    @abstractmethod
    def editar_receita(self, receita: Receita) -> Receita:
        pass

    @abstractmethod
    def excluir_receita(self, receita: Receita) -> None:
        pass

    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Receita]:
        pass

    @abstractmethod
    def listar_por_usuario(self, user_id: str) -> List[Receita]:
        """Retorna todas as receitas do usuário autenticado. (RF010, RF014)"""
        pass

    @abstractmethod
    def buscar_por_nome(self, user_id: str, nome: str) -> List[Receita]:
        pass
