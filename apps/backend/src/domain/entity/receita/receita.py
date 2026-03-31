from datetime import datetime
import re

class Receita:
    def __init__(self):
        self.__nome = None
        self.__preco = None
        self.__descricao = None
        self.__dataCriacao = None
        self.__rendimento = None
        self.__idUsuario = None

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if(valor.strip()==""):
            raise("Nome deve ter valor")
        self.__nome = valor

    @property
    def preco(self) -> float:
        return self.__preco

    @preco.setter
    def preco(self, valor: float) -> None:
        if valor is not None and valor <= 0:
            raise ValueError("O preço está invalido")
        self.__preco = valor

    @property
    def descricao(self) -> str:
        return self.__descricao

    @descricao.setter
    def descricao(self, valor: str) -> None:
        self.__descricao = valor

    @property
    def dataCriacao(self) -> datetime:
        return self.__dataCriacao

    @dataCriacao.setter
    def dataCriacao(self, valor: datetime) -> None:
        self.__dataCriacao = valor

    @property
    def rendimento(self) -> int:
        valorAtual=self.__rendimento
        self.__rendimento-=1
        return valorAtual

    @rendimento.setter
    def rendimento(self, valor: int) -> None:
        if valor is not None and valor <= 0:
            raise ValueError("O rendimento deve ser maior que zero.")
        self.__rendimento = valor

    @property
    def idUsuario(self) ->int:
        return self.__idUsuario
    
    @idUsuario.setter
    def idUsuario(self,idUsuario:int) -> None:
        if(idUsuario is None or idUsuario==0):
            raise("Receita tem que ser atrelada ao usuario")
        self.__idUsuario = idUsuario
