from src.application.gateways.repositorioDeReceita import RepositorioDeReceita
from src.domain.entity.receita.receita import Receita



class CriarReceita():
    def __init__(self, repositorioDeReceita: RepositorioDeReceita):
        self.__repositorioDeReceita = repositorioDeReceita
       
    def executar(self, receita: Receita) -> Receita:
        return self.__repositorioDeReceita.criar_receita(receita)


    