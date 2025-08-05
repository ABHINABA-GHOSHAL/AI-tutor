from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)

db = client["ai_tutor"]

users_collection = db["users"]
documents_collection = db["documents"]
chunks_collection = db["chunks"]
history_collection = db["history"]
