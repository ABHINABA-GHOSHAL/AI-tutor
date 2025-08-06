
from ml.loader import load_pdf_chunks
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("MISTRAL_API_KEY")

llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
    max_retries=2,
    api_key=API_KEY
)
def generate_quiz_questions(pdf_path: str, num_questions: int = 5) -> list:
    chunks = load_pdf_chunks(pdf_path)
    full_text = " ".join([chunk.page_content for chunk in chunks])

    prompt = f"""
You are a quiz generator. Read the following content and generate {num_questions} multiple-choice questions with 4 options and indicate the correct answer.

Content:
{full_text}
"""

    messages = [
        SystemMessage(content="You are a quiz-making assistant."),
        HumanMessage(content=prompt),
    ]

    response = llm.invoke(messages)
    return response.content.strip().split("\n\n")  
