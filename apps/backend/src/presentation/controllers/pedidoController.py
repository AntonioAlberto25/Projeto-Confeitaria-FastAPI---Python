from fastapi import HTTPException, status
from src.domain.entity.pedido.pedido import Pedido
from typing import Dict, Any, List

class PedidoController:
    def __init__(self, repository_de_pedido: Any): # Replace Any with RepositorioDePedido interface
        self.repository = repository_de_pedido

    def handle_criar_pedido(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Lógica para criação de pedido iniciada pelo router.
        """
        try:
            pedido = Pedido()
            pedido.cliente_nome = data.get("cliente_nome")
            pedido.descricao = data.get("descricao")
            pedido.tipo_entrega = data.get("tipo_entrega")
            pedido.data_entrega = data.get("data_entrega")
            pedido.user_id = user_id
            pedido.status = "Pendente"
            
            # Aqui chamaria o use case se existisse, caso contrário o repo
            resultado = self.repository.criar_pedido(pedido)
            
            return {
                "mensagem": "Pedido criado com sucesso!",
                "pedido_id": resultado.id,
                "status": resultado.status
            }
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    def handle_listar_meus_pedidos(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Busca todos os pedidos associados ao user_id autenticado no Clerk.
        """
        pedidos = self.repository.listar_por_usuario(user_id)
        return [{"id": p.id, "cliente": p.cliente_nome, "status": p.status} for p in pedidos]
