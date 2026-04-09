from datetime import datetime

class Receita:
    def __init__(self):
        self.__id = None
        self.__nome = None
        self.__preco_venda_sugerido = None
        self.__descricao = None
        self.__rendimento = None
        self.__tempo_preparo = None
        self.__modo_preparo = None
        self.__idUsuario = None

    @property
    def id(self) -> str:
        return self.__id

    @id.setter
    def id(self, valor: str) -> None:
        self.__id = valor

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if valor and valor.strip() == "":
            raise ValueError("Nome deve ter valor")
        self.__nome = valor

    @property
    def preco_venda_sugerido(self) -> float:
        return self.__preco_venda_sugerido

    @preco_venda_sugerido.setter
    def preco_venda_sugerido(self, valor: float) -> None:
        if valor is not None and valor <= 0:
            raise ValueError("O preço está inválido")
        self.__preco_venda_sugerido = valor

    @property
    def preco(self) -> float: # Alias for compatibility if needed
        return self.__preco_venda_sugerido

    @property
    def descricao(self) -> str:
        return self.__descricao

    @descricao.setter
    def descricao(self, valor: str) -> None:
        self.__descricao = valor

    @property
    def rendimento(self) -> str:
        return self.__rendimento

    @rendimento.setter
    def rendimento(self, valor: str) -> None:
        self.__rendimento = valor

    @property
    def tempo_preparo(self) -> int:
        return self.__tempo_preparo

    @tempo_preparo.setter
    def tempo_preparo(self, valor: int) -> None:
        self.__tempo_preparo = valor

    @property
    def modo_preparo(self) -> str:
        return self.__modo_preparo

    @modo_preparo.setter
    def modo_preparo(self, valor: str) -> None:
        self.__modo_preparo = valor

    @property
    def idUsuario(self) -> str:
        return self.__idUsuario
    
    @idUsuario.setter
    def idUsuario(self, idUsuario: str) -> None:
        if not idUsuario:
            raise ValueError("Receita tem que ser atrelada ao usuario")
        self.__idUsuario = idUsuario

