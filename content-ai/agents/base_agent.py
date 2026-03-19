from abc import ABC, abstractmethod
from langchain.chat_models import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from core.config import get_settings

settings = get_settings()

class BaseAgent(ABC):
    def __init__(self, system_prompt: str):
        self.system_prompt = system_prompt
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self):
        return ChatOpenAI (
            base_url="https://models.inference.ai.azure.com",
            api_key=settings.GITHUB_TOKEN,
            model="openai/gpt-5",
            temperature=0.7,
        )
    
    def generate(self, prompt: str) -> str:
        full_prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("user", prompt)
        ])

        chain = full_prompt | self.llm
        response = chain.run({})
        
        return response.content