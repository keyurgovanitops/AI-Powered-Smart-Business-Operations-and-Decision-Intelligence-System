from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = "Bank Manager"
    company_name: Optional[str] = "Apex Commercial Bank"
    role: Optional[str] = "Manager"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    company_name: Optional[str]
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
