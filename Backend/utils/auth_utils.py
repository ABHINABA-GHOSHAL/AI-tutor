import bcrypt
import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.user import get_user_by_id

JWT_SECRET = "supersecret"  # replace with os.getenv("JWT_SECRET")
JWT_EXPIRY_MINUTES = 60
security = HTTPBearer()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRY_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = decode_token(token)
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
