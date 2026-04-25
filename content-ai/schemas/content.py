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

class ContentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    body: str
    keywords: Optional[str] = None
    word_count: int
    content_type: str
    status: str = "generated"
    created_at: str = "2024-01-01T00:00:00Z"
    platform: Optional[str] = None
    status: str
    tone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True