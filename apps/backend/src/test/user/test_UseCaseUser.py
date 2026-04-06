from unittest.mock import Mock
from src.application.usecases.user.registrarUsuario import RegistrarUsuario
from src.application.usecases.user.buscarUsuarioPorId import BuscarUsuarioPorId
from src.domain.entity.user.user import User

def test_registrar_usuario_chama_repositorio():
    repositorio_mock = Mock()
    user_fake = User()
    user_fake.id = "user_123"
    user_fake.email = "test@example.com"
    repositorio_mock.registrar_usuario.return_value = user_fake

    usecase = RegistrarUsuario(repositorio_mock)
    resultado = usecase.executar(user_fake)

    repositorio_mock.registrar_usuario.assert_called_once_with(user_fake)
    assert resultado == user_fake

def test_buscar_usuario_por_id_chama_repositorio():
    repositorio_mock = Mock()
    user_id = "user_123"
    user_fake = User()
    user_fake.id = user_id
    repositorio_mock.buscar_por_id.return_value = user_fake

    usecase = BuscarUsuarioPorId(repositorio_mock)
    resultado = usecase.executar(user_id)

    repositorio_mock.buscar_por_id.assert_called_once_with(user_id)
    assert resultado == user_fake
