from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita
from typing import List

class ListarReceitas:
    def __init__(self, repositorio: RepositorioDeReceita):
        self.__repositorio = repositorio

    def executar(self, user_id: str, limit: int = 100, skip: int = 0, q: str = None) -> tuple[List[Receita], int]:
        return self.__repositorio.listar_por_usuario(user_id, limit, skip, q)
