import pytest
from src.domain.entity.user.user import User

def test_user_creation_valid():
    user = User()
    user.id = "user_123"
    user.email = "test@example.com"
    user.first_name = "Jhonatas"
    user.last_name = "Junior"
    user.role = "Admin"
    
    assert user.id == "user_123"
    assert user.email == "test@example.com"
    assert user.first_name == "Jhonatas"
    assert user.last_name == "Junior"
    assert user.role == "Admin"

def test_user_creation_default_role():
    user = User()
    assert user.role == "Confeiteiro"

def test_user_invalid_email():
    user = User()
    with pytest.raises(ValueError, match="E-mail inválido"):
        user.email = "invalid-email"

def test_user_invalid_role():
    user = User()
    with pytest.raises(ValueError, match="Papel inválido"):
        user.role = "Hacker"

def test_user_empty_id():
    user = User()
    with pytest.raises(ValueError, match="ID do usuário é obrigatório"):
        user.id = " "
