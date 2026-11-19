import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Banking Decision Intelligence System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database - Default to SQLite, easily switched to PostgreSQL or MySQL via .env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./banking_bi.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # LLM Settings (Optional Google Gemini or OpenAI API Key)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Reports output
    REPORTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "reports")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
