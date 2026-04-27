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
    model_mock.tempo_preparo = 60
    model_mock.modo_preparo = "Assar"
    
    db_mock.query().filter().count.return_value = 1
    db_mock.query().filter().offset().limit().all.return_value = [model_mock]
    
    items, total = repo.listar_por_usuario("user_1")
    
    assert len(items) == 1
    assert total == 1
    assert items[0].nome == "Bolo"
    assert items[0].preco_venda_sugerido == 10.5

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
    
    db_mock.query().filter().count.return_value = 1
    db_mock.query().filter().order_by().offset().limit().all.return_value = [model_mock]
    
    items, total = repo.listar_por_usuario("user_1")
    
    assert len(items) == 1
    assert total == 1
    assert items[0].cliente_nome == "Maria"

# --- Testes de regressão: bypass de setter para dados históricos ---

def test_receita_repository_listar_com_preco_zero():
    """Receitas com preco_venda_sugerido=0 não devem lançar ValueError ao serem lidas."""
    db_mock = MagicMock()
    model_mock = Mock()
    model_mock.id = "abc"
    model_mock.nome = "Bolo Antigo"
    model_mock.preco_venda_sugerido = 0.0  # valor que o setter rejeitaria
    model_mock.descricao = None
    model_mock.rendimento = 10
    model_mock.tempo_preparo = 30
    model_mock.modo_preparo = None
    model_mock.usuario_id = "user_1"

    db_mock.query().filter().count.return_value = 1
    db_mock.query().filter().offset().limit().all.return_value = [model_mock]

    repo = ReceitaRepository(db_mock)
    items, total = repo.listar_por_usuario("user_1")

    assert len(items) == 1
    assert items[0].preco_venda_sugerido == 0.0
    assert items[0].nome == "Bolo Antigo"

def test_receita_repository_listar_com_rendimento_zero():
    """Receitas com rendimento=0 não devem lançar ValueError ao serem lidas."""
    db_mock = MagicMock()
    model_mock = Mock()
    model_mock.id = "def"
    model_mock.nome = "Torta"
    model_mock.preco_venda_sugerido = 25.0
    model_mock.descricao = None
    model_mock.rendimento = 0  # valor que o setter (com <= 0) rejeitaria
    model_mock.tempo_preparo = 60
    model_mock.modo_preparo = "Assar"
    model_mock.usuario_id = "user_2"

    db_mock.query().filter().count.return_value = 1
    db_mock.query().filter().offset().limit().all.return_value = [model_mock]

    repo = ReceitaRepository(db_mock)
    items, total = repo.listar_por_usuario("user_2")

    assert len(items) == 1
    assert items[0].rendimento == 0

def test_receita_repository_buscar_por_id_com_dados_invalidos():
    """valor não-numérico nos campos deve degradar para None sem crashar."""
    db_mock = MagicMock()
    model_mock = Mock()
    model_mock.id = "ghi"
    model_mock.nome = "Cupcake"
    model_mock.preco_venda_sugerido = "invalido"  # dado corrompido hipotético
    model_mock.descricao = None
    model_mock.rendimento = None
    model_mock.tempo_preparo = None
    model_mock.modo_preparo = None
    model_mock.usuario_id = "user_3"

    db_mock.query().filter().first.return_value = model_mock

    repo = ReceitaRepository(db_mock)
    resultado = repo.buscar_por_id("ghi")

    assert resultado is not None
    assert resultado.nome == "Cupcake"
    assert resultado.preco_venda_sugerido is None  # degradou para None
