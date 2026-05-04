from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class ContentType(str, Enum):
    BLOG_ARTICLE = "blog_article"
    SOCIAL_MEDIA_POST = "social_media_post"
    PRODUCT_DESCRIPTION = "product_description"
    YOUTUBE_CONTENT = "youtube_content"
    TIKTOK_CONTENT = "tiktok_content"

class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    TECHNICAL = "technical"
    FUNNY = "funny"
    INSPIRATIONAL = "inspirational"
    EDUCATIONAL = "educational"
    PERSUASIVE = "persuasive"

class SocialPlatform(str, Enum):
    FACEBOOK = "facebook"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    INSTAGRAM = "instagram"
    THREADS = "threads"
    PINTEREST = "pinterest"


class BlogArticleRequest(BaseModel):
    user_id: int = Field(..., description="ID of the user requesting the content")
    topic: str = Field(..., description="The main topic of the blog article")
    keywords: List[str] = Field(..., description="List of keywords to include in the article")
    tone: ToneType = Field(default=ToneType.PROFESSIONAL)
    length: int = Field(default=1000, description="Approximate word count for the article")

class SocialMediaPostRequest(BaseModel):
    topic: str = Field(..., description="The main topic of the social media post")
    platform: SocialPlatform = Field(..., description="The social media platform for which the post is intended")
    tone: ToneType = Field(default=ToneType.CASUAL)
    length: int = Field(default=280, description="Approximate character count for the post")

class ProductDescriptionRequest(BaseModel):
    product_name: str = Field(..., description="The name of the product")
    features: List[str] = Field(..., description="List of key features of the product")
    benefits: str = Field(..., description="Description of the benefits of the product")
    target_audience: str = Field(..., description="The target audience for the product")
    length: str = Field(default="medium", description="Approximate word count for the product description")

class YoutubeContentRequest(BaseModel):
    topic: str = Field(..., description="The main topic for YouTube content")
    keywords: List[str] = Field(..., description="List of keywords for SEO")
    tone: ToneType = Field(default=ToneType.CASUAL)
    length: str = Field(default="medium", description="Content length: short, medium, or long")

class TiktokContentRequest(BaseModel):
    topic: str = Field(..., description="The main topic for TikTok content")
    keywords: List[str] = Field(..., description="List of trending keywords and hashtags")
    tone: ToneType = Field(default=ToneType.CASUAL)
    length: str = Field(default="short", description="Content length: short, medium, or long")


class SEOReport(BaseModel):
    """
    SEO analysis report containing score, breakdown, and recommendations.
    Parsed from the SEOOptimizer's analyze_content output.
    """
    id: Optional[int] = None
    content_id: Optional[int] = None
    score: int = Field(..., description="Overall SEO score (0-100)")
    score_breakdown: dict = Field(..., description="Detailed breakdown of scores")
    positive_points: List[str] = Field(default_factory=list, description="What's working well")
    negative_points: List[str] = Field(default_factory=list, description="Areas needing improvement")
    points_to_improve: List[dict] = Field(default_factory=list, description="Actionable recommendations with priority")
    
    class Config:
        from_attributes = True


class ContentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    body: str
    keywords: Optional[str] = None
    word_count: int
    content_type: str
    status: str = "generated"
    platform: Optional[str] = None
    tone: Optional[str] = None
    created_at: datetime
    seo_report: Optional[SEOReport] = None

    class Config:
        from_attributes = True
