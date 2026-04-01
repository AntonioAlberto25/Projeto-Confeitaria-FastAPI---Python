from src.application.gateways.repositorioDeUsuario import RepositorioDeUsuario
from src.domain.entity.user.user import User
from typing import Dict, Any

class UserController:
    def __init__(self, repository: RepositorioDeUsuario):
        self.repository = repository

    def registrar_novo_usuario_clerk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Registra localmente um usuário vindo do Clerk (ex: via webhook ou primeiro acesso).
        """
        user = User()
        user.id = data.get("id")
        user.email = data.get("email")
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.role = data.get("role", "Confeiteiro")
        
        resultado = self.repository.registrar_usuario(user)
        
        return {
            "status": "sucesso",
            "user_id_local": resultado.id,
            "email": resultado.email
        }
