from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.pedido.pedido import Pedido


class CriarPedido:
    def __init__(self, repositorio_de_pedido: RepositorioDePedido, repositorio_de_receita: RepositorioDeReceita = None):
        self.__repositorio_de_pedido = repositorio_de_pedido
        self.__repositorio_de_receita = repositorio_de_receita

    def executar(self, pedido: Pedido) -> Pedido:
        if pedido.receita_id and self.__repositorio_de_receita:
            receita = self.__repositorio_de_receita.buscar_por_id(pedido.receita_id)
            if receita:
                try:
                    if not pedido.status or pedido.status.lower() != "cancelado":
                        receita.consumir(pedido.quantidade or 1)
                        self.__repositorio_de_receita.editar_receita(receita)
                except ValueError:
                    pass

                
        return self.__repositorio_de_pedido.criar_pedido(pedido)
