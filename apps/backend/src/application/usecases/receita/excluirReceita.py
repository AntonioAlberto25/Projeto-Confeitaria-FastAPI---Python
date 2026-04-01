from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita

class ExcluirReceita:
    def __init__(self, repositorio: RepositorioDeReceita):
        self.__repositorio = repositorio

    def executar(self, receita: Receita) -> None:
        return self.__repositorio.excluir_receita(receita)
