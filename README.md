# 🏦 Apex Commercial Bank — AI Decision Intelligence Platform
### Industry-Level Multi-Agent Operations & Risk Intelligence System
**Technology Stack:** React.js (Vite + Tailwind CSS + Recharts) + Python FastAPI + CrewAI + Google Gemini 3.5 Flash + SQLAlchemy  
**Dataset Period:** May 1, 2026 – October 31, 2026  
**Industry:** Banking (`06_Banking.xlsx`)

---

## 📌 Executive Summary
An autonomous AI-powered Decision Intelligence System designed for bank managers and risk officers. Instead of manually inspecting thousands of loan ledgers, customer records, and fraud events, an autonomous boardroom of **six specialized AI agents** collaborates to analyze trends, assess non-performing loans, audit calculations to eliminate hallucinations, and propose strategic governance actions requiring authorized human sign-off.

---

## 🚀 Key Features

1. **Executive KPI Dashboard (Paiso Ka Hisab)**
   * **Customer Deposits:** Rs. 200.74 Cr across 1,600 accounts.
   * **Loan Disbursements:** Rs. 142.15 Cr disbursed across approved home, personal, auto, and business loans.
   * **Default Rate (Loan Ka Lafda):** Real-time monitoring of overdue loans (21.12% at-risk capital).
   * **Suspicious Activity (Kuch To Gadbad Hai):** 122 AML fraud alerts detected across UPI, ATM, and NetBanking.

2. **6 Specialized Autonomous Agents (CrewAI Baithak)**
   * **Data Analyst Agent:** Extracts exact statistical metrics and monthly loan disbursement trends.
   * **Marketing & Growth Agent:** Identifies high-net-worth customer segments and churn propensities.
   * **Finance Agent:** Computes bad-debt provisioning requirements and net interest margin risk.
   * **Operations Agent:** Flags digital channel friction and high-velocity UPI spikes.
   * **Strategy Agent:** Consolidates insights into an actionable board improvement plan.
   * **Verification Agent:** Audits every calculation against database source records to ensure zero hallucinations.

3. **Human-in-the-Loop Governance (Manager Desk)**
   * Strategic recommendations (e.g., raising credit score cutoffs or reallocating AML budgets) cannot execute automatically.
   * The branch manager must review, provide audit notes, and formally **Approve (Pakka Karo)** or **Reject (Nahi Jam Raha)**.

4. **Charcha AI (Interactive Banking Chatbot)**
   * Conversational assistant grounded on the live banking database powered by Gemini 3.5 Flash.

5. **Downloadable Audit PDF Report**
   * Instant executive PDF generation using ReportLab containing verified multi-agent findings.

6. **Khilona Zone (Playful Experimental Toys)**
   * Clearly watermarked and labeled **TOY** features (Account Freeze Bot, WhatsApp Wasooli Bot, etc.) showcasing future concepts while keeping production boundaries clear.

---

## 🛠️ Quick Start Instructions

### 1. Launch Everything With One Click
Double-click `start_app.bat` in this folder, or run:
```powershell
.\start_app.bat
```

### 2. Manual Startup
**Backend (FastAPI):**
```powershell
backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
* **Swagger API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

**Frontend (React.js):**
```powershell
cd frontend
npm.cmd run dev
```
* **Web Application:** [http://localhost:5173](http://localhost:5173)

---

## 🔒 Security & Environment Configuration
Environment settings are stored in `backend/.env`:
* `GEMINI_API_KEY`: Configured with Google AI Studio Free Tier.
* `DATABASE_URL`: Defaults to `sqlite:///./banking_bi.db` (Switch to PostgreSQL or MySQL anytime by modifying this single URL).
