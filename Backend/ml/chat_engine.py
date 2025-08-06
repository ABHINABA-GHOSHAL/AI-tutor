from langchain_core.messages import HumanMessage
from langchain_mistralai.chat_models import ChatMistralAI
from langchain.chains import ConversationalRetrievalChain
from ml.vectorstore import load_vectorstore, create_vectorstore
from ml.loader import load_pdf_chunks
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")
chat_memory = []

llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
    max_retries=2,
    api_key=api_key
)
chat_upload_dir = "chat_uploads"
chat_vectorstore_dir = "chat_vectorstore"



def upload_and_index_pdf_for_chat(file) -> str:
    os.makedirs(chat_upload_dir, exist_ok=True)
    os.makedirs(chat_vectorstore_dir, exist_ok=True)

    file_path = os.path.join(chat_upload_dir, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    chunks = load_pdf_chunks(file_path)
    create_vectorstore(chunks, index_path=chat_vectorstore_dir)

    return file_path


def chat_with_ai(query: str) -> str:
    try:

        vectorstore_file = os.path.join(chat_vectorstore_dir, "index.faiss")
        use_vectorstore = os.path.exists(vectorstore_file)

        if use_vectorstore:
            vectorstore = load_vectorstore(chat_vectorstore_dir)


            relevant_docs = vectorstore.similarity_search(query, k=1)

 
            if not relevant_docs or len(relevant_docs) == 0:
                raise ValueError("No relevant PDF chunks found. Using general chat.")


            chain = ConversationalRetrievalChain.from_llm(
                llm=llm,
                retriever=vectorstore.as_retriever(search_type="similarity", k=4),
                return_source_documents=False,
            )
            response = chain.invoke({"question": query, "chat_history": chat_memory})
            answer = response["answer"]
            chat_memory.append((query, answer))
            return answer


        raise FileNotFoundError("No vectorstore found")

    except Exception as e:

        response = llm.invoke([HumanMessage(content=query)])
        answer = str(response.content) if hasattr(response, "content") else str(response)
        chat_memory.append((query, answer))
        return answer