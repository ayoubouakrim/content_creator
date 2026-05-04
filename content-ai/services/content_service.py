from typing import Union
import json
from schemas.content import (
    BlogArticleRequest, 
    SocialMediaPostRequest, 
    ProductDescriptionRequest,
    SEOReport
)
from agents.blog_agent import BlogAgent
from agents.social_media_agent import SocialMediaAgent
from agents.product_agent import ProductAgent
from agents.seo_optimizer import SEOOptimizer

class ContentService:
    def __init__(self):
        self.seo_optimizer = SEOOptimizer()
        self.target_score = 90
    
    def generate_content(self, request: Union[BlogArticleRequest, SocialMediaPostRequest, ProductDescriptionRequest]) -> dict:
        """
        Generate content based on request type using conditional routing.
        Routes to appropriate agent using if-elif-else conditions.
        
        Returns:
            dict: {
                'content': str - Generated content,
                'seo_report': SEOReport | None - SEO analysis report (only for blog articles)
            }
        """
        
        agent = None
        content_type = None
        seo_report = None

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
            print(f"SEO Analysis: {analysis[:200]}...")
            
            # Parse analysis into structured SEOReport
            seo_report = self.parse_analysis(analysis)
            print(f"📊 SEO Report Score: {seo_report.score}/100")

        return {
            "content": result,
            "seo_report": seo_report
        }
    
    def parse_analysis(self, analysis_json: str) -> SEOReport:
        """
        Parse the SEO analysis JSON from SEOOptimizer.analyze_content() into a structured SEOReport.
        
        Maps SEO optimizer output fields:
        - overall_score → score
        - readability, keywords, on_page, meta_suggestion → score_breakdown
        - positive_points → positive_points
        - negative_points → negative_points
        - recommendations → points_to_improve
        
        Args:
            analysis_json: Raw JSON string from SEOOptimizer.analyze_content()
            
        Returns:
            SEOReport: Structured SEO report object
            
        Raises:
            json.JSONDecodeError: If analysis_json is invalid JSON
            KeyError: If required fields are missing from analysis
        """
        try:
            # Parse the JSON string from SEO optimizer
            analysis_data = json.loads(analysis_json)
            print(f"✅ Successfully parsed SEO analysis JSON")
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse SEO analysis JSON: {e}")
            raise ValueError(f"Invalid JSON in SEO analysis: {e}")
        
        # Extract the overall SEO score
        overall_score = analysis_data.get("overall_score", 0)
        
        # Build score_breakdown dictionary with all detailed metrics
        score_breakdown = {
            "overall_score": overall_score,
            "word_count": analysis_data.get("word_count"),
            "word_count_status": analysis_data.get("word_count_status"),
            "readability": analysis_data.get("readability", {}),
            "keywords": analysis_data.get("keywords", {}),
            "on_page_elements": analysis_data.get("on_page", []),
            "meta_suggestions": analysis_data.get("meta_suggestion", {}),
        }
        
        # Extract positive and negative points
        positive_points = analysis_data.get("positive_points", [])
        negative_points = analysis_data.get("negative_points", [])
        
        # Transform recommendations into points_to_improve with required structure
        recommendations = analysis_data.get("recommendations", [])
        points_to_improve = [
            {
                "priority": rec.get("priority", "medium"),
                "action": rec.get("action", ""),
                "category": rec.get("category", "general")
            }
            for rec in recommendations
        ]
        
        # Create and return the SEOReport object
        seo_report = SEOReport(
            score=overall_score,
            score_breakdown=score_breakdown,
            positive_points=positive_points,
            negative_points=negative_points,
            points_to_improve=points_to_improve
        )
        
        print(f"📊 SEO Report created - Score: {overall_score}/100")
        return seo_report

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
            
            # Parse analysis into structured SEOReport
            seo_report = self.parse_analysis(analysis)
            print(f"📊 SEO Report Score: {seo_report.score}/100")
            
            # Improve content if score is below target
            if seo_report.score < self.target_score:
                print(f"📈 Improving content (current score: {seo_report.score}/{self.target_score})...")
                result = self.seo_optimizer.improve_content(result, analysis, request)
                print(f"✅ Content improved based on SEO recommendations")
            else:
                print(f"🎯 Content meets target SEO score: {seo_report.score}/{self.target_score}")

        return result