from agents.base_agent import BaseAgent

class SEOOptimizer(BaseAgent):
    seo_system_prompt = """ 
                        You are an expert SEO analyst and content optimization specialist with deep knowledge of modern search engine algorithms and best practices. Your role is to analyze content comprehensively and provide actionable SEO recommendations.

                        When analyzing content, consider:
                            - E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness)
                            - Keyword relevance, placement, and semantic relationships (LSI keywords)
                            - User search intent alignment (informational, transactional, navigational, commercial)
                            - Content structure, readability, and multimedia optimization
                            - On-page SEO elements: titles, meta descriptions, headers, schema markup
                            - Core Web Vitals and user experience factors
                            - Content freshness and topical authority
                            - Featured snippet potential and zero-click optimization
                            - Mobile-friendliness and technical SEO considerations

                        Always prioritize user value and authentic content quality while optimizing for search visibility. Provide specific, measurable recommendations rather than generic suggestions.
                        """
    def __init__(self):
        system_prompt = self.seo_system_prompt
        super().__init__(system_prompt)
    
    def analyze_content(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
        prompt = f"""You are an expert SEO analyst. Analyze the following content for SEO optimization against these target keywords: {keywords_str}

**Content to analyze:**
{content}

In less than 1000 tokens, return ONLY a valid JSON object with absolutely no text before or after it.
No markdown, no code blocks, no explanation. Just the raw JSON.

Use exactly this structure:

{{
  "score": <overall SEO score out of 100 as integer>,
  "score_breakdown": {{
    "keyword_optimization": <score out of 20 as integer>,
    "content_structure": <score out of 15 as integer>,
    "on_page_seo": <score out of 15 as integer>,
    "user_intent": <score out of 15 as integer>,
    "eeat": <score out of 15 as integer>,
    "technical_seo": <score out of 10 as integer>,
    "content_gaps": <score out of 10 as integer>
  }},
  "positive_points": [
    "<what the content already does well>",
    "<another strength>",
    "<another strength>"
  ],
  "negative_points": [
    "<what is clearly wrong or missing>",
    "<another weakness>",
    "<another weakness>"
  ],
  "points_to_improve": [
    {{
      "area": "<e.g. Keyword Optimization>",
      "issue": "<what specifically needs improvement>",
      "action": "<concrete action to fix it>"
    }},
    {{
      "area": "<area>",
      "issue": "<issue>",
      "action": "<action>"
    }}
  ],
  "missing_keywords": [
    "<LSI or semantic keyword missing from content>",
    "<another missing keyword>"
  ],
  "quick_wins": [
    "<small easy change that would have big SEO impact>",
    "<another quick win>"
  ]
}}"""

        response = self.generate(prompt)
        return response
    
    def improve_content(self, content: str, analysis: str, original_request: str) -> str:
        prompt = f"""ENHANCE and IMPROVE the existing content based on the SEO analysis. 
        Do NOT rewrite from scratch.

        **Original User Request:** {original_request}

        **SEO Analysis:**
        {analysis}

        **Original Content:**
        {content}

        **Your task:** enhance and improve the content to address the SEO analysis findings while honoring the original request.
        Focus on making specific improvements based on the analysis."""
        
        response = self.generate(prompt)
        return response