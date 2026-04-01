import pytest
from unittest.mock import Mock
from decimal import Decimal
from datetime import date
from src.application.usecases.pedido.criarPedido import CriarPedido
from src.application.usecases.pedido.listarPedidos import ListarPedidos
from src.application.usecases.pedido.buscarPedidoPorId import BuscarPedidoPorId
from src.application.usecases.pedido.buscarPedidoPorNomeCliente import BuscarPedidoPorNomeCliente
from src.application.usecases.pedido.editarPedido import EditarPedido
from src.application.usecases.pedido.excluirPedido import ExcluirPedido
from src.domain.entity.pedido.pedido import Pedido


def _pedido_fake() -> Pedido:
    """Helper: retorna um Pedido com dados válidos para usar nos testes."""
    pedido = Pedido()
    pedido.cliente_nome = "Maria Silva"
    pedido.descricao = "Bolo de casamento 3 andares"
    pedido.tipo_entrega = "Entrega em domicílio"
    pedido.preco_total = Decimal("350.00")
    pedido.data_entrega = date(2026, 6, 15)
    pedido.user_id = 42
    pedido.status = "Pendente"
    return pedido


# ── CriarPedido ───────────────────────────────────────────────────────────────

def test_criar_pedido_chama_repositorio():
    # Arrange
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.criar_pedido.return_value = pedido_fake

    usecase = CriarPedido(repositorio_mock)

    # Act
    resultado = usecase.criar_pedido(pedido_fake)

    # Assert
    repositorio_mock.criar_pedido.assert_called_once_with(pedido_fake)
    assert resultado == pedido_fake


def test_criar_pedido_retorna_o_pedido_criado():
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.criar_pedido.return_value = pedido_fake

    usecase = CriarPedido(repositorio_mock)
    resultado = usecase.criar_pedido(pedido_fake)

    assert resultado.cliente_nome == "Maria Silva"
    assert resultado.status == "Pendente"
    assert resultado.user_id == 42


def test_criar_pedido_nao_chama_repositorio_mais_de_uma_vez():
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.criar_pedido.return_value = pedido_fake

    usecase = CriarPedido(repositorio_mock)
    usecase.criar_pedido(pedido_fake)

    assert repositorio_mock.criar_pedido.call_count == 1

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

def test_editar_pedido_chama_repositorio():
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.editar_pedido.return_value = pedido_fake

    usecase = EditarPedido(repositorio_mock)
    resultado = usecase.executar(pedido_fake)

    repositorio_mock.editar_pedido.assert_called_once_with(pedido_fake)
    assert resultado == pedido_fake

def test_excluir_pedido_chama_repositorio():
    repositorio_mock = Mock()
    pedido_id = 123
    repositorio_mock.excluir_pedido.return_value = True

    usecase = ExcluirPedido(repositorio_mock)
    resultado = usecase.executar(pedido_id)

    repositorio_mock.excluir_pedido.assert_called_once_with(pedido_id)
    assert resultado is True
