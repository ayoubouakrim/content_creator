from typing import Optional
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from core.config import get_settings

settings = get_settings()

#password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#JWT settings
SECRET_KEY = "7c33b40a281263c50ffc2df6b188e0991497549a9b165e5faaef721dfb2a8059"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

def hash_password(password: str) -> str:
    print("Hashing password:", password)
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])    
        return payload
    
    except jwt.JWTError:
        raise ValueError("Invalid token")