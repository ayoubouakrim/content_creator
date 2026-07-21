from sqlalchemy.orm import Session
from models.content import Content, ContentType, ContentStatus, ImprovedContent
from models.seo_report import SEOReport
from models.hashtags_analysis import HashtagAnalysis
from typing import Optional, Any


# ========== CONTENT ==========

import traceback

def create_content(
    db: Session,
    user_id: int,
    title: str,
    body: str,
    content_type: str,
    platform: Optional[str] = None,
    meta_description: Optional[str] = None,
) -> Content:

    ct_map = {
        "blog": ContentType.BLOG_ARTICLE,
        "social": ContentType.SOCIAL_MEDIA_POST,
        "product": ContentType.PRODUCT_DESCRIPTION,
        "youtube": ContentType.YOUTUBE_CONTENT,
        "tiktok": ContentType.TIKTOK_CONTENT,
    }
    mapped = ct_map.get(content_type, ContentType.BLOG_ARTICLE)

    print(f"Mapped content_type '{content_type}' to ContentType '{mapped}'")

    try:
        print("About to create Content object...", flush=True)
        record = Content(          # ← keyword args, not positional
            user_id=user_id,
            title=title,
            body=body,
            content_type=mapped,
            platform=platform,
            meta_description=meta_description,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        print("Content saved successfully", flush=True)
        return record
    except Exception as e:
        db.rollback()
        print("‼️ create_content failed:", flush=True)
        traceback.print_exc()
        raise


# ========== SEO REPORT ==========

def create_seo_report(
    db: Session,
    score: int,
    score_label: str,
    raw_content: Optional[str] = None,
    content_id: Optional[int] = None,
    post_title: Optional[str] = None,
    niche: Optional[str] = None,
    format: Optional[str] = None,
    word_count: Optional[int] = None,
    word_count_target: Optional[str] = None,
    word_count_status: Optional[str] = None,
    readability_score: Optional[float] = None,
    readability_level: Optional[str] = None,
    readability_metrics: Optional[Any] = None,
    keyword_density: Optional[float] = None,
    primary_keyword: Optional[Any] = None,
    secondary_keywords: Optional[Any] = None,
    missing_keywords: Optional[Any] = None,
    on_page_elements: Optional[Any] = None,
    title_suggestion: Optional[str] = None,
    meta_description_suggestion: Optional[str] = None,
    positive_points: Optional[Any] = None,
    negative_points: Optional[Any] = None,
    recommendations: Optional[Any] = None,
) -> SEOReport:
    """Save an SEO analysis report."""
    record = SEOReport(
        content_id=content_id,
        raw_content=raw_content,
        score=score,
        score_label=score_label,
        post_title=post_title,
        niche=niche,
        format=format,
        word_count=word_count,
        word_count_target=word_count_target,
        word_count_status=word_count_status,
        readability_score=readability_score,
        readability_level=readability_level,
        readability_metrics=readability_metrics,
        keyword_density=keyword_density,
        primary_keyword=primary_keyword,
        secondary_keywords=secondary_keywords,
        missing_keywords=missing_keywords,
        on_page_elements=on_page_elements,
        title_suggestion=title_suggestion,
        meta_description_suggestion=meta_description_suggestion,
        positive_points=positive_points,
        negative_points=negative_points,
        recommendations=recommendations,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ========== HASHTAG ANALYSIS ==========

def create_hashtag_analysis(
    db: Session,
    platform: str,
    raw_content: str,
    hashtags: Any,
    content_summary: Optional[str] = None,
    recommended_count: Optional[int] = None,
    notes: Optional[str] = None,
    content_id: Optional[int] = None,
) -> HashtagAnalysis:
    """Save a hashtag analysis result."""
    record = HashtagAnalysis(
        content_id=content_id,
        raw_content=raw_content,
        platform=platform,
        content_summary=content_summary,
        hashtags=hashtags,
        recommended_count=recommended_count,
        notes=notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ========== CONTENT IMPROVEMENT ==========

def create_content_improvement(
    db: Session,
    original_content: str,
    improved_content: str,
    content_type: Optional[str] = None,
    platform: Optional[str] = None,
    target_keyword: Optional[str] = None,
    notes: Optional[Any] = None,
    content_id: Optional[int] = None,
) -> ImprovedContent:
    """Save a content improvement (rewrite) result."""
    record = ImprovedContent(
        content_id=content_id,
        original_content=original_content,
        improved_content=improved_content,
        content_type=content_type,
        platform=platform,
        target_keyword=target_keyword,
        notes=notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
