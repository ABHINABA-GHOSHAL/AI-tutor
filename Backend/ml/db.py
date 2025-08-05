
from datetime import datetime
from database.__init__ import history_collection

from datetime import datetime

async def save_summary_history(user_id: str, file_name: str, summary: str):
    entry = {
        "user_id": user_id,
        "file_name": file_name,
        "summary": summary,
        "timestamp": datetime.utcnow(),
        "type": "summarizer"
    }
    await history_collection.insert_one(entry)

async def get_user_history(user_id: str):
    cursor = history_collection.find({"user_id": user_id}).sort("timestamp", -1)
    return await cursor.to_list(length=100)


async def save_quiz_history(user_id: str, file_name: str, quiz: str):
    entry = {
        "user_id": user_id,
        "file_name": file_name,
        "quiz": quiz,
        "timestamp": datetime.utcnow(),
        "type": "quiz"
    }
    await history_collection.insert_one(entry)



async def save_flashcard_history(user_id: str, file_name: str, flashcards: list):
    doc = {
        "user_id": user_id,
        "type": "flashcards",
        "file_name": file_name,
        "flashcards": flashcards,
        "timestamp": datetime.utcnow()
    }
    await history_collection.insert_one(doc)

async def get_flashcard_history(user_id: str):
    return await history_collection.find({"user_id": user_id, "type": "flashcards"}).to_list(length=100)