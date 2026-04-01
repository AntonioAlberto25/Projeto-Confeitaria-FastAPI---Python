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
    assert receita.rendimento == 30  # leitura não muta estado


def test_cpf_usuario():
    receitaNova = Receita()
    receitaNova.idUsuario=2
    assert receitaNova.idUsuario==2


# --- consumir() ---

def test_consumir_abate_porcoes():
    receita = Receita()
    receita.rendimento = 30
    receita.consumir(10)
    assert receita.rendimento == 20

def test_consumir_exato_zera_rendimento():
    receita = Receita()
    receita.rendimento = 10
    receita.consumir(10)
    assert receita.rendimento == 0

def test_consumir_acima_do_disponivel_levanta_erro():
    receita = Receita()
    receita.rendimento = 5
    with pytest.raises(ValueError, match="Rendimento insuficiente"):
        receita.consumir(6)

def test_consumir_quantidade_invalida_levanta_erro():
    receita = Receita()
    receita.rendimento = 10
    with pytest.raises(ValueError):
        receita.consumir(0)

def test_consumir_sem_rendimento_definido_levanta_erro():
    receita = Receita()
    with pytest.raises(ValueError, match="Rendimento não definido"):
        receita.consumir(1)

