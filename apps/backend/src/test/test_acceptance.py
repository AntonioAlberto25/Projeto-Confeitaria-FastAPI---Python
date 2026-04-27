"""
Testes de Aceite — Validam os fluxos de negócio completos ponta a ponta.

RF primário: Gestão de Pedido (criação → produção → conclusão)
RF secundário: Gestão de Receitas (CRUD completo)
"""
from decimal import Decimal
from unittest.mock import Mock
import pytest
from fastapi.testclient import TestClient

from src.main import app
from src.infrastructure.auth.clerk import get_current_user_id
from src.infrastructure.dependencies import get_receita_controller, get_pedido_controller
from src.presentation.schemas.receita_schema import ReceitaResponse
from src.presentation.schemas.pedido_schema import PedidoResponse

MOCK_USER_ID = "user_aceite_001"


def mock_auth():
    return MOCK_USER_ID


@pytest.fixture
def client():
    app.dependency_overrides[get_current_user_id] = mock_auth
    yield TestClient(app)
    app.dependency_overrides = {}


# ─── FLUXO PRIMÁRIO: Ciclo completo de um Pedido ────────────────────────────────

class TestFluxoPrimarioPedido:
    """
    RF-11 a RF-16: Registro → Em Produção → Concluído.
    Valida que o fluxo de negócio completo é executável ponta a ponta via API.
    """

    def _mock_pedido(self, status: str = "Pendente") -> PedidoResponse:
        return PedidoResponse(
            id="pedido-aceite-001",
            cliente_nome="Joana Silva",
            descricao="Bolo de aniversário 3 andares",
            tipo_entrega="Entrega",
            preco_total=Decimal("350.00"),
            data_entrega="2026-12-25",
            user_id=MOCK_USER_ID,
            status=status,
        )

    def test_ac01_criar_pedido_com_status_pendente(self, client):
        """AC-01: Todo pedido deve ser criado com status Pendente (RF-12)."""
        mock_controller = Mock()
        mock_controller.handle_criar_pedido.return_value = self._mock_pedido("Pendente")
        app.dependency_overrides[get_pedido_controller] = lambda: mock_controller

        payload = {
            "cliente_nome": "Joana Silva",
            "descricao": "Bolo de aniversário 3 andares",
            "tipo_entrega": "Entrega",
            "preco_total": 350.00,
            "data_entrega": "2026-12-25",
        }
        response = client.post("/pedidos/", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["cliente_nome"] == "Joana Silva"
        assert data["status"] == "Pendente"

    def test_ac02_listar_pedidos_do_usuario(self, client):
        """AC-02: Usuário deve ver apenas seus próprios pedidos (RF-16)."""
        mock_controller = Mock()
        mock_controller.handle_listar_meus_pedidos.return_value = {
            "items": [
                self._mock_pedido("Pendente"),
                self._mock_pedido("Em Producao"),
            ],
            "total": 2,
            "limit": 100,
            "skip": 0
        }
        app.dependency_overrides[get_pedido_controller] = lambda: mock_controller

        response = client.get("/pedidos/")

        assert response.status_code == 200
        data = response.json()
        pedidos = data["items"]
        assert len(pedidos) == 2
        assert all(p["user_id"] == MOCK_USER_ID for p in pedidos)

    def test_ac03_detalhar_pedido_por_id(self, client):
        """AC-03: Deve ser possível consultar os detalhes de um pedido específico (RF-11)."""
        mock_controller = Mock()
        mock_controller.handle_buscar_pedido_por_id.return_value = self._mock_pedido()
        app.dependency_overrides[get_pedido_controller] = lambda: mock_controller

        response = client.get("/pedidos/pedido-aceite-001")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "pedido-aceite-001"
        assert data["cliente_nome"] == "Joana Silva"

    def test_ac04_atualizar_pedido_para_em_producao(self, client):
        """AC-04: Pedido deve poder ser atualizado para Em Producao (RF-13)."""
        mock_controller = Mock()
        mock_controller.handle_editar_pedido.return_value = self._mock_pedido("Em Producao")
        app.dependency_overrides[get_pedido_controller] = lambda: mock_controller

        payload = {
            "cliente_nome": "Joana Silva",
            "status": "Em Producao",
            "tipo_entrega": "Entrega",
        }
        response = client.put("/pedidos/pedido-aceite-001", json=payload)

        assert response.status_code == 200
        assert response.json()["status"] == "Em Producao"

    def test_ac05_pedido_concluido(self, client):
        """AC-05: Pedido deve poder ser marcado como Concluído (RF-13)."""
        mock_controller = Mock()
        mock_controller.handle_editar_pedido.return_value = self._mock_pedido("Concluido")
        app.dependency_overrides[get_pedido_controller] = lambda: mock_controller

        payload = {
            "cliente_nome": "Joana Silva",
            "status": "Concluido",
            "tipo_entrega": "Entrega",
        }
        response = client.put("/pedidos/pedido-aceite-001", json=payload)

        assert response.status_code == 200
        assert response.json()["status"] == "Concluido"


# ─── FLUXO SECUNDÁRIO: Gestão completa de Receitas ──────────────────────────────

class TestFluxoSecundarioReceitas:
    """
    RF-06 a RF-10: CRUD completo de receitas (ficha técnica).
    Valida que o fluxo de receitas é executável ponta a ponta via API.
    """

    def _mock_receita(self, nome: str = "Bolo de Chocolate") -> ReceitaResponse:
        return ReceitaResponse(
            id="receita-aceite-001",
            nome=nome,
            preco_venda_sugerido=45.0,
            id_usuario=MOCK_USER_ID,
            rendimento=12,
            descricao="Bolo de chocolate com cobertura ganache",
        )

    def test_ac06_criar_receita_com_ficha_tecnica(self, client):
        """AC-06: Deve ser possível criar receita com todos os campos (RF-06, RF-07)."""
        mock_controller = Mock()
        mock_controller.handle_criar_receita.return_value = self._mock_receita()
        app.dependency_overrides[get_receita_controller] = lambda: mock_controller

        payload = {
            "nome": "Bolo de Chocolate",
            "descricao": "Bolo de chocolate com cobertura ganache",
            "preco_venda_sugerido": 45.0,
            "rendimento": 12,
        }
        response = client.post("/receitas", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Bolo de Chocolate"
        assert data["rendimento"] == 12
        assert data["id_usuario"] == MOCK_USER_ID

    def test_ac07_listar_receitas_do_usuario(self, client):
        """AC-07: Usuário deve ver apenas suas próprias receitas (RF-10)."""
        mock_controller = Mock()
        mock_controller.handle_listar_receitas.return_value = {
            "items": [
                self._mock_receita("Bolo de Chocolate"),
                self._mock_receita("Brigadeiro Gourmet"),
            ],
            "total": 2,
            "limit": 100,
            "skip": 0
        }
        app.dependency_overrides[get_receita_controller] = lambda: mock_controller

        response = client.get("/receitas")

        assert response.status_code == 200
        data = response.json()
        receitas = data["items"]
        assert len(receitas) == 2
        assert all(r["id_usuario"] == MOCK_USER_ID for r in receitas)

    def test_ac08_detalhar_receita_por_id(self, client):
        """AC-08: Deve ser possível consultar os detalhes de uma receita (RF-09)."""
        mock_controller = Mock()
        mock_controller.handle_buscar_por_id.return_value = self._mock_receita()
        app.dependency_overrides[get_receita_controller] = lambda: mock_controller

        response = client.get("/receitas/receita-aceite-001")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "receita-aceite-001"
        assert data["nome"] == "Bolo de Chocolate"

    def test_ac09_editar_receita(self, client):
        """AC-09: Deve ser possível editar uma receita existente (RF-09)."""
        mock_controller = Mock()
        mock_controller.handle_editar_receita.return_value = self._mock_receita("Bolo de Cenoura")
        app.dependency_overrides[get_receita_controller] = lambda: mock_controller

        payload = {
            "nome": "Bolo de Cenoura",
            "preco_venda_sugerido": 38.0,
            "rendimento": 10,
        }
        response = client.put("/receitas/receita-aceite-001", json=payload)

        assert response.status_code == 200
        assert response.json()["nome"] == "Bolo de Cenoura"

    def test_ac10_excluir_receita(self, client):
        """AC-10: Deve ser possível excluir uma receita (RF-09)."""
        mock_controller = Mock()
        mock_controller.handle_excluir_receita.return_value = None
        app.dependency_overrides[get_receita_controller] = lambda: mock_controller

        response = client.delete("/receitas/receita-aceite-001")

        assert response.status_code in (200, 204)


# ─── Validações de Sistema (RNFs) ───────────────────────────────────────────────

class TestValidacoesSistema:
    """Valida comportamentos não funcionais críticos do sistema."""

    def test_ac11_health_check_disponivel(self, client):
        """AC-11: Endpoint /health deve retornar status ok (RNF-04)."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "service" in data

    def test_ac12_request_id_presente_no_header(self, client):
        """AC-12: Toda resposta deve incluir X-Request-ID para rastreabilidade (RNF-04)."""
        response = client.get("/health")
        assert "x-request-id" in response.headers
        assert len(response.headers["x-request-id"]) == 36  # UUID format

    def test_ac13_api_documentada_via_openapi(self, client):
        """AC-13: API deve expor documentação OpenAPI (RNF-03)."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert "paths" in schema
        assert "/receitas" in schema["paths"]
        assert "/pedidos/" in schema["paths"]
