import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.system import ApprovalDecision
from backend.app.schemas.banking import ApprovalActionRequest, ApprovalDecisionResponse

router = APIRouter(prefix="/approvals", tags=["Human-in-the-Loop Governance"])

@router.get("/pending", response_model=List[ApprovalDecisionResponse])
def get_pending_approvals(db: Session = Depends(get_db)):
    return db.query(ApprovalDecision).filter(ApprovalDecision.status == "PENDING").all()

@router.get("/all", response_model=List[ApprovalDecisionResponse])
def get_all_approvals(db: Session = Depends(get_db)):
    return db.query(ApprovalDecision).order_by(ApprovalDecision.created_at.desc()).all()

@router.post("/{decision_id}/decide", response_model=ApprovalDecisionResponse)
def submit_approval_decision(
    decision_id: int,
    action: ApprovalActionRequest,
    db: Session = Depends(get_db)
):
    decision = db.query(ApprovalDecision).filter(ApprovalDecision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Approval record not found")

    decision.status = action.decision.upper()
    decision.decision_by = action.decision_by or "Branch Manager"
    decision.decision_notes = action.decision_notes or "Reviewed by authorized officer"
    decision.decided_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(decision)
    return decision
