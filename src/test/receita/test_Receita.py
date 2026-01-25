import pytest
from src.domain.entity.receita.receita import Receita

def test_preco_invalido():
    receitaNova = Receita()
    with pytest.raises(ValueError):
        receitaNova.preco=0

def test_rendimento_valido():
    receita = Receita()
    receita.rendimento = 30
    assert receita.rendimento == 30
    assert receita.rendimento == 29
