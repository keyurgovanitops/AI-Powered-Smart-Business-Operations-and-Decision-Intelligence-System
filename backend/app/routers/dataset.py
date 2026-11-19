import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.services.data_processor import ingest_banking_excel, DEFAULT_DATASET_PATH
from backend.app.models.banking import Customer, Account, Transaction, LoanApplication, LoanRepayment, RiskEvent

router = APIRouter(prefix="/dataset", tags=["Dataset Management"])

@router.get("/status")
def get_dataset_status(db: Session = Depends(get_db)):
    return {
        "customers_count": db.query(Customer).count(),
        "accounts_count": db.query(Account).count(),
        "transactions_count": db.query(Transaction).count(),
        "loans_count": db.query(LoanApplication).count(),
        "repayments_count": db.query(LoanRepayment).count(),
        "risk_events_count": db.query(RiskEvent).count(),
        "is_seeded": db.query(Customer).count() > 0,
        "default_file_exists": os.path.exists(DEFAULT_DATASET_PATH)
    }

@router.post("/seed")
def seed_default_dataset(db: Session = Depends(get_db)):
    try:
        stats = ingest_banking_excel(db, DEFAULT_DATASET_PATH)
        return {
            "status": "success",
            "message": "Banking dataset successfully imported into database.",
            "records_imported": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx) are supported.")
    
    temp_path = os.path.join(os.path.dirname(DEFAULT_DATASET_PATH), f"uploaded_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        stats = ingest_banking_excel(db, temp_path)
        return {
            "status": "success",
            "message": f"Successfully ingested {file.filename}",
            "records_imported": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
