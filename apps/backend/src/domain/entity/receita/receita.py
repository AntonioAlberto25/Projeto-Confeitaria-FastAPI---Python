from datetime import datetime

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
        return self.__rendimento

    @rendimento.setter
    def rendimento(self, valor: int) -> None:
        if valor is not None and valor <= 0:
            raise ValueError("O rendimento deve ser maior que zero.")
        self.__rendimento = valor

    def consumir(self, quantidade: int) -> None:
        """Abate porções do rendimento disponível ao processar um pedido.

        Raises:
            ValueError: se quantidade for inválida ou se o rendimento
                        ficar negativo após o consumo.
        """
        if quantidade <= 0:
            raise ValueError("A quantidade a consumir deve ser maior que zero.")
        if self.__rendimento is None:
            raise ValueError("Rendimento não definido para esta receita.")
        if quantidade > self.__rendimento:
            raise ValueError(
                f"Rendimento insuficiente: disponível {self.__rendimento}, "
                f"solicitado {quantidade}."
            )
        self.__rendimento -= quantidade



    @property
    def idUsuario(self) ->int:
        return self.__idUsuario
    
    @idUsuario.setter
    def idUsuario(self,idUsuario:int) -> None:
        if(idUsuario is None or idUsuario==0):
            raise("Receita tem que ser atrelada ao usuario")
        self.__idUsuario = idUsuario

