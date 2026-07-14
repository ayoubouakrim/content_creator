from typing import List
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from langchain.agents import create_agent
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage

from agents.base_agent import BaseAgent
from dotenv import load_dotenv

load_dotenv()



search_tool = TavilySearchResults(max_results=5)


@tool
def get_hashtag_stats(hashtag: str) -> str:
    """Look up usage/volume stats for a single hashtag.
    Replace this stub with a real call to your analytics/social API."""
    # e.g. call Ayrshare / TikTok API here and return real numbers
    return f"No live stats source configured yet for #{hashtag}."


tools = [search_tool, get_hashtag_stats]


# ---------------------------------------------------------------------------
# 2. Structured output so downstream code gets clean JSON, not free text.
# ---------------------------------------------------------------------------
class HashtagSuggestion(BaseModel):
    tag: str = Field(description="Hashtag without the # symbol")
    reason: str = Field(description="Why this tag fits the content")
    popularity: str = Field(description="Rough popularity tier: high/medium/niche")


class HashtagAnalysis(BaseModel):
    hashtags: List[HashtagSuggestion]
    summary: str


# ---------------------------------------------------------------------------
# 3. The agent itself, built on top of the user's existing BaseAgent.
#    BaseAgent.generate() is a plain single-turn call with no tools bound,
#    so this class builds its own tool-calling AgentExecutor using the same
#    underlying self.llm from BaseAgent.
# ---------------------------------------------------------------------------
class HashtagsAnalyzerAgent(BaseAgent):
    """
    Agent that analyzes content and suggests relevant hashtags,
    optionally grounding suggestions in live search results.
    """

    def __init__(self):
        system_prompt = (
            "You are a social media hashtag strategist. Given a piece of "
            "content, propose relevant hashtags. Use the search tool when you "
            "need current trends or real numbers instead of guessing. "
            "Use get_hashtag_stats to check volume for specific candidate tags. "
            "Always ground popularity claims in tool results, never invent numbers."
        )
        super().__init__(system_prompt=system_prompt)

        self.name = "HashtagsAnalyzerAgent"
        self.description = "Analyzes content and suggests data-grounded hashtags."

        self.agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=self.system_prompt,
            response_format=HashtagAnalysis,
            debug=True,
        )

    def analyze(self, content: str) -> HashtagAnalysis:
        result = self.agent.invoke({
            "messages": [HumanMessage(content=content)]
        })

        structured = result.get("structured_response")
        if structured is not None:
            return structured

        messages = result.get("messages", [])
        if messages:
            last_message = messages[-1]
            if hasattr(last_message, "content"):
                return self.llm.with_structured_output(HashtagAnalysis).invoke(
                    f"Convert this hashtag analysis into the required structured "
                    f"format:\n\n{last_message.content}"
                )

        raise ValueError("Hashtag analysis agent returned no structured response.")


