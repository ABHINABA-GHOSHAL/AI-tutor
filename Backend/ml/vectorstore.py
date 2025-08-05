from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import os

def create_vectorstore(chunks, index_path="vectorstore"):
    os.makedirs(index_path, exist_ok=True)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(index_path)
    return vectorstore

def load_vectorstore(index_path="vectorstore"):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
