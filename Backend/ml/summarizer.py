from ml.loader import load_pdf_chunks
from ml.vectorstore import create_vectorstore, load_vectorstore
from langchain_mistralai import ChatMistralAI
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
    max_retries=2,
    api_key=api_key
)

def summarize_text(pdf_path: str) -> str:
    chunks = load_pdf_chunks(pdf_path)
    full_text = "\n".join([chunk.page_content for chunk in chunks])

    messages = [
        ("system", "You are an academic assistant that summarizes academic PDF content."),
        ("human", f"Summarize the following document:\n\n{full_text}")
    ]

    response = llm.invoke(messages)
    
    return response.content.strip()
