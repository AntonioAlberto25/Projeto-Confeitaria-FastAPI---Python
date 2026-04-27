from decimal import Decimal
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock
from src.main import app
from src.infrastructure.auth.clerk import get_current_user_id
from src.infrastructure.dependencies import get_receita_controller, get_pedido_controller
from src.presentation.schemas.receita_schema import ReceitaResponse
from src.presentation.schemas.pedido_schema import PedidoResponse

# Mock user_id for tests
MOCK_USER_ID = "user_123"

def mock_get_current_user_id():
    return MOCK_USER_ID

@pytest.fixture
def client():
    # Override authentication dependency
    app.dependency_overrides[get_current_user_id] = mock_get_current_user_id
    yield TestClient(app)
    # Reset overrides after each test
    app.dependency_overrides = {}

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["service"] == "confeitaria-api"

def test_listar_receitas_empty(client):
    # Mock controller to return paginated response structure
    mock_controller = Mock()
    mock_controller.handle_listar_receitas.return_value = {
        "items": [],
        "total": 0,
        "limit": 100,
        "skip": 0
    }
    app.dependency_overrides[get_receita_controller] = lambda: mock_controller
    
    response = client.get("/receitas")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0

def test_criar_receita(client):
    # Mock controller response
    mock_controller = Mock()
    mock_response = ReceitaResponse(
        id="1",
        nome="Bolo",
        preco_venda_sugerido=10.5,
        id_usuario=MOCK_USER_ID,
        rendimento=10,
        descricao="Teste"
    )
    mock_controller.handle_criar_receita.return_value = mock_response
    app.dependency_overrides[get_receita_controller] = lambda: mock_controller
    
    payload = {
        "nome": "Bolo",
        "preco_venda_sugerido": 10.5,
        "rendimento": 10,
        "descricao": "Teste"
    }
    response = client.post("/receitas", json=payload)
    assert response.status_code == 201
    assert response.json()["nome"] == "Bolo"

def test_listar_pedidos_empty(client):
    # Mock controller to return paginated response structure
    mock_controller = Mock()
    mock_controller.handle_listar_meus_pedidos.return_value = {
        "items": [],
        "total": 0,
        "limit": 100,
        "skip": 0
    }
    app.dependency_overrides[get_pedido_controller] = lambda: mock_controller
    
    response = client.get("/pedidos/")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0

def test_buscar_receita_por_id(client):
    mock_controller = Mock()
    mock_response = ReceitaResponse(
        id="1",
        nome="Bolo",
        preco_venda_sugerido=10.5,
        id_usuario=MOCK_USER_ID,
        rendimento=10,
        descricao="Teste"
    )
    # The actual controller method is handle_buscar_por_id
    mock_controller.handle_buscar_por_id.return_value = mock_response
    app.dependency_overrides[get_receita_controller] = lambda: mock_controller
    
    response = client.get("/receitas/1")
    assert response.status_code == 200
    assert response.json()["nome"] == "Bolo"

def test_criar_pedido(client):
    mock_controller = Mock()
    mock_response = PedidoResponse(
        id="1",
        cliente_nome="Maria",
        descricao="Desc",
        tipo_entrega="Entrega",
        preco_total=Decimal("100.00"),
        data_entrega="2023-12-31",
        user_id=MOCK_USER_ID,
        status="Pendente"
    )
    mock_controller.handle_criar_pedido.return_value = mock_response
    app.dependency_overrides[get_pedido_controller] = lambda: mock_controller
    
    payload = {
        "cliente_nome": "Maria",
        "descricao": "Desc",
        "preco_total": 100.00,
        "tipo_entrega": "Entrega",
        "data_entrega": "2023-12-31"
    }
    response = client.post("/pedidos/", json=payload)
    assert response.status_code == 201
    assert response.json()["cliente_nome"] == "Maria"

def test_buscar_pedido_por_id(client):
    mock_controller = Mock()
    mock_response = PedidoResponse(
        id="1",
        cliente_nome="Maria",
        descricao="Desc",
        tipo_entrega="Entrega",
        preco_total=Decimal("100.00"),
        data_entrega="2023-12-31",
        user_id=MOCK_USER_ID,
        status="Pendente"
    )
    mock_controller.handle_buscar_pedido_por_id.return_value = mock_response
    app.dependency_overrides[get_pedido_controller] = lambda: mock_controller
    
    response = client.get("/pedidos/1")
    assert response.status_code == 200
    assert response.json()["cliente_nome"] == "Maria"

def test_editar_receita(client):
    mock_controller = Mock()
    mock_response = ReceitaResponse(
        id="1",
        nome="Bolo editado",
        preco_venda_sugerido=15.0,
        id_usuario=MOCK_USER_ID,
        rendimento=12,
        descricao="Teste editado"
    )
    mock_controller.handle_editar_receita.return_value = mock_response
    app.dependency_overrides[get_receita_controller] = lambda: mock_controller
    
    payload = {
        "nome": "Bolo editado",
        "preco_venda_sugerido": 15.0,
        "rendimento": 12,
        "descricao": "Teste editado"
    }
    response = client.put("/receitas/1", json=payload)
    assert response.status_code == 200
    assert response.json()["nome"] == "Bolo editado"
    assert response.json()["preco_venda_sugerido"] == 15.0

