import pytest
from unittest.mock import Mock
from src.application.usecases.receita.criarReceita import CriarReceita
from src.application.usecases.receita.listarReceitas import ListarReceitas
from src.application.usecases.receita.buscarReceitaPorId import BuscarReceitaPorId
from src.application.usecases.receita.buscarReceitaPorNome import BuscarReceitaPorNome
from src.application.usecases.receita.editarReceita import EditarReceita
from src.application.usecases.receita.excluirReceita import ExcluirReceita
from src.domain.entity.receita.receita import Receita

def test_criar_receita_chama_repositorio():
    repositorio_mock = Mock()
    receita_fake = Receita()
    receita_fake.nome="Bolo de Chocolate"
    receita_fake.preco=20.0
    receita_fake.rendimento=8

    repositorio_mock.criar_receita.return_value = receita_fake

    usecase = CriarReceita(repositorio_mock)

    resultado = usecase.executar(receita_fake)

    repositorio_mock.criar_receita.assert_called_once_with(receita_fake)
    assert resultado == receita_fake

def test_listar_receitas_chama_repositorio():
    repositorio_mock = Mock()
    user_id = "user_123"
    receitas_fake = [Receita(), Receita()]
    repositorio_mock.listar_por_usuario.return_value = receitas_fake

    usecase = ListarReceitas(repositorio_mock)
    resultado = usecase.executar(user_id)

    repositorio_mock.listar_por_usuario.assert_called_once_with(user_id)
    assert resultado == receitas_fake

def test_buscar_receita_por_id_chama_repositorio():
    repositorio_mock = Mock()
    receita_id = 1
    receita_fake = Receita()
    repositorio_mock.buscar_por_id.return_value = receita_fake

    usecase = BuscarReceitaPorId(repositorio_mock)
    resultado = usecase.executar(receita_id)

    repositorio_mock.buscar_por_id.assert_called_once_with(receita_id)
    assert resultado == receita_fake

def test_buscar_receita_por_nome_chama_repositorio():
    repositorio_mock = Mock()
    user_id = "user_123"
    nome = "Bolo"
    receitas_fake = [Receita()]
    repositorio_mock.buscar_por_nome.return_value = receitas_fake

    usecase = BuscarReceitaPorNome(repositorio_mock)
    resultado = usecase.executar(user_id, nome)

    repositorio_mock.buscar_por_nome.assert_called_once_with(user_id, nome)
    assert resultado == receitas_fake

def test_editar_receita_chama_repositorio():
    repositorio_mock = Mock()
    receita_fake = Receita()
    repositorio_mock.editar_receita.return_value = receita_fake

    usecase = EditarReceita(repositorio_mock)
    resultado = usecase.executar(receita_fake)

    repositorio_mock.editar_receita.assert_called_once_with(receita_fake)
    assert resultado == receita_fake

def test_excluir_receita_chama_repositorio():
    repositorio_mock = Mock()
    receita_id = 1
    repositorio_mock.excluir_receita.return_value = True

    usecase = ExcluirReceita(repositorio_mock)
    resultado = usecase.executar(receita_id)

    repositorio_mock.excluir_receita.assert_called_once_with(receita_id)
    assert resultado is True