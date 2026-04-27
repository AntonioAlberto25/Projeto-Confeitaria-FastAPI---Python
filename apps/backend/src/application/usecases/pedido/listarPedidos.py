from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido
from typing import List, Tuple, Optional

class ListarPedidos:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, user_id: str, limit: int = 100, skip: int = 0, status: Optional[str] = None, q: Optional[str] = None) -> Tuple[List[Pedido], int]:
        return self.__repositorio.listar_por_usuario(user_id, limit, skip, status, q)
