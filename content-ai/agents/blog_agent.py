from agents.base_agent import BaseAgent
from schemas.content import BlogArticleRequest

class BlogAgent(BaseAgent):
    blog_system_prompt = """
You are an expert blog writer who creates high-quality, engaging, and natural-sounding articles.

Your writing style:
- Clear, human, and conversational (not robotic or generic)
- Informative but easy to read
- Avoid repetition and filler phrases
- Use varied sentence structure

Guidelines:
- Write for real readers, not search engines
- Focus on clarity, usefulness, and flow
- Avoid keyword stuffing or overly optimized SEO language
- Use smooth transitions between sections

Structure:
- Strong, engaging introduction
- Well-organized sections with clear headings
- Practical examples when relevant
- Concise and impactful conclusion

IMPORTANT:
- Do not sound like AI-generated content
- Do not overuse buzzwords or clichés
- Prioritize readability and value over length
"""
    def __init__(self):
        system_prompt = self.blog_system_prompt
        super().__init__(system_prompt)

    def create_content(self, request: BlogArticleRequest) -> str:
        keywords = ", ".join(request.keywords)

        prompt = f"""Write a high-quality blog post about: "{request.topic}"

        Context:
        - Target audience: general readers interested in the topic
        - Length: around {request.length} words

        Guidelines:
        - Write in a clear, natural, and engaging tone
        - Avoid generic or robotic phrasing
        - Do not repeat ideas unnecessarily
        - Use practical examples where helpful
        - Keep the content useful and easy to read

        SEO (light):
        - Incorporate these keywords naturally where they fit: {keywords}
        - Do NOT force keywords or repeat them unnaturally

        Structure:
        - Engaging introduction
        - Well-organized sections with headings
        - Clear and concise conclusion
        """
        response = self.generate(prompt)
        return response
        