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
from agents.hashtags_analyzer_agent import HashtagsAnalyzerAgent

class ContentService:
    def __init__(self):
        self.seo_optimizer = SEOOptimizer()
        self.hashtags_analyzer = HashtagsAnalyzerAgent()
        self.target_score = 90

    def get_related_hashtags(self, request: dict) -> dict:
        """
        Generate hashtag suggestions for a piece of content.

        Expected request shape:
        {
            "content": str,
            "platform": str | None
        }
        """
        content = (request.get("content") or "").strip()
        platform = (request.get("platform") or "instagram").strip().lower()

        if not content:
            raise ValueError("Content is required to generate hashtags.")

        analysis = self.hashtags_analyzer.analyze(content)

        def to_tier(popularity: str) -> str:
            normalized = (popularity or "").strip().lower()
            if normalized in {"high", "broad"}:
                return "broad"
            if normalized in {"medium", "moderate"}:
                return "moderate"
            return "niche"

        hashtags = []
        for item in analysis.hashtags:
            hashtags.append({
                "tag": item.tag,
                "tier": to_tier(item.popularity),
                "reason": item.reason,
            })

        recommended_count_map = {
            "instagram": 12,
            "twitter": 3,
            "x": 3,
            "linkedin": 5,
            "tiktok": 6,
            "pinterest": 8,
            "youtube": 5,
        }

        recommended_count = recommended_count_map.get(platform, 5)
        notes = (
            f"Suggested for {platform.title()} based on the content topic and current relevance signals."
            if platform
            else "Suggested based on the content topic and current relevance signals."
        )

        return {
            "content_summary": analysis.summary,
            "platform": platform,
            "hashtags": hashtags,
            "recommended_count": recommended_count,
            "notes": notes,
        }
    
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
            print(f"🚀 Routing to SocialMediaAgent for platforms: {request.platforms}")
            agent = SocialMediaAgent()
            content_type = "social_media"
            platforms = request.platforms
            
        elif isinstance(request, ProductDescriptionRequest):
            print(f"🚀 Routing to ProductAgent for product: {request.product_name}")
            agent = ProductAgent()
            content_type = "product"
            
        else:
            raise ValueError(f"❌ Unsupported content type: {type(request)}")

        # SEO optimization (only for blog articles)
        if content_type == "blog":

            # Generate content using the appropriate agent
            print(f"📝 Generating {content_type} content...")
            result = agent.create_content(request)
            print(f"✅ {content_type.upper()} content generated successfully")
            print(f"Result preview: {result[:100]}...")

            print("🔍 Analyzing content for SEO...")
            analysis = self.seo_optimizer.analyze_content(result, request.keywords)
            print(f"SEO Analysis: {analysis[:200]}...")
            
            # Parse analysis into structured SEOReport
            seo_report = self.parse_analysis(analysis)
            print(f"📊 SEO Report Score: {seo_report.score}/100")
        
        elif content_type == "social_media":
            # run platform-specific social analyzer and parse into SEOReport
            keywords = getattr(request, "keywords", None) or [getattr(request, "topic", "")]
            list_of_content_and_reports = []
            for platform in request.platforms :

                # Generate content using the appropriate agent
                print(f"📝 Generating {content_type} content...")
                result = agent.create_content(request)
                print(f"✅ {content_type.upper()} content generated successfully")
                

                if platform == "twitter":
                    analysis = self.seo_optimizer.analyze_twitter_post(result, keywords)
                elif platform == "instagram":
                    analysis = self.seo_optimizer.analyze_instagram_post(result, keywords)
                elif platform == "facebook":
                    analysis = self.seo_optimizer.analyze_facebook_post(result, keywords)
                
                # Parse analysis into structured SEOReport
                seo_report = self.parse_social_analysis(analysis)
                print(f"📊 Social SEO Report Score for {platform}: {seo_report.score}/100")

                
                list_of_content_and_reports.append({
                    "content": result,
                    "seo_report": seo_report
                })

            return list_of_content_and_reports

        return {
            "content": result,
            "seo_report": seo_report
        }
    
    def parse_analysis(self, analysis_json: str) -> SEOReport:
        
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

    def parse_social_analysis(self, analysis_json: str, platform: str = "social") -> SEOReport:
        """
        Parse social-media style analysis JSON (Facebook / Twitter / Instagram)
        and convert it into an `SEOReport`-compatible object so the frontend
        `SEOReportCard` can render a summary for social posts.

        This performs best-effort mapping of fields:
        - overall score -> score
        - post_title -> post_title
        - character/word usage -> word_count
        - keywords/hashtags -> primary/secondary/missing
        - on_page / on_page_elements -> OnPageElement list
        - recommendations -> SEORecommendation list
        """
        try:
            if isinstance(analysis_json, str):
                analysis_data = json.loads(analysis_json)
            else:
                analysis_data = analysis_json
        except Exception as e:
            print(f"❌ Failed to parse social analysis JSON: {e}")
            raise ValueError(f"Invalid JSON in social analysis: {e}")

        # Score
        scores = analysis_data.get("scores") or analysis_data.get("scores", {})
        overall = 0
        if isinstance(scores, dict):
            overall = int(scores.get("overall") or scores.get("score") or 0)
        else:
            overall = int(analysis_data.get("overall") or 0)

        # Basic metadata
        post_title = analysis_data.get("post_title") or analysis_data.get("title") or analysis_data.get("hook")

        # Character / word usage
        word_count = 0
        cu = analysis_data.get("character_usage") or analysis_data.get("character_usage", [])
        if isinstance(cu, list) and len(cu) > 0 and isinstance(cu[0], dict):
            try:
                word_count = int(cu[0].get("used", 0))
            except Exception:
                word_count = 0

        # Keywords
        primary_keyword = None
        secondary_keywords = []
        missing_keywords = []
        kwh = analysis_data.get("keywords_and_hashtags") or analysis_data.get("keywords", {})
        items = []
        if isinstance(kwh, dict):
            items = kwh.get("items") or []

        for it in items:
            if not isinstance(it, dict):
                continue
            t = it.get("text") or it.get("term")
            typ = it.get("type") or it.get("role")
            if typ == "primary":
                primary_keyword = KeywordAnalysis(term=t or "", search_volume=None, keyword_difficulty=None, usage_count=it.get("count", 0), note=it.get("note") or "")
            elif typ == "secondary":
                secondary_keywords.append(KeywordAnalysis(term=t or "", search_volume=None, keyword_difficulty=None, usage_count=it.get("count", 0), note=it.get("note") or ""))
            elif typ == "missing":
                missing_keywords.append(KeywordAnalysis(term=t or "", search_volume=None, keyword_difficulty=None, usage_count=0, note=it.get("reason") or ""))

        # On-page elements
        on_page_elements = []
        opl = analysis_data.get("on_page_elements") or analysis_data.get("on_page") or analysis_data.get("on_page_elements", [])
        for elem in opl:
            if isinstance(elem, dict):
                on_page_elements.append(OnPageElement(
                    element=elem.get("label") or elem.get("element") or elem.get("name", ""),
                    status=elem.get("status") or elem.get("result") or "needs_work",
                    current=elem.get("note") or elem.get("current"),
                    suggestion=elem.get("note") or elem.get("suggestion"),
                    priority=("HIGH" if elem.get("status") in ("fail", "high") else "MED")
                ))

        # Recommendations
        recommendations = []
        recs = analysis_data.get("recommendations") or analysis_data.get("recommendations", [])
        for r in recs:
            if isinstance(r, dict):
                recommendations.append(SEORecommendation(
                    priority=(r.get("priority") or r.get("level") or "MED").upper(),
                    title=r.get("title") or r.get("action") or r.get("summary") or "",
                    description=r.get("description") or r.get("action") or "",
                    category=r.get("category")
                ))

        seo_report = SEOReport(
            score=overall or 0,
            score_label=("Good" if overall >= 70 else "Needs work" if overall >= 45 else "Poor"),
            post_title=post_title,
            niche=analysis_data.get("category") or analysis_data.get("niche"),
            format=analysis_data.get("format"),
            word_count=word_count,
            word_count_target=None,
            word_count_status=analysis_data.get("word_count_status"),
            readability_score=analysis_data.get("readability", {}).get("flesch_score") if isinstance(analysis_data.get("readability"), dict) else None,
            readability_level=None,
            readability_metrics=[],
            keyword_density=None,
            primary_keyword=primary_keyword,
            secondary_keywords=secondary_keywords,
            missing_keywords=missing_keywords,
            on_page_elements=on_page_elements,
            title_suggestion=(analysis_data.get("meta_suggestion") or {}).get("title_tag") if isinstance(analysis_data.get("meta_suggestion"), dict) else None,
            meta_description_suggestion=(analysis_data.get("meta_suggestion") or {}).get("meta_description") if isinstance(analysis_data.get("meta_suggestion"), dict) else None,
            positive_points=analysis_data.get("positive_points") or [],
            negative_points=analysis_data.get("negative_points") or [],
            recommendations=recommendations
        )

        print(f"📊 Social SEO Report created - Score: {seo_report.score}/100 · {seo_report.score_label}")
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
    
    def analyze_seo(self, request: dict) -> dict:
        """
        Analyze SEO for a given content.
        - content: the text content to analyze
        """
        try:
            post_type = request.get("postType")
            content = request.get("content")
            keywords = request.get("keywords", [])
            platform = request.get("platform")

            if post_type == "blog":
                result = self.seo_optimizer.analyze_content(content, keywords)
            elif post_type == "social":
                if platform == "twitter":
                    result = self.seo_optimizer.analyze_twitter_post(content, keywords)
                elif platform == "instagram":
                    result = self.seo_optimizer.analyze_instagram_post(content, keywords)
                elif platform == "facebook":
                    result = self.seo_optimizer.analyze_facebook_post(content, keywords)
                else:
                    raise ValueError(f"❌ Unsupported social platform: {platform}")
            else:
                raise ValueError(f"❌ Unsupported post type for SEO analysis: {post_type}")
            
            seo_report = self.parse_analysis(result) if post_type == "blog" else self.parse_social_analysis(result, platform)
            return seo_report
        except Exception as e:
            print(f"❌ Error analyzing SEO: {e}")
            raise e
