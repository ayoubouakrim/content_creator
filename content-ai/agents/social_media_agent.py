from agents.base_agent import BaseAgent
from schemas.content import SocialMediaPostRequest

class SocialMediaAgent(BaseAgent):
    social_media_system_prompt = "You are a helpful assistant that creates social media posts."
    def __init__(self):
        system_prompt = self.social_media_system_prompt
        super().__init__(system_prompt)

    def create_content(self, request: SocialMediaPostRequest) -> str:
        prompt = f"Write a social media post about '{request.topic}' for the platform {request.platform}. The post should be engaging and appropriate for the target audience."
        response = self.generate(prompt)
        return response