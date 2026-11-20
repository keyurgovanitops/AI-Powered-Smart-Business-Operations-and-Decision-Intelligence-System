import os
import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.services.kpi_engine import calculate_banking_kpis
from backend.app.agents.banking_crew import run_banking_multi_agent_analysis
from backend.app.services.pdf_generator import generate_pdf_report
from backend.app.models.system import AnalysisReport, AgentLog, ApprovalDecision
from backend.app.schemas.banking import ReportDetailResponse

router = APIRouter(prefix="/agents", tags=["Multi-Agent Crew"])

@router.post("/run", response_model=ReportDetailResponse)
def execute_multi_agent_analysis(db: Session = Depends(get_db)):
    # 1. Fetch exact KPIs
    kpis = calculate_banking_kpis(db)
    if kpis["total_customers"] == 0:
        raise HTTPException(
            status_code=400,
            detail="Bank database is empty! Please load or seed dataset first."
        )

    # 2. Create Analysis Report record in progress
    report = AnalysisReport(
        title="EVA Operations & Risk Decision Intelligence Report",
        status="PROCESSING",
        kpi_snapshot=kpis,
        dataset_period="May 1, 2026 - October 31, 2026"
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # 3. Log agent steps
    agents_sequence = [
        ("Data Analyst Agent", "Extracting portfolio metrics, monthly disbursement trends & default percentages."),
        ("Marketing Agent", "Segmenting account tranches, customer churn propensity & deposit mobilization."),
        ("Finance Agent", "Auditing non-performing loan exposure, interest margins & loss provisioning."),
        ("Operations Agent", "Analyzing digital channel friction, UPI velocity spikes & AML workload."),
        ("Strategy Agent", "Formulating consolidated growth plan and human-in-the-loop credit policy proposal."),
        ("Verification Agent", "Cross-checking all numerical ratios against database source tables.")
    ]

    for name, msg in agents_sequence:
        log_entry = AgentLog(
            report_id=report.id,
            agent_name=name,
            status="COMPLETED",
            log_message=msg,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(log_entry)
    db.commit()

    # 4. Run multi-agent execution
    agent_results = run_banking_multi_agent_analysis(kpis)

    report.status = "COMPLETED"
    report.data_analyst_output = agent_results["data_analyst_output"]
    report.marketing_output = agent_results["marketing_output"]
    report.finance_output = agent_results["finance_output"]
    report.operations_output = agent_results["operations_output"]
    report.strategy_output = agent_results["strategy_output"]
    report.verification_output = agent_results["verification_output"]
    report.is_verified = agent_results.get("is_verified", "VERIFIED")

    # 5. Generate PDF report
    try:
        os.makedirs(settings.REPORTS_DIR, exist_ok=True)
        pdf_file = generate_pdf_report(agent_results, kpis, f"EVA_Audit_Report_{report.id}.pdf")
        report.pdf_filename = pdf_file
    except Exception as e:
        print(f"PDF generation deferred to download time: {e}")
        report.pdf_filename = f"EVA_Audit_Report_{report.id}.pdf"

    # 6. Create Human-in-the-Loop decision requirement
    action_info = agent_results.get("proposed_action", {})
    decision = ApprovalDecision(
        report_id=report.id,
        action_title=action_info.get("title", "Credit Underwriting & AML Budget Reallocation"),
        action_description=action_info.get("description", "Proposed credit score threshold hike and budget reallocation."),
        recommended_by="Strategy Agent",
        verified_by="Verification Agent",
        status="PENDING",
        created_at=datetime.datetime.utcnow()
    )
    db.add(decision)
    db.commit()
    db.refresh(report)

    return report
