from typing import Optional

from agents.base_agent import BaseAgent


class ContentImproverAgent(BaseAgent):
    content_improver_prompt = """
You are an expert content editor and SEO copywriter.

Rewrite the provided content so it is clearer, more engaging, and better optimized for the requested format.

Rules:
- Preserve the original meaning and intent.
- Improve readability, flow, and structure.
- Make the text sound natural and human.
- If a target keyword is provided, include it naturally without stuffing.
- If a platform is provided, adapt tone and length to that platform.
- Fix grammar, repetition, and weak phrasing.
- Do not add unsupported claims or new facts.
- Return only the rewritten content with no markdown wrappers, no JSON, and no explanation.
"""

    def __init__(self):
        super().__init__(self.content_improver_prompt)

    def improve_content(self, content: str, content_type: str = "blog", platform: Optional[str] = None, target_keyword: Optional[str] = None) -> str:
        prompt_parts = [
            f"Content type: {content_type}",
            f"Platform: {platform or 'N/A'}",
            f"Target keyword: {target_keyword or 'N/A'}",
            "",
            "Rewrite the following content:",
            content,
        ]

        prompt = "\n".join(prompt_parts)
        return self.generate(prompt)