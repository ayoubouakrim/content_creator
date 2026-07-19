from services.content_service import ContentService
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import getdb
from api.deps import get_current_user
from models.user import User
from schemas.content import (
    BlogArticleRequest,
    SocialMediaPostRequest,
    ProductDescriptionRequest,
    YoutubeContentRequest,
    TiktokContentRequest,
    ContentImprovementRequest,
    ContentImprovementResponse,
    ContentResponse,
)
from fastapi import HTTPException
from typing import List, Optional, Any
from pydantic import BaseModel
from crud import content as content_crud


router = APIRouter()
content_service = ContentService()


# ========== SAVE ENDPOINTS (auth required) ==========

class SaveContentRequest(BaseModel):
    title: str
    body: str
    content_type: str
    platform: Optional[str] = None
    meta_description: Optional[str] = None


class SaveSEOReportRequest(BaseModel):
    score: int
    score_label: str = "Needs SEO work"
    raw_content: Optional[str] = None
    post_title: Optional[str] = None
    niche: Optional[str] = None
    format: Optional[str] = None
    word_count: Optional[int] = None
    word_count_target: Optional[str] = None
    word_count_status: Optional[str] = None
    readability_score: Optional[float] = None
    readability_level: Optional[str] = None
    readability_metrics: Optional[Any] = None
    keyword_density: Optional[float] = None
    primary_keyword: Optional[Any] = None
    secondary_keywords: Optional[Any] = None
    missing_keywords: Optional[Any] = None
    on_page_elements: Optional[Any] = None
    title_suggestion: Optional[str] = None
    meta_description_suggestion: Optional[str] = None
    positive_points: Optional[Any] = None
    negative_points: Optional[Any] = None
    recommendations: Optional[Any] = None


class SaveHashtagsRequest(BaseModel):
    raw_content: str
    platform: str = "instagram"
    content_summary: Optional[str] = None
    hashtags: Any
    recommended_count: Optional[int] = None
    notes: Optional[str] = None


class SaveImprovementRequest(BaseModel):
    original_content: str
    improved_content: str
    content_type: Optional[str] = "blog"
    platform: Optional[str] = None
    target_keyword: Optional[str] = None
    notes: Optional[Any] = None


@router.post("/save")
def save_content(
    request: SaveContentRequest,
):
    """Save generated content to the database."""

    db: Session = Depends(getdb)
    try:
        record = content_crud.create_content(
            db=db,
            user_id=request.user_id,
            title = request.title or (request.body[:80] + "…" if len(request.body) > 80 else request.body),
            body=request.body,
            word_count=len(request.body.split()),
            content_type=request.content_type,
            platform=request.platform,
            meta_description=request.meta_description,
        )
 
        # ══ ADDED: persist the SEO report if one was passed in ══
        if request.seo_report:
            sr = request.seo_report
            content_crud.create_seo_report(
                db=db,
                content_id=record.id,
                score=sr.score,
                score_label=sr.score_label,
                raw_content=sr.raw_content,
                post_title=sr.post_title,
                niche=sr.niche,
                format=sr.format,
                word_count=sr.word_count,
                word_count_target=sr.word_count_target,
                word_count_status=sr.word_count_status,
                readability_score=sr.readability_score,
                readability_level=sr.readability_level,
                readability_metrics=sr.readability_metrics,
                keyword_density=sr.keyword_density,
                primary_keyword=sr.primary_keyword,
                secondary_keywords=sr.secondary_keywords,
                missing_keywords=sr.missing_keywords,
                on_page_elements=sr.on_page_elements,
                title_suggestion=sr.title_suggestion,
                meta_description_suggestion=sr.meta_description_suggestion,
                positive_points=sr.positive_points,
                negative_points=sr.negative_points,
                recommendations=sr.recommendations,
            )
 
        return {"id": record.id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save/seo-report")
def save_seo_report(
    request: SaveSEOReportRequest,
    db: Session = Depends(getdb),
    current_user: User = Depends(get_current_user),
):
    """Save an SEO analysis report."""
    try:
        record = content_crud.create_seo_report(
            db=db,
            **request.model_dump(exclude_none=True),
        )
        return {"id": record.id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save/hashtags")
def save_hashtags(
    request: SaveHashtagsRequest,
    db: Session = Depends(getdb),
    current_user: User = Depends(get_current_user),
):
    """Save a hashtag analysis result."""
    try:
        record = content_crud.create_hashtag_analysis(
            db=db,
            **request.model_dump(exclude_none=True),
        )
        return {"id": record.id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save/improvement")
def save_improvement(
    request: SaveImprovementRequest,
    db: Session = Depends(getdb),
    current_user: User = Depends(get_current_user),
):
    """Save a content improvement (rewrite) result."""
    try:
        record = content_crud.create_content_improvement(
            db=db,
            **request.model_dump(exclude_none=True),
        )
        return {"id": record.id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== CONTENT IMPROVEMENT ENDPOINT ==========
@router.post("/improve_seo", response_model=ContentImprovementResponse)
async def improve_seo(request: ContentImprovementRequest):
    """
    Rewrite existing content to improve clarity, SEO, and platform fit.
    """
    try:
        result = content_service.improve_content(request)
        return ContentImprovementResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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



@router.post("/seo")
async def analyze_seo(request: dict):
    """
    Analyze SEO for a given content.
    - content: the text content to analyze
    """
    try:
        result = content_service.analyze_seo(request)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/hashtags")
async def getRelatedHashtags(request: dict):
    try:
        result = content_service.get_related_hashtags(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))