// Lighthouse 감사(audit) ID별 한국어 설명 + 수정 방법
// 여기에 없는 항목은 Lighthouse 원문 설명으로 대체됩니다.

export const CATEGORY_LABEL = {
  seo: 'SEO',
  performance: '성능',
  accessibility: '접근성',
  'best-practices': '권장사항',
};

export const GUIDE = {
  // ───────── SEO ─────────
  'document-title': {
    title: '<title> 태그가 없거나 비어 있음',
    why: '검색 결과의 제목으로 사용되며 페이지 주제를 판단하는 핵심 신호입니다.',
    fix: [
      '<head> 안에 <title>페이지 핵심 키워드 | 브랜드명</title> 형태로 작성하세요.',
      '페이지마다 고유한 제목을 사용하고 50~60자 이내로 유지하세요.',
    ],
    code: '<head>\n  <title>예: 서울 강남 치과 임플란트 비용 안내 | OO치과</title>\n</head>',
  },
  'meta-description': {
    title: '메타 설명(meta description)이 없음',
    why: '검색 결과 스니펫에 표시되어 클릭률(CTR)에 직접 영향을 줍니다.',
    fix: [
      '<head>에 <meta name="description" content="..."> 를 추가하세요.',
      '페이지 내용을 요약한 고유한 문장을 120~155자 정도로 작성하세요.',
    ],
    code: '<meta name="description" content="페이지 내용을 요약한 고유한 설명 문장 (120~155자)">',
  },
  'http-status-code': {
    title: 'HTTP 상태 코드가 정상(2xx)이 아님',
    why: '4xx/5xx 응답 페이지는 검색엔진이 색인하지 않습니다.',
    fix: [
      '서버 응답이 200을 반환하는지 확인하세요.',
      '이동된 페이지라면 301 리다이렉트로 최종 URL을 명확히 하세요.',
    ],
  },
  'link-text': {
    title: '링크 텍스트가 설명적이지 않음',
    why: '"여기를 클릭", "더보기" 같은 링크 텍스트는 링크 대상 페이지의 내용을 검색엔진에 전달하지 못합니다.',
    fix: [
      '링크 텍스트에 대상 페이지의 주제를 담으세요. 예) "더보기" → "임플란트 비용 자세히 보기"',
      '아래 표의 해당 링크들을 하나씩 수정하세요.',
    ],
  },
  'crawlable-anchors': {
    title: '크롤링할 수 없는 링크가 있음',
    why: 'href 없이 onclick만 있는 <a> 또는 href="#", javascript: 링크는 크롤러가 따라갈 수 없습니다.',
    fix: [
      '모든 내부 이동 링크는 <a href="/실제경로"> 형태로 작성하세요.',
      '버튼 동작이면 <a> 대신 <button>을 사용하세요.',
    ],
    code: '<!-- 나쁨 -->\n<a onclick="go(\'/about\')">회사소개</a>\n<!-- 좋음 -->\n<a href="/about">회사소개</a>',
  },
  'is-crawlable': {
    title: '페이지가 색인 생성에서 차단됨',
    why: 'noindex 메타태그 또는 X-Robots-Tag 헤더 때문에 검색 결과에 노출되지 않습니다.',
    fix: [
      '<meta name="robots" content="noindex"> 가 있다면 제거하세요.',
      '서버 응답 헤더 X-Robots-Tag: noindex 설정을 확인하세요.',
      '의도적으로 숨기는 페이지라면 이 항목은 무시해도 됩니다.',
    ],
  },
  'robots-txt': {
    title: 'robots.txt 파일이 유효하지 않음',
    why: '문법 오류가 있으면 크롤러가 사이트 전체 크롤링 규칙을 잘못 해석할 수 있습니다.',
    fix: [
      '/robots.txt 가 200 으로 응답하고 텍스트 형식인지 확인하세요.',
      '오류 줄 번호를 확인하여 지시문(User-agent, Disallow, Allow, Sitemap) 문법을 수정하세요.',
    ],
    code: 'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml',
  },
  'image-alt': {
    title: '이미지에 alt 속성이 없음',
    why: '이미지 검색 노출과 스크린리더 접근성 모두에 필요합니다.',
    fix: [
      '의미 있는 이미지: alt="이미지 내용을 설명하는 문장"',
      '장식용 이미지: alt="" (빈 값)으로 명시하세요.',
    ],
    code: '<img src="implant.jpg" alt="임플란트 시술 전후 비교 사진">',
  },
  hreflang: {
    title: 'hreflang 태그가 유효하지 않음',
    why: '다국어 페이지의 언어/지역 매핑이 잘못되면 잘못된 언어 버전이 노출됩니다.',
    fix: [
      '언어 코드는 ISO 639-1(ko, en), 지역은 ISO 3166-1(KR, US) 형식을 사용하세요.',
      '모든 언어 버전이 서로를 상호 참조(x-default 포함)하도록 하세요.',
    ],
    code: '<link rel="alternate" hreflang="ko" href="https://example.com/ko/">\n<link rel="alternate" hreflang="en" href="https://example.com/en/">\n<link rel="alternate" hreflang="x-default" href="https://example.com/">',
  },
  canonical: {
    title: 'canonical 링크가 유효하지 않음',
    why: '중복 페이지 중 대표 URL을 잘못 지정하면 색인이 분산되거나 엉뚱한 URL이 노출됩니다.',
    fix: [
      '절대 URL(https://...)을 사용하고 페이지당 하나만 선언하세요.',
      '다른 도메인이나 사이트 루트를 가리키고 있지 않은지 확인하세요.',
    ],
    code: '<link rel="canonical" href="https://example.com/current-page/">',
  },
  'structured-data': {
    title: '구조화된 데이터(Schema.org) 검토 필요',
    why: '리치 결과(별점, FAQ, 상품 등) 노출을 위해 필요하며 Lighthouse는 자동 검사하지 않습니다.',
    fix: [
      'Google 리치 결과 테스트(https://search.google.com/test/rich-results)로 검증하세요.',
      'JSON-LD 형식으로 Organization, Article, Product 등 적절한 스키마를 추가하세요.',
    ],
  },
  viewport: {
    title: 'viewport 메타 태그가 없음',
    why: '모바일 친화성 판단의 기본 요소이며 없으면 모바일 검색 순위에 불리합니다.',
    fix: ['<head>에 아래 태그를 추가하세요.'],
    code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
  },
  'font-size': {
    title: '글꼴 크기가 너무 작음',
    why: '모바일에서 12px 미만 텍스트는 가독성이 떨어져 모바일 친화성 점수가 낮아집니다.',
    fix: ['본문 텍스트는 최소 16px, 보조 텍스트도 12px 이상으로 설정하세요.'],
  },
  'tap-targets': {
    title: '터치 대상이 너무 작거나 가까움',
    why: '모바일에서 버튼/링크가 잘못 눌리면 사용성이 떨어집니다.',
    fix: ['버튼과 링크는 최소 48×48px 크기, 주변 8px 이상 간격을 확보하세요.'],
  },

  // ───────── 성능 (SEO에 영향 큰 항목 위주) ─────────
  'largest-contentful-paint': {
    title: 'LCP(최대 콘텐츠 렌더링 시간)가 느림',
    why: 'Core Web Vitals 지표로 검색 순위 신호에 포함됩니다. 목표 2.5초 이하.',
    fix: [
      '히어로 이미지는 <img fetchpriority="high"> 와 preload를 적용하세요.',
      '이미지를 WebP/AVIF로 변환하고 적절한 크기로 제공하세요.',
      '렌더링 차단 CSS/JS를 줄이고 서버 응답 시간(TTFB)을 개선하세요.',
    ],
  },
  'cumulative-layout-shift': {
    title: 'CLS(누적 레이아웃 이동)가 큼',
    why: 'Core Web Vitals 지표입니다. 목표 0.1 이하.',
    fix: [
      '모든 <img>, <video>, iframe에 width/height 속성을 지정하세요.',
      '광고·배너 영역에 미리 고정 높이를 확보하세요.',
      '웹폰트는 font-display: swap 과 preload를 사용하세요.',
    ],
  },
  'total-blocking-time': {
    title: 'TBT(총 차단 시간)가 큼',
    why: 'INP(상호작용 반응성)와 연관되며 사용자 입력이 지연됩니다.',
    fix: ['큰 JS 번들을 코드 분할하고, 사용하지 않는 스크립트를 제거하세요.', '서드파티 스크립트(채팅, 분석)는 defer/async 또는 지연 로드하세요.'],
  },
  'first-contentful-paint': {
    title: 'FCP(첫 콘텐츠 렌더링)가 느림',
    why: '사용자가 화면에 무언가 표시되기까지 기다리는 시간입니다. 목표 1.8초 이하.',
    fix: ['렌더링 차단 리소스를 제거하고 중요 CSS를 인라인하세요.', '서버 응답 시간을 개선하세요.'],
  },
  'speed-index': {
    title: '속도 지수(Speed Index)가 느림',
    why: '화면 콘텐츠가 시각적으로 채워지는 속도입니다.',
    fix: ['위 FCP/LCP 개선 항목을 적용하면 함께 개선됩니다.'],
  },
  'server-response-time': {
    title: '서버 응답 시간(TTFB)이 느림',
    why: '모든 지표의 출발점이며 600ms 이상이면 크롤링 효율도 떨어집니다.',
    fix: ['서버 캐싱(페이지 캐시, CDN)을 적용하세요.', 'DB 쿼리와 백엔드 로직을 최적화하세요.'],
  },
  'render-blocking-resources': {
    title: '렌더링 차단 리소스가 있음',
    why: '<head>의 CSS/JS가 화면 표시를 지연시킵니다.',
    fix: ['JS에는 defer 또는 async를 붙이세요.', '중요 CSS는 인라인하고 나머지는 지연 로드하세요.'],
    code: '<script src="app.js" defer></script>',
  },
  'uses-optimized-images': { title: '이미지 압축이 부족함', why: '불필요하게 큰 이미지가 로딩을 늦춥니다.', fix: ['이미지를 85% 내외 품질로 압축하세요. (Squoosh, TinyPNG 등)'] },
  'modern-image-formats': { title: '차세대 이미지 포맷 미사용', why: 'WebP/AVIF는 JPEG 대비 25~50% 작습니다.', fix: ['<picture> 태그로 WebP/AVIF를 우선 제공하세요.'], code: '<picture>\n  <source srcset="a.avif" type="image/avif">\n  <source srcset="a.webp" type="image/webp">\n  <img src="a.jpg" alt="설명">\n</picture>' },
  'uses-responsive-images': { title: '이미지 크기가 표시 크기보다 큼', why: '모바일에 데스크톱용 대형 이미지를 보내고 있습니다.', fix: ['srcset/sizes 속성으로 화면 크기별 이미지를 제공하세요.'] },
  'offscreen-images': { title: '화면 밖 이미지를 즉시 로드함', why: '보이지 않는 이미지가 초기 로딩 대역폭을 차지합니다.', fix: ['첫 화면 아래 이미지에 loading="lazy"를 추가하세요.'], code: '<img src="..." loading="lazy" alt="...">' },
  'unused-javascript': { title: '사용하지 않는 JavaScript가 많음', why: '불필요한 코드 다운로드·파싱으로 TBT가 증가합니다.', fix: ['코드 분할(dynamic import)과 트리 셰이킹을 적용하세요.', '사용하지 않는 라이브러리/플러그인을 제거하세요.'] },
  'unused-css-rules': { title: '사용하지 않는 CSS가 많음', why: '불필요한 CSS도 렌더링을 차단합니다.', fix: ['PurgeCSS 등으로 미사용 CSS를 제거하세요.'] },
  'unminified-javascript': { title: 'JavaScript가 압축(minify)되지 않음', why: '파일 크기가 커집니다.', fix: ['빌드 시 terser/esbuild로 minify 하세요.'] },
  'unminified-css': { title: 'CSS가 압축(minify)되지 않음', why: '파일 크기가 커집니다.', fix: ['빌드 시 cssnano 등으로 minify 하세요.'] },
  'uses-text-compression': { title: '텍스트 압축(gzip/brotli) 미사용', why: 'HTML/CSS/JS 전송량을 70% 이상 줄일 수 있습니다.', fix: ['서버(Nginx/Apache/CDN)에서 gzip 또는 brotli 압축을 활성화하세요.'] },
  'uses-long-cache-ttl': { title: '정적 자산의 캐시 기간이 짧음', why: '재방문 시 매번 다시 다운로드합니다.', fix: ['이미지/CSS/JS에 Cache-Control: max-age=31536000, immutable 을 설정하세요.'] },
  'font-display': { title: '웹폰트 로딩 중 텍스트가 보이지 않음', why: '폰트 로딩 동안 텍스트가 사라져 FCP가 늦어집니다.', fix: ['@font-face에 font-display: swap 을 추가하세요.'] },
  'third-party-summary': { title: '서드파티 코드의 영향이 큼', why: '외부 스크립트(광고·분석·채팅)가 메인 스레드를 차단합니다.', fix: ['필수가 아닌 서드파티는 제거하거나 사용자 상호작용 후 로드하세요.'] },
  'dom-size': { title: 'DOM 크기가 과도함', why: '노드가 많을수록 스타일 계산·레이아웃 비용이 커집니다.', fix: ['불필요한 래퍼 요소를 줄이고 긴 목록은 가상화/페이지네이션하세요.'] },
  redirects: { title: '여러 번의 리다이렉트가 있음', why: '리다이렉트마다 왕복 시간이 추가되고 크롤링 예산이 낭비됩니다.', fix: ['최종 URL로 바로 연결되도록 링크와 리다이렉트 체인을 정리하세요.'] },
  'uses-rel-preconnect': { title: '중요 외부 출처에 preconnect 미사용', why: '외부 도메인 연결 시간이 추가됩니다.', fix: ['<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 처럼 선언하세요.'] },
  'critical-request-chains': { title: '중요 요청 체인이 김', why: '연쇄적으로 로드되는 리소스가 초기 렌더링을 늦춥니다.', fix: ['체인 길이를 줄이고 중요 리소스는 preload 하세요.'] },
  'legacy-javascript': { title: '구형 브라우저용 JavaScript를 제공함', why: '최신 브라우저에 불필요한 폴리필이 전송됩니다.', fix: ['빌드 타깃을 최신 브라우저로 설정하고 module/nomodule 패턴을 사용하세요.'] },
  'lcp-lazy-loaded': { title: 'LCP 이미지에 lazy loading이 적용됨', why: '가장 중요한 이미지가 오히려 늦게 로드됩니다.', fix: ['첫 화면 히어로 이미지에서 loading="lazy"를 제거하고 fetchpriority="high"를 추가하세요.'] },
  'prioritize-lcp-image': { title: 'LCP 이미지가 미리 로드되지 않음', why: 'LCP 이미지 발견 시점이 늦습니다.', fix: ['<link rel="preload" as="image" href="hero.jpg" fetchpriority="high"> 를 추가하세요.'] },

  // ───────── 성능: Lighthouse 12+ 인사이트 감사 ─────────
  'render-blocking-insight': { title: '렌더링 차단 요청이 있음', why: '첫 화면 표시 전에 반드시 내려받아야 하는 CSS/JS가 FCP·LCP를 늦춥니다.', fix: ['아래 표의 스크립트에 defer/async를 적용하세요.', '첫 화면에 필요한 CSS만 인라인하고 나머지는 media 속성이나 지연 로드로 분리하세요.'], code: '<link rel="stylesheet" href="print.css" media="print">\n<script src="app.js" defer></script>' },
  'cache-insight': { title: '정적 자산의 캐시 수명이 짧음', why: '재방문 시 이미지·CSS·JS를 매번 다시 내려받아 로딩이 느려집니다.', fix: ['아래 표의 리소스에 Cache-Control: max-age=31536000, immutable 헤더를 설정하세요.', '파일명에 해시(app.a1b2c3.js)를 붙여 변경 시 캐시가 갱신되도록 하세요.'] },
  'cls-culprits-insight': { title: '레이아웃 이동(CLS)을 일으키는 요소가 있음', why: '아래 표의 요소가 로딩 중 위치를 바꿔 CLS 점수를 낮춥니다.', fix: ['이미지/광고/iframe에 width·height 또는 aspect-ratio를 지정하세요.', '동적으로 삽입되는 배너 영역은 미리 공간을 확보하세요.', '웹폰트는 preload + font-display: swap 으로 폰트 교체 시 이동을 줄이세요.'] },
  'forced-reflow-insight': { title: '강제 리플로우(레이아웃 재계산)가 발생함', why: 'JS가 스타일을 바꾼 직후 offsetWidth 등 레이아웃 값을 읽으면 브라우저가 레이아웃을 즉시 다시 계산해 메인 스레드가 막힙니다.', fix: ['레이아웃 값 읽기와 스타일 쓰기를 분리해 배치 처리하세요.', 'requestAnimationFrame 안에서 DOM 측정을 하세요.'] },
  'network-dependency-tree-insight': { title: '네트워크 요청 의존 체인이 김', why: '리소스가 연쇄적으로 발견되어 순차 로드되면 LCP가 늦어집니다.', fix: ['체인 깊숙한 곳의 중요 리소스(폰트, 히어로 이미지)는 <link rel="preload">로 먼저 요청하세요.', '외부 도메인에는 preconnect를 선언하세요.'] },
  'document-latency-insight': { title: 'HTML 문서 응답이 느리거나 최적화되지 않음', why: '리다이렉트, 느린 서버 응답, 압축 미적용이 모든 로딩의 출발점을 늦춥니다.', fix: ['아래 검사 항목 중 실패한 것을 확인하세요: 리다이렉트 제거, 서버 응답 600ms 이하, 텍스트 압축(gzip/brotli) 적용.'] },
  'image-delivery-insight': { title: '이미지 전송 최적화 필요', why: '과도한 크기·구형 포맷·미압축 이미지가 대역폭을 낭비합니다.', fix: ['아래 표의 이미지를 WebP/AVIF로 변환하고 표시 크기에 맞게 줄이세요.', 'srcset으로 화면 크기별 이미지를 제공하세요.'] },
  'legacy-javascript-insight': { title: '레거시 JavaScript(불필요한 폴리필) 제공', why: '최신 브라우저에 필요 없는 변환 코드가 전송됩니다.', fix: ['빌드 타깃(browserslist)을 최신 브라우저로 올리세요.', '아래 표의 라이브러리 중 폴리필 번들을 제거하세요.'] },
  'lcp-discovery-insight': { title: 'LCP 이미지가 늦게 발견됨', why: 'LCP 이미지가 CSS 배경이나 JS로 삽입되면 브라우저가 늦게 찾습니다.', fix: ['LCP 이미지는 HTML <img> 태그로 직접 넣고 fetchpriority="high"를 지정하세요.', 'loading="lazy"를 제거하세요.'] },
  'lcp-phases-insight': { title: 'LCP 단계별 지연 분석', why: 'TTFB, 리소스 로드 지연, 로드 시간, 렌더 지연 중 어디가 병목인지 보여줍니다.', fix: ['가장 큰 단계를 우선 개선하세요. TTFB → 서버/CDN, 로드 지연 → preload, 로드 시간 → 이미지 최적화, 렌더 지연 → 차단 JS 제거.'] },
  'font-display-insight': { title: '웹폰트 로딩 중 텍스트가 보이지 않음', why: '폰트 로딩 동안 텍스트가 사라져 FCP가 늦어집니다.', fix: ['@font-face에 font-display: swap 을 추가하세요.'] },
  'dom-size-insight': { title: 'DOM 크기가 과도함', why: '노드가 많을수록 스타일 계산·레이아웃 비용이 커집니다.', fix: ['불필요한 래퍼 요소를 줄이고 긴 목록은 가상화/페이지네이션하세요.'] },
  'third-parties-insight': { title: '서드파티 코드의 영향이 큼', why: '외부 스크립트(광고·분석·채팅)가 메인 스레드를 차단합니다.', fix: ['필수가 아닌 서드파티는 제거하거나 사용자 상호작용 후 로드하세요.'] },
  'duplicated-javascript-insight': { title: '중복된 JavaScript 모듈이 있음', why: '같은 라이브러리가 여러 번들에 포함되어 전송량이 늘어납니다.', fix: ['번들러 설정(splitChunks 등)으로 공통 모듈을 하나로 합치세요.'] },
  'modern-http-insight': { title: 'HTTP/2 이상을 사용하지 않는 요청이 있음', why: 'HTTP/1.1은 동시 요청 수가 제한되어 로딩이 느립니다.', fix: ['서버/CDN에서 HTTP/2 또는 HTTP/3를 활성화하세요.'] },
  'viewport-insight': { title: 'viewport 메타 태그가 없거나 잘못됨', why: '모바일에서 탭 반응이 300ms 지연되고 모바일 친화성이 떨어집니다.', fix: ['<meta name="viewport" content="width=device-width, initial-scale=1"> 를 추가하세요.'] },
  'inp-breakdown-insight': { title: 'INP(상호작용 반응성) 지연', why: '클릭·입력 후 화면 반응까지 200ms를 넘으면 사용자가 느리다고 느낍니다.', fix: ['긴 JS 작업을 잘게 나누고(scheduler.yield, setTimeout), 입력 핸들러를 가볍게 유지하세요.'] },
  interactive: { title: 'TTI(상호작용 가능 시간)가 느림', why: '페이지가 완전히 반응할 때까지 오래 걸립니다.', fix: ['JS 번들 크기를 줄이고 서드파티 스크립트를 지연 로드하세요.'] },
  'max-potential-fid': { title: '최대 첫 입력 지연이 큼', why: '가장 긴 작업 동안 사용자 입력이 처리되지 않습니다.', fix: ['50ms 이상 걸리는 긴 작업을 분할하세요.'] },
  'bootup-time': { title: 'JavaScript 실행 시간이 김', why: 'JS 파싱·컴파일·실행이 메인 스레드를 오래 점유합니다.', fix: ['아래 표의 상위 스크립트를 코드 분할하거나 제거하세요.', '사용하지 않는 라이브러리를 정리하세요.'] },
  'mainthread-work-breakdown': { title: '메인 스레드 작업이 많음', why: '스크립트 평가·스타일 계산·레이아웃이 화면 반응을 막습니다.', fix: ['가장 큰 카테고리(보통 스크립트 평가)를 줄이는 것부터 시작하세요.'] },
  'bf-cache': { title: '뒤로/앞으로 캐시(bfcache)가 차단됨', why: '뒤로가기 시 페이지를 즉시 복원하지 못해 재로딩이 발생합니다.', fix: ['unload 이벤트 리스너를 pagehide로 바꾸세요.', 'Cache-Control: no-store 를 HTML 문서에서 제거하세요.', '아래 표의 실패 이유별로 조치하세요.'] },
  'total-byte-weight': { title: '전체 페이지 용량이 큼', why: '총 전송량이 크면 모바일 환경에서 로딩이 크게 느려집니다.', fix: ['아래 표의 큰 리소스를 압축·분할·지연 로드하세요.', '이미지·동영상 최적화가 가장 효과가 큽니다.'] },
  'unsized-images': { title: '이미지에 width/height가 없음', why: '이미지가 로드되면서 레이아웃이 밀려 CLS가 커집니다.', fix: ['모든 <img>에 원본 비율에 맞는 width, height 속성을 지정하세요.'], code: '<img src="a.jpg" width="800" height="450" alt="설명">' },
  'long-tasks': { title: '긴 메인 스레드 작업이 있음', why: '50ms 이상 작업 동안 입력이 멈춥니다.', fix: ['아래 표의 스크립트 작업을 분할하거나 Web Worker로 옮기세요.'] },
  'non-composited-animations': { title: 'GPU 합성되지 않는 애니메이션', why: 'top/left/width 애니메이션은 매 프레임 레이아웃을 유발합니다.', fix: ['transform, opacity 속성만 애니메이션하세요.'] },
  'layout-shifts': { title: '레이아웃 이동이 발생한 요소', why: '아래 요소가 CLS 점수를 낮춥니다.', fix: ['이미지·광고·폰트에 크기를 미리 지정하세요.'] },
  'largest-contentful-paint-element': { title: 'LCP 요소 정보', why: '가장 큰 콘텐츠 요소가 무엇인지 확인하여 우선 최적화하세요.', fix: ['이미지라면 preload + fetchpriority="high", 텍스트라면 폰트 최적화가 핵심입니다.'] },

  // ───────── 접근성 (SEO 관련 항목) ─────────
  'html-has-lang': { title: '<html> 태그에 lang 속성이 없음', why: '검색엔진과 스크린리더가 페이지 언어를 판단하지 못합니다.', fix: ['<html lang="ko"> 로 지정하세요.'], code: '<html lang="ko">' },
  'html-lang-valid': { title: 'lang 속성 값이 유효하지 않음', why: '잘못된 언어 코드는 무시됩니다.', fix: ['BCP 47 형식(ko, en, ja, zh-CN 등)을 사용하세요.'] },
  'heading-order': { title: '제목 태그 순서가 건너뜀', why: 'h1→h3처럼 단계를 건너뛰면 문서 구조 파악이 어렵습니다.', fix: ['h1 → h2 → h3 순서로 계층을 지키세요. 페이지당 h1은 하나가 좋습니다.'] },
  'link-name': { title: '이름이 없는 링크가 있음', why: '아이콘만 있는 링크는 크롤러와 스크린리더가 목적을 알 수 없습니다.', fix: ['링크 안에 텍스트를 넣거나 aria-label="설명"을 추가하세요.'] },
  'button-name': { title: '이름이 없는 버튼이 있음', why: '아이콘 버튼의 기능을 알 수 없습니다.', fix: ['버튼에 텍스트 또는 aria-label을 추가하세요.'] },
  'color-contrast': { title: '텍스트 색상 대비가 부족함', why: '가독성이 떨어지며 접근성 점수가 낮아집니다.', fix: ['본문 텍스트 대비율 4.5:1 이상(큰 텍스트 3:1)으로 색상을 조정하세요.'] },
  'meta-viewport': { title: 'viewport에서 확대/축소가 금지됨', why: 'user-scalable=no 는 저시력 사용자를 막습니다.', fix: ['maximum-scale, user-scalable=no 를 제거하세요.'] },
  label: { title: '폼 입력에 라벨이 없음', why: '입력창의 용도를 알 수 없습니다.', fix: ['<label for="id"> 또는 aria-label을 연결하세요.'] },

  // ───────── 권장사항 ─────────
  'is-on-https': { title: 'HTTPS를 사용하지 않는 요청이 있음', why: 'HTTPS는 검색 순위 신호이며 혼합 콘텐츠는 브라우저가 차단합니다.', fix: ['모든 리소스 URL을 https:// 로 변경하세요.'] },
  'errors-in-console': { title: '브라우저 콘솔에 오류가 기록됨', why: 'JS 오류는 콘텐츠 렌더링 실패로 이어져 색인에 영향을 줄 수 있습니다.', fix: ['아래 표의 오류 메시지를 확인하고 원인 스크립트를 수정하세요.'] },
  'image-aspect-ratio': { title: '이미지 비율이 왜곡됨', why: 'CSS 크기와 실제 이미지 비율이 달라 찌그러져 보입니다.', fix: ['width/height를 원본 비율에 맞추거나 object-fit을 사용하세요.'] },
  'image-size-responsive': { title: '이미지 해상도가 낮음', why: '고해상도 화면에서 흐릿하게 보입니다.', fix: ['표시 크기의 2배 해상도 이미지를 srcset으로 제공하세요.'] },
  deprecations: { title: '지원 중단된 API를 사용함', why: '향후 브라우저에서 동작하지 않을 수 있습니다.', fix: ['콘솔 경고에 안내된 대체 API로 교체하세요.'] },
  'inspector-issues': { title: 'Chrome DevTools 문제 패널에 이슈가 있음', why: '쿠키, 혼합 콘텐츠, CORS 등의 문제입니다.', fix: ['아래 표의 이슈 유형별로 원인을 수정하세요.'] },
  doctype: { title: '<!DOCTYPE html> 선언이 없음', why: '쿼크 모드로 렌더링되어 레이아웃이 깨질 수 있습니다.', fix: ['문서 첫 줄에 <!DOCTYPE html> 을 추가하세요.'] },
  charset: { title: '문자 인코딩 선언이 없음', why: '한글이 깨질 수 있습니다.', fix: ['<head> 맨 앞에 <meta charset="utf-8"> 을 추가하세요.'], code: '<meta charset="utf-8">' },
  'valid-source-maps': { title: '소스맵이 없거나 유효하지 않음', why: '디버깅 편의 항목이며 SEO 영향은 없습니다.', fix: ['빌드 시 소스맵을 생성하거나 무시해도 됩니다.'] },
  'csp-xss': { title: 'CSP(콘텐츠 보안 정책)가 없음', why: 'XSS 공격 방어 정책이 없습니다. SEO 직접 영향은 없습니다.', fix: ['Content-Security-Policy 헤더를 설정하세요.'] },
};

// 심각도: SEO 카테고리이면 높음, 그 외는 점수/가중치 기반
export function severityOf(categoryId, score, weight) {
  if (score === null || score === undefined) return 'info';
  if (categoryId === 'seo') return score < 0.5 ? 'high' : 'medium';
  if (weight >= 10 && score < 0.5) return 'high';
  if (score < 0.5) return 'medium';
  return 'low';
}
