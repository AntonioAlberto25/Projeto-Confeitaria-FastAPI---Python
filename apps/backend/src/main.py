import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.presentation.routes.health import router as health_router

app = FastAPI(
    title="Confeitaria API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
