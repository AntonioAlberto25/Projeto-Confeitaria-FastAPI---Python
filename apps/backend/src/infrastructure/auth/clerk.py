import os
import httpx
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta

# Constants
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL") # Example: https://clerk.your-domain.com/.well-known/jwks.json
CLERK_ISSUER = os.getenv("CLERK_ISSUER")     # Example: https://clerk.your-domain.com

# Simple cache for JWKS
_jwks_cache = None
_jwks_last_fetch = None

security = HTTPBearer()

async def get_jwks():
    global _jwks_cache, _jwks_last_fetch
    
    # Cache for 1 hour
    if _jwks_cache and _jwks_last_fetch and datetime.now() < _jwks_last_fetch + timedelta(hours=1):
        return _jwks_cache
        
    if not CLERK_JWKS_URL:
        raise Exception("CLERK_JWKS_URL environment variable is not set")
        
    async with httpx.AsyncClient() as client:
        response = await client.get(CLERK_JWKS_URL)
        if response.status_code != 200:
            raise Exception("Failed to fetch Clerk JWKS")
        _jwks_cache = response.json()
        _jwks_last_fetch = datetime.now()
        return _jwks_cache

async def get_current_user_id(token: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    FastAPI dependency to validate Clerk JWT and return user_id (sub).
    """
    try:
        jwks = await get_jwks()
        payload = jwt.decode(
            token.credentials,
            jwks,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={"verify_aud": False} # Usually aud is the frontend URL, can be checked if needed
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
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service unavailable",
        )
