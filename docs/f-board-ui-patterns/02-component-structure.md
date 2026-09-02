# f-board Component Structure

이 문서는 f-board에서 공통 컴포넌트를 어떤 기준으로 만들고, 어느 단위까지 분리할지 정리한다.

## 공통화 기준

공통 컴포넌트는 단순히 코드 줄 수를 줄이기 위해 만들지 않는다. 같은 UI 역할이 반복되고, 상태 규칙까지 함께 유지해야 할 때 만든다.

### 바로 분리하는 경우

- 같은 역할의 UI가 2개 이상의 화면에서 반복된다.
- hover, focus, disabled, loading 같은 상태 규칙이 같이 따라다닌다.
- 접근성 속성이나 키보드 동작을 매번 다시 작성해야 한다.
- 한 번만 쓰이더라도 모달, 팝오버, 탭처럼 상태와 상호작용이 복잡하다.

### 조금 더 지켜보는 경우

- 한 페이지 안에서만 쓰이는 순수 레이아웃이다.
- 데이터 모양이 아직 자주 바뀌고 있다.
- 추상화하면 props가 많아져 사용처가 더 읽기 어려워진다.
- 페이지의 맥락을 알아야만 의미가 생기는 UI다.

### 반복 횟수 기준

- 스타일만 반복되면 3회 이상부터 분리 후보로 본다.
- 역할과 상태가 함께 반복되면 2회부터 분리한다.
- 접근성, 포커스, 키보드, 외부 클릭 처리처럼 실수 가능성이 큰 동작은 1회여도 분리할 수 있다.

## 현재 버튼 계열

| 컴포넌트 | 역할 | 사용 예 |
| --- | --- | --- |
| `Button` | 배경/테두리가 있는 명령형 버튼과 텍스트형 페이지 이동 | 등록, 저장, 폰트 추천, 목록으로, 게시글로 |
| `IconButton` | 아이콘만 있는 버튼 | 검색어 지우기, 공유, 플로팅 글쓰기, 상단으로 |
| `TextActionButton` | 배경 없는 텍스트 액션 | 수정, 삭제, 로그아웃, 인증 전환, 모달 취소 |
| `PaginationButton` | 목록 페이지네이션 | 이전, 다음, 페이지 번호 |
| `TabButton` | 작성 화면 탭 전환 | Write, Preview |
| `StateSection` | 페이지/섹션 단위 상태 화면 | 목록 loading/empty/error, 상세 loading/error, 작성 loading |
| `StateMessage` | 작은 영역의 상태 문구 | 댓글 empty, 마이페이지 목록 loading/empty |
| `PostCard` | 목록 게시글 카드 | 게시글 메타, 제목, 폰트 미리보기, 댓글 수 |
| `CommentSection` | 상세 페이지 댓글 영역 | 댓글 입력, 댓글 목록, 삭제 확인 |
| `CommentItem` | 댓글 단일 행 | 닉네임, 내용, 작성일, 삭제 버튼 |
| `MyPageAccordionSection` | 마이페이지 아코디언 섹션 | 내가 등록한 게시물, 내가 사용한 폰트 |
| `MyPagePostLink` | 마이페이지 게시글 링크 행 | 게시글 링크와 bullet 표시 |

## 버튼 분리 이유

처음에는 `Button` 하나에 여러 size/variant를 추가하는 방식으로 시작했다. 하지만 `수정/삭제`처럼 본문 옆에 붙는 작은 텍스트 액션까지 일반 버튼에 넣으면, 버튼의 역할이 흐려지고 크기 수정이 다른 버튼에 영향을 줄 수 있다.

그래서 버튼을 역할 기준으로 나눴다.

- 명령형 액션: `Button`
- 아이콘 액션: `IconButton`
- 문장 옆 텍스트 액션: `TextActionButton`
- 페이지 탐색: `PaginationButton`
- 탭 전환: `TabButton`

이렇게 나누면 화면에서 같은 위치와 같은 성격의 버튼이 같은 규칙을 공유한다.

## size token 추가 기준

공통 컴포넌트의 크기는 임의 Tailwind 클래스를 사용처에서 덮어쓰기보다, 컴포넌트 내부 size token으로 먼저 정의한다.

- 같은 패딩/높이 조합이 2회 이상 반복되면 size token 후보로 본다.
- 한 번만 쓰여도 역할이 명확하면 token으로 둔다. 예: `Button.inline`은 `목록으로`, `게시글로`처럼 본문 시작점과 맞아야 하는 텍스트 이동에 사용한다.
- `px-5`는 기본 명령형 버튼이나 게시글 본문 입력처럼 여유가 필요한 요소에 사용한다.
- `px-4`는 검색/인증 입력, 모달 버튼, 탭처럼 밀도 있는 조작 UI에 사용한다.
- `px-2`는 페이지 번호나 댓글 등록처럼 주변 텍스트와 함께 붙는 작은 액션에 사용한다.
- `px-0`은 버튼처럼 동작하지만 텍스트 시작점 정렬이 중요한 이동 액션에만 사용한다.
- 페이지 고유 배치가 필요한 경우에도 `className`으로 위치만 보정하고, 크기/패딩은 가능하면 size token을 사용한다.

## 현재 남겨둔 버튼

`FontInfoPopover`의 폰트 이름 칩은 아직 raw `button`으로 남겨둔다. 이유는 단순 텍스트 액션이 아니라 팝오버를 여는 chip trigger이고, 팝오버 위치와 반응형 처리를 함께 다시 설계해야 하기 때문이다.

이 부분은 나중에 `PopoverTrigger` 또는 `FontInfoButton`으로 분리할 수 있다.

## 다음 공통화 후보

### 입력 컴포넌트

후보:

- 검색 입력
- 제목 입력
- 게시글 textarea
- 댓글 textarea
- 인증 입력 그룹

분리 방향:

- `TextInput`
- `Textarea`
- `SearchInput`
- 필요하면 `PasswordInput`

분리 이유:

- `border-gray-300`, `placeholder:text-gray-300`, `focus:border-black` 패턴이 반복된다.
- 입력 크기와 focus 상태가 화면마다 달라지기 쉽다.
- 검색 입력은 clear button과 아이콘까지 포함하므로 별도 컴포넌트가 자연스럽다.

### 상태 화면

적용 완료:

- 목록 loading
- 목록 empty
- 상세 loading/error
- 작성 loading
- 마이페이지 empty/loading

분리 결과:

- `StateMessage`
- `StateSection`
- 이후 skeleton 적용 시 `PostCardSkeleton`

분리 이유:

- loading, empty, error 문구와 위치가 반복된다.
- 스켈레톤 도입 시 각 페이지에 임시 레이아웃이 늘어나는 것을 막을 수 있다.

분리 기준:

- 화면 한가운데 넓게 보여야 하는 상태는 `StateSection`을 사용한다.
- 리스트 내부에 한 줄로 들어가는 상태는 `StateMessage`를 사용한다.
- 상태 문구 자체는 공통 컴포넌트가 관리하고, 페이지는 어떤 메시지를 보여줄지만 결정한다.

### 확인 모달

후보:

- 게시글 삭제 확인 모달
- 이후 댓글 삭제 확인이 추가될 경우

분리 방향:

- `ConfirmDialog`

분리 이유:

- `role="dialog"`, `aria-modal`, 배경 dim, 버튼 배치가 같이 유지되어야 한다.
- 삭제/취소 같은 위험 액션의 문구와 포커스 처리를 한 곳에서 점검할 수 있다.

### 폰트 추천 헤더

적용 완료:

- 상세 페이지 상단 추천 폰트 영역
- 작성/수정 페이지 추천 결과 영역

분리 결과:

- `FontRecommendationHeader`

분리 이유:

- `FontInfoPopover`, tag, 추천 이유, Zodiak `f` 장식이 두 화면에서 거의 같은 구조로 반복된다.
- 웹폰트 없음, 추천 중, 추천 완료 상태를 한 곳에서 관리하기 좋다.

분리 기준:

- `FontRecommendationHeader`는 폰트 정보, tag, 추천 이유, 오른쪽 `f` 심볼을 보여주는 도메인 컴포넌트다.
- 상세 페이지는 저장된 추천 결과를 그대로 보여주고, 작성/수정 페이지는 미리보기 탭에서 추천 결과를 넘겨준다.
- 추천 전 안내 문구는 `emptyMessage`로 받되, 별도의 `추천 없음` 상태 컴포넌트로 만들지 않는다.
- 추천 중 상태는 헤더가 아니라 작성 화면의 waiting overlay가 담당한다. 사용자가 진행 중임을 더 직접적으로 이해할 수 있기 때문이다.
- 추천 이유 타이핑 효과는 작성 화면의 연출 로직이므로 `Write.jsx`에 남기고, 헤더는 받은 문자열만 렌더링한다.
- 추천 이유 영역의 스크롤/빈 문구/타이핑 표현이 더 복잡해질 때만 `FontReasonPreview` 분리를 다시 검토한다.

### 게시글 카드

적용 완료:

- 목록 페이지의 게시글 카드

분리 결과:

- `PostCard`

분리 이유:

- 현재는 목록 한 곳에서만 쓰이지만 내부 구조가 길고, skeleton/hover/fallback font 상태가 추가되면 페이지 파일이 무거워진다.
- 카드 단위 테스트나 시각 QA를 붙이기 좋다.

분리 기준:

- `Board.jsx`는 검색, 페이지네이션, 목록 상태, 이동 경로 보존을 담당한다.
- `PostCard`는 카드 내부 렌더링과 상세 이동 링크, 카드 hover 상태를 담당한다.
- 카드 데이터 변환은 아직 `Board.jsx`에 남긴다. API 응답 형태가 더 안정되면 `utils` 또는 별도 mapper로 이동한다.
- skeleton을 추가할 때는 `PostCard` 옆에 `PostCardSkeleton`을 두고 카드 크기와 preview 영역 높이를 공유한다.

### 댓글 영역

적용 완료:

- 상세 페이지 댓글 작성 영역
- 댓글 목록
- 댓글 삭제 확인 모달

분리 결과:

- `CommentSection`
- `CommentItem`

분리 이유:

- 댓글 입력, 삭제 요청, empty 상태, 작성자 권한 표시가 게시글 본문과 다른 책임이다.
- 상세 페이지가 게시글 조회/수정/삭제와 댓글 CRUD UI를 동시에 갖고 있어 파일이 비대해지기 쉽다.
- 댓글 줄바꿈 표시, 날짜 표시, 삭제 버튼 정렬을 댓글 컴포넌트 안에서 일관되게 관리할 수 있다.

분리 기준:

- `PostDetail.jsx`는 댓글 데이터 상태와 API 핸들러를 소유한다.
- `CommentSection`은 댓글 입력폼, 목록, empty 상태, 댓글 삭제 모달 배치를 담당한다.
- `CommentItem`은 댓글 한 줄의 렌더링과 작성자 본인에게만 삭제 버튼을 노출하는 UI 규칙을 담당한다.
- 댓글 API 호출 자체는 아직 페이지에 남긴다. 댓글 수정, 페이지네이션, optimistic update가 추가되면 별도 hook 분리를 검토한다.

### 마이페이지 아코디언

적용 완료:

- 내가 등록한 게시물 섹션
- 내가 사용한 폰트 섹션
- 아코디언 내부 게시글 링크 행

분리 결과:

- `MyPageAccordionSection`
- `MyPagePostLink`

분리 이유:

- `details`, `summary`, loading, empty, scroll list 구조가 마이페이지 안에서 반복된다.
- 각 섹션의 데이터는 다르지만 아코디언 제목, 아이콘, 상태 문구, 리스트 박스의 시각 규칙은 같다.
- 게시글 링크 행의 bullet, hover, spacing 규칙이 두 섹션에서 반복된다.

분리 기준:

- `MyPage.jsx`는 사용자 정보, 로그아웃, 마이페이지 데이터 로딩 상태를 소유한다.
- `MyPageAccordionSection`은 아코디언 껍데기와 loading/empty 상태 배치를 담당한다.
- `MyPagePostLink`는 마이페이지 안에서 게시글로 이동하는 링크의 시각 규칙을 담당한다.
- 사용한 폰트 그룹의 내부 데이터 매핑은 아직 `MyPage.jsx`에 남긴다. 폰트 그룹 표시가 다른 화면에서도 반복되면 별도 컴포넌트로 분리한다.

## 폴더 기준

- `frontend/src/components/ui`: 범용 UI 원자 컴포넌트
- `frontend/src/components`: 프로젝트 도메인이 묻어나는 재사용 컴포넌트
- `frontend/src/hooks`: 상태와 브라우저 이벤트를 다루는 재사용 로직
- `frontend/src/utils`: 렌더링과 무관한 데이터 변환/계산 로직
- `frontend/src/pages`: 라우트 단위 화면 조립과 데이터 요청

## util 분리 기준

렌더링과 무관한 변환 로직이 여러 페이지에서 반복되면 `utils`로 분리한다.

- `date.js`: 목록 게시글 날짜, 상세 게시글 날짜/시간, 댓글 날짜/시간 포맷을 관리한다.
- 페이지 컴포넌트는 어떤 날짜 포맷이 필요한지만 선택하고, `Intl.DateTimeFormat` 구성이나 fallback 처리는 util에 둔다.
- API 응답 형태를 화면용 데이터로 바꾸는 mapper는 화면 맥락이 강하면 페이지에 남기고, 같은 변환이 반복될 때 utils로 이동한다.

## hook 분리 기준

컴포넌트가 화면 렌더링보다 브라우저 API, 타이머, 반복 이벤트를 오래 들고 있으면 hook 분리 후보로 본다.

- `useShareLink`: 공유 URL 생성, 클립보드 복사, fallback 복사, 안내 메시지 타이머를 관리한다.
- `useFontRecommendation`: 폰트 추천 요청, waiting message 순환, 추천 이유 타이핑 표시를 관리한다.
- 페이지 컴포넌트는 공유 버튼 위치와 메시지 노출만 담당한다.
- `window`, `navigator.clipboard`, `setTimeout`처럼 브라우저 API와 lifecycle cleanup이 같이 있는 로직은 hook으로 빼면 페이지가 읽기 쉬워진다.
- API 요청, interval, typing animation state가 한 화면에 묶여 길어질 때도 hook 분리 후보로 본다.

## 페이지에 남겨도 되는 코드

- 라우트 파라미터, navigate 흐름
- 해당 페이지에서만 쓰는 데이터 변환
- 컴포넌트 조립 순서
- 페이지 고유 레이아웃
- 한 번만 쓰이고 의미가 화면 맥락에 강하게 묶인 UI

## 리팩터링 순서

1. 버튼 계열 정리
2. 입력 컴포넌트 정리
3. loading, empty, error 상태 화면 정리
4. 폰트 추천 헤더 분리
5. 게시글 카드 분리
6. API 요청 상태와 에러 처리 공통화
7. 검색 디바운스와 요청 중복 제어
