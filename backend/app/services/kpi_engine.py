from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.banking import Customer, Account, Transaction, LoanApplication, LoanRepayment, RiskEvent
from collections import defaultdict

def calculate_banking_kpis(db: Session) -> dict:
    # 1. Customers & Accounts
    total_customers = db.query(Customer).count()
    total_accounts = db.query(Account).count()
    active_accounts = db.query(Account).filter(Account.account_status == "Active").count()
    total_deposits = db.query(func.sum(Account.current_balance)).scalar() or 0.0

    # 2. Loans & Performance
    total_loan_apps = db.query(LoanApplication).count()
    approved_loans = db.query(LoanApplication).filter(LoanApplication.application_status == "Approved")
    approved_loans_count = approved_loans.count()
    total_approved_loan_amount = db.query(func.sum(LoanApplication.requested_amount)).filter(
        LoanApplication.application_status == "Approved"
    ).scalar() or 0.0

    # Repayments & Defaults
    total_repayments = db.query(LoanRepayment).count()
    total_due_amount = db.query(func.sum(LoanRepayment.due_amount)).scalar() or 0.0
    total_collected_amount = db.query(func.sum(LoanRepayment.paid_amount)).scalar() or 0.0
    
    overdue_repayments = db.query(LoanRepayment).filter(
        (LoanRepayment.repayment_status.in_(["Overdue", "Defaulted"])) | (LoanRepayment.days_past_due > 30)
    )
    overdue_loans_count = overdue_repayments.count()
    total_overdue_amount = db.query(func.sum(LoanRepayment.due_amount - LoanRepayment.paid_amount)).filter(
        (LoanRepayment.repayment_status.in_(["Overdue", "Defaulted"])) | (LoanRepayment.days_past_due > 30)
    ).scalar() or 0.0

    default_rate_pct = round((overdue_loans_count / max(total_repayments, 1)) * 100, 2)

    # 3. Transactions & Fraud Risk
    total_transactions = db.query(Transaction).count()
    flagged_tx = db.query(Transaction).filter(Transaction.is_flagged == "Yes")
    flagged_tx_count = flagged_tx.count()
    flagged_tx_pct = round((flagged_tx_count / max(total_transactions, 1)) * 100, 2)

    # 4. Risk Events
    high_critical_risks = db.query(RiskEvent).filter(
        RiskEvent.risk_level.in_(["High", "Critical"])
    ).count()

    # 5. Monthly Trends (May to October 2026)
    # Group loan applications by YYYY-MM
    months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"]
    monthly_data = {m: {"month": m, "loans_disbursed": 0.0, "repayments_collected": 0.0, "flagged_tx": 0} for m in months}

    all_loans = db.query(LoanApplication.application_date, LoanApplication.requested_amount).filter(
        LoanApplication.application_status == "Approved"
    ).all()
    for date_str, amt in all_loans:
        if date_str:
            month_key = date_str[:7]
            if month_key in monthly_data:
                monthly_data[month_key]["loans_disbursed"] += float(amt or 0.0)

    all_repayments = db.query(LoanRepayment.payment_date, LoanRepayment.paid_amount).filter(
        LoanRepayment.paid_amount > 0
    ).all()
    for date_str, amt in all_repayments:
        if date_str:
            month_key = date_str[:7]
            if month_key in monthly_data:
                monthly_data[month_key]["repayments_collected"] += float(amt or 0.0)

    flagged_transactions = db.query(Transaction.transaction_date).filter(
        Transaction.is_flagged == "Yes"
    ).all()
    for (date_str,) in flagged_transactions:
        if date_str:
            month_key = date_str[:7]
            if month_key in monthly_data:
                monthly_data[month_key]["flagged_tx"] += 1

    monthly_trends = [
        {
            "month": m,
            "loans_disbursed_millions": round(data["loans_disbursed"] / 1_000_000, 2),
            "repayments_millions": round(data["repayments_collected"] / 1_000_000, 2),
            "flagged_transactions": data["flagged_tx"]
        }
        for m, data in sorted(monthly_data.items())
    ]

    # 6. Loan Type Distribution
    loan_types = db.query(
        LoanApplication.loan_type,
        func.count(LoanApplication.loan_id),
        func.sum(LoanApplication.requested_amount)
    ).group_by(LoanApplication.loan_type).all()

    loan_distribution = [
        {"name": lt or "Other", "count": count, "amount_millions": round((amt or 0.0) / 1_000_000, 2)}
        for lt, count, amt in loan_types
    ]

    # 7. Risk by Channel
    channel_flags = db.query(
        Transaction.channel,
        func.count(Transaction.transaction_id)
    ).filter(Transaction.is_flagged == "Yes").group_by(Transaction.channel).all()

    risk_by_channel = [
        {"channel": ch or "Unknown", "flagged_count": count}
        for ch, count in channel_flags
    ]

    # 8. Customer Segments
    segments = db.query(
        Customer.customer_segment,
        func.count(Customer.customer_id)
    ).group_by(Customer.customer_segment).all()

    customer_segment_distribution = [
        {"segment": seg or "Retail", "count": count}
        for seg, count in segments
    ]

    return {
        "total_customers": total_customers,
        "total_accounts": total_accounts,
        "active_accounts": active_accounts,
        "total_deposits": round(total_deposits, 2),
        "total_loan_applications": total_loan_apps,
        "approved_loans_count": approved_loans_count,
        "total_approved_loan_amount": round(total_approved_loan_amount, 2),
        "total_loan_repayments_due": round(total_due_amount, 2),
        "total_loan_repayments_collected": round(total_collected_amount, 2),
        "default_rate_pct": default_rate_pct,
        "overdue_loans_count": overdue_loans_count,
        "total_overdue_amount": round(total_overdue_amount, 2),
        "total_transactions": total_transactions,
        "flagged_transactions_count": flagged_tx_count,
        "flagged_transaction_pct": flagged_tx_pct,
        "high_critical_risk_events": high_critical_risks,
        "monthly_trends": monthly_trends,
        "loan_distribution": loan_distribution,
        "risk_by_channel": risk_by_channel,
        "customer_segment_distribution": customer_segment_distribution,
    }
