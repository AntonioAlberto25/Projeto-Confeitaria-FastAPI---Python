from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

class Base(DeclarativeBase):
    pass

_engine = None
_SessionLocal = None

def get_engine():
    global _engine
    if _engine is None:
        url = os.getenv("DATABASE_URL")
        if not url:
            raise RuntimeError(
                "DATABASE_URL environment variable is not set. "
                "Configure-a no painel da Vercel em Settings > Environment Variables."
            )
        # Vercel/Supabase usam URLs postgres://, SQLAlchemy exige postgresql://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        _engine = create_engine(url, pool_pre_ping=True)
    return _engine

def get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal

# Compatibilidade com código existente (lazy)
class _LazyEngine:
    def __getattr__(self, name):
        return getattr(get_engine(), name)

class _LazySession:
    def __call__(self, **kw):
        return get_session_local()(**kw)
    def __getattr__(self, name):
        return getattr(get_session_local(), name)

engine = _LazyEngine()
SessionLocal = _LazySession()
