class SEOOptimizer(BaseAgent):
    seo_system_prompt = "You are a helpful assistant that optimizes content for search engines."
    def __init__(self):
        system_prompt = self.seo_system_prompt
        super().__init__(system_prompt)
    
    def analyze_content(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
        prompt = f"Analyze the following content and suggest improvements to optimize it for the following keywords: {keywords_str}. The content is: {content}"
        response = self.generate(prompt)
        return response
    
    def improve_content(self, content: str, analysis: str, original_request: str) -> str:
        prompt = f"Based on the following analysis: {analysis}, improve the content to better optimize it for search engines while still addressing the original request: {original_request}. The original content is: {content}"
        response = self.generate(prompt)
        return response