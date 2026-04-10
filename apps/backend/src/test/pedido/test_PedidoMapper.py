from decimal import Decimal
from datetime import date
from src.domain.entity.pedido.pedido import Pedido
from src.infrastructure.persistencia.pedidoModel import PedidoModel
from src.infrastructure.mappers.pedidoMapper import PedidoMapper


def test_mapper_to_domain():
    model = PedidoModel(
        id="1",
        cliente_nome="Ana",
        descricao="Bolo",
        tipo_entrega="Retirada",
        preco_total=Decimal("150.00"),
        data_entrega=date(2026, 10, 10),
        usuario_id="user_42",
        status="Em Producao"
    )

    domain = PedidoMapper.to_domain(model)

    assert domain.id == "1"
    assert domain.cliente_nome == "Ana"
    assert domain.descricao == "Bolo"
    assert domain.tipo_entrega == "Retirada"
    assert domain.preco_total == Decimal("150.00")
    assert domain.data_entrega == date(2026, 10, 10)
    assert domain.user_id == "user_42"
    assert domain.status == "Em Producao"


def test_mapper_to_model():
    domain = Pedido()
    domain.id = "2"
    domain.cliente_nome = "Carlos"
    domain.descricao = "Doces"
    domain.tipo_entrega = "Entrega"
    domain.preco_total = Decimal("300.00")
    domain.data_entrega = date(2026, 12, 1)
    domain.user_id = "user_10"
    domain.status = "Pendente"

    model = PedidoMapper.to_model(domain)

    assert model.id == "2"
    assert model.cliente_nome == "Carlos"
    assert model.descricao == "Doces"
    assert model.tipo_entrega == "Entrega"
    assert model.preco_total == Decimal("300.00")
    assert model.data_entrega == date(2026, 12, 1)
    assert model.usuario_id == "user_10"
    assert model.status == "Pendente"
