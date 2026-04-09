from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido
from typing import Optional

class BuscarPedidoPorId:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, id: str) -> Optional[Pedido]:
        return self.__repositorio.buscar_pedido_por_id(id)
