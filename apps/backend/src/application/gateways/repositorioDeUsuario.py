from abc import ABC, abstractmethod
from typing import Optional
from src.domain.entity.user.user import User


class RepositorioDeUsuario(ABC):
    """
    Contrato de acesso a dados de usuários.
    O ID do usuário é uma string proveniente do Clerk (Auth-as-a-Service).
    Não existe lógica de senha nesta camada — o Clerk é o responsável.
    """

    @abstractmethod
    def registrar_usuario(self, user: User) -> User:
        """
        Persiste a projeção local do perfil recebido do Clerk.
        Chamado no primeiro acesso ou ao sincronizar dados de webhook.
        """
        pass

    @abstractmethod
    def buscar_por_id(self, id: str) -> Optional[User]:
        """
        Retorna o perfil local do usuário pelo ID do Clerk,
        ou None caso ainda não possua projeção local.
        """
        pass
