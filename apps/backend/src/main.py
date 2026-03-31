from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from src.modules.health.router import router as health_router

load_dotenv()

app = FastAPI(
    title="Confeitaria API",
    description="API de gestão para confeitaria artesanal",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)


@app.get("/", tags=["root"])
def hello_world():
    return {"message": "Hello, World!"}
