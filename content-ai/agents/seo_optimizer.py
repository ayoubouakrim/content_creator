from agents.base_agent import BaseAgent
 
class SEOOptimizer(BaseAgent):
 
    seo_system_prompt = """
    You are an expert SEO and social media content analyst. Your job is to evaluate
    content and return a structured JSON report that identifies strengths,
    weaknesses, and actionable recommendations.
 
    Output rules (strictly enforced):
        - Return ONLY a raw JSON object — no markdown, no backticks, no explanation
        - Do NOT invent search volume numbers — always set search_volume to null
        - All scores must be integers within their defined ranges (0–100)
        - Priority must be exactly: "high", "medium", or "low"
        - Status must be exactly: "pass", "warn", or "fail"
        - word_count_status must be exactly: "too_short", "good", or "too_long"
        - search_intent must be exactly: "informational", "transactional",
          "navigational", or "commercial"
        - All arrays must contain between 2 and 5 items
        - Every "action" field must be a concrete, implementable step
    """
 
    def __init__(self):
        system_prompt = self.seo_system_prompt
        super().__init__(system_prompt)
 
    def analyze_content(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
 
        prompt = f"""Analyze the blog post below and return ONLY a valid JSON object.
No explanation, no markdown, no preamble — raw JSON only.
 
Target keywords to evaluate against: {keywords_str}
 
Evaluate the following dimensions:
 
  1. Title and H1 SEO quality
     - Is the primary keyword present and positioned early?
     - Is the title between 50–60 characters?
     - Is it compelling enough to earn a click?
 
  2. Keyword usage
     - Identify the primary keyword (from the target list or inferred from content)
     - Identify 2–3 secondary/LSI keywords used
     - Flag missing keyword opportunities relevant to the topic
     - Keyword density = (count / total_words) * 100, rounded to 1 decimal
     - Ideal primary keyword density: 0.5%–2.5%
 
  3. Word count vs. ideal range
     - Count words in the article
 
  4. Readability
 
  5. On-page elements — evaluate each and assign pass / warn / fail:
     
 
  6. Prioritized recommendations
     
 
// The article to analyze:
\"\"\"
{content}
\"\"\"
 
Return exactly this JSON structure:
 
{{
  "post_title": "",
  "niche": "<e.g. Lifestyle / Humor, Tech / Tutorial>",
  "search_intent": "",
  "word_count": <integer>,
  "word_count_status": "<too_short|good|too_long>",
  "overall_score": <integer 0-100>,
 
  "readability": {{
    "flesch_score": <integer 0-100>,
    "avg_sentence_words": <integer>,
    "passive_voice_pct": <integer 0-100>,
    "transition_words_pct": <integer 0-100>,
    "tone": "<e.g. conversational, formal, technical>"
  }},
 
  "keywords": {{
    "primary": {{
      "term": "<detected primary keyword>",
      "count": <integer>,
      "density_pct": <float 1 decimal>,
      "in_title": <true|false>,
      "in_first_100_words": <true|false>,
      "in_conclusion": <true|false>,
      "search_volume": null
    }},
    "secondary": [
      {{
        "term": "<keyword>",
        "count": <integer>,
        "density_pct": <float 1 decimal>
      }}
    ],
    "missing_opportunities": [
      {{
        "term": "<semantically relevant keyword not used>",
        "reason": "<why it would help>"
      }}
    ]
  }},
 
  "on_page": [
    {{
      "element": "<title>",
      "status": "<pass|warn|fail>",
      "note": "<specific finding about this element>"
    }}
  ],
 
  "meta_suggestion": {{
    "title_tag": "<suggested SEO title, 50-60 chars, keyword early>",
    "meta_description": "<suggested meta, 150-160 chars, includes CTA>"
  }},
 
  "positive_points": [
    "<something the content already does well>",
    "<another strength>"
  ],
 
  "negative_points": [
    "<something clearly wrong or missing>",
    "<another weakness>"
  ],
 
  "recommendations": [
    {{
      "priority": "<high|medium|low>",
      "action": "<specific, implementable step>"
    }}
  ]
}}"""
 
        response = self.generate(prompt)
        return response
 
    def analyze_facebook_post(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
 
        prompt = f"""Analyze the Facebook post below and return ONLY a valid JSON object.
No explanation, no markdown, no preamble — raw JSON only.
 
Target keywords to evaluate against: {keywords_str}
 
Evaluate the following dimensions:
 
  1. Post title / headline
     - Is the primary keyword present and positioned early?
     - Is it compelling enough to stop the scroll?
 
  2. Keyword & hashtag usage
     - Identify the primary keyword (from target list or inferred)
     - Identify 2–3 secondary keywords used
     - Flag missing keyword opportunities
     - Facebook ideal hashtag count: 1–3 (penalises more)
     - Check if primary keyword appears in the first sentence
 
  3. Character usage
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Hook (first line): grabs attention, leads with value or emotion
     - Hashtag count: 1–3 for maximum reach
 
  5. Algorithm signals — score each 0–100:
     - Shares potential: 
     - Comment bait score: 
     - Reach suppression risk: 
     - Authenticity score:
 
  6. Prioritized recommendations
     - Each must be specific and actionable, never generic
     - Priority must be exactly: "high", "medium", or "low"
 
// The Facebook post to analyze:
\"\"\"
{content}
\"\"\"
 
Return exactly this JSON structure:
 
{{
  "post_title": "<detected or inferred title>",
  "category": "<e.g. Personal growth, Business, Lifestyle>",
  "format": "",
  "intent": "",
 
  "scores": {{
    "overall": <integer 0-100>,
    "engagement": <integer 0-100>,
    "reach": <integer 0-100>
  }},
 
  "character_usage": [
    {{ "label": "Post text", "used": <integer>, "max": 63206 }},
    {{ "label": "Headline",  "used": <integer>, "max": 80 }},
    {{ "label": "Description", "used": <integer>, "max": 200 }}
  ],
 
  "keywords_and_hashtags": {{
    "items": [
      {{ "text": "<keyword or #hashtag>", "type": "<primary|secondary|missing>" }}
    ],
    "notes": "<specific findings about keyword and hashtag usage>"
  }},
 
  "on_page_elements": [
    {{
      "label": "<element name>",
      "status": "<pass|warn|fail>",
      "note": "<specific finding>"
    }}
  ],
 
  "algorithm_signals": [
    {{
      "label": "<signal name>",
      "value": "<descriptive label e.g. High / Medium / Low or percentage string>",
      "percentage": <integer 0-100>,
      "color": "<green|amber|red>"
    }}
  ],
 
  "recommendations": [
    {{
      "priority": "<high|medium|low>",
      "action": "<specific, implementable step>"
    }}
  ]
}}"""
 
        response = self.generate(prompt)
        return response
 
    def analyze_twitter_post(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
 
        prompt = f"""Analyze the Twitter / X post or thread below and return ONLY a valid JSON object.
No explanation, no markdown, no preamble — raw JSON only.
 
Target keywords to evaluate against: {keywords_str}
 
Evaluate the following dimensions:
 
  1. Post title / headline
     - Is the primary keyword present and positioned early?
     - Is it compelling enough to stop the scroll?
 
  2. Keyword & hashtag usage
     - Identify the primary keyword (from target list or inferred)
     - Identify 2–3 secondary keywords used
     - Flag missing keyword opportunities
     - Facebook ideal hashtag count: 1–3 (penalises more)
     - Check if primary keyword appears in the first sentence
 
  3. Character usage
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Hook (first line): grabs attention, leads with value or emotion
     - Hashtag count: 1–3 for maximum reach
 
  5. Algorithm signals — score each 0–100:
     - Shares potential: 
     - Comment bait score: 
     - Reach suppression risk: 
     - Authenticity score:
 
  6. Prioritized recommendations
     - Each must be specific and actionable, never generic
     - Priority must be exactly: "high", "medium", or "low"
 
 
// The Twitter / X post or thread to analyze:
\"\"\"
{content}
\"\"\"
 
Return exactly this JSON structure:
 
{{
  "post_title": "<detected or inferred hook / title>",
  "category": "<e.g. Personal growth, Tech, Finance>",
  "format": "<e.g. Single tweet, Thread (N tweets)>",
  "intent": "<informational|transactional|navigational|commercial>",
 
  "scores": {{
    "overall": <integer 0-100>,
    "visibility": <integer 0-100>,
    "engagement": <integer 0-100>
  }},
 
  "character_usage": [
    {{ "label": "Tweet 1",   "used": <integer>, "max": 280 }},
    {{ "label": "Avg tweet", "used": <integer>, "max": 280 }}
  ],
  "character_usage_note": "Ideal tweet length for engagement: 70–120 chars",
 
  "keywords_and_hashtags": {{
    "items": [
      {{ "text": "<keyword or #hashtag>", "type": "<primary|secondary|missing>" }}
    ],
    "notes": "<specific findings about keyword and hashtag usage>"
  }},
 
  "on_page_elements": [
    {{
      "label": "<element name>",
      "status": "<pass|warn|fail>",
      "note": "<specific finding>"
    }}
  ],
 
  "algorithm_signals": [
    {{
      "label": "<signal name>",
      "value": "<descriptive label e.g. High / Medium / Low or percentage string>",
      "percentage": <integer 0-100>,
      "color": "<green|amber|red>"
    }}
  ],
 
  "recommendations": [
    {{
      "priority": "<high|medium|low>",
      "action": "<specific, implementable step>"
    }}
  ]
}}"""
 
        response = self.generate(prompt)
        return response
 
    def analyze_instagram_post(self, content: str, keywords: list[str]) -> str:
        keywords_str = ", ".join(keywords)
 
        prompt = f"""Analyze the Instagram post below and return ONLY a valid JSON object.
No explanation, no markdown, no preamble — raw JSON only.
 
Target keywords to evaluate against: {keywords_str}
 
Evaluate the following dimensions:
 
  1. Post title / headline
     - Is the primary keyword present and positioned early?
     - Is it compelling enough to stop the scroll?
 
  2. Keyword & hashtag usage
     - Identify the primary keyword (from target list or inferred)
     - Identify 2–3 secondary keywords used
     - Flag missing keyword opportunities
     - Facebook ideal hashtag count: 1–3 (penalises more)
     - Check if primary keyword appears in the first sentence
 
  3. Character usage
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Hook (first line): grabs attention, leads with value or emotion
     - Hashtag count: 1–3 for maximum reach
 
  5. Algorithm signals — score each 0–100:
     - Shares potential: 
     - Comment bait score: 
     - Reach suppression risk: 
     - Authenticity score:
 
  6. Prioritized recommendations
     - Each must be specific and actionable, never generic
     - Priority must be exactly: "high", "medium", or "low"
 
 
// The Instagram post to analyze:
\"\"\"
{content}
\"\"\"
 
Return exactly this JSON structure:
 
{{
  "post_title": "<detected or inferred caption hook / title>",
  "category": "<e.g. Lifestyle, Fitness, Food>",
  "format": "<e.g. Carousel post, Single image, Reel>",
  "intent": "<informational|transactional|navigational|commercial>",
 
  "scores": {{
    "overall": <integer 0-100>,
    "discovery": <integer 0-100>,
    "engagement": <integer 0-100>
  }},
 
  "character_usage": [
    {{ "label": "Caption", "used": <integer>, "max": 2200 }}
  ],
  "character_usage_note": "<note about ideal caption length and current status>",
 
  "keywords_and_hashtags": {{
    "items": [
      {{ "text": "<keyword or #hashtag>", "type": "<primary|secondary|missing>" }}
    ],
    "notes": "<specific findings about hashtag count, saturation, and missing keywords>"
  }},
 
  "on_page_elements": [
    {{
      "label": "<element name>",
      "status": "<pass|warn|fail>",
      "note": "<specific finding>"
    }}
  ],
 
  "algorithm_signals": [
    {{
      "label": "<signal name>",
      "value": "<descriptive label e.g. High / Medium / Low or percentage string>",
      "percentage": <integer 0-100>,
      "color": "<green|amber|red>"
    }}
  ],
 
  "recommendations": [
    {{
      "priority": "<high|medium|low>",
      "action": "<specific, implementable step>"
    }}
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