from agents.base_agent import BaseAgent

class SEOOptimizer(BaseAgent):

    seo_system_prompt = """
    You are an expert SEO content analyst. Your job is to evaluate the content
    and return a structured JSON report that identifies SEO strengths,
    weaknesses, and actionable recommendations.

    When analyzing content, consider:
        - Title and H1 SEO quality
        - Keyword relevance, placement, and semantic relationships (LSI keywords)
        - Word count vs. ideal range for the detected content type
        - Readability: sentence length, passive voice, transition words, tone
        - On-page elements: titles, meta descriptions, headers, links, images, CTA
        - Prioritized recommendations to improve ranking

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