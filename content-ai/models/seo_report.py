from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.session import Base


class SEOReport(Base):
    __tablename__ = "seo_reports"
 
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=True, index=True)
    raw_content = Column(Text, nullable=True)  # set when analyzed via /seo-report with no saved Content
 
    score = Column(Integer, nullable=False)
    score_label = Column(String(50), nullable=True)
    post_title = Column(String(255), nullable=True)
    niche = Column(String(100), nullable=True)
    format = Column(String(50), nullable=True)
 
    word_count = Column(Integer, nullable=True)
    word_count_target = Column(String(50), nullable=True)
    word_count_status = Column(String(50), nullable=True)
 
    readability_score = Column(Float, nullable=True)
    readability_level = Column(String(50), nullable=True)
    readability_metrics = Column(JSON, nullable=True)  # list[{metric_name, value, target, status}]
 
    keyword_density = Column(Float, nullable=True)
    primary_keyword = Column(JSON, nullable=True)      # {term, search_volume, keyword_difficulty, usage_count, note}
    secondary_keywords = Column(JSON, nullable=True)   # list[KeywordAnalysis]
    missing_keywords = Column(JSON, nullable=True)     # list[KeywordAnalysis]
 
    on_page_elements = Column(JSON, nullable=True)      # list[{element, status, current, suggestion, priority}]
 
    title_suggestion = Column(String(255), nullable=True)
    meta_description_suggestion = Column(String(320), nullable=True)
 
    positive_points = Column(JSON, nullable=True)       # list[str]
    negative_points = Column(JSON, nullable=True)       # list[str]
    recommendations = Column(JSON, nullable=True)       # list[{priority, title, description, category}]
 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    content = relationship("Content", back_populates="seo_reports")
 