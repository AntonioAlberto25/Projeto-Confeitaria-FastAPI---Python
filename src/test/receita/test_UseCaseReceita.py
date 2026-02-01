import pytest
from unittest.mock import Mock
from src.application.usecases.receita.criarReceita import CriarReceita
from src.domain.entity.receita.receita import Receita

def test_criar_receita_chama_repositorio():
    # Arrange: cria um mock do repositório
    repositorio_mock = Mock()
    receita_fake = Receita()
    receita_fake.nome="Bolo de Chocolate"
    receita_fake.preco=20.0
    receita_fake.rendimento=8

    repositorio_mock.criar_receita.return_value = receita_fake

    usecase = CriarReceita(repositorio_mock)

    # Act: chama o usecase
    resultado = usecase.criar_receita(receita_fake)

    # Assert: verifica se o repositório foi chamado corretamente
    repositorio_mock.criar_receita.assert_called_once_with(receita_fake)
    assert resultado == receita_fake