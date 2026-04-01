from datetime import datetime

class User:
    def __init__(self):
        self.__id = None
        self.__email = None
        self.__first_name = None
        self.__last_name = None
        self.__role = "Confeiteiro"
        self.__created_at = datetime.now()

    @property
    def id(self) -> int:
        return self.__id

    @id.setter
    def id(self, value: int) -> None:
        if value is None:
            raise ValueError("ID do usuário é obrigatório")
        self.__id = value

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, value: str) -> None:
        if not value or "@" not in value:
            raise ValueError("E-mail inválido")
        self.__email = value

    @property
    def first_name(self) -> str:
        return self.__first_name

    @first_name.setter
    def first_name(self, value: str) -> None:
        if not value or value.strip() == "":
            raise ValueError("Nome é obrigatório")
        self.__first_name = value

    @property
    def last_name(self) -> str:
        return self.__last_name

    @last_name.setter
    def last_name(self, value: str) -> None:
        self.__last_name = value

    @property
    def role(self) -> str:
        return self.__role

    @role.setter
    def role(self, value: str) -> None:
        allowed_roles = ["Admin", "Confeiteiro"]
        if value not in allowed_roles:
            raise ValueError(f"Papel inválido. Deve ser um de: {', '.join(allowed_roles)}")
        self.__role = value

    @property
    def created_at(self) -> datetime:
        return self.__created_at
