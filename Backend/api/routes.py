from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from pydantic import BaseModel, EmailStr
import os
from database.__init__ import history_collection
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from database.user import get_user_by_email, create_user, get_user_by_id
from utils.auth_utils import (
    hash_password,
    verify_password,
    create_token,
    get_current_user
)
from bson import ObjectId
from fastapi.responses import JSONResponse
from ml.query_engine import ingest_pdf_and_build_index, answer_query
from ml.summarizer import summarize_text
from ml.quiz_generator import generate_quiz_questions
from ml.db import save_summary_history, get_user_history
from ml.chat_engine import upload_and_index_pdf_for_chat, chat_with_ai
router = APIRouter()

# =========================
# 🚀 Authentication Routes
# =========================

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
    user_info = await create_user(request.name, request.email, hashed_pw)
    
    token = create_token(user_info["user_id"])
    return {
        "token": token,
        "user_id": user_info["user_id"],
        "name": user_info["name"]
    }

@router.post("/login")
async def login(request: LoginRequest):
    user = await get_user_by_email(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(str(user["_id"]))
    return {
        "token": token,
        "user_id": str(user["_id"]),
        "name": user["name"]
    }

# =========================
# 📄 ML Routes
# =========================

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"message": f"{file.filename} uploaded successfully"}


@router.post("/summarize")
async def summarize():
    upload_dir = "uploads"
    uploaded_files = os.listdir(upload_dir)

    if not uploaded_files:
        raise HTTPException(status_code=400, detail="No uploaded PDF found.")

    latest_file = max(
        [os.path.join(upload_dir, f) for f in uploaded_files if f.endswith(".pdf")],
        key=os.path.getmtime
    )

    print("📄 Latest file to summarize:", latest_file)

    try:
        summary = summarize_text(latest_file)
        return {"summary": summary}
    except Exception as e:
        print("🔥 ERROR in /summarize:", e)
        raise HTTPException(status_code=500, detail="Summarization failed")



@router.post("/ask")
async def ask_question(query: str = Form(...), user=Depends(get_current_user)):
    try:
        user_id = str(user["_id"])
        answer = answer_query(query, user_id)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@router.post("/quiz")
async def quiz():
    upload_dir = "uploads"
    uploaded_files = os.listdir(upload_dir)

    if not uploaded_files:
        raise HTTPException(status_code=400, detail="No uploaded PDF found.")

    latest_file = max(
        [os.path.join(upload_dir, f) for f in uploaded_files if f.endswith(".pdf")],
        key=os.path.getmtime
    )

    print("📄 Latest file to quiz:", latest_file)

    try:
        questions = generate_quiz_questions(latest_file, num_questions=5)
        return {"quiz": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@router.post("/history/quiz")
async def save_quiz_history_route(data: dict, user=Depends(get_current_user)):
    try:
        user_id = str(user["_id"])
        file_name = data.get("file_name")
        quiz = data.get("quiz")

        if not file_name or not quiz:
            raise HTTPException(status_code=400, detail="Missing file_name or quiz")

        from ml.db import save_quiz_history
        await save_quiz_history(user_id, file_name, quiz)
        return {"message": "Quiz history saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save quiz history: {str(e)}")


@router.post("/chat/upload")
async def upload_chat_pdf(file: UploadFile = File(...)):
    try:
        path = upload_and_index_pdf_for_chat(file)
        return {"message": f"{file.filename} uploaded and indexed."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chat")
async def chat_endpoint(query: str = Form(...)):
    try:
        answer = chat_with_ai(query)
        return {"response": answer}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@router.post("/history/summarize")
async def save_summarize_history(data: dict, user=Depends(get_current_user)):
    try:
        user_id = str(user["_id"])
        file_name = data.get("file_name")
        summary = data.get("summary")

        if not file_name or not summary:
            raise HTTPException(status_code=400, detail="Missing file_name or summary")

        await save_summary_history(user_id, file_name, summary)
        return {"message": "Summary history saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save history: {str(e)}")
    

@router.get("/history")
async def get_history(user=Depends(get_current_user)):
    try:
        user_id = str(user["_id"])
        history = await get_user_history(user_id)

        # Convert ObjectId and timestamp for frontend compatibility
        cleaned = []
        for item in history:
            item["_id"] = str(item["_id"])
            if "timestamp" in item:
                item["timestamp"] = item["timestamp"].isoformat()
            cleaned.append(item)

        return {"history": cleaned}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")
    
    
@router.get("/history/summarizer/{item_id}")
async def download_summary(item_id: str, user=Depends(get_current_user)):
    doc = await history_collection.find_one({"_id": ObjectId(item_id), "user_id": str(user["_id"]), "type": "summarizer"})
    if not doc:
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"summary": doc["summary"]}

@router.get("/history/quiz/{item_id}")
async def download_quiz(item_id: str, user=Depends(get_current_user)):
    doc = await history_collection.find_one({"_id": ObjectId(item_id), "user_id": str(user["_id"]), "type": "quiz"})
    if not doc:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {"quiz": doc["quiz"]}