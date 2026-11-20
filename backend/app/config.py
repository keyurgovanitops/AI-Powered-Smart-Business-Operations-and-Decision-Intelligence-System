import os
from pydantic_settings import BaseSettings

# Determine path to .env in backend or root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
backend_env = os.path.join(BASE_DIR, ".env")
root_env = os.path.join(ROOT_DIR, ".env")
env_path = backend_env if os.path.exists(backend_env) else root_env

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
    
    # LLM Settings (Google Gemini API Key)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Reports output
    REPORTS_DIR: str = os.path.join(BASE_DIR, "static", "reports")

    class Config:
        env_file = env_path
        extra = "ignore"

settings = Settings()
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
