import os
from pydantic_settings import BaseSettings

# Determine path to .env in backend or root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
backend_env = os.path.join(BASE_DIR, ".env")
root_env = os.path.join(ROOT_DIR, ".env")
env_path = backend_env if os.path.exists(backend_env) else root_env

import tempfile
import shutil

is_serverless = bool(
    os.environ.get("VERCEL") or 
    os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or 
    not os.access(os.getcwd(), os.W_OK)
)

if is_serverless:
    tmp_dir = tempfile.gettempdir()
    tmp_db = os.path.join(tmp_dir, "banking_bi.db")
    if not os.path.exists(tmp_db):
        candidates = [
            os.path.join(ROOT_DIR, "banking_bi.db"),
            os.path.join(os.getcwd(), "banking_bi.db"),
            os.path.join(BASE_DIR, "banking_bi.db"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "banking_bi.db"),
        ]
        copied = False
        for cand in candidates:
            if os.path.exists(cand):
                try:
                    shutil.copyfile(cand, tmp_db)
                    copied = True
                    break
                except Exception:
                    pass
        if not copied:
            for root, dirs, files in os.walk(os.getcwd()):
                if "banking_bi.db" in files:
                    try:
                        shutil.copyfile(os.path.join(root, "banking_bi.db"), tmp_db)
                        break
                    except Exception:
                        pass
    default_db = f"sqlite:///{tmp_db}"
    default_reports = os.path.join(tmp_dir, "reports")
    os.makedirs(default_reports, exist_ok=True)
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
if is_serverless:
    settings.DATABASE_URL = default_db
    settings.REPORTS_DIR = default_reports

os.makedirs(settings.REPORTS_DIR, exist_ok=True)
