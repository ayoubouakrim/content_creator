from typing import Union
from schemas.content import BlogArticleRequest, SocialMediaPostRequest, ProductDescriptionRequest
from agents.blog_agent import BlogAgent
from agents.social_media_agent import SocialMediaAgent
from agents.product_agent import ProductAgent
from agents.seo_optimizer import SEOOptimizer

class ContentService:
    def __init__(self):
        self.seo_optimizer = SEOOptimizer()
        self.target_score = 90
    

    def generate_content(self, request: Union[BlogArticleRequest, SocialMediaPostRequest]) -> str:
        if isinstance(request, BlogArticleRequest):
            agent = BlogAgent()
        elif isinstance(request, SocialMediaPostRequest):
            agent = SocialMediaAgent()
        elif isinstance(request, ProductDescriptionRequest):
            agent = ProductAgent()
        else:
            raise ValueError("Unsupported content type")
        
        print("Generating content...")
        result = agent.create_content(request)
        print("the result is ", result)

        print("Analyzing content for SEO...")
        analysis = self.seo_optimizer.analyze_content(result, request.keywords)
        print("SEO Analysis:", analysis)

        print("Improving content based on SEO analysis...")
        improved_content = self.seo_optimizer.improve_content(result, analysis, request)
        print("Improved Content:", improved_content)

        return improved_content