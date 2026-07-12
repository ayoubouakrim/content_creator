from services.content_service import ContentService
from fastapi import APIRouter
from schemas.content import (
    BlogArticleRequest,
    SocialMediaPostRequest,
    ProductDescriptionRequest,
    YoutubeContentRequest,
    TiktokContentRequest,
    ContentResponse,
)
from http.client import HTTPException
from typing import List


router = APIRouter()
content_service = ContentService()


# ========== BLOG ARTICLE ENDPOINT ==========
@router.post("/generate/blog_article", response_model=ContentResponse)
async def generate_blog_article(request: BlogArticleRequest):
    """
    Generate a blog article.
    - topic: main topic of the article
    - keywords: SEO keywords to include
    - tone: writing tone (professional, casual, technical)
    - length: approximate word count
    """
    try:
        result = content_service.generate_content(request)
        content_response = ContentResponse(
            id=1,
            user_id=request.user_id or 1,
            title=request.topic,
            body=result["content"],
            word_count=len(result["content"].split()),
            content_type="blog_article",
            status="generated",
            created_at="2024-01-01T00:00:00Z",
            seo_report=result["seo_report"],
        )
        return content_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== SOCIAL MEDIA ENDPOINT ==========
@router.post("/generate/social_media_post", response_model=List[ContentResponse])
async def generate_social_media_post(request: SocialMediaPostRequest):
    """
    Generate social media posts for specific platforms.
    Returns a list of ContentResponse — one entry per platform.
    """
    try:
        result = content_service.generate_content(request)
        # result is a List[dict] here: [{"content": ..., "seo_report": ...}, ...]
        # one entry per platform, in the same order as request.platforms

        responses = []
        for idx, (platform, item) in enumerate(zip(request.platforms, result), start=1):
            responses.append(
                ContentResponse(
                    id=idx,  # TODO: replace with a real unique ID (DB row id or uuid4())
                    user_id=1,
                    title=f"{request.topic} — {platform}",
                    body=item["content"],
                    word_count=len(item["content"].split()),
                    content_type="social_media_post",
                    status="generated",
                    created_at="2024-01-01T00:00:00Z",
                    seo_report=item["seo_report"],
                )
            )
        return responses

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== PRODUCT DESCRIPTION ENDPOINT ==========
@router.post("/generate/product_description", response_model=ContentResponse)
async def generate_product_description(request: ProductDescriptionRequest):
    """
    Generate product descriptions optimized for sales conversion.
    - product_name: name of the product
    - features: list of key features
    - benefits: description of product benefits
    - target_audience: who is this product for
    - length: word count (short, medium, long)
    """
    try:
        result = content_service.generate_content(request)
        content_response = ContentResponse(
            id=1,
            user_id=1,
            title=request.product_name,
            body=result["content"],
            word_count=len(result["content"].split()),
            content_type="product_description",
            status="generated",
            created_at="2024-01-01T00:00:00Z",
            seo_report=result["seo_report"],
        )
        return content_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== YOUTUBE CONTENT ENDPOINT ==========
@router.post("/generate/youtube_content", response_model=ContentResponse)
async def generate_youtube_content(request: YoutubeContentRequest):
    """
    Generate YouTube content: titles, descriptions, and tags.
    - topic: main topic for the video
    - keywords: relevant keywords for SEO
    - tone: writing tone (casual, professional, energetic, etc.)
    - length: content length preference (short, medium, long)
    """
    try:
        result = content_service.generate_content(request)
        content_response = ContentResponse(
            id=1,
            user_id=1,
            title=request.topic,
            body=result["content"],
            word_count=len(result["content"].split()),
            content_type="youtube_content",
            status="generated",
            created_at="2024-01-01T00:00:00Z",
            seo_report=result["seo_report"],
        )
        return content_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== TIKTOK CONTENT ENDPOINT ==========
@router.post("/generate/tiktok_content", response_model=ContentResponse)
async def generate_tiktok_content(request: TiktokContentRequest):
    """
    Generate TikTok content: hooks, captions, hashtags, and ideas.
    - topic: main topic for the video
    - keywords: trending hashtags and keywords
    - tone: writing tone (funny, inspirational, educational, etc.)
    - length: content length preference (short, medium, long)
    """
    try:
        result = content_service.generate_content(request)
        content_response = ContentResponse(
            id=1,
            user_id=1,
            title=request.topic,
            body=result["content"],
            word_count=len(result["content"].split()),
            content_type="tiktok_content",
            status="generated",
            created_at="2024-01-01T00:00:00Z",
            seo_report=result["seo_report"],
        )
        return content_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))