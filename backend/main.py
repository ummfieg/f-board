import os

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_
from sqlmodel import Session, select

from database import engine
from models.comment import Comment
from models.post import Post, PostCreate
from models.font import Font
from models.user import User
from models.recommend import (RecommendRequest, RecommendResponse)

from datetime import datetime, timezone
from agent.recommend_agent import run_recommend_agent
from routers.comments import router as comments_router
from routers.auth import router as auth_router
from routers.auth import get_current_user_from_access_token
from schema_updates import ensure_notice_schema

app = FastAPI()

app.include_router(comments_router)
app.include_router(auth_router)

ensure_notice_schema()

ADMIN_ROLE = "admin"
POST_TYPE_POST = "post"
POST_TYPE_NOTICE = "notice"
NOTICE_RECOMMEND_REASON = "관리자 계정으로 공지를 등록중입니다."
NOTICE_FONT_RESPONSE = {
    "id": None,
    "is_paid": False,
    "name": "Pretendard",
    "source": "site",
    "license": "사이트 기본 폰트",
    "category": "기본",
    "tags": ["notice", "system"],
    "description": "공지에는 사이트 기본 폰트인 Pretendard 400을 적용합니다.",
    "weights": [400],
    "download_url": "#",
    "source_url": "#",
    "license_summary": [],
    "webfonts": [],
}


def get_cors_origins() -> list[str]:
    cors_origins = os.getenv("CORS_ORIGINS")

    if cors_origins is None:
        return ["http://localhost:5173"]

    origins = []
    for origin in cors_origins.split(","):
        stripped_origin = origin.strip()

        if stripped_origin:
            origins.append(stripped_origin)

    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def build_font_response(font: Font):
    return {
        "id": font.id,
        "is_paid": font.is_paid,
        "name": font.name,
        "source": font.source,
        "license": font.license,
        "category": font.category,
        "tags": font.tags,
        "description": font.description,
        "weights": font.weights,
        "download_url": font.download_url,
        "source_url": font.source_url,
        "license_summary": font.license_summary,
        "webfonts": font.webfonts,
    }

def build_post_response(session: Session, post: Post):
    font = session.get(Font, post.font_id) if post.font_id is not None else None
    user = session.get(User, post.user_id)
    comment_count = session.exec(
        select(func.count(Comment.id)).where(Comment.post_id == post.id)
    ).one()
    font_response = (
        build_font_response(font)
        if font is not None
        else NOTICE_FONT_RESPONSE
    )

    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "recommend_reason": post.recommend_reason,
        "post_type": post.post_type,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "user": {
            "id": user.id if user is not None else None,
            "nickname": user.nickname if user is not None else "작성자",
            "role": user.role if user is not None else "user",
        },
        "comment_count": comment_count,
        "font": font_response,
    }

def is_admin(user: User) -> bool:
    return user.role == ADMIN_ROLE

def normalize_post_type(post_type: str | None) -> str:
    normalized_type = (post_type or POST_TYPE_POST).strip()

    if normalized_type not in {POST_TYPE_POST, POST_TYPE_NOTICE}:
        raise HTTPException(status_code=400, detail="지원하지 않는 게시글 유형입니다.")

    return normalized_type

@app.get("/")
def home():
    return {"message" : "connected backend"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/posts")
def get_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=9, ge=1, le=50),
    search: str | None = None,
):

    with Session(engine) as session:
        statement = (
            select(Post)
            .where(Post.post_type == POST_TYPE_POST)
            .order_by(Post.created_at.desc())
        )
        count_statement = (
            select(func.count(Post.id))
            .where(Post.post_type == POST_TYPE_POST)
        )
        search_keyword = search.strip() if search is not None else ""

        if search_keyword:
            search_pattern = f"%{search_keyword}%"
            statement = (
                statement
                .join(Font, Post.font_id == Font.id)
                .where(
                    or_(
                        Post.title.ilike(search_pattern),
                        Font.name.ilike(search_pattern),
                    )
                )
            )
            count_statement = (
                count_statement
                .join(Font, Post.font_id == Font.id)
                .where(
                    or_(
                        Post.title.ilike(search_pattern),
                        Font.name.ilike(search_pattern),
                    )
                )
            )

        total = session.exec(count_statement).one()
        offset = (page - 1) * page_size
        posts = session.exec(statement.offset(offset).limit(page_size)).all()
        result = [
            build_post_response(session, post)
            for post in posts
        ]
        
        total_pages = max(1, (total + page_size - 1) // page_size)

        return {
            "items": result,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        }

@app.get("/notices")
def get_notices(limit: int = Query(default=5, ge=1, le=20)):
    with Session(engine) as session:
        statement = (
            select(Post)
            .where(Post.post_type == POST_TYPE_NOTICE)
            .order_by(Post.created_at.desc())
            .limit(limit)
        )
        notices = session.exec(statement).all()

        return {
            "items": [
                build_post_response(session, notice)
                for notice in notices
            ],
        }

@app.post("/posts")
def create_post(post_data: PostCreate, request: Request):

    current_user = get_current_user_from_access_token(request)
    title = post_data.title.strip()
    content = post_data.content
    post_type = normalize_post_type(post_data.post_type)
    is_notice = post_type == POST_TYPE_NOTICE
    recommend_reason = (
        NOTICE_RECOMMEND_REASON
        if is_notice
        else post_data.recommend_reason.strip()
    )

    if not title:
        raise HTTPException(status_code=400, detail="제목은 필수 입력 항목입니다.")

    if not content.strip():
        raise HTTPException(status_code=400, detail="내용은 필수 입력 항목입니다.")

    if is_notice and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="공지 등록 권한이 없습니다.")

    if not recommend_reason:
        raise HTTPException(status_code=400, detail="추천 이유는 필수 입력 항목입니다.")

    # postgreSQL 연결 시작 수행 후 종료
    with Session(engine) as session:
        font = (
            session.get(Font, post_data.font_id)
            if post_data.font_id is not None
            else None
        )

        if not is_notice and font is None:
            raise HTTPException(status_code=400, detail="폰트 정보를 찾을 수 없습니다.")

        post = Post(
            title=title,
            content=content,
            recommend_reason=recommend_reason,
            font_id=font.id if font is not None else None,
            user_id=current_user.id,
            post_type=post_type,
        )

        # 객체 등록 (저장 대기열)
        session.add(post)
        # 객체 DB 반영
        session.commit()
        # DB 반영 조회 (최신 상태로 객체 갱신)
        session.refresh(post)
        # fast API 자동 json으로 변환해줌
        return build_post_response(session, post)

@app.get("/posts/{post_id}")
def get_post(post_id : int): 

    with Session(engine) as session:
        # 해당 id의 Row 가져오기
        post = session.get(Post, post_id)
        if post is None:
            raise HTTPException(
                status_code=404,
                detail="게시글을 찾을 수 없습니다."
            )
        
        return build_post_response(session, post)

@app.put("/posts/{post_id}")
def update_post(post_id: int, post_data: PostCreate, request: Request):

    current_user = get_current_user_from_access_token(request)
    title = post_data.title.strip()
    content = post_data.content
    post_type = normalize_post_type(post_data.post_type)
    is_notice = post_type == POST_TYPE_NOTICE
    recommend_reason = (
        NOTICE_RECOMMEND_REASON
        if is_notice
        else post_data.recommend_reason.strip()
    )

    if not title:
        raise HTTPException(status_code=400, detail="제목은 필수 입력 항목입니다.")

    if not content.strip():
        raise HTTPException(status_code=400, detail="내용은 필수 입력 항목입니다.")

    if is_notice and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="공지 수정 권한이 없습니다.")

    if not recommend_reason:
        raise HTTPException(status_code=400, detail="추천 이유는 필수 입력 항목입니다.")
    
    with Session (engine) as session:
        post = session.get(Post, post_id)

        if post is None:
            # FastAPI 제공 예외 클래스로 정확한 상태코드 내려줌
            raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

        if post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="게시글 수정 권한이 없습니다.")

        font = (
            session.get(Font, post_data.font_id)
            if post_data.font_id is not None
            else None
        )

        if not is_notice and font is None:
            raise HTTPException(status_code=400, detail="폰트 정보를 찾을 수 없습니다.")

        post.title = title
        post.content = content
        post.recommend_reason = recommend_reason
        post.font_id = font.id if font is not None else None
        post.post_type = post_type
        post.updated_at = datetime.now(timezone.utc)

        session.add(post)
        session.commit()
        session.refresh(post)

        return {
            "success": True,
            "message": "게시글 수정 완료"
        }


@app.delete("/posts/{post_id}")
def delete_post(post_id : int, request: Request):
    # 해당 post_id를 db에서 찾아서 있으면 삭제하고 결과반환

    current_user = get_current_user_from_access_token(request)

    with Session (engine) as session:
        post = session.get(Post, post_id)

        if post is None:
            raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
        
        if post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="게시글 삭제 권한이 없습니다.")

        session.delete(post)
        session.commit()

        return {
            "success": True,
            "message": "게시글 삭제 완료"
        }

@app.post("/recommend", response_model=RecommendResponse)
def recommend_fonts(request: RecommendRequest):
    try:
        return run_recommend_agent(request)

    # agent 내부 예외 전달
    except HTTPException:
        raise

    # 파이썬 기본 예외들의 부모 클래스
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="추천 처리 중 오류가 발생했습니다.",
        )
