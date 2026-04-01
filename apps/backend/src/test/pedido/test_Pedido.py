import pytest
from decimal import Decimal
from datetime import date
from src.domain.entity.pedido.pedido import Pedido


# ── cliente_nome ─────────────────────────────────────────────────────────────

def test_cliente_nome_valido():
    pedido = Pedido()
    pedido.cliente_nome = "Maria Silva"
    assert pedido.cliente_nome == "Maria Silva"


def test_cliente_nome_com_espacos_extras():
    pedido = Pedido()
    pedido.cliente_nome = "  Ana Paula  "
    assert pedido.cliente_nome == "Ana Paula"


def test_cliente_nome_vazio_levanta_erro():
    pedido = Pedido()
    with pytest.raises(ValueError, match="obrigatório"):
        pedido.cliente_nome = ""


def test_cliente_nome_none_levanta_erro():
    pedido = Pedido()
    with pytest.raises(ValueError, match="obrigatório"):
        pedido.cliente_nome = None


def test_cliente_nome_apenas_espacos_levanta_erro():
    pedido = Pedido()
    with pytest.raises(ValueError, match="obrigatório"):
        pedido.cliente_nome = "   "


# ── preco_total ───────────────────────────────────────────────────────────────

def test_preco_total_valido():
    pedido = Pedido()
    pedido.preco_total = Decimal("59.90")
    assert pedido.preco_total == Decimal("59.90")


def test_preco_total_zero_e_valido():
    pedido = Pedido()
    pedido.preco_total = Decimal("0")
    assert pedido.preco_total == Decimal("0")


def test_preco_total_negativo_levanta_erro():
    pedido = Pedido()
    with pytest.raises(ValueError, match="negativo"):
        pedido.preco_total = Decimal("-1.00")


def test_preco_total_none_e_permitido():
    pedido = Pedido()
    pedido.preco_total = None
    assert pedido.preco_total is None


# ── campos opcionais ──────────────────────────────────────────────────────────

def test_descricao_pode_ser_none():
    pedido = Pedido()
    pedido.descricao = None
    assert pedido.descricao is None


def test_tipo_entrega_valido():
    pedido = Pedido()
    pedido.tipo_entrega = "Retirada"
    assert pedido.tipo_entrega == "Retirada"


def test_data_entrega_valida():
    pedido = Pedido()
    pedido.data_entrega = date(2026, 12, 31)
    assert pedido.data_entrega == date(2026, 12, 31)


def test_status_valido():
    pedido = Pedido()
    pedido.status = "Pendente"
    assert pedido.status == "Pendente"


def test_user_id_valido():
    pedido = Pedido()
    pedido.user_id = 42
    assert pedido.user_id == 42


# ── estado inicial ────────────────────────────────────────────────────────────

def test_pedido_inicial_todos_campos_none():
    pedido = Pedido()
    assert pedido.id is None
    assert pedido.cliente_nome is None
    assert pedido.descricao is None
    assert pedido.tipo_entrega is None
    assert pedido.preco_total is None
    assert pedido.data_entrega is None
    assert pedido.user_id is None
    assert pedido.status is None
