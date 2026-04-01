from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from src.domain.entity.user.user import User

class RegistrarUsuario:
    def __init__(self, repositorio: RepositorioDeUsuario):
        self.__repositorio = repositorio

    def executar(self, user: User) -> User:
        return self.__repositorio.registrar_usuario(user)
