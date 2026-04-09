import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta

# Simple cache for JWKS
_jwks_cache = None
_jwks_last_fetch = None

security = HTTPBearer()

async def get_jwks():
    global _jwks_cache, _jwks_last_fetch
    
    clerk_jwks_url = os.getenv("CLERK_JWKS_URL")
    # Cache for 1 hour
    if _jwks_cache and _jwks_last_fetch and datetime.now() < _jwks_last_fetch + timedelta(hours=1):
        return _jwks_cache
        
    if not clerk_jwks_url:
        raise Exception("CLERK_JWKS_URL environment variable is not set")
        
    async with httpx.AsyncClient() as client:
        response = await client.get(clerk_jwks_url)
        if response.status_code != 200:
            raise Exception("Failed to fetch Clerk JWKS")
        _jwks_cache = response.json()
        _jwks_last_fetch = datetime.now()
        return _jwks_cache

async def get_current_user_id(token: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    FastAPI dependency to validate Clerk JWT and return user_id (sub).
    Follows JWKS (Public Key Set) rotation and cryptographic signature verification.
    """
    try:
        raw_token = token.credentials
        jwks = await get_jwks()
        
        # 1. Obter o Header do Token (não verificado) p/ achar o 'kid'
        header = jwt.get_unverified_header(raw_token)
        kid = header.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="Token sem 'kid' no header")

        # 2. Localizar a chave pública correspondente no JWKS
        public_key = None
        for key in jwks.get("keys", []):
            if key["kid"] == kid:
                public_key = key
                break
        
        if not public_key:
            raise HTTPException(status_code=401, detail="Chave pública correspondente não encontrada no JWKS (kid inválido)")

        # 3. Decodificar e validar criptograficamente
        payload = jwt.decode(
            raw_token,
            public_key,
            algorithms=["RS256"],
            issuer=os.getenv("CLERK_ISSUER"),
            options={"verify_aud": False} # Validar se o issuer bate c/ Clerk
        )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has no sub (user id)",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service unavailable",
        )
