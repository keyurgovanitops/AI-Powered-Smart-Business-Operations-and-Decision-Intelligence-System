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

@router.get("/preview/{table_name}")
def get_table_preview(table_name: str, limit: int = 15, db: Session = Depends(get_db)):
    table_map = {
        "customers": (Customer, ["customer_id", "customer_name", "age", "city", "customer_segment", "kyc_status", "risk_profile"]),
        "accounts": (Account, ["account_id", "customer_id", "account_type", "branch_id", "current_balance", "account_status"]),
        "transactions": (Transaction, ["transaction_id", "account_id", "transaction_date", "transaction_type", "amount", "channel", "is_flagged"]),
        "loans": (LoanApplication, ["loan_id", "customer_id", "application_date", "loan_type", "requested_amount", "annual_interest_rate", "credit_score", "application_status"]),
        "repayments": (LoanRepayment, ["repayment_id", "loan_id", "due_date", "due_amount", "paid_amount", "repayment_status", "days_past_due"]),
        "risk_events": (RiskEvent, ["event_id", "customer_id", "event_date", "event_type", "risk_level", "case_status", "assigned_team"])
    }
    
    table_info = table_map.get(table_name.lower())
    if not table_info:
        raise HTTPException(status_code=400, detail=f"Table {table_name} not found. Available: {list(table_map.keys())}")
        
    model, cols = table_info
    records = db.query(model).limit(limit).all()
    rows = []
    for r in records:
        row = {c: getattr(r, c, None) for c in cols}
        rows.append(row)
        
    return {
        "table": table_name,
        "columns": cols,
        "total_in_db": db.query(model).count(),
        "rows": rows
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
