import datetime
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.services.kpi_engine import calculate_banking_kpis
from backend.app.schemas.banking import KPISummaryResponse, ChatRequest, ChatResponse
from backend.app.config import settings

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/kpis", response_model=KPISummaryResponse)
def get_banking_kpis(db: Session = Depends(get_db)):
    return calculate_banking_kpis(db)

@router.post("/chat", response_model=ChatResponse)
def chat_with_bank_ai(request: ChatRequest, db: Session = Depends(get_db)):
    kpis = calculate_banking_kpis(db)
    question = request.question.strip()
    
    # Try live Gemini 3.8 Flash if API key is configured
    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={settings.GEMINI_API_KEY}"
            dep_cr = round(kpis['total_deposits'] / 10_000_000, 2)
            loan_cr = round(kpis['total_approved_loan_amount'] / 10_000_000, 2)
            overdue_cr = round(kpis['total_overdue_amount'] / 10_000_000, 2)

            system_context = (
                f"You are the Apex Bank Executive AI Business Assistant. Answer accurately using ONLY this real dataset context:\n"
                f"- Total Customers: {kpis['total_customers']:,}\n"
                f"- Total Accounts: {kpis['total_accounts']:,} (Active: {kpis['active_accounts']:,})\n"
                f"- Total Deposits: Rs. {dep_cr} Cr\n"
                f"- Total Approved Loans: Rs. {loan_cr} Cr ({kpis['approved_loans_count']:,} loans)\n"
                f"- Portfolio Default Rate: {kpis['default_rate_pct']}%\n"
                f"- Overdue Loan Count: {kpis['overdue_loans_count']:,} (Rs. {overdue_cr} Cr)\n"
                f"- Transactions: {kpis['total_transactions']:,} (Flagged: {kpis['flagged_transactions_count']:,}, {kpis['flagged_transaction_pct']}%)\n"
                f"- High/Critical Risk Incidents: {kpis['high_critical_risk_events']}\n\n"
                f"Question from Manager: {question}\n\n"
                f"Provide a concise, direct, and professional banking answer with numbers."
            )

            payload = {
                "contents": [{"parts": [{"text": system_context}]}]
            }
            res = requests.post(url, json=payload, timeout=12)
            if res.status_code == 200:
                answer = res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                return ChatResponse(
                    answer=answer,
                    sources=["Apex Bank Central DB (May-Oct 2026)", "Gemini 3.5 Flash Model"],
                    generated_at=datetime.datetime.now().strftime("%H:%M:%S")
                )
        except Exception:
            pass

    # Contextual grounded fallback if offline or request fails
    q_lower = question.lower()
    if "deposit" in q_lower or "balance" in q_lower:
        answer = f"Total customer deposits stand at Rs. {round(kpis['total_deposits']/10_000_000, 2)} Cr across {kpis['active_accounts']:,} active accounts."
    elif "default" in q_lower or "overdue" in q_lower or "npa" in q_lower:
        answer = f"The portfolio default and overdue rate is {kpis['default_rate_pct']}%, representing Rs. {round(kpis['total_overdue_amount']/10_000_000, 2)} Cr across {kpis['overdue_loans_count']:,} at-risk loan accounts."
    elif "loan" in q_lower or "lend" in q_lower:
        answer = f"The bank disbursed Rs. {round(kpis['total_approved_loan_amount']/10_000_000, 2)} Cr across {kpis['approved_loans_count']:,} approved applications."
    elif "fraud" in q_lower or "risk" in q_lower or "flag" in q_lower:
        answer = f"We have flagged {kpis['flagged_transactions_count']:,} suspicious transactions ({kpis['flagged_transaction_pct']}% rate) and logged {kpis['high_critical_risk_events']} high/critical risk events."
    else:
        answer = (
            f"Apex Bank Intelligence Status: {kpis['total_customers']:,} customers, "
            f"Rs. {round(kpis['total_deposits']/10_000_000, 2)} Cr deposits, and "
            f"{kpis['default_rate_pct']}% loan default rate. How can I assist with portfolio analytics?"
        )

    return ChatResponse(
        answer=answer,
        sources=["Apex Bank Central Database (May - October 2026)"],
        generated_at=datetime.datetime.now().strftime("%H:%M:%S")
    )
