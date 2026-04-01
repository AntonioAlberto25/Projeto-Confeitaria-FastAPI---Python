from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido


class CriarPedido:
    def __init__(self, repositorio_de_pedido: RepositorioDePedido):
        self.__repositorio_de_pedido = repositorio_de_pedido

    def criar_pedido(self, pedido: Pedido) -> Pedido:
        return self.__repositorio_de_pedido.criar_pedido(pedido)
