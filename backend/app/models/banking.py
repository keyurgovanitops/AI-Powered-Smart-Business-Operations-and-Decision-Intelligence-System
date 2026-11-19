from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(50), primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    city = Column(String(100), nullable=True)
    customer_since = Column(String(50), nullable=True)
    customer_segment = Column(String(50), nullable=True)  # Retail, Corporate, SME, Priority
    kyc_status = Column(String(50), nullable=True)        # Verified, Pending, Expired
    risk_profile = Column(String(50), nullable=True)      # Low, Medium, High

    accounts = relationship("Account", back_populates="customer")
    loan_applications = relationship("LoanApplication", back_populates="customer")
    risk_events = relationship("RiskEvent", back_populates="customer")


class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), index=True)
    account_type = Column(String(50), nullable=True)      # Savings, Current, Business, Fixed Deposit
    opening_date = Column(String(50), nullable=True)
    branch_id = Column(String(50), nullable=True)
    current_balance = Column(Float, default=0.0)
    account_status = Column(String(50), nullable=True)    # Active, Dormant, Frozen
    currency = Column(String(10), default="INR")

    customer = relationship("Customer", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(50), primary_key=True, index=True)
    account_id = Column(String(50), ForeignKey("accounts.account_id"), index=True)
    transaction_date = Column(String(50), nullable=True)
    transaction_type = Column(String(50), nullable=True)  # Credit, Debit
    amount = Column(Float, default=0.0)
    channel = Column(String(50), nullable=True)           # ATM, UPI, NetBanking, Branch
    merchant_category = Column(String(100), nullable=True)
    transaction_status = Column(String(50), nullable=True) # Completed, Failed, Pending
    is_flagged = Column(String(20), default="No")         # Yes, No

    account = relationship("Account", back_populates="transactions")


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    loan_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), index=True)
    application_date = Column(String(50), nullable=True)
    loan_type = Column(String(50), nullable=True)         # Home, Personal, Auto, Business
    requested_amount = Column(Float, default=0.0)
    annual_interest_rate = Column(Float, default=0.0)
    tenure_months = Column(Integer, default=12)
    credit_score = Column(Integer, default=650)
    application_status = Column(String(50), nullable=True) # Approved, Rejected, Pending

    customer = relationship("Customer", back_populates="loan_applications")
    repayments = relationship("LoanRepayment", back_populates="loan")


class LoanRepayment(Base):
    __tablename__ = "loan_repayments"

    repayment_id = Column(String(50), primary_key=True, index=True)
    loan_id = Column(String(50), ForeignKey("loan_applications.loan_id"), index=True)
    due_date = Column(String(50), nullable=True)
    due_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    payment_date = Column(String(50), nullable=True)
    repayment_status = Column(String(50), nullable=True)  # Paid, Late, Overdue, Defaulted
    days_past_due = Column(Integer, default=0)

    loan = relationship("LoanApplication", back_populates="repayments")


class RiskEvent(Base):
    __tablename__ = "risk_events"

    event_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), index=True)
    event_date = Column(String(50), nullable=True)
    event_type = Column(String(100), nullable=True)       # High Value Transfer, Structuring, Rapid In-Out
    risk_level = Column(String(50), nullable=True)        # Low, Medium, High, Critical
    case_status = Column(String(50), nullable=True)       # Open, Under Review, Closed
    assigned_team = Column(String(100), nullable=True)

    customer = relationship("Customer", back_populates="risk_events")
