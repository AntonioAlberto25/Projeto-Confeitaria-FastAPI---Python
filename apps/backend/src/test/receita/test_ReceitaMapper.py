import pytest
from decimal import Decimal
from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel
from src.infrastructure.mappers.receitaMapper import ReceitaMapper


def test_receita_mapper_to_domain():
    model = ReceitaModel(
        id=1,
        nome="Bolo de Cenoura",
        preco=Decimal("25.50"),
        descricao="Delicioso bolo com calda de chocolate",
        rendimento=10,
        id_usuario=42
    )

    domain = ReceitaMapper.to_domain(model)

    assert domain.nome == "Bolo de Cenoura"
    assert domain.preco == Decimal("25.50")
    assert domain.descricao == "Delicioso bolo com calda de chocolate"
    assert domain.rendimento == 10
    assert domain.idUsuario == 42


def test_receita_mapper_to_model():
    domain = Receita()
    domain.nome = "Torta de Limão"
    domain.preco = Decimal("35.00")
    domain.descricao = "Torta refrescante"
    domain.rendimento = 8
    domain.idUsuario = 10

    model = ReceitaMapper.to_model(domain)

    assert model.nome == "Torta de Limão"
    assert model.preco == Decimal("35.00")
    assert model.descricao == "Torta refrescante"
    assert model.rendimento == 8
    assert model.id_usuario == 10
