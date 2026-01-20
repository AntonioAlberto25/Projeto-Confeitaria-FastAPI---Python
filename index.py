from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Aplicação iniciada")
    yield
    print("Aplicação encerrada")

app = FastAPI(title="Confeitaria API", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API da Confeitaria"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)