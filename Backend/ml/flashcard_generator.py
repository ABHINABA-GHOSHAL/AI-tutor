
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

def generate_flashcards(pdf_path: str, num_cards: int = 5) -> list:
    chunks = load_pdf_chunks(pdf_path)
    full_text = " ".join([chunk.page_content for chunk in chunks])

    prompt = f"""
You are a flashcard generator. Read the following content and generate {num_cards} flashcards in this format:
Q: <question>
A: <answer>

Only output the flashcards in this format.

Content:
{full_text}
"""

    messages = [
        SystemMessage(content="You are a flashcard generator."),
        HumanMessage(content=prompt),
    ]

    response = llm.invoke(messages)
    raw_cards = response.content.strip().split("\n\n")

    flashcards = []
    for idx, card in enumerate(raw_cards):
        lines = card.strip().split("\n")
        if len(lines) >= 2 and lines[0].startswith("Q:") and lines[1].startswith("A:"):
            flashcards.append({
                "id": idx + 1,
                "front": lines[0][2:].strip(),
                "back": lines[1][2:].strip(),
                "category": "Generated"
            })

    return flashcards
