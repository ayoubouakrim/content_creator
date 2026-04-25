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
    
    def generate_content(self, request: Union[BlogArticleRequest, SocialMediaPostRequest, ProductDescriptionRequest]) -> str:
        """
        Generate content based on request type using conditional routing.
        Routes to appropriate agent using if-elif-else conditions.
        """
        
        agent = None
        content_type = None

        # ========== CONDITIONAL ROUTING: if-elif-else ==========
        if isinstance(request, BlogArticleRequest):
            print(f"🚀 Routing to BlogAgent for topic: {request.topic}")
            agent = BlogAgent()
            content_type = "blog"
            
        elif isinstance(request, SocialMediaPostRequest):
            print(f"🚀 Routing to SocialMediaAgent for platform: {request.platform}")
            agent = SocialMediaAgent()
            content_type = "social_media"
            
        elif isinstance(request, ProductDescriptionRequest):
            print(f"🚀 Routing to ProductAgent for product: {request.product_name}")
            agent = ProductAgent()
            content_type = "product"
            
        else:
            raise ValueError(f"❌ Unsupported content type: {type(request)}")

        # Generate content using the appropriate agent
        print(f"📝 Generating {content_type} content...")
        result = agent.create_content(request)
        print(f"✅ {content_type.upper()} content generated successfully")
        print(f"Result preview: {result[:100]}...")

        # SEO optimization (only for blog articles)
        if content_type == "blog":
            print("🔍 Analyzing content for SEO...")
            analysis = self.seo_optimizer.analyze_content(result, request.keywords)
            print(f"SEO Analysis: {analysis}")

            print("📈 Improving content based on SEO analysis...")
            improved_content = self.seo_optimizer.improve_content(result, analysis, request)
            print("✅ Content improved")
            return improved_content

        return result


    def generate_content_switch(self, request: Union[BlogArticleRequest, SocialMediaPostRequest, ProductDescriptionRequest]) -> str:
        """
        Alternative implementation using a switch-like pattern with a dictionary.
        More scalable for adding new content types.
        """
        
        # Define handler mapping for each content type
        handlers = {
            BlogArticleRequest: {
                "agent": BlogAgent(),
                "type": "blog",
                "optimize": True
            },
            SocialMediaPostRequest: {
                "agent": SocialMediaAgent(),
                "type": "social_media",
                "optimize": False
            },
            ProductDescriptionRequest: {
                "agent": ProductAgent(),
                "type": "product",
                "optimize": False
            }
        }

        # Get handler for request type
        request_type = type(request)
        if request_type not in handlers:
            raise ValueError(f"❌ Unsupported content type: {request_type}")

        handler = handlers[request_type]
        agent = handler["agent"]
        content_type = handler["type"]
        should_optimize = handler["optimize"]

        # Generate content
        print(f"🚀 Routing to {content_type} agent...")
        print(f"📝 Generating {content_type} content...")
        result = agent.create_content(request)
        print(f"✅ {content_type.upper()} content generated")

        # Apply SEO optimization if needed
        if should_optimize and hasattr(request, 'keywords'):
            print("🔍 Analyzing content for SEO...")
            analysis = self.seo_optimizer.analyze_content(result, request.keywords)
            print(f"SEO Analysis: {analysis}")
            print("📈 Improving content...")
            result = self.seo_optimizer.improve_content(result, analysis, request)

        return result