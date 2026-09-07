# Lighthouse SEO 검수

URL을 입력하면 Google Lighthouse로 페이지를 검사하고, **수정이 필요한 항목만 한국어 설명 + 수정 방법**과 함께 보여주는 웹앱입니다.

- 검사 엔진: **Google PageSpeed Insights API** (구글 서버에서 Lighthouse 실행) → Chrome 설치 없이 Vercel 서버리스에서 동작
- 프론트엔드: 단일 HTML, 빌드 없음
- 결과: 카테고리 점수, Core Web Vitals, 스크린샷, 심각도별 수정 항목(왜 중요한지 / 수정 방법 / 예시 코드 / 문제 요소 표), Markdown 체크리스트 복사

## 1. PageSpeed Insights API 키 발급 (필수, 무료)

키 없이 호출하면 Google이 즉시 할당량 초과(429)를 반환합니다. 키가 있으면 하루 25,000회까지 무료입니다.

1. https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com 접속
2. 프로젝트 선택(없으면 새로 만들기) → **사용** 클릭
3. 왼쪽 메뉴 **사용자 인증 정보** → **사용자 인증 정보 만들기** → **API 키**
4. (권장) 만든 키 클릭 → **API 제한사항** → "키 제한" → **PageSpeed Insights API** 만 선택 → 저장
5. 키 문자열(`AIza...`)을 복사해 둡니다.

## 2. Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
   ```bash
   git init
   git add .
   git commit -m "Lighthouse SEO 검수 앱"
   gh repo create lighthouse-seo-checker --public --source=. --push   # gh CLI 사용 시
   ```
2. https://vercel.com/new 에서 저장소를 Import 합니다. Framework Preset은 **Other** 그대로 두면 됩니다. (Build Command 없음, Output Directory 비움)
3. **Environment Variables** 에 `PSI_API_KEY` = 발급한 키 를 추가합니다.
4. **Deploy**. 배포 후 `https://<프로젝트>.vercel.app` 접속.

> Hobby 플랜 서버리스 함수 최대 실행 시간은 60초로 설정되어 있습니다(`vercel.json`). 매우 느린 사이트는 시간 초과가 날 수 있습니다. Pro 플랜이면 `maxDuration`을 300까지 올릴 수 있습니다.

## 3. 로컬 실행

```bash
npm install
cp .env.example .env        # PSI_API_KEY= 에 키 입력
npm start                   # http://localhost:3000
```

Windows는 `start.bat` 더블클릭으로도 실행됩니다.

내 PC의 Chrome으로 직접 Lighthouse를 돌리고 싶으면(API 키 불필요, 전체 HTML 보고서가 `reports/`에 저장됨):

```bash
npm run dev:local
```

## 사용법

1. 검사할 URL 입력 → 기기(모바일/데스크톱), 카테고리 선택 → **검사 시작**
2. 20초~1분 뒤 결과 표시
3. 항목을 펼치면 **왜 중요한가 / 수정 방법 / 예시 코드 / 해당 요소 표**
4. **체크리스트 복사 (Markdown)** 로 작업 목록 복사, **Lighthouse 전체 보고서 열기**로 PageSpeed Insights 원본 리포트 확인

`/?url=https://example.com&device=desktop` 형태로 접속하면 자동 실행됩니다.

## 구조

```
api/audit.js       Vercel 서버리스 함수 (POST /api/audit) — PSI 호출 + 결과 가공
lib/psi.js         PageSpeed Insights API 호출
lib/shape.js       Lighthouse 결과 → 수정 항목 목록 가공 (공용)
lib/guide.js       감사 ID별 한국어 제목/이유/수정방법/예시 코드 ← 항목 추가는 여기
public/index.html  프론트엔드 (단일 파일)
server.js          로컬 개발 서버 (PSI 또는 로컬 Chrome 엔진)
vercel.json        함수 실행 시간/메모리 설정
```

## API

```
POST /api/audit
{ "url": "https://example.com", "device": "mobile" | "desktop",
  "categories": ["seo", "performance", "accessibility", "best-practices"] }
```

응답 `issues` 에는 실패(score < 0.5), 개선 필요(0.5 ≤ score < 0.9), SEO 수동 확인 항목만 담깁니다. 통과/해당 없음 항목은 제외됩니다.

## 가이드 항목 추가하기

`lib/guide.js` 의 `GUIDE` 객체에 Lighthouse 감사 ID를 키로 추가합니다.

```js
'audit-id': {
  title: '한국어 제목',
  why: '왜 중요한지',
  fix: ['수정 방법 1', '수정 방법 2'],
  code: '<예시 코드>',   // 선택
},
```

가이드가 없는 항목은 Lighthouse 원문(한국어 로케일) 제목과 설명이 그대로 표시됩니다.
