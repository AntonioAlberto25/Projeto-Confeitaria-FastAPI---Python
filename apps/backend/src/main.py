import src.infrastructure.persistencia.pedidoModel # noqa: F401
import src.infrastructure.persistencia.receitaModel # noqa: F401
import src.infrastructure.persistencia.userModel # noqa: F401

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


# ─── Endpoint de Diagnóstico (REMOVIDO para produção) ─────────────────────────
