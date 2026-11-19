import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.system import AnalysisReport
from backend.app.schemas.banking import ReportDetailResponse
from backend.app.config import settings

router = APIRouter(prefix="/reports", tags=["Reports & History"])

@router.get("/", response_model=List[ReportDetailResponse])
def list_reports(db: Session = Depends(get_db)):
    return db.query(AnalysisReport).order_by(AnalysisReport.generated_at.desc()).all()

@router.get("/latest", response_model=ReportDetailResponse)
def get_latest_report(db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).order_by(AnalysisReport.generated_at.desc()).first()
    if not report:
        raise HTTPException(status_code=404, detail="No reports generated yet.")
    return report

@router.get("/{report_id}", response_model=ReportDetailResponse)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(AnalysisReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/{report_id}/pdf")
def download_pdf_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(AnalysisReport).filter(AnalysisReport.id == report_id).first()
    if not report or not report.pdf_filename:
        raise HTTPException(status_code=404, detail="PDF report not found")
    
    file_path = os.path.join(settings.REPORTS_DIR, report.pdf_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF file does not exist on disk")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=report.pdf_filename
    )
