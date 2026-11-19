from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import datetime

class KPISummaryResponse(BaseModel):
    total_customers: int
    total_accounts: int
    active_accounts: int
    total_deposits: float
    total_loan_applications: int
    approved_loans_count: int
    total_approved_loan_amount: float
    total_loan_repayments_due: float
    total_loan_repayments_collected: float
    default_rate_pct: float
    overdue_loans_count: int
    total_overdue_amount: float
    total_transactions: int
    flagged_transactions_count: int
    flagged_transaction_pct: float
    high_critical_risk_events: int
    monthly_trends: List[Dict[str, Any]]
    loan_distribution: List[Dict[str, Any]]
    risk_by_channel: List[Dict[str, Any]]
    customer_segment_distribution: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []
    generated_at: str

class ApprovalActionRequest(BaseModel):
    decision: str  # "APPROVED" or "REJECTED"
    decision_by: str = "Chief Risk Officer"
    decision_notes: Optional[str] = ""

class ApprovalDecisionResponse(BaseModel):
    id: int
    report_id: int
    action_title: str
    action_description: str
    recommended_by: str
    verified_by: str
    status: str
    decision_by: Optional[str]
    decision_notes: Optional[str]
    created_at: datetime.datetime
    decided_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

class AgentLogResponse(BaseModel):
    id: int
    agent_name: str
    status: str
    log_message: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class ReportDetailResponse(BaseModel):
    id: int
    title: str
    generated_at: datetime.datetime
    status: str
    dataset_period: str
    kpi_snapshot: Optional[Dict[str, Any]]
    data_analyst_output: Optional[str]
    marketing_output: Optional[str]
    finance_output: Optional[str]
    operations_output: Optional[str]
    strategy_output: Optional[str]
    verification_output: Optional[str]
    is_verified: str
    verification_notes: Optional[str]
    pdf_filename: Optional[str]
    approvals: List[ApprovalDecisionResponse] = []
    agent_logs: List[AgentLogResponse] = []

    class Config:
        from_attributes = True
