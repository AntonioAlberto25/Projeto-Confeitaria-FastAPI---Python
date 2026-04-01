from src.application.gateways.repositorioDeOrder import RepositorioDeOrder
from src.domain.entity.order.order import Order


class CriarOrder:
    def __init__(self, repositorio_de_order: RepositorioDeOrder):
        self.__repositorio_de_order = repositorio_de_order

    def criar_order(self, order: Order) -> Order:
        return self.__repositorio_de_order.criar_order(order)
