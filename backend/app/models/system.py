import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="Banking Operations & Decision Intelligence Report")
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="COMPLETED")  # PENDING, IN_PROGRESS, COMPLETED, FAILED
    dataset_period = Column(String(100), default="May 1, 2026 - October 31, 2026")
    
    # Financial and KPI summary snapshot
    kpi_snapshot = Column(JSON, nullable=True)
    
    # Agent detailed findings
    data_analyst_output = Column(Text, nullable=True)
    marketing_output = Column(Text, nullable=True)
    finance_output = Column(Text, nullable=True)
    operations_output = Column(Text, nullable=True)
    strategy_output = Column(Text, nullable=True)
    verification_output = Column(Text, nullable=True)
    
    # Verification details
    is_verified = Column(String(20), default="VERIFIED")
    verification_notes = Column(Text, nullable=True)
    
    # Path to downloadable PDF
    pdf_filename = Column(String(255), nullable=True)

    agent_logs = relationship("AgentLog", back_populates="report", cascade="all, delete-orphan")
    approvals = relationship("ApprovalDecision", back_populates="report", cascade="all, delete-orphan")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("analysis_reports.id"), index=True)
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), default="COMPLETED") # STARTING, RUNNING, COMPLETED, FAILED
    log_message = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    report = relationship("AnalysisReport", back_populates="agent_logs")


class ApprovalDecision(Base):
    __tablename__ = "approval_decisions"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("analysis_reports.id"), index=True)
    action_title = Column(String(255), nullable=False)
    action_description = Column(Text, nullable=False)
    recommended_by = Column(String(100), default="Strategy Agent")
    verified_by = Column(String(100), default="Verification Agent")
    status = Column(String(50), default="PENDING")  # PENDING, APPROVED, REJECTED
    decision_by = Column(String(100), nullable=True)
    decision_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    decided_at = Column(DateTime, nullable=True)

    report = relationship("AnalysisReport", back_populates="approvals")
