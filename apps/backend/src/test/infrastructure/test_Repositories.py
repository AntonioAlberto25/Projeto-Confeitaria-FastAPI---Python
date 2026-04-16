from unittest.mock import Mock, MagicMock
from src.infrastructure.gateway.receitaRepository import ReceitaRepository
from src.infrastructure.gateway.pedidoRepository import PedidoRepository
from src.infrastructure.repositorios.repositorioDeReceitaSQLAlchemy import RepositorioDeReceitaSQLAlchemy
from src.infrastructure.repositorios.repositorioDePedidoSQLAlchemy import RepositorioDePedidoSQLAlchemy
from src.infrastructure.repositorios.repositorioDeUsuarioSQLAlchemy import RepositorioDeUsuarioSQLAlchemy
from src.domain.entity.receita.receita import Receita
from src.domain.entity.pedido.pedido import Pedido
from src.domain.entity.user.user import User
from decimal import Decimal

def test_receita_repository_criar():
    db_mock = MagicMock()
    repo = ReceitaRepository(db_mock)
    
    receita = Receita()
    receita.nome = "Bolo"
    receita.preco_venda_sugerido = 10.0
    receita.idUsuario = "user_1"
    
    resultado = repo.criar_receita(receita)
    
    assert db_mock.add.called
    assert db_mock.commit.called
    assert db_mock.refresh.called
    assert resultado.nome == "Bolo"

def test_pedido_repository_criar():
    db_mock = MagicMock()
    repo = PedidoRepository(db_mock)
    
    pedido = Pedido()
    pedido.cliente_nome = "Maria"
    pedido.preco_total = Decimal("100.00")
    pedido.user_id = "user_1"
    
    resultado = repo.criar_pedido(pedido)
    
    assert db_mock.add.called
    assert db_mock.commit.called
    assert db_mock.refresh.called
    assert resultado.cliente_nome == "Maria"

def test_receita_repository_buscar_por_id():
    db_mock = MagicMock()
    model_mock = Mock()
    model_mock.nome = "Bolo"
    model_mock.preco_venda_sugerido = 10.0
    model_mock.usuario_id = "user_1"
    model_mock.descricao = "Teste"
    model_mock.rendimento = 10
    model_mock.tempo_preparo = 60
    model_mock.modo_preparo = "Assar"
    
    db_mock.query().filter().first.return_value = model_mock
    
    repo = ReceitaRepository(db_mock)
    resultado = repo.buscar_por_id("1")
    
    assert resultado.nome == "Bolo"
    assert resultado.idUsuario == "user_1"
    assert resultado.preco_venda_sugerido == 10.0

def test_pedido_repository_buscar_por_id():
    db_mock = MagicMock()
    model_mock = Mock()
    model_mock.cliente_nome = "Maria"
    model_mock.preco_total = Decimal("100.00")
    model_mock.usuario_id = "user_1" # Updated field name to match model
    model_mock.id = "1"
    model_mock.cliente_telefone = "123"
    model_mock.descricao = "Desc"
    model_mock.tipo_entrega = "Entrega"
    model_mock.data_entrega = "2023-12-31"
    model_mock.observacoes = "Obs"
    model_mock.receita_id = "rec1"
    model_mock.status = "Pendente"
    
    db_mock.query().filter().first.return_value = model_mock
    
    repo = PedidoRepository(db_mock)
    resultado = repo.buscar_pedido_por_id("1")
    
    assert resultado.cliente_nome == "Maria"
    assert resultado.user_id == "user_1"

# --- SQLAlchemy Repositories ---

def test_receita_sqlalchemy_repository_criar():
    db_mock = MagicMock()
    repo = RepositorioDeReceitaSQLAlchemy(db_mock)
    
    receita = Receita()
    receita.nome = "Bolo"
    receita.preco_venda_sugerido = 10.0
    receita.idUsuario = "user_1"
    
    repo.criar_receita(receita)
    
    assert db_mock.add.called
    assert db_mock.commit.called

def test_pedido_sqlalchemy_repository_criar():
    db_mock = MagicMock()
    repo = RepositorioDePedidoSQLAlchemy(db_mock)
    
    pedido = Pedido()
    pedido.cliente_nome = "Maria"
    pedido.preco_total = Decimal("100.00")
    pedido.user_id = "user_1"
    
    repo.criar_pedido(pedido)
    
    assert db_mock.add.called
    assert db_mock.commit.called

def test_user_sqlalchemy_repository_registrar():
    db_mock = MagicMock()
    repo = RepositorioDeUsuarioSQLAlchemy(db_mock)
    
    user = User()
    user.id = "user_1"
    user.email = "test@example.com"
    user.first_name = "Teste"
    user.last_name = "User"
    
    repo.registrar_usuario(user)
    
    assert db_mock.add.called
    assert db_mock.commit.called

def test_receita_sqlalchemy_repository_listar():
    db_mock = MagicMock()
    repo = RepositorioDeReceitaSQLAlchemy(db_mock)
    
    model_mock = Mock()
    model_mock.id = "1"
    model_mock.nome = "Bolo"
    model_mock.preco_venda_sugerido = 10.5
    model_mock.usuario_id = "user_1"
    model_mock.descricao = "Teste"
    model_mock.rendimento = 10
    model_mock.tempo_preparo = "1h"
    model_mock.modo_preparo = "Assar"
    
    db_mock.query().filter().all.return_value = [model_mock]
    
    resultado = repo.listar_por_usuario("user_1")
    
    assert len(resultado) == 1
    assert resultado[0].nome == "Bolo"
    assert resultado[0].preco_venda_sugerido == 10.5

def test_pedido_sqlalchemy_repository_listar():
    db_mock = MagicMock()
    repo = RepositorioDePedidoSQLAlchemy(db_mock)
    
    model_mock = Mock()
    model_mock.id = 1
    model_mock.cliente_nome = "Maria"
    model_mock.usuario_id = "user_1"
    model_mock.cliente_telefone = "123"
    model_mock.descricao = "Teste"
    model_mock.observacoes = None
    model_mock.tipo_entrega = "Teste"
    model_mock.endereco_entrega = None
    model_mock.preco_total = Decimal("100.00")
    model_mock.data_entrega = None
    model_mock.receita_id = None
    model_mock.status = "Pendente"
    model_mock.data_criacao = None
    model_mock.data_inicio_producao = None
    model_mock.data_conclusao = None
    
    db_mock.query().filter().order_by().all.return_value = [model_mock]
    
    resultado = repo.listar_por_usuario("user_1")
    
    assert len(resultado) == 1
    assert resultado[0].cliente_nome == "Maria"
