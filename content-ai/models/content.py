from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.session import Base
import enum


class ContentType(str, enum.Enum):
    BLOG_ARTICLE = "blog_article"
    SOCIAL_MEDIA_POST = "social_media_post"
    PRODUCT_DESCRIPTION = "product_description"

class ContentStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    meta_description = Column(String(160), nullable=True)
    word_count = Column(Integer, nullable=True)
    platform = Column(String(100), nullable=True)
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    author = relationship("User", back_populates="contents")
    
    

class ImprovedContent(Base):
    __tablename__ = "content_improvements"
 
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=True, index=True)
 
    original_content = Column(Text, nullable=False)
    improved_content = Column(Text, nullable=False)
    content_type = Column(String(50), nullable=True)
    platform = Column(String(50), nullable=True)
    target_keyword = Column(String(255), nullable=True)
    notes = Column(JSON, nullable=True)  # list[str]
 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    content = relationship("Content", back_populates="improvements")