# ml/rag_agent.py

from langchain_mistralai.chat_models import ChatMistralAI
from langchain.chains import RetrievalQA
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from langchain.utilities import GoogleSearchAPIWrapper
from ml.vectorstore import load_vectorstore
import os
from dotenv import load_dotenv

def ask_from_pdf_and_web(query: str) -> str:
    # Load Mistral via OpenRouter
    load_dotenv()
    API_KEY = os.getenv("MISTRAL_API_KEY")

    llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
    max_retries=2,
    api_key=API_KEY
   )

    # Load vectorstore
    vectorstore = load_vectorstore()

    # Tool 1: PDF Retriever
    pdf_qa_tool = Tool(
        name="PDF Retriever",
        func=RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever()).run,
        description="Use this tool to answer questions from the uploaded document."
    )

    # Tool 2: Google Search tool
    search_tool = Tool(
        name="Google Search",
        func=GoogleSearchAPIWrapper().run,
        description="Use this tool to fetch general or real-world knowledge."
    )

    # Hybrid Agent
    agent = initialize_agent(
        tools=[pdf_qa_tool, search_tool],
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
    )

    return agent.run(query)
