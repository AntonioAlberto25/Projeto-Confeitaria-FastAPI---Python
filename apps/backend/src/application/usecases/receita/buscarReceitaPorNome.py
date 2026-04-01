from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita
from typing import List

class BuscarReceitaPorNome:
    def __init__(self, repositorio: RepositorioDeReceita):
        self.__repositorio = repositorio

    def executar(self, user_id: str, nome: str) -> List[Receita]:
        return self.__repositorio.buscar_por_nome(user_id, nome)
