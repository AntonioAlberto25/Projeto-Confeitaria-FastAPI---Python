import pytest
from unittest.mock import Mock
from decimal import Decimal
from datetime import date
from src.application.usecases.pedido.criarPedido import CriarPedido
from src.domain.entity.pedido.pedido import Pedido


def _pedido_fake() -> Pedido:
    """Helper: retorna um Pedido com dados válidos para usar nos testes."""
    pedido = Pedido()
    pedido.cliente_nome = "Maria Silva"
    pedido.descricao = "Bolo de casamento 3 andares"
    pedido.tipo_entrega = "Entrega em domicílio"
    pedido.preco_total = Decimal("350.00")
    pedido.data_entrega = date(2026, 6, 15)
    pedido.user_id = "user_2abc123"
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
    assert resultado.user_id == "user_2abc123"


def test_criar_pedido_nao_chama_repositorio_mais_de_uma_vez():
    repositorio_mock = Mock()
    pedido_fake = _pedido_fake()
    repositorio_mock.criar_pedido.return_value = pedido_fake

    usecase = CriarPedido(repositorio_mock)
    usecase.criar_pedido(pedido_fake)

    assert repositorio_mock.criar_pedido.call_count == 1
