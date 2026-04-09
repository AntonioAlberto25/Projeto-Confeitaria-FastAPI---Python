from src.application.gateways.repositorioDePedido import RepositorioDePedido

class ExcluirPedido:
    def __init__(self, repositorio: RepositorioDePedido):
        self.__repositorio = repositorio

    def executar(self, id: str) -> None:
        return self.__repositorio.excluir_pedido(id)
