from abc import ABC, abstractmethod
from src.domain.entity.order.order import Order


class RepositorioDeOrder(ABC):

    @abstractmethod
    def criar_order(self, order: Order) -> Order:
        pass

    @abstractmethod
    def editar_order(self, order: Order) -> Order:
        pass

    @abstractmethod
    def excluir_order(self, order: Order) -> None:
        pass

    @abstractmethod
    def buscar_order_por_id(self, id: int) -> Order:
        pass
