from abc import ABC, abstractmethod
from src.domain.entity.pedido.pedido import Pedido


class RepositorioDePedido(ABC):

    @abstractmethod
    def criar_pedido(self, pedido: Pedido) -> Pedido:
        pass

    @abstractmethod
    def editar_pedido(self, pedido: Pedido) -> Pedido:
        pass

    @abstractmethod
    def excluir_pedido(self, pedido: Pedido) -> None:
        pass

    @abstractmethod
    def buscar_pedido_por_id(self, id: int) -> Pedido:
        pass
