from fastapi import Depends
from sqlalchemy.orm import Session
from src.infrastructure.persistencia.database import SessionLocal

# Repositories
from src.infrastructure.gateway.userRepository import UserRepository
from src.infrastructure.gateway.receitaRepository import ReceitaRepository
from src.infrastructure.gateway.pedidoRepository import PedidoRepository

# Use Cases - Receita
from src.application.usecases.receita.criarReceita import CriarReceita
from src.application.usecases.receita.editarReceita import EditarReceita
from src.application.usecases.receita.excluirReceita import ExcluirReceita
from src.application.usecases.receita.listarReceitas import ListarReceitas
from src.application.usecases.receita.buscarReceitaPorId import BuscarReceitaPorId
from src.application.usecases.receita.buscarReceitaPorNome import BuscarReceitaPorNome

# Use Cases - Pedido
from src.application.usecases.pedido.criarPedido import CriarPedido
from src.application.usecases.pedido.editarPedido import EditarPedido
from src.application.usecases.pedido.excluirPedido import ExcluirPedido
from src.application.usecases.pedido.listarPedidos import ListarPedidos
from src.application.usecases.pedido.buscarPedidoPorId import BuscarPedidoPorId
from src.application.usecases.pedido.buscarPedidoPorNomeCliente import BuscarPedidoPorNomeCliente

# Use Cases - User
from src.application.usecases.user.registrarUsuario import RegistrarUsuario
from src.application.usecases.user.buscarUsuarioPorId import BuscarUsuarioPorId

# Controllers
from src.presentation.controllers.receitaController import ReceitaController
from src.presentation.controllers.pedidoController import PedidoController
from src.presentation.controllers.userController import UserController

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Receita Dependency Functions ---
def get_receita_controller(db: Session = Depends(get_db)) -> ReceitaController:
    repo = ReceitaRepository(db)
    return ReceitaController(
        criar_receita_use_case=CriarReceita(repo),
        editar_receita_use_case=EditarReceita(repo),
        excluir_receita_use_case=ExcluirReceita(repo),
        listar_receitas_use_case=ListarReceitas(repo),
        buscar_receita_por_id_use_case=BuscarReceitaPorId(repo),
        buscar_receita_por_nome_use_case=BuscarReceitaPorNome(repo)
    )

# --- Pedido Dependency Functions ---
def get_pedido_controller(db: Session = Depends(get_db)) -> PedidoController:
    repo = PedidoRepository(db)
    return PedidoController(
        criar_pedido_use_case=CriarPedido(repo),
        editar_pedido_use_case=EditarPedido(repo),
        excluir_pedido_use_case=ExcluirPedido(repo),
        listar_pedidos_use_case=ListarPedidos(repo),
        buscar_pedido_por_id_use_case=BuscarPedidoPorId(repo),
        buscar_pedido_por_nome_cliente_use_case=BuscarPedidoPorNomeCliente(repo)
    )

# --- User Dependency Functions ---
def get_user_controller(db: Session = Depends(get_db)) -> UserController:
    repo = UserRepository(db)
    return UserController(
        registrar_usuario_use_case=RegistrarUsuario(repo),
        buscar_usuario_por_id_use_case=BuscarUsuarioPorId(repo)
    )
