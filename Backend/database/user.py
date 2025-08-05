from . import users_collection
from bson.objectid import ObjectId

async def create_user(name: str, email: str, hashed_password: str):
    user = {
        "name": name,
        "email": email,
        "hashed_password": hashed_password
    }
    result = await users_collection.insert_one(user)
    return {
        "user_id": str(result.inserted_id),
        "name": name
    }

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def get_user_by_id(user_id: str):
    return await users_collection.find_one({"_id": ObjectId(user_id)})
