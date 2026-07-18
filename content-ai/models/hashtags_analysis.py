from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.session import Base

class HashtagAnalysis(Base):
    __tablename__ = "hashtag_analyses"
 
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=True, index=True)
    raw_content = Column(Text, nullable=True)  # set when analyzed via /hashtags with no saved Content
 
    platform = Column(String(50), nullable=True)
    content_summary = Column(Text, nullable=True)
    hashtags = Column(JSON, nullable=False)     # list[{tag, tier, reason}]
    recommended_count = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    content = relationship("Content", back_populates="hashtag_analyses")