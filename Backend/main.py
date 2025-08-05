from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router  # your route imports

app = FastAPI()

# ✅ Add middleware BEFORE including routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
