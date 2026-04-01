from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido
from typing import List

class BuscarPedidoPorNomeCliente:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, user_id: str, nome_cliente: str) -> List[Pedido]:
        return self.__repositorio.buscar_por_nome_cliente(user_id, nome_cliente)
