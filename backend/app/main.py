import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.database import engine, Base, SessionLocal
from backend.app.config import settings
from backend.app.models.banking import Customer
from backend.app.services.data_processor import ingest_banking_excel, DEFAULT_DATASET_PATH

# Import routers
from backend.app.routers import auth, dataset, analytics, agents, approval, reports

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EVA — Autonomous Banking Intelligence Platform",
    description="EVA Enterprise Multi-Agent AI Operations & Decision Intelligence System (CrewAI + FastAPI + React)",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-seed database with 06_Banking.xlsx on initial launch if empty
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        count = db.query(Customer).count()
        if count == 0 and os.path.exists(DEFAULT_DATASET_PATH):
            print(f"Auto-seeding banking dataset from {DEFAULT_DATASET_PATH}...")
            ingest_banking_excel(db, DEFAULT_DATASET_PATH)
            print("Auto-seeding complete!")
    except Exception as e:
        print(f"Startup seed notice: {e}")
    finally:
        db.close()

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(dataset.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(approval.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

# Static files for PDF reports
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def root():
    return {
        "platform": "EVA",
        "tagline": "Enterprise Vision & Autonomous Banking Operations",
        "message": "EVA Multi-Agent Decision Intelligence API is live and operational",
        "docs": "/docs",
        "version": "2.0.0",
        "dataset_period": "May 1, 2026 - October 31, 2026"
    }
