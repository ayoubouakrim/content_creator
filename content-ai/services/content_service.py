from typing import Union
import json
from schemas.content import (
    BlogArticleRequest, 
    SocialMediaPostRequest, 
    ProductDescriptionRequest,
    SEOReport,
    KeywordAnalysis,
    OnPageElement,
    ReadabilityMetric,
    SEORecommendation
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
        Parse the comprehensive SEO analysis JSON from SEOOptimizer.analyze_content().
        
        Extracts all detailed metrics:
        - Score and metadata (title, niche, format)
        - Word count analysis
        - Readability metrics
        - Keyword analysis (primary, secondary, missing)
        - On-page element evaluation
        - Meta suggestions
        - Positive/negative points
        - Actionable recommendations by priority
        
        Args:
            analysis_json: Raw JSON string from SEOOptimizer.analyze_content()
            
        Returns:
            SEOReport: Comprehensive SEO report object
        """
        try:
            analysis_data = json.loads(analysis_json)
            print(f"✅ Successfully parsed SEO analysis JSON")
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse SEO analysis JSON: {e}")
            raise ValueError(f"Invalid JSON in SEO analysis: {e}")
        
        # ═══════════════════════════════════════════════════════
        # BASIC METRICS
        # ═══════════════════════════════════════════════════════
        score = analysis_data.get("overall_score", 0)
        score_label = "Great" if score >= 80 else "Good" if score >= 60 else "Needs SEO work"
        
        # ═══════════════════════════════════════════════════════
        # POST METADATA
        # ═══════════════════════════════════════════════════════
        post_title = analysis_data.get("post_title")
        niche = analysis_data.get("niche")
        format_type = analysis_data.get("format")
        
        # ═══════════════════════════════════════════════════════
        # WORD COUNT & TARGET
        # ═══════════════════════════════════════════════════════
        word_count = analysis_data.get("word_count", 0)
        word_count_status = analysis_data.get("word_count_status")
        word_count_target = None
        
        # Determine target range based on detected format
        if word_count_status == "too_short":
            word_count_target = "1,200–2,000"
        elif word_count_status == "too_long":
            word_count_target = "1,200–2,000"
        else:
            word_count_target = "1,200–2,000"
        
        # ═══════════════════════════════════════════════════════
        # READABILITY ANALYSIS
        # ═══════════════════════════════════════════════════════
        readability_data = analysis_data.get("readability", {})
        readability_score = readability_data.get("flesch_score")
        
        readability_level = "Easy" if readability_score and readability_score > 60 else "Difficult"
        if readability_score and readability_score > 60:
            readability_level = "Fairly easy"
        
        # Build readability metrics list
        readability_metrics = []
        if readability_data.get("avg_sentence_words"):
            readability_metrics.append(ReadabilityMetric(
                metric_name="Sentence length",
                value=f"Avg {readability_data.get('avg_sentence_words')} words",
                target="Under 18 words",
                status="✓" if readability_data.get("avg_sentence_words", 20) < 20 else "⚠"
            ))
        if readability_data.get("passive_voice_pct") is not None:
            readability_metrics.append(ReadabilityMetric(
                metric_name="Passive voice",
                value=f"~{readability_data.get('passive_voice_pct')}%",
                target="Under 10%",
                status="✓" if readability_data.get("passive_voice_pct", 20) < 10 else "⚠"
            ))
        if readability_data.get("transition_words_pct") is not None:
            readability_metrics.append(ReadabilityMetric(
                metric_name="Transition words",
                value=f"~{readability_data.get('transition_words_pct')}%",
                target="15–25%",
                status="✓" if 15 <= readability_data.get("transition_words_pct", 0) <= 25 else "⚠"
            ))
        if readability_data.get("tone"):
            readability_metrics.append(ReadabilityMetric(
                metric_name="Tone",
                value=readability_data.get("tone"),
                target="Conversational"
            ))
        
        # ═══════════════════════════════════════════════════════
        # KEYWORD ANALYSIS
        # ═══════════════════════════════════════════════════════
        keywords_data = analysis_data.get("keywords", {})
        keyword_density = keywords_data.get("keyword_density", 0) if isinstance(keywords_data, dict) else 0
        
        # Primary keyword
        primary_kw = keywords_data.get("primary", {}) if isinstance(keywords_data, dict) else {}
        primary_keyword = None
        if primary_kw:
            primary_keyword = KeywordAnalysis(
                term=primary_kw.get("term", ""),
                search_volume=primary_kw.get("search_volume"),
                keyword_difficulty=primary_kw.get("keyword_difficulty", primary_kw.get("kd")),
                usage_count=primary_kw.get("count", 0),
                note=f"Density: {primary_kw.get('density_pct', 0):.1f}%"
            )
        
        # Secondary keywords
        secondary_keywords = []
        secondary_list = keywords_data.get("secondary", []) if isinstance(keywords_data, dict) else []
        for kw in secondary_list:
            if isinstance(kw, dict):
                secondary_keywords.append(KeywordAnalysis(
                    term=kw.get("term", ""),
                    search_volume=kw.get("search_volume"),
                    keyword_difficulty=kw.get("keyword_difficulty", kw.get("kd")),
                    usage_count=kw.get("count", 0),
                    note=f"Density: {kw.get('density_pct', 0):.1f}%"
                ))
        
        # Missing keywords (opportunities)
        missing_keywords = []
        missing_list = keywords_data.get("missing_opportunities", []) if isinstance(keywords_data, dict) else []
        for kw in missing_list:
            if isinstance(kw, dict):
                missing_keywords.append(KeywordAnalysis(
                    term=kw.get("term", ""),
                    search_volume=kw.get("search_volume"),
                    keyword_difficulty=kw.get("keyword_difficulty"),
                    usage_count=0,
                    note=kw.get("reason", "")
                ))
        
        # ═══════════════════════════════════════════════════════
        # ON-PAGE ELEMENTS
        # ═══════════════════════════════════════════════════════
        on_page_elements = []
        on_page_list = analysis_data.get("on_page", [])
        for elem in on_page_list:
            if isinstance(elem, dict):
                on_page_elements.append(OnPageElement(
                    element=elem.get("element", ""),
                    status=elem.get("status", "needs_work"),
                    current=elem.get("current"),
                    suggestion=elem.get("note", elem.get("suggestion")),
                    priority="HIGH" if elem.get("status") == "fail" else "MED"
                ))
        
        # ═══════════════════════════════════════════════════════
        # META SUGGESTIONS
        # ═══════════════════════════════════════════════════════
        meta_suggestion = analysis_data.get("meta_suggestion", {})
        title_suggestion = meta_suggestion.get("title_tag") if isinstance(meta_suggestion, dict) else None
        meta_description_suggestion = meta_suggestion.get("meta_description") if isinstance(meta_suggestion, dict) else None
        
        # ═══════════════════════════════════════════════════════
        # POSITIVE & NEGATIVE POINTS
        # ═══════════════════════════════════════════════════════
        positive_points = analysis_data.get("positive_points", [])
        negative_points = analysis_data.get("negative_points", [])
        
        # ═══════════════════════════════════════════════════════
        # RECOMMENDATIONS
        # ═══════════════════════════════════════════════════════
        recommendations = []
        recommendations_list = analysis_data.get("recommendations", [])
        for rec in recommendations_list:
            if isinstance(rec, dict):
                recommendations.append(SEORecommendation(
                    priority=rec.get("priority", "MED").upper(),
                    title=rec.get("title", rec.get("action", "")),
                    description=rec.get("description", rec.get("action", "")),
                    category=rec.get("category")
                ))
        
        # ═══════════════════════════════════════════════════════
        # CREATE & RETURN SEO REPORT
        # ═══════════════════════════════════════════════════════
        seo_report = SEOReport(
            score=score,
            score_label=score_label,
            post_title=post_title,
            niche=niche,
            format=format_type,
            word_count=word_count,
            word_count_target=word_count_target,
            word_count_status=word_count_status,
            readability_score=readability_score,
            readability_level=readability_level,
            readability_metrics=readability_metrics,
            keyword_density=keyword_density,
            primary_keyword=primary_keyword,
            secondary_keywords=secondary_keywords,
            missing_keywords=missing_keywords,
            on_page_elements=on_page_elements,
            title_suggestion=title_suggestion,
            meta_description_suggestion=meta_description_suggestion,
            positive_points=positive_points,
            negative_points=negative_points,
            recommendations=recommendations
        )
        
        print(f"📊 SEO Report created - Score: {score}/100 · {score_label}")
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