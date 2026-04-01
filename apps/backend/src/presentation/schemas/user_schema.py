from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    role: str = "Confeiteiro"

class UserCreate(UserBase):
    id: str # Clerk ID - should be provided by client or auth layer

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
