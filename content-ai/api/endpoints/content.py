from services.content_service import ContentService
from fastapi import APIRouter
from schemas.content import BlogArticleRequest, ContentResponse
from http.client import HTTPException

router = APIRouter()
content_service = ContentService()

@router.post("/generate/blog_article", response_model=ContentResponse)
async def generate_blog_article(request: BlogArticleRequest):
    try:
        result = content_service.generate_content(request)

        content_response = ContentResponse(id=1, user_id=1, title=request.topic, body=result, word_count=len(result.split()), content_type="blog_article", status="generated", created_at="2024-01-01T00:00:00Z")
        return content_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))