from datetime import date
from decimal import Decimal


class Pedido:
    def __init__(self):
        self.__id = None
        self.__cliente_nome = None
        self.__cliente_tel = None
        self.__descricao = None
        self.__observacoes = None
        self.__tipo_entrega = None
        self.__preco_total = None
        self.__data_entrega = None
        self.__user_id = None
        self.__receita_id = None
        self.__status = None

    # ── id ──────────────────────────────────────────────────────────────────

    @property
    def id(self) -> str:
        return self.__id

    @id.setter
    def id(self, valor: str) -> None:
        self.__id = valor

    # ── cliente_nome ─────────────────────────────────────────────────────────

    @property
    def cliente_nome(self) -> str:
        return self.__cliente_nome

    @cliente_nome.setter
    def cliente_nome(self, valor: str) -> None:
        if valor is None or valor.strip() == "":
            raise ValueError("O nome do cliente é obrigatório.")
        self.__cliente_nome = valor.strip()

    # ── cliente_tel ──────────────────────────────────────────────────────────

    @property
    def cliente_tel(self) -> str:
        return self.__cliente_tel

    @cliente_tel.setter
    def cliente_tel(self, valor: str) -> None:
        self.__cliente_tel = valor

    # ── descricao ────────────────────────────────────────────────────────────

    @property
    def descricao(self) -> str:
        return self.__descricao

    @descricao.setter
    def descricao(self, valor: str) -> None:
        self.__descricao = valor

    # ── observacoes ──────────────────────────────────────────────────────────

    @property
    def observacoes(self) -> str:
        return self.__observacoes

    @observacoes.setter
    def observacoes(self, valor: str) -> None:
        self.__observacoes = valor

    # ── tipo_entrega ─────────────────────────────────────────────────────────

    @property
    def tipo_entrega(self) -> str:
        return self.__tipo_entrega

    @tipo_entrega.setter
    def tipo_entrega(self, valor: str) -> None:
        self.__tipo_entrega = valor

    # ── preco_total ──────────────────────────────────────────────────────────

    @property
    def preco_total(self) -> Decimal:
        return self.__preco_total

    @preco_total.setter
    def preco_total(self, valor: Decimal) -> None:
        if valor is not None and valor < 0:
            raise ValueError("O preço total não pode ser negativo.")
        self.__preco_total = valor

    # ── data_entrega ─────────────────────────────────────────────────────────

    @property
    def data_entrega(self) -> date:
        return self.__data_entrega

    @data_entrega.setter
    def data_entrega(self, valor: date) -> None:
        self.__data_entrega = valor

    # ── user_id ──────────────────────────────────────────────────────────────

    @property
    def user_id(self) -> str:
        return self.__user_id

    @user_id.setter
    def user_id(self, valor: str) -> None:
        self.__user_id = valor

    # ── status ───────────────────────────────────────────────────────────────

    @property
    def status(self) -> str:
        return self.__status

    @status.setter
    def status(self, valor: str) -> None:
        self.__status = valor

    # ── receita_id ───────────────────────────────────────────────────────────

    @property
    def receita_id(self) -> str:
        return self.__receita_id

    @receita_id.setter
    def receita_id(self, valor: str) -> None:
        self.__receita_id = valor
