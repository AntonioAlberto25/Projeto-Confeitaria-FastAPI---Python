from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entity.pedido.pedido import Pedido


class RepositorioDePedido(ABC):

    @abstractmethod
    def criar_pedido(self, pedido: Pedido) -> Pedido:
        """Persiste um novo pedido. (RF007)"""
        pass

    @abstractmethod
    def editar_pedido(self, pedido: Pedido) -> Pedido:
        """Atualiza os dados de um pedido existente. (RF008)"""
        pass

    @abstractmethod
    def excluir_pedido(self, id: int) -> None:
        """Remove um pedido pelo ID."""
        pass

    @abstractmethod
    def buscar_pedido_por_id(self, id: int) -> Optional[Pedido]:
        """Retorna um pedido pelo seu ID, ou None se não encontrado."""
        pass

    @abstractmethod
    def listar_por_usuario(self, user_id: str) -> List[Pedido]:
        """Retorna todos os pedidos do usuário autenticado. (RF006, RF009)"""
        pass

    @abstractmethod
    def buscar_por_nome_cliente(self, user_id: str, nome_cliente: str) -> List[Pedido]:
        """Filtra os pedidos do usuário autenticado pelo nome do cliente. (RF006)"""
        pass
