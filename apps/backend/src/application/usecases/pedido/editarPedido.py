from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.domain.entity.pedido.pedido import Pedido

class EditarPedido:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, pedido: Pedido) -> Pedido:
        return self.__repositorio.editar_pedido(pedido)
