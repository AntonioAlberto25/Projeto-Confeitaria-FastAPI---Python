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

from src.infrastructure.persistencia.database import engine, Base
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cria as tabelas no banco de dados se elas não existirem
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Confeitaria API",
    version="0.1.0",
    lifespan=lifespan,
)

# TODO: Em produção, substitua "*" pelos domínios específicos para maior segurança
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
