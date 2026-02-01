from src.application.gateways.repositorioDeReceita import RepostorioDeReceita
from src.domain.entity.receita.receita import Receita



class CriarReceita():
    def __init__(self, repositorioDeReceita: RepostorioDeReceita):
        self.__repositorioDeReceita = repositorioDeReceita
       
    def criar_receita(self, receita: Receita) -> Receita:
        return self.__repositorioDeReceita.criar_receita(receita)


    