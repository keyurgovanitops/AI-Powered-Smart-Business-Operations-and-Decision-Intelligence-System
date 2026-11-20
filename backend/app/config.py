import os
from pydantic_settings import BaseSettings

# Determine path to .env in backend or root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
backend_env = os.path.join(BASE_DIR, ".env")
root_env = os.path.join(ROOT_DIR, ".env")
env_path = backend_env if os.path.exists(backend_env) else root_env

is_vercel = bool(os.environ.get("VERCEL"))
if is_vercel:
    tmp_db = "/tmp/banking_bi.db"
    if not os.path.exists(tmp_db):
        seed_db = os.path.join(ROOT_DIR, "banking_bi.db")
        if os.path.exists(seed_db):
            import shutil
            shutil.copyfile(seed_db, tmp_db)
    default_db = f"sqlite:///{tmp_db}"
    default_reports = "/tmp/reports"
else:
    default_db = "sqlite:///./banking_bi.db"
    default_reports = os.path.join(BASE_DIR, "static", "reports")

class Settings(BaseSettings):
    PROJECT_NAME: str = "EVA Banking Decision Intelligence System"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    
    # Database - Default to SQLite, easily switched to PostgreSQL or MySQL via .env
    DATABASE_URL: str = os.getenv("DATABASE_URL", default_db)
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # LLM Settings (Google Gemini API Key)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Reports output
    REPORTS_DIR: str = default_reports

    class Config:
        env_file = env_path
        extra = "ignore"

settings = Settings()
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
