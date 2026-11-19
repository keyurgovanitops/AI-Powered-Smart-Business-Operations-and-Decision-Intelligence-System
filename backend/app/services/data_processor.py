import os
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.models.banking import Customer, Account, Transaction, LoanApplication, LoanRepayment, RiskEvent
from backend.app.database import engine, Base

DEFAULT_DATASET_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
    "Six_Industry_CrewAI_Datasets",
    "06_Banking.xlsx"
)

def clean_value(val, default=None):
    if pd.isna(val):
        return default
    return val

def ingest_banking_excel(db: Session, file_path: str = DEFAULT_DATASET_PATH) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found at {file_path}")

    # Recreate or ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Read sheets
    excel_file = pd.ExcelFile(file_path)
    stats = {}

    # 1. Customers
    if "Customers" in excel_file.sheet_names:
        df_cust = excel_file.parse("Customers")
        db.query(Customer).delete()
        cust_objs = []
        for _, row in df_cust.iterrows():
            cust_objs.append(Customer(
                customer_id=str(row["customer_id"]).strip(),
                customer_name=str(row["customer_name"]).strip(),
                age=int(row["age"]) if pd.notna(row.get("age")) else 35,
                city=str(clean_value(row.get("city"), "Unknown")).strip(),
                customer_since=str(clean_value(row.get("customer_since"), "2026-05-01")),
                customer_segment=str(clean_value(row.get("customer_segment"), "Retail")),
                kyc_status=str(clean_value(row.get("kyc_status"), "Verified")),
                risk_profile=str(clean_value(row.get("risk_profile"), "Medium"))
            ))
        db.bulk_save_objects(cust_objs)
        db.commit()
        stats["customers"] = len(cust_objs)

    # 2. Accounts
    if "Accounts" in excel_file.sheet_names:
        df_acc = excel_file.parse("Accounts")
        db.query(Account).delete()
        acc_objs = []
        for _, row in df_acc.iterrows():
            acc_objs.append(Account(
                account_id=str(row["account_id"]).strip(),
                customer_id=str(row["customer_id"]).strip(),
                account_type=str(clean_value(row.get("account_type"), "Savings")),
                opening_date=str(clean_value(row.get("opening_date"), "2026-05-01")),
                branch_id=str(clean_value(row.get("branch_id"), "BR001")),
                current_balance=float(clean_value(row.get("current_balance"), 0.0)),
                account_status=str(clean_value(row.get("account_status"), "Active")),
                currency=str(clean_value(row.get("currency"), "INR"))
            ))
        db.bulk_save_objects(acc_objs)
        db.commit()
        stats["accounts"] = len(acc_objs)

    # 3. Transactions
    if "Transactions" in excel_file.sheet_names:
        df_tx = excel_file.parse("Transactions")
        db.query(Transaction).delete()
        tx_objs = []
        for _, row in df_tx.iterrows():
            tx_objs.append(Transaction(
                transaction_id=str(row["transaction_id"]).strip(),
                account_id=str(row["account_id"]).strip(),
                transaction_date=str(clean_value(row.get("transaction_date"), "2026-05-01")),
                transaction_type=str(clean_value(row.get("transaction_type"), "Debit")),
                amount=float(clean_value(row.get("amount"), 0.0)),
                channel=str(clean_value(row.get("channel"), "UPI")),
                merchant_category=str(clean_value(row.get("merchant_category"), "General")),
                transaction_status=str(clean_value(row.get("transaction_status"), "Completed")),
                is_flagged=str(clean_value(row.get("is_flagged"), "No"))
            ))
        db.bulk_save_objects(tx_objs)
        db.commit()
        stats["transactions"] = len(tx_objs)

    # 4. Loan Applications
    if "Loan_Applications" in excel_file.sheet_names:
        df_loans = excel_file.parse("Loan_Applications")
        db.query(LoanApplication).delete()
        loan_objs = []
        for _, row in df_loans.iterrows():
            loan_objs.append(LoanApplication(
                loan_id=str(row["loan_id"]).strip(),
                customer_id=str(row["customer_id"]).strip(),
                application_date=str(clean_value(row.get("application_date"), "2026-05-01")),
                loan_type=str(clean_value(row.get("loan_type"), "Personal")),
                requested_amount=float(clean_value(row.get("requested_amount"), 0.0)),
                annual_interest_rate=float(clean_value(row.get("annual_interest_rate"), 10.5)),
                tenure_months=int(clean_value(row.get("tenure_months"), 12)),
                credit_score=int(clean_value(row.get("credit_score"), 650)),
                application_status=str(clean_value(row.get("application_status"), "Approved"))
            ))
        db.bulk_save_objects(loan_objs)
        db.commit()
        stats["loan_applications"] = len(loan_objs)

    # 5. Loan Repayments
    if "Loan_Repayments" in excel_file.sheet_names:
        df_rep = excel_file.parse("Loan_Repayments")
        db.query(LoanRepayment).delete()
        rep_objs = []
        for _, row in df_rep.iterrows():
            rep_objs.append(LoanRepayment(
                repayment_id=str(row["repayment_id"]).strip(),
                loan_id=str(row["loan_id"]).strip(),
                due_date=str(clean_value(row.get("due_date"), "2026-05-01")),
                due_amount=float(clean_value(row.get("due_amount"), 0.0)),
                paid_amount=float(clean_value(row.get("paid_amount"), 0.0)),
                payment_date=str(clean_value(row.get("payment_date"), "")),
                repayment_status=str(clean_value(row.get("repayment_status"), "Paid")),
                days_past_due=int(clean_value(row.get("days_past_due"), 0))
            ))
        db.bulk_save_objects(rep_objs)
        db.commit()
        stats["loan_repayments"] = len(rep_objs)

    # 6. Risk Events
    if "Risk_Events" in excel_file.sheet_names:
        df_risk = excel_file.parse("Risk_Events")
        db.query(RiskEvent).delete()
        risk_objs = []
        for _, row in df_risk.iterrows():
            risk_objs.append(RiskEvent(
                event_id=str(row["event_id"]).strip(),
                customer_id=str(row["customer_id"]).strip(),
                event_date=str(clean_value(row.get("event_date"), "2026-05-01")),
                event_type=str(clean_value(row.get("event_type"), "Suspicious Activity")),
                risk_level=str(clean_value(row.get("risk_level"), "Medium")),
                case_status=str(clean_value(row.get("case_status"), "Open")),
                assigned_team=str(clean_value(row.get("assigned_team"), "Fraud Ops"))
            ))
        db.bulk_save_objects(risk_objs)
        db.commit()
        stats["risk_events"] = len(risk_objs)

    return stats
