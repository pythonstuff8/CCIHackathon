"""User-related Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: str  # teen, parent, counselor


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: str
    onboarding_complete: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int | None = None


class TrustedAdultCreate(BaseModel):
    name: str
    email: EmailStr
    relation: str


class TrustedAdultResponse(BaseModel):
    id: int
    name: str
    email: str
    relation: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LinkParentRequest(BaseModel):
    parent_email: EmailStr


class ConsentCreate(BaseModel):
    consent_type: str
    consented: bool
