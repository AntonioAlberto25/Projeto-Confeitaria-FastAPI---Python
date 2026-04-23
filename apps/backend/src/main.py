import src.infrastructure.persistencia.pedidoModel # noqa: F401
import src.infrastructure.persistencia.receitaModel # noqa: F401
import src.infrastructure.persistencia.userModel # noqa: F401

import os
import uuid
import time
import json
import logging
from fastapi import FastAPI, Request
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

# ─── Logging Estruturado (RNF-04 Observabilidade) ──────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("confeitaria-api")


def _log(level: str, message: str, **extra):
    record = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()),
        "level": level,
        "service": "confeitaria-api",
        "message": message,
        **extra,
    }
    print(json.dumps(record, ensure_ascii=False))


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        db_engine = get_engine()
        Base.metadata.create_all(bind=db_engine)
        _log("INFO", "Banco de dados inicializado com sucesso")
    except Exception as e:
        _log("WARNING", "Não foi possível inicializar o banco", error=str(e))
    yield


app = FastAPI(
    title="Confeitaria API",
    version="0.1.0",
    description="API RESTful para gestão de pedidos, receitas e estoque de confeitarias artesanais.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Middleware de Observabilidade (RNF-04) ─────────────────────────────────────
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start = time.time()

    _log(
        "INFO",
        "Requisição recebida",
        request_id=request_id,
        method=request.method,
        path=request.url.path,
    )

    response = await call_next(request)

    duration_ms = round((time.time() - start) * 1000, 2)
    _log(
        "INFO",
        "Requisição concluída",
        request_id=request_id,
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration_ms,
    )

    response.headers["X-Request-ID"] = request_id
    return response


app.include_router(health_router)
app.include_router(receitas_router)
app.include_router(pedidos_router)
app.include_router(perfil_router)
app.include_router(webhooks_router)


# ─── Endpoint de Diagnóstico (REMOVER em produção estável) ─────────────────────
@app.get("/debug")
async def debug_env():
    """Verifica se as variáveis de ambiente críticas estão configuradas e se há conectividade."""
    import httpx
    vars_to_check = [
        "DATABASE_URL",
        "CLERK_SECRET_KEY",
        "CLERK_ISSUER",
        "CLERK_JWKS_URL",
        "CLERK_WEBHOOK_SECRET",
    ]
    status = {}
    connectivity = {}
    
    for var in vars_to_check:
        val = os.getenv(var)
        if not val:
            status[var] = "❌ NÃO CONFIGURADA"
        elif var == "DATABASE_URL":
            try:
                from urllib.parse import urlparse
                parsed = urlparse(val)
                status[var] = f"✅ host={parsed.hostname}, db={parsed.path.lstrip('/')}"
            except Exception:
                status[var] = "✅ configurada (formato inválido)"
        else:
            status[var] = f"✅ configurada ({len(val)} chars)"

    # Testar conectividade com Clerk JWKS
    jwks_url = os.getenv("CLERK_JWKS_URL")
    if jwks_url:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(jwks_url)
                connectivity["CLERK_JWKS"] = f"✅ Success ({resp.status_code})" if resp.status_code == 200 else f"❌ Failed ({resp.status_code})"
        except Exception as e:
            connectivity["CLERK_JWKS"] = f"❌ Error: {type(e).__name__}"

    return {
        "environment": status, 
        "connectivity": connectivity,
        "python_path": __import__('sys').path[:3]
    }
