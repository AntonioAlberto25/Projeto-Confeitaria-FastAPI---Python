from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entity.estoque.insumo import Insumo

class RepositorioDeEstoque(ABC):
    @abstractmethod
    def criar_insumo(self, insumo: Insumo) -> Insumo:
        pass

    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[Insumo]:
        pass

    @abstractmethod
    def listar_por_usuario(self, user_id: str) -> List[Insumo]:
        pass

    @abstractmethod
    def atualizar_quantidade(self, id: str, quantidade: float) -> Optional[Insumo]:
        pass

    @abstractmethod
    def excluir_insumo(self, id: str) -> bool:
        pass
