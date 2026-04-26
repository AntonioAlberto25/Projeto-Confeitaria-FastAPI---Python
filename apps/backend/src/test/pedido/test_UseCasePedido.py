from unittest.mock import Mock, call
from decimal import Decimal
from datetime import date
from src.application.usecases.pedido.criarPedido import CriarPedido
from src.application.usecases.pedido.listarPedidos import ListarPedidos
from src.application.usecases.pedido.buscarPedidoPorId import BuscarPedidoPorId
from src.application.usecases.pedido.buscarPedidoPorNomeCliente import BuscarPedidoPorNomeCliente
from src.application.usecases.pedido.editarPedido import EditarPedido
from src.application.usecases.pedido.excluirPedido import ExcluirPedido
from src.domain.entity.pedido.pedido import Pedido
from src.domain.entity.receita.receita import Receita


def _pedido_fake() -> Pedido:
    """Helper: retorna um Pedido com dados válidos para usar nos testes."""
    pedido = Pedido()
    pedido.id = "pedido_123"
    pedido.cliente_nome = "Maria Silva"
    pedido.descricao = "Bolo de casamento 3 andares"
    pedido.tipo_entrega = "Entrega em domicílio"
    pedido.preco_total = Decimal("350.00")
    pedido.data_entrega = date(2026, 6, 15)
    pedido.user_id = 42
    pedido.status = "Pendente"
    pedido.receita_id = "receita_123"
    pedido.quantidade = 2
    return pedido


def _receita_fake() -> Receita:
    """Helper: retorna uma Receita válida para testes."""
    receita = Receita()
    receita.id = "receita_123"
    receita.rendimento = 10
    return receita


# ── CriarPedido ───────────────────────────────────────────────────────────────

def test_criar_pedido_chama_repositorio_e_ajusta_rendimento():
    # Arrange
    repositorio_mock = Mock()
    receita_repo_mock = Mock()
    pedido_fake = _pedido_fake()
    receita_fake = _receita_fake()

    repositorio_mock.criar_pedido.return_value = pedido_fake
    receita_repo_mock.buscar_por_id.return_value = receita_fake

    usecase = CriarPedido(repositorio_mock, receita_repo_mock)

    # Act
    resultado = usecase.executar(pedido_fake)

    # Assert
    repositorio_mock.criar_pedido.assert_called_once_with(pedido_fake)
    receita_repo_mock.buscar_por_id.assert_called_once_with("receita_123")
    receita_repo_mock.editar_receita.assert_called_once_with(receita_fake)
    assert receita_fake.rendimento == 8  # 10 - 2
    assert resultado == pedido_fake


def test_criar_pedido_sem_repo_receita_apenas_salva():
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.criar_pedido.return_value = pedido_fake

    usecase = CriarPedido(repositorio_mock)
    resultado = usecase.executar(pedido_fake)

    assert resultado.cliente_nome == "Maria Silva"
    assert resultado.status == "Pendente"
    assert resultado.user_id == 42
    repositorio_mock.criar_pedido.assert_called_once_with(pedido_fake)


# ── Listar e Buscar Pedidos ───────────────────────────────────────────────────

def test_listar_pedidos_chama_repositorio():
    repositorio_mock = Mock()
    user_id = "user_123"
    pedidos_fake = [_pedido_fake()]
    repositorio_mock.listar_por_usuario.return_value = pedidos_fake

    usecase = ListarPedidos(repositorio_mock)
    resultado = usecase.executar(user_id)

    repositorio_mock.listar_por_usuario.assert_called_once_with(user_id)
    assert resultado == pedidos_fake


def test_buscar_pedido_por_id_chama_repositorio():
    repositorio_mock = Mock()
    pedido_id = 123
    pedido_fake = _pedido_fake()
    repositorio_mock.buscar_pedido_por_id.return_value = pedido_fake

    usecase = BuscarPedidoPorId(repositorio_mock)
    resultado = usecase.executar(pedido_id)

    repositorio_mock.buscar_pedido_por_id.assert_called_once_with(pedido_id)
    assert resultado == pedido_fake


def test_buscar_pedido_por_nome_cliente_chama_repositorio():
    repositorio_mock = Mock()
    user_id = "user_123"
    nome = "Maria"
    pedidos_fake = [_pedido_fake()]
    repositorio_mock.buscar_por_nome_cliente.return_value = pedidos_fake

    usecase = BuscarPedidoPorNomeCliente(repositorio_mock)
    resultado = usecase.executar(user_id, nome)

    repositorio_mock.buscar_por_nome_cliente.assert_called_once_with(user_id, nome)
    assert resultado == pedidos_fake


# ── EditarPedido ──────────────────────────────────────────────────────────────

def test_editar_pedido_muda_quantidade_ajusta_rendimento():
    repositorio_mock = Mock()
    receita_repo_mock = Mock()
    
    pedido_antigo = _pedido_fake()
    pedido_antigo.quantidade = 2
    
    pedido_novo = _pedido_fake()
    pedido_novo.quantidade = 5  # aumentou 3
    
    receita_fake = _receita_fake()
    
    repositorio_mock.buscar_pedido_por_id.return_value = pedido_antigo
    repositorio_mock.editar_pedido.return_value = pedido_novo
    receita_repo_mock.buscar_por_id.return_value = receita_fake

    usecase = EditarPedido(repositorio_mock, receita_repo_mock)
    resultado = usecase.executar(pedido_novo)

    # 10 original - 3 de diferença = 7
    assert receita_fake.rendimento == 7
    receita_repo_mock.editar_receita.assert_called_once_with(receita_fake)
    repositorio_mock.editar_pedido.assert_called_once_with(pedido_novo)
    assert resultado == pedido_novo


def test_editar_pedido_cancelado_restaura_rendimento():
    repositorio_mock = Mock()
    receita_repo_mock = Mock()
    
    pedido_antigo = _pedido_fake()
    pedido_antigo.status = "Pendente"
    pedido_antigo.quantidade = 2
    
    pedido_novo = _pedido_fake()
    pedido_novo.status = "cancelado"
    pedido_novo.quantidade = 2
    
    receita_fake = _receita_fake()
    
    repositorio_mock.buscar_pedido_por_id.return_value = pedido_antigo
    repositorio_mock.editar_pedido.return_value = pedido_novo
    receita_repo_mock.buscar_por_id.return_value = receita_fake

    usecase = EditarPedido(repositorio_mock, receita_repo_mock)
    resultado = usecase.executar(pedido_novo)

    # 10 original + 2 (restaurado do cancelamento)
    assert receita_fake.rendimento == 12
    receita_repo_mock.editar_receita.assert_called_once_with(receita_fake)


# ── ExcluirPedido ─────────────────────────────────────────────────────────────

def test_excluir_pedido_restaura_rendimento():
    repositorio_mock = Mock()
    receita_repo_mock = Mock()
    
    pedido_fake = _pedido_fake()
    pedido_fake.id = "pedido_excluir"
    pedido_fake.quantidade = 4
    
    receita_fake = _receita_fake()
    
    repositorio_mock.buscar_pedido_por_id.return_value = pedido_fake
    repositorio_mock.excluir_pedido.return_value = True
    receita_repo_mock.buscar_por_id.return_value = receita_fake

    usecase = ExcluirPedido(repositorio_mock, receita_repo_mock)
    resultado = usecase.executar("pedido_excluir")

    # Rendimento de 10 restaurando os 4 do pedido excluído = 14
    assert receita_fake.rendimento == 14
    receita_repo_mock.editar_receita.assert_called_once_with(receita_fake)
    repositorio_mock.excluir_pedido.assert_called_once_with("pedido_excluir")
    assert resultado is True
