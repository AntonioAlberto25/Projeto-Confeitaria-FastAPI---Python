from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido
from typing import List

class ListarPedidos:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, user_id: str) -> List[Pedido]:
        return self.__repositorio.listar_por_usuario(user_id)
