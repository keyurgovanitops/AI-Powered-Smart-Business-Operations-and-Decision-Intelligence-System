import os
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from backend.app.config import settings

def generate_pdf_report(report_data: dict, kpis: dict, output_filename: str = None) -> str:
    if not output_filename:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"Banking_BI_Report_{timestamp}.pdf"
    
    file_path = os.path.join(settings.REPORTS_DIR, output_filename)
    
    doc = SimpleDocTemplate(
        file_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#1E3A8A'),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#4B5563'),
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#1E40AF'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1F2937')
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=colors.HexColor('#065F46')
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("Smart Banking Operations & Decision Intelligence System", title_style))
    elements.append(Paragraph(f"Autonomous Multi-Agent Audit Report | Dataset: May 1 – Oct 31, 2026 | Generated: {datetime.datetime.now().strftime('%b %d, %Y %H:%M')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=10))

    # KPI Summary Table
    dep_cr = round(kpis.get('total_deposits', 0) / 10_000_000, 2)
    loan_cr = round(kpis.get('total_approved_loan_amount', 0) / 10_000_000, 2)
    overdue_cr = round(kpis.get('total_overdue_amount', 0) / 10_000_000, 2)

    kpi_table_data = [
        [
            Paragraph("<b>Total Customers:</b>", body_style), Paragraph(f"{kpis.get('total_customers', 0):,}", body_style),
            Paragraph("<b>Total Deposits:</b>", body_style), Paragraph(f"Rs. {dep_cr} Cr", body_style),
        ],
        [
            Paragraph("<b>Active Accounts:</b>", body_style), Paragraph(f"{kpis.get('active_accounts', 0):,}", body_style),
            Paragraph("<b>Approved Loans:</b>", body_style), Paragraph(f"Rs. {loan_cr} Cr", body_style),
        ],
        [
            Paragraph("<b>Default / Overdue Rate:</b>", body_style), Paragraph(f"{kpis.get('default_rate_pct', 0)}%", body_style),
            Paragraph("<b>At-Risk Capital:</b>", body_style), Paragraph(f"Rs. {overdue_cr} Cr", body_style),
        ],
        [
            Paragraph("<b>Transactions:</b>", body_style), Paragraph(f"{kpis.get('total_transactions', 0):,}", body_style),
            Paragraph("<b>Flagged Anomalies:</b>", body_style), Paragraph(f"{kpis.get('flagged_transactions_count', 0):,} ({kpis.get('flagged_transaction_pct', 0)}%)", body_style),
        ]
    ]

    t = Table(kpi_table_data, colWidths=[130, 140, 130, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))

    # Agent Findings
    agent_sections = [
        ("Agent 1: Data Analyst Agent (Numerical Performance & Trends)", report_data.get("data_analyst_output", "")),
        ("Agent 2: Marketing & Growth Agent (Customer Segments & Retention)", report_data.get("marketing_output", "")),
        ("Agent 3: Finance Agent (Credit Risk, Provisions & Margin)", report_data.get("finance_output", "")),
        ("Agent 4: Operations Agent (Bottlenecks, Channels & Compliance)", report_data.get("operations_output", "")),
        ("Agent 5: Strategy Agent (Consolidated Improvement Plan)", report_data.get("strategy_output", "")),
        ("Agent 6: Verification Agent (Numerical Cross-Validation & Audit)", report_data.get("verification_output", "")),
    ]

    for title, text in agent_sections:
        elements.append(Paragraph(title, section_heading))
        cleaned_text = text.replace("\n", "<br/>")
        elements.append(Paragraph(cleaned_text, body_style))
        elements.append(Spacer(1, 6))

    # Human-in-the-Loop Section
    elements.append(Paragraph("Human-in-the-Loop Governance & Approvals", section_heading))
    hitl_desc = report_data.get("proposed_action", {}).get("description", "Credit threshold and budget re-allocation approval.")
    elements.append(Paragraph(f"<b>Proposed Consequential Action:</b> {hitl_desc}", body_style))
    elements.append(Paragraph("<b>Status:</b> Recorded for Executive Management Review", badge_style))

    doc.build(elements)
    return output_filename
