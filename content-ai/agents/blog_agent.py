from agents.base_agent import BaseAgent
from schemas.content import BlogArticleRequest

class BlogAgent(BaseAgent):
    blog_system_prompt = "You are a helpful assistant that writes blog posts."
    def __init__(self):
        system_prompt = self.blog_system_prompt
        super().__init__(system_prompt)

    def create_content(self, request: BlogArticleRequest) -> str:

        keywords = ", ".join(request.keywords)
        prompt = f"Write a blog post about '{request.topic}' using the following keywords: {keywords}. The blog post should be approximately {request.length} words long."

        response = self.generate(prompt)
        return response
        