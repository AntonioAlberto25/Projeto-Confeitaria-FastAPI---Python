import pytest
from datetime import datetime
from src.domain.entity.user.user import User
from src.infrastructure.persistencia.userModel import UserModel
from src.infrastructure.mappers.userMapper import UserMapper


def test_user_mapper_to_domain():
    now = datetime.now()
    model = UserModel(
        id=99,
        email="test@user.com",
        first_name="Jane",
        last_name="Doe",
        role="Admin",
        created_at=now
    )

    domain = UserMapper.to_domain(model)

    assert domain.id == 99
    assert domain.email == "test@user.com"
    assert domain.first_name == "Jane"
    assert domain.last_name == "Doe"
    assert domain.role == "Admin"
    assert domain.created_at == now


def test_user_mapper_to_model():
    domain = User()
    domain.id = 55
    domain.email = "baker@bakery.com"
    domain.first_name = "Bob"
    domain.last_name = "Baker"
    domain.role = "Confeiteiro"
    
    # Store the creation time mapping internally since it generated uniquely upon object instantiation
    creation_time = domain.created_at

    model = UserMapper.to_model(domain)

    assert model.id == 55
    assert model.email == "baker@bakery.com"
    assert model.first_name == "Bob"
    assert model.last_name == "Baker"
    assert model.role == "Confeiteiro"
    assert model.created_at == creation_time
