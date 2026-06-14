"""auth.py — JWT creation and verification"""
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency — injects current user into any protected route."""
    return decode_token(token)


def require_admin(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency — only allows admin email through."""
    from config import ADMIN_EMAIL
    payload = decode_token(token)
    if payload.get("email") != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access only")
    return payload