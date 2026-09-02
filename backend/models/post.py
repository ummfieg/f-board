from typing import Optional
from datetime import datetime, timezone

from sqlmodel import SQLModel, Field
from sqlalchemy import Column,String, Text

class PostCreate(SQLModel):
    title: str
    content: str
    font_id: Optional[int] = None
    recommend_reason: str
    post_type: str = "post"

class Post(SQLModel, table=True):
    __tablename__ = "posts"

    id: Optional[int] = Field(default=None, primary_key=True)

    title: str = Field(sa_column=Column(String(100), nullable=False))
    content: str = Field(sa_column=Column(Text, nullable=False))
    recommend_reason: Optional[str] = Field(
        default=None,
        sa_column=Column(Text, nullable=True)
    )

    font_id: Optional[int] = Field(default=None, foreign_key="fonts.id")
    user_id: int = Field(foreign_key="users.id")
    post_type: str = Field(default="post", sa_column=Column(String(20), nullable=False))

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
