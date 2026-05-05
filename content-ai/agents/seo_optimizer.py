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
     - Compare against the ideal range for the detected content type:
         Blog post / listicle     → 1,200–2,000 words
         How-to / tutorial        → 1,500–2,500 words
         Opinion / personal story → 800–1,500 words
         News / announcement      → 300–800 words
 
  4. Readability
     - Estimate average sentence length (in words)
     - Estimate passive voice % based on sentence patterns
     - Estimate transition word usage %
     - Estimate Flesch reading ease score (0–100, higher = easier)
     - Identify the tone (e.g. conversational, formal, technical)
 
  5. On-page elements — evaluate each and assign pass / warn / fail:
     - Title tag: present, keyword-optimized, 50–60 chars
     - Meta description: present, 150–160 chars, includes CTA
     - H1: present, includes primary keyword
     - H2/H3 structure: logical hierarchy, keyword-rich subheadings
     - Images: present with descriptive alt text
     - Internal links: at least 3–5 recommended
     - External links: at least 1–2 to authoritative sources
     - Call to action: present at the end
 
  6. Prioritized recommendations
     - Each must be specific and actionable, never generic
     - Bad:  "improve readability"
     - Good: "Shorten sentences in the intro from avg 28 words to under 18 words"
     - Priority must be exactly: "high", "medium", or "low"
 
// The article to analyze:
\"\"\"
{content}
\"\"\"
 
Return exactly this JSON structure:
 
{{
  "post_title": "<detected or inferred title from content>",
  "niche": "<e.g. Lifestyle / Humor, Tech / Tutorial>",
  "search_intent": "<informational|transactional|navigational|commercial>",
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
      "element": "<e.g. Title tag, Meta description, H1, Images, Internal links>",
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
     - Is the headline between 50–80 characters?
     - Is it compelling enough to stop the scroll?
 
  2. Keyword & hashtag usage
     - Identify the primary keyword (from target list or inferred)
     - Identify 2–3 secondary keywords used
     - Flag missing keyword opportunities
     - Facebook ideal hashtag count: 1–3 (penalises more)
     - Check if primary keyword appears in the first sentence
 
  3. Character usage
     - Post text length vs. 63,206 char limit
     - Headline length vs. 80 char ideal
     - Description length vs. 200 char ideal
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Hook (first line): grabs attention, leads with value or emotion
     - Image attached: present and at optimal 1200×630px
     - Hashtag count: 1–3 for maximum reach
     - Link placement: links in body suppress reach — should be in first comment
     - Call to action: ends with a question or clear CTA
     - Video / Reel: video content receives 3× organic reach boost
 
  5. Algorithm signals — score each 0–100:
     - Shares potential: shareability based on emotional/informational value
     - Comment bait score: how likely the post drives comments
     - Reach suppression risk: presence of links, excess hashtags, etc.
     - Authenticity score: personal tone, storytelling, non-promotional feel
 
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
  "format": "<e.g. Long-form post, Short update, Link post>",
  "intent": "<informational|transactional|navigational|commercial>",
 
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
 
  1. Post title / hook tweet
     - Is the primary keyword present in tweet 1?
     - Is the hook compelling enough to drive thread reads?
 
  2. Keyword & hashtag usage
     - Identify the primary keyword (from target list or inferred)
     - Identify 2–3 secondary keywords used across the thread
     - Flag missing keyword opportunities
     - X ideal hashtag count: 1–2 per tweet (3+ suppresses impressions)
     - Check if primary keyword appears in tweet 1
 
  3. Character usage per tweet
     - Tweet 1 length vs. 280 char limit
     - Average tweet length vs. 280 char limit
     - Note: ideal engagement length is 70–120 chars per tweet
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Thread hook tweet: strong opener that drives saves and reads
     - Tweet length: majority of tweets within 70–120 char ideal
     - Media in thread: at least one image or video (boosts impressions ~35%)
     - Hashtag count: max 1–2 per tweet
     - CTA in final tweet: asks for follows, retweets, or replies
     - Timing: scheduling data present for peak hours (8–10am, 6–9pm)
 
  5. Algorithm signals — score each 0–100:
     - Retweet potential: shareability and quotability of content
     - Reply bait score: how likely the thread drives replies
     - Impression suppression risk: excess hashtags, links, low engagement patterns
     - Bookmark potential: educational or reference value that drives saves
 
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
 
  1. Caption hook
     - Is the primary keyword present in the first 125 characters (preview)?
     - Is the opening line compelling enough to expand the caption?
 
  2. Hashtag analysis
     - Identify the primary hashtag (from target list or inferred)
     - Identify 2–4 secondary hashtags used
     - Flag oversaturated hashtags (500M+ posts) and suggest niche alternatives
     - Instagram recommended hashtag count: 3–5 highly targeted
     - Flag missing keywords not present in caption
 
  3. Caption length
     - Caption length vs. 2,200 char limit
     - Note: Instagram rewards longer captions (800–1,000 chars); shorter = low effort signal
 
  4. On-page elements — evaluate each and assign pass / warn / fail:
     - Caption length: at least 800–1,000 chars for algorithm ranking
     - Alt text on images: set with descriptive keywords for accessibility and indexing
     - Post format: carousel / reel / single image (carousels get 3× more reach)
     - Keyword in caption: primary keyword within first 125 chars
     - Bio link CTA: "link in bio" mention present
     - Location tag: tagged for local discovery boost
 
  5. Algorithm signals — score each 0–100:
     - Explore page potential: likelihood of appearing on Explore based on hashtags, engagement signals
     - Save / share potential: educational or inspirational value that drives saves
     - Caption engagement signal: caption length and question/CTA quality
     - Hashtag relevance score: how targeted and non-saturated the hashtags are
 
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