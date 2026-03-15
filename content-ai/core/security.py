from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

#password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#JWT settings
SECRET_KEY = "7c33b40a281263c50ffc2df6b188e0991497549a9b165e5faaef721dfb2a8059"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": str(user_id), "exp": expire}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return token

def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise ValueError("Invalid token")
        return user_id
    except jwt.JWTError:
        raise ValueError("Invalid token")