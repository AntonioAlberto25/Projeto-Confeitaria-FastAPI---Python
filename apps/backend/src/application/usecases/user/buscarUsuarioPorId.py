from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from src.domain.entity.user.user import User
from typing import Optional

class BuscarUsuarioPorId:
    def __init__(self, repositorio: RepositorioDeUsuario):
        self.__repositorio = repositorio

    def executar(self, user_id: str) -> Optional[User]:
        return self.__repositorio.buscar_por_id(user_id)
