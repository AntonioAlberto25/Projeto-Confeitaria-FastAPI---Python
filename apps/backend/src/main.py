import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.presentation.routes.health import router as health_router
from src.presentation.routes.receitas import router as receitas_router
from src.presentation.routes.pedidos import router as pedidos_router
from src.presentation.routes.perfil import router as perfil_router
from src.presentation.routes.webhooks import router as webhooks_router

app = FastAPI(
    title="Confeitaria API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simple for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(receitas_router)
app.include_router(pedidos_router)
app.include_router(perfil_router)
app.include_router(webhooks_router)
