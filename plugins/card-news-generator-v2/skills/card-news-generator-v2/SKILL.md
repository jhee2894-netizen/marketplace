---
name: "card-news-generator-v2"
description: "주제나 원고를 받아 인스타그램용 카드뉴스(기본 1080×1350 PNG 5~10장)를 만든다. 카드별 원고 → 디자인 → HTML → PNG 렌더 순서로 진행한다. \"카드뉴스 만들어줘\", \"이 글로 카드뉴스\", \"인스타 캐러셀 만들어줘\"에 쓴다."
---

# 카드뉴스 생성기 v2

주제나 원고 하나로 인스타그램 캐러셀용 카드뉴스를 만든다. 결과물은 PNG 이미지 여러 장과 그 원본 HTML이다.

## 기본값 (사용자가 따로 말하지 않으면 그대로 쓴다)

- **크기**: 1080×1350 (4:5). 정사각형을 원하면 1080×1080.
- **장수**: 표지 1 + 본문 4~8 + 마무리 1. 합계 6~10장.
- **언어**: 한국어. 존댓말 대신 짧고 단정한 문장("~한다", "~하자", 명사형 종결).
- **저장 위치**: 현재 작업 폴더의 `card-news/<slug>/`
  - `script.md` — 카드별 원고
  - `cards/01.html` … — 카드별 HTML
  - `out/01.png` … — 렌더 결과

## 작업 순서

### 1. 정보 받기

아래가 빠져 있으면 한 번에 묻는다. 이미 있는 것은 다시 묻지 않는다.

1. 주제 또는 원고(글, 링크, 메모)
2. 대상 독자와 목적(정보 전달 / 홍보 / 저장 유도 등)
3. 스타일(예: 깔끔한 정보형, 굵은 타이포, 손글씨 메모, 다크 모드) — 없으면 "깔끔한 정보형"
4. 브랜드 색·로고·계정명 — 없으면 생략

### 2. 카드별 원고 표 → 승인

코드를 쓰기 전에 아래 표를 보여주고 **승인을 받는다**. 승인 전에는 HTML을 만들지 않는다.

| # | 역할 | 제목(큰 글씨) | 본문(작은 글씨) | 시각 요소 |
|---|------|---------------|-----------------|-----------|
| 1 | 표지 | ... | ... | ... |

원고 규칙:
- **표지 제목은 15자 안팎.** 숫자·질문·반전으로 넘기고 싶게 만든다.
- **카드 하나에 메시지 하나.** 제목 20자, 본문 60자를 넘기지 않는다. 넘치면 카드를 나눈다.
- 본문 카드는 흐름이 이어지게 번호나 단계를 붙인다.
- 마지막 카드는 요약 한 줄 + 행동 유도(저장·공유·팔로우)로 끝낸다.
- 사실 정보는 출처가 있는 것만 쓴다. 확인할 수 없는 수치는 넣지 않는다.

승인되면 표를 `script.md`에 저장한다.

### 3. 디자인 정하기

카드 전체에 같은 디자인 토큰을 쓴다. `cards/theme.css` 하나에 모아 두고 모든 카드가 이 파일을 불러온다.

- 색: 배경 / 글자 / 강조 / 보조 4가지 안에서 끝낸다. 강조색은 한 카드에 한 군데만.
- 글꼴: Pretendard(CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`). 제목 800, 본문 500.
- 크기: 표지 제목 96~120px, 본문 제목 64~80px, 본문 36~42px, 페이지 번호 28px.
- 여백: 상하좌우 최소 96px. 글자가 가장자리에 붙지 않게 한다.
- 페이지 표시: 오른쪽 아래에 `2 / 8` 형식. 표지와 마지막 카드는 생략해도 된다.
- 계정명이 있으면 왼쪽 아래에 작게 넣는다.

### 4. HTML 만들기

카드마다 HTML 파일 하나. 뼈대:

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<link rel="stylesheet" href="theme.css">
</head>
<body>
  <main class="card">
    <!-- 카드 내용 -->
  </main>
</body>
</html>
```

`theme.css`에는 최소한 아래가 들어간다.

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body { font-family: "Pretendard", sans-serif; word-break: keep-all; }
.card { width: 1080px; height: 1350px; padding: 96px; position: relative; }
```

- 한국어 줄바꿈이 어색하지 않게 `word-break: keep-all`을 유지하고, 필요한 곳은 `<br>`로 직접 끊는다.
- 아이콘·도형은 인라인 SVG로 그린다. 외부 이미지는 사용자가 준 것만 쓴다.

### 5. PNG로 렌더

이 스킬 폴더의 `scripts/render.mjs`를 쓴다. Chrome(또는 Edge)의 헤드리스 스크린샷 기능을 사용하므로 따로 설치할 패키지가 없다.

```bash
node "<이 스킬 폴더>/scripts/render.mjs" card-news/<slug>/cards card-news/<slug>/out 1080 1350
```

Chrome을 못 찾으면 환경 변수 `CHROME_PATH`에 실행 파일 경로를 넣고 다시 실행한다.

### 6. 검수

렌더한 PNG를 전부 직접 열어 확인한다.

- 글자가 잘리거나 넘치지 않았는가
- 줄바꿈이 단어 중간에서 끊기지 않았는가
- 글꼴이 Pretendard로 나왔는가 (기본 글꼴로 나오면 네트워크 문제 — 다시 렌더)
- 카드끼리 여백·글자 크기·색이 일정한가
- 오탈자

문제가 있으면 HTML을 고치고 그 카드만 다시 렌더한다.

### 7. 전달

`out/` 폴더 경로와 장수를 알려주고, 수정하고 싶은 카드 번호를 묻는다.
