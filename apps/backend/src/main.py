import src.infrastructure.persistencia.pedidoModel # noqa: F401
import src.infrastructure.persistencia.receitaModel # noqa: F401
import src.infrastructure.persistencia.userModel # noqa: F401

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.presentation.routes.health import router as health_router
from src.presentation.routes.receitas import router as receitas_router
from src.presentation.routes.pedidos import router as pedidos_router
from src.presentation.routes.perfil import router as perfil_router
from src.presentation.routes.webhooks import router as webhooks_router

from src.infrastructure.persistencia.database import get_engine, Base
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tenta criar as tabelas, mas NÃO derruba o app se o banco não estiver disponível
    try:
        db_engine = get_engine()
        Base.metadata.create_all(bind=db_engine)
        print("INFO: Banco de dados inicializado com sucesso.")
    except Exception as e:
        print(f"WARNING: Não foi possível inicializar o banco: {e}")
    yield

app = FastAPI(
    title="Confeitaria API",
    version="0.1.0",
    lifespan=lifespan,
)

# DEBUG: Temporariamente liberando tudo para isolar se o problema é CORS ou o Backend em si
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(receitas_router)
app.include_router(pedidos_router)
app.include_router(perfil_router)
app.include_router(webhooks_router)

# ─── Endpoint de Diagnóstico (REMOVER em produção estável) ─────────────────────
@app.get("/debug")
def debug_env():
    """Verifica se as variáveis de ambiente críticas estão configuradas na Vercel."""
    vars_to_check = [
        "DATABASE_URL",
        "CLERK_SECRET_KEY",
        "CLERK_WEBHOOK_SECRET",
    ]
    status = {}
    for var in vars_to_check:
        val = os.getenv(var)
        if not val:
            status[var] = "❌ NÃO CONFIGURADA"
        elif var == "DATABASE_URL":
            # Mostra apenas o host, não a senha
            try:
                from urllib.parse import urlparse
                parsed = urlparse(val)
                status[var] = f"✅ host={parsed.hostname}, db={parsed.path.lstrip('/')}"
            except Exception:
                status[var] = "✅ configurada (formato inválido)"
        else:
            status[var] = f"✅ configurada ({len(val)} chars)"
    return {"environment": status, "python_path": __import__('sys').path[:3]}
