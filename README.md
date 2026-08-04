# f-board

글의 분위기를 분석해 어울리는 웹폰트를 추천하고, 추천된 폰트가 적용된 글을 저장하는 AI 폰트 보드입니다.

## 주요 기능

- 게시글 CRUD, 검색, 페이지네이션
- 쿠키 기반 로그인/회원가입
- 글 내용 기반 AI 폰트 추천
- 추천 폰트 웹폰트 미리보기
- 폰트 출처, 라이선스, 다운로드 정보 팝오버
- 댓글 작성/삭제
- 마이페이지의 내가 쓴 글, 내가 사용한 폰트 기록

## 기술 스택

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, SQLModel
- AI: OpenAI API, RAG 기반 폰트 가이드 검색, MCP 형태의 폰트 후보 조회
- Database: PostgreSQL 호환 DB

## 폰트 사용 방식

추천 대상 폰트 파일은 저장하거나 재배포하지 않습니다. 폰트명, 출처, 라이선스, 웹폰트 URL 같은 메타데이터만 관리하고, 화면에서는 원격 웹폰트 URL을 `@font-face`로 등록해 미리보기를 제공합니다.

포트폴리오 목적의 학습 프로젝트이며, 실제 브랜드/상업 적용 전에는 각 폰트의 원 배포처와 라이선스를 다시 확인해야 합니다.

## 실행 준비

Backend 환경변수 예시:

```env
DATABASE_URL=
OPENAI_API_KEY=
JWT_SECRET_KEY=
CORS_ORIGINS=http://localhost:5173
```

Frontend 환경변수 예시:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 실행

Backend:

```bash
cd backend
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
