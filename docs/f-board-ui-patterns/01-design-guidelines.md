# f-board Design Guidelines

이 문서는 f-board 리팩터링 중 유지할 시각 규칙을 정리한다. 목표는 화면을 화려하게 만드는 것이 아니라, 폰트 미리보기가 주인공으로 보이도록 배경과 조작 UI를 조용하게 유지하는 것이다.

## 디자인 방향

- 폰트 중심 서비스이므로 장식 요소보다 글자, 여백, 상태 피드백을 우선한다.
- 흰색, 검정, 저채도 회색을 기본으로 사용한다.
- 버튼, 탭, 페이지네이션, 팝오버는 크기와 상태 변화가 예측 가능해야 한다.
- hover, focus, disabled, loading, empty 상태가 화면마다 다르게 보이지 않게 한다.

## 색상 기준

### 기본 색상

| 용도 | 값 | 사용 위치 |
| --- | --- | --- |
| App background | `#F8F9FA` | 페이지 배경, 탭 활성 배경 |
| Surface | `white` | 카드, 모달, 팝오버 |
| Primary text | `black` | 제목, 본문, 주요 액션 |
| Border | `gray-300` | 입력창, outline button, floating button |
| Soft border | `gray-200` | 카드 내부 preview, chip, modal |
| Muted action | `gray-500` | 수정, 삭제, 보조 텍스트 액션 |
| Subtle action | `gray-400` | 로그아웃, 인증 전환, 댓글 삭제 아이콘 |
| Disabled | `gray-300` | 비활성 버튼, 사용할 수 없는 탭 |

### 기존 임의 색상 처리

- `#d4d4d4`는 기존 UI에서 empty/loading/placeholder 톤으로 많이 쓰고 있다.
- 새 인터랙티브 컴포넌트에는 가능하면 Tailwind gray token을 우선 사용한다.
- active control에 `#d4d4d4`를 쓰면 대비가 낮아질 수 있으므로, 클릭 가능한 액션은 `gray-400` 이상을 사용한다.
- `#6b7280`은 Tailwind `gray-500`에 가까우므로 새 코드에서는 `text-gray-500`으로 작성한다.

## 글꼴 기준

| 용도 | 크기 | 굵기 | 비고 |
| --- | --- | --- | --- |
| 기본 UI 텍스트 | `text-sm` | `font-normal` 또는 `font-semibold` | 버튼, 댓글, 보조 문구 |
| 본문 입력 | `text-base` | `font-normal` | 제목/내용 입력 |
| 게시글 본문 미리보기 | `text-[20px]` ~ `text-[24px]` | 폰트별 적용 | 폰트 감상이 목적이라 크게 둔다 |
| 카드 제목 | `text-base` | `font-bold` | 2줄 clamp |
| Header nav | `text-[30px]` | `font-normal` | 브랜드 성격 유지 |
| Brand `f` | `Zodiak`, `text-[40pt]` | `font-extrabold italic` | 로고/상징 |
| Chip | `text-[10px]` | `font-medium` | 폰트 이름, tag |

## 크기와 여백 기준

- 일반 버튼은 `Button`의 `xs`, `sm`, `md`, `full` 크기를 사용한다.
- 배경 없는 텍스트 액션은 `TextActionButton`의 `xs`, `sm` 크기를 사용한다.
- 아이콘 버튼은 `IconButton`의 `xs`, `sm`, `floating` 크기를 사용한다.
- 카드, 모달, 버튼 radius는 기본적으로 `rounded-md`를 사용한다.
- 앱 컨테이너의 큰 외곽 radius처럼 브랜드 레이아웃 성격이 있는 경우만 별도 radius를 둔다.
- 고정 크기 요소는 hover나 loading 텍스트로 레이아웃이 흔들리지 않게 `h-*`, `min-w-*`, `min-h-*`를 같이 둔다.

### 컴포넌트 패딩 토큰

공통 UI는 한 가지 좌우 패딩으로 통일하지 않는다. 버튼, 입력, 탭, 페이지네이션은 사용 맥락과 밀도가 다르므로 컴포넌트별 size token으로 관리한다.

| 컴포넌트 | 토큰 | 좌우 패딩 | 사용 기준 |
| --- | --- | --- | --- |
| `Button` | `md` | `20px` (`px-5`) | 기본 명령 버튼, 폼 제출, 추천 실행 |
| `Button` | `sm` | `16px` (`px-4`) | 모달 내부 버튼, 좁은 영역의 보조 명령 |
| `Button` | `xs` | `8px` (`px-2`) | 댓글 등록처럼 본문 옆에 붙는 작은 명령 |
| `Button` | `inline` | `0px` (`px-0`) | `목록으로`, `게시글로`처럼 본문 시작점과 맞아야 하는 텍스트 이동 |
| `TextInput` | `box`, `group` | `16px` (`px-4`) | 검색, 로그인, 회원가입 입력 |
| `TextInput` | `underline` | `4px` (`px-1`) | 글쓰기 제목처럼 선형 입력에서 텍스트 시작점을 가볍게 보정 |
| `Textarea` | `post` | `20px` (`px-5`) | 게시글 본문 입력 |
| `Textarea` | `comment` | `16px` (`px-4`) | 댓글 입력 |
| `TabButton` | default | `16px` (`px-4`) | 작성/미리보기 탭 |
| `PaginationButton` | `page` | `8px` (`px-2`) | 페이지 번호 |

예외를 만들 때는 페이지에서 임시 클래스로 덮어쓰기보다, 먼저 공통 컴포넌트의 size token으로 추가할 수 있는지 본다.

### 페이지 여백 기준

- 페이지 내부 주요 컨테이너는 `max-w-[720px]`를 기본 폭으로 사용한다.
- 상세/글쓰기의 상단 이동 버튼은 컨테이너와 같은 시작점에 둔다.
- 목록 페이지네이션은 카드 목록 아래 `mt-12`, 페이지 하단과는 `mb-16` 이상 간격을 둔다.

## 상태 표현 기준

- `hover`: 활성 액션은 검정 또는 흰색 반전으로 명확히 표현한다.
- `focus`: 키보드 이동 중인 요소가 색상 변화 또는 outline으로 구분되어야 한다.
- `disabled`: 클릭 불가 상태는 `cursor-not-allowed`와 낮은 대비 색상을 같이 사용한다.
- `loading`: 빈 화면이 아니라 현재 무엇을 기다리는지 짧게 보여준다.
- `empty`: 사용자가 다음 행동을 떠올릴 수 있는 문장을 제공한다.
- `error`: API 실패 문구는 화면 안에 남겨 사용자가 원인을 놓치지 않게 한다.

### 상태 화면 토큰

상태 UI는 크게 두 단위로 나눈다.

| 컴포넌트 | 용도 | 기본 스타일 |
| --- | --- | --- |
| `StateSection` | 페이지/섹션 전체가 loading, empty, error 상태일 때 | 중앙 정렬, `text-sm`, muted color |
| `StateMessage` | 리스트 안의 empty/loading 문구나 작은 안내 문구 | `text-sm`, muted color |

`StateSection`의 높이는 화면 맥락에 따라 size token으로 선택한다.

| 토큰 | 높이 | 사용 기준 |
| --- | --- | --- |
| `sm` | `min-h-[360px]` | 목록 페이지의 검색 결과, empty, loading |
| `md` | `min-h-[420px]` | 작성/수정 화면 내부 loading |
| `lg` | `min-h-[520px]` | 상세 페이지처럼 단독 화면을 대체하는 loading/error |

상태 문구 색은 기본적으로 `#d4d4d4`를 사용한다. 단, 실제 오류 원인을 강조해야 하는 폼/요청 에러는 `neutral-600` 이상을 사용한다.

## 피해야 할 방식

- 한 화면에서만 임시로 `!text-sm`처럼 강제 클래스를 붙이지 않는다.
- 같은 역할의 버튼이 페이지마다 다른 크기/색으로 보이지 않게 한다.
- 페이지 고유 레이아웃을 공통 컴포넌트로 과하게 밀어 넣지 않는다.
- 폰트 미리보기를 방해하는 강한 배경색, 장식성 그래픽, 과한 그림자는 사용하지 않는다.
