from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from database.user import get_user_by_email, create_user, get_user_by_id
from utils.auth_utils import hash_password, verify_password, create_token, get_current_user

router = APIRouter()

# Request models
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup(request: SignupRequest):
    existing_user = await get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(request.password)
    user_id = await create_user(request.name, request.email, hashed_pw)
    token = create_token(user_id)
    return {"token": token}

@router.post("/login")
async def login(request: LoginRequest):
    user = await get_user_by_email(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(str(user["_id"]))
    
    return {"token": token}

@router.get("/auth/me")
async def get_profile(user=Depends(get_current_user)):
    return {"name": user.get("name"), "email": user.get("email")}
