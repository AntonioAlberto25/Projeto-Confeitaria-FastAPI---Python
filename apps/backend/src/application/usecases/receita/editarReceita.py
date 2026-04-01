from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita

class EditarReceita:
    def __init__(self, repositorio: RepositorioDeReceita):
        self.__repositorio = repositorio

    def executar(self, receita: Receita) -> Receita:
        return self.__repositorio.editar_receita(receita)
