from src.application.gateways.repositorioDePedido import RepositorioDePedido
from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.pedido.pedido import Pedido

class EditarPedido:
    def __init__(self, repositorio: RepositorioDePedido, receita_repositorio: RepositorioDeReceita = None):
        self.__repositorio = repositorio
        self.__receita_repositorio = receita_repositorio

    def executar(self, pedido: Pedido) -> Pedido:
        if self.__receita_repositorio and pedido.id and pedido.receita_id:
            pedido_antigo = self.__repositorio.buscar_pedido_por_id(pedido.id)
            if pedido_antigo and pedido_antigo.receita_id == pedido.receita_id:
                receita = self.__receita_repositorio.buscar_por_id(pedido.receita_id)
                if receita:
                    q_antiga = pedido_antigo.quantidade if pedido_antigo.quantidade else 1
                    q_nova = pedido.quantidade if pedido.quantidade else 1
                    
                    status_antigo_cancelado = (pedido_antigo.status or "").lower() == "cancelado"
                    status_novo_cancelado = (pedido.status or "").lower() == "cancelado"
                    
                    try:
                        if not status_antigo_cancelado and status_novo_cancelado:
                            # Canceled: refund old quantity
                            receita.retornar_rendimento(q_antiga)
                        elif status_antigo_cancelado and not status_novo_cancelado:
                            # Un-canceled: consume new quantity
                            receita.consumir(q_nova)
                        elif not status_antigo_cancelado and not status_novo_cancelado:
                            # Normal state, check if quantity changed
                            if q_nova > q_antiga:
                                receita.consumir(q_nova - q_antiga)
                            elif q_nova < q_antiga:
                                receita.retornar_rendimento(q_antiga - q_nova)
                                
                        self.__receita_repositorio.editar_receita(receita)
                    except ValueError:
                        pass # Ignore yield errors for now
                        
        return self.__repositorio.editar_pedido(pedido)
