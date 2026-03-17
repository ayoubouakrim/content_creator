from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/content_ai_db"
    SECRET_KEY: str = "7c33b40a281263c50ffc2df6b188e0991497549a9b165e5faaef721dfb2a8059"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()