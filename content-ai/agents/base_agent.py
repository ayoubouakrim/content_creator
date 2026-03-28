from abc import ABC, abstractmethod
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from core.config import get_settings
from langchain_core.messages import SystemMessage, HumanMessage

settings = get_settings()

class BaseAgent(ABC):
    def __init__(self, system_prompt: str):
        self.system_prompt = system_prompt
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self):
        return ChatOpenAI (
            base_url="https://models.inference.ai.azure.com",
            api_key=settings.GITHUB_TOKEN,
            model="gpt-4o",
            temperature=0.7,
        )
    
    def generate(self, prompt: str) -> str:
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]

        
        response = self.llm.invoke(messages)
        
        return response.content