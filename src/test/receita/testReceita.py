import pytest
from src.omain.entity.receita.receita import Receita

def test_preco_invalido():
    receitaNova = Receita()
    # espera que lançar TypeError ao tentar atribuir preco incorretamente
    with pytest.raises(TypeError):
        receitaNova.preco(0)   # cuidado: aqui no seu código original você chamou como função

def test_rendimento_valido():
    receita = Receita()
    receita.rendimento = 30
    assert receita.rendimento == 30

def test_rendimento_invalido():
    receita = Receita()
    receita.rendimento = 30
    # esse teste vai falhar de propósito, porque 30 != 29
    assert receita.rendimento == 29