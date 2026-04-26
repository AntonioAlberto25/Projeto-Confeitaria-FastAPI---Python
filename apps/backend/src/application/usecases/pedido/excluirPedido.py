from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.application.gateways.repositorioDeReceita import RepositorioDeReceita

class ExcluirPedido:
    def __init__(self, repositorio: RepositorioDePedido, receita_repositorio: RepositorioDeReceita = None):
        self.__repositorio = repositorio
        self.__receita_repositorio = receita_repositorio

    def executar(self, id: str) -> None:
        if self.__receita_repositorio:
            pedido = self.__repositorio.buscar_pedido_por_id(id)
            if pedido and pedido.receita_id:
                receita = self.__receita_repositorio.buscar_por_id(pedido.receita_id)
                if receita:
                    quantidade = pedido.quantidade if pedido.quantidade else 1
                    try:
                        receita.retornar_rendimento(quantidade)
                        self.__receita_repositorio.editar_receita(receita)
                    except ValueError:
                        pass # Ignore if it can't return
        return self.__repositorio.excluir_pedido(id)
