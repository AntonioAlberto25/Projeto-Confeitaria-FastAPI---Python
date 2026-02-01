from abc import ABC, abstractmethod
from src.domain.entity.receita.receita import Receita

class RepostorioDeReceita(ABC):
    @abstractmethod
    def criar_receita(self,Receita)->Receita:
        pass

    @abstractmethod
    def editar_receita(self,Receita)->Receita:
        pass

    @abstractmethod
    async def excluir_receita(self,Receita)->None:
        pass
