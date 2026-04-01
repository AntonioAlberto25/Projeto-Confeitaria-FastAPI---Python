from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita
from typing import Optional

class BuscarReceitaPorId:
    def __init__(self, repositorio: RepositorioDeReceita):
        self.__repositorio = repositorio

    def executar(self, id: int) -> Optional[Receita]:
        return self.__repositorio.buscar_por_id(id)
