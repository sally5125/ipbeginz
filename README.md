# Handoff: IPBeginz Web — IP 브랜드 크리에이터 플랫폼 (v.1 프로토타입)

## Overview
IP 홀더 · 브랜드/클라이언트 · 크리에이터가 캠페인으로 권리를 팔고(수익형) 제작 · 홍보를 의뢰하는(지출형) 마켓플레이스 웹 앱의 **고해상도 인터랙티브 프로토타입**입니다. 홈 피드 · 마켓 · 캠페인 만들기(7단계) · 캠페인 상세(지원자 · 섭외 · 검수 · 납품) · 프로젝트 프로필(IP · Brand · Creator) · 인박스(지원 · 섭외 · 계약) · 지갑 · 채팅 · 에이전트 패널까지 한 파일에 들어 있습니다.

## About the Design Files
이 번들의 HTML은 **디자인 레퍼런스**입니다. 의도한 모양과 동작을 보여 주는 프로토타입이고, 그대로 배포하는 코드가 아닙니다. 할 일은 이 화면 · 상태 · 규칙을 **대상 코드베이스의 환경(React/Next · Vue 등)과 패턴으로 다시 구현**하는 것입니다. 아직 코드베이스가 없으면 React + TypeScript(Vite 또는 Next.js)를 권장합니다 — 프로토타입 자체가 React 클래스 컴포넌트 위에서 돌고 있어 상태 모델을 거의 그대로 옮길 수 있습니다.

## Fidelity
**High-fidelity.** 색 · 글자 크기 · 간격 · 모서리 · 상태 배지 · 모달 규격이 모두 확정값입니다(`docs/PROJECT_RULES.md`, `docs/UI 스타일 가이드.dc.html`). 픽셀 단위로 재현하되 코드베이스의 컴포넌트 라이브러리로 구현합니다.

## 프로토타입 실행 방법
빌드 없이 브라우저에서 바로 열립니다.
```
npx serve .          # 또는 python -m http.server
→ http://localhost:3000/IPBeginz%20Web.dc.html
```
- `support.js` = 프로토타입 런타임(템플릿을 React로 렌더). `<x-dc>` 안의 템플릿과 `<script data-dc-script>` 안의 `class Component extends DCLogic`를 읽어 실행합니다.
- `app-data.js` = 모든 목 데이터(전역 상수). 화면 로직은 `PROFILES`, `CAMPAIGNS`, `CAMPAIGN_META`, `APPLICANTS`, `APPLICATIONS`, `OUTREACH`, `CONTRACTS`, `WORLD_COUNTRIES` 등을 `window`에서 읽습니다.
- `franchise-rights.html` = 프랜차이즈 권한 조건 설정 화면(38종 권한). 앱 안에서 iframe으로 임베드됩니다.
- 로그인 화면이 먼저 뜹니다. 아무 값으로 진행하면 됩니다. 현재 화면은 URL 쿼리(`?view=…`)에 저장되어 새로 고침해도 유지됩니다.

## 파일 구조
```
IPBeginz Web.dc.html      메인 앱 — 템플릿(1~10,9xx행) + 로직 클래스(그 아래, ~9,500행)
app-data.js               목 데이터 · 카테고리 · 국가 · 템플릿
franchise-rights.html     프랜차이즈 권한 조건 화면 (iframe)
support.js                프로토타입 런타임 (구현 대상 아님)
assets/                   목 이미지 3종
docs/SPEC.md              ★ 정책 · 필드 · 상태 규칙의 기준 문서. 결정은 전부 여기 있음
docs/CHANGELOG.md         작업 단위별 변경 기록 (최근 결정의 맥락)
docs/PROJECT_RULES.md     디자인 토큰 · 컴포넌트 규칙 · 편집 규칙 (원본 CLAUDE.md)
docs/UI 스타일 가이드.dc.html  색 · 글자 · 버튼 · 배지 · 칩 · 모달 규격 (브라우저로 열기)
docs/IA 정보구조도.dc.html     화면 트리
docs/기획문서.dc.html          발표용 기획 문서 (SPEC을 근거로 작성)
docs/인박스 옵션.dc.html       인박스 목록 구조 대안 3종 (1a 채택 예정)
```

## 메인 파일 읽는 법 (`IPBeginz Web.dc.html`)
- **템플릿**: `<sc-if value="{{ isMarket }}">` 처럼 화면(view)별 블록이 순서대로 놓여 있고, 반복은 `<sc-for list="{{ rows }}" as="r">`, 값은 `{{ r.label }}`. 스타일은 전부 인라인(클래스 없음). `style-hover` 등은 pseudo 상태.
- **로직**: `class Component extends DCLogic`. `state`가 앱 전체 상태(`view`, `rail`, `profileId`, `campaignId`, `campTab`, `workTab`, `nc*`(캠페인 만들기), `c*`(프로필 만들기), `out*`(섭외), `apply*`(지원) …). `renderVals()`가 템플릿에 들어갈 값과 핸들러를 한 객체로 돌려줍니다. 화면 이동은 `resetTo(patch)`(히스토리 push) / `goBack()`.
- **화면 ↔ 상태 키**: `view` 값 — `home` `market` `campaign` `newcampaign` `profile` `create` `hub`(계정) `work`(인박스) `wallet` `chat` `dash` `drafts` `post` `docupload` `promote` `license` `rights` `settings` `plan`.
- **헬퍼**: `terrVals/terrState/terrSummary`(지역 선택기 3모드), `myProfTag`(인박스 「내 프로필」 태그), `outStatusFor`(섭외 상태), `campOwnerType/campKindLabel/ownerChip/ownerBadgeStyle`(카드 배지), `ncPerHead/ncBudget*`(예치금 계산).

## 핵심 도메인 규칙 (요약 — 상세는 docs/SPEC.md)
- **프로필 3종**: IP(권리를 빌려주거나 팜) · Brand/Client(제품 · 서비스 홍보 의뢰) · 크리에이터(작업 시간 · 채널을 팜). 계정 하나에 여러 프로젝트 프로필.
- **캠페인 2방향**: 수익형 EARN(사용권 판매 · IP 판매 · 셀프 프로모션) / 지출형 SPEND(홍보 · PPL · 퀵오더 · 2차 창작 · 어필리에이트). 지출형은 보상 예산 + 수수료 5%를 예치금으로 잡아야 게시.
- **지원 · 요청의 주체**(2026-10-01): 섭외 · 초대 = **캠페인**으로 보냄(캠페인 없으면 불가) / 지원 = **프로필**로 보냄(지원 모달에 「지원 프로필」 필수) / 서비스 주문 = 크리에이터가 **공개한** 셀프 프로모션 캠페인에만.
- **셀프 프로모션 자동 생성**: 크리에이터 프로필 저장 시 비공개 캠페인이 자동 생성(프로필 데이터 그대로). 본인이 「마켓 공개」로 바꾼 뒤에만 마켓 노출.
- **인박스는 계정 중심**: 받은 지원 · 내 지원 · 받은 섭외 · 보낸 섭외 모든 행에 「받은/지원/보낸 프로필」 유형 배지 + 이름. 지금은 캠페인 카드(400px) 4열, 다음 단계에서 **1a 캠페인 묶음 목록**으로 전환 예정(docs/인박스 옵션.dc.html).
- **지역 선택기**: 전 세계 / 선택 국가만 / 전 세계에서 제외 3모드 + 검색 + 대륙별 194개국(`WORLD_COUNTRIES`). 캠페인 · 프랜차이즈 · 프로필 3곳 공통.
- **상태 배지 5계열**: 모집 · 대기(#96681A/#FDF6E9) · 완료 · 확정(#3F8460/#EEF7F1) · 실패 · 거절(#B0405C/#FBEEF0) · 종료 · 취소(#77727E/#F2F0F6). 새 상태는 이 중 하나로.

## Design Tokens
- 브랜드 #6846DB · 딥퍼플 #2A1F4D · 본문 #27252F / #6F6879 / #8D8399 · 테두리 #E8E5ED · 배경 #FAF9FC · 성공 #3F8460 · 경고 #96681A · 위험 #B0405C
- 글꼴 Noto Sans KR(400/500/700/900), 아이콘 Material Symbols Outlined
- 페이지 헤더: 카테고리 11.5px/0.14em/#8265B9 → 제목 25px/700 → 안내 14px/#6F6879
- 카드: 흰 배경 · 1px #E8E5ED · 모서리 16px · 안쪽 22/24px · 카드 간격 14~16px. 마켓 · 인박스 카드는 min-height 400px, 커버 138px
- 모달: 덮개 rgba(28,20,52,.5) · 모서리 20px · 폭 392(확인)/560(입력)/620~760(목록) · 제목 19px · ✕ 32px · 버튼 우측 정렬 보조 → 주요(min-width 82px, 모서리 9~10px)
- 입력: 13px · 모서리 10px · 테두리 #DAD6E1 · 포커스 #9276DC. 라벨 13.5px/700/#3D3748, 필수는 빨간 `*`
- 탭 칩(사각 9px, 선택 #EEE8FA/#6846DB) vs 조건 칩(둥근 999px, 선택 보라 채움)
- 주체 배지(ownerChip): IP #EEE8FA/#4F31B4 · 브랜드 #E5EEF8/#1F5786 · 크리에이터 #FDEEF2/#A33A56
- EARN #E9F4EE/#3F8460 · SPEND #F3EFFC/#5836C4, 이미지 위에는 rgba(63,132,96,.92)/rgba(104,70,219,.92) + 흰 글씨

## 구현 시 권장 분해
1. `app-data.js`의 상수들을 타입(`Profile`, `Campaign`, `CampaignMeta`, `Applicant`, `Application`, `Outreach`, `Contract`)과 목 API로 옮기기
2. `view` 값 하나 = 라우트 하나. 레일(사이드바) 5개: 홈 · 마켓 · 인박스 · 채팅 · 계정
3. 공용 컴포넌트: 캠페인 카드(마켓 · 캠페인 관리 · 인박스 공통), 주체 배지, 상태 배지, 지역 선택기, 모달 셸, 상단 고정 액션 바(만들기 화면 6곳)
4. 캠페인 만들기는 섹션 단위(`data-ncsec` 속성이 섹션 이름)로 분리 — 기본 정보 · 모집 대상 · 지원 · 선정 · 시딩 · 보상 · 보상 방식 · 정산 · 콘텐츠 · 자료 · 최종 확인

## 열려 있는 작업 (다음 단계 — SPEC 미반영)
- 캠페인 만들기 「보상 방식」 아래 **금액 제안 방식 3택**(정액 / 예산 범위 + 제안 / 협의) + 「조건 미달도 지원 받기」 토글. 지출형 공통(IP · 브랜드 무관), 수익형엔 없음
- **지원 가능 판정**: 모집 대상(팔로워 등급 · 채널 · 국가 · 자격)을 지원 프로필의 연결 채널 데이터와 비교해 카드 · 상세 · 지원 모달에 「지원 가능 / 조건 미달 — 이유」 표시. 미달 기본은 차단(버튼 비활성)
- 지원 모달을 제안 방식에 맞춰 분기(정액이면 금액 입력 없음 등)
- 인박스 4목록을 **1a 캠페인 묶음 목록**으로 전환, 보낸 요청 탭은 단순 목록
- 지원자 표 썸네일을 프로필로 되돌리고 공개 캠페인이 있을 때만 「서비스 카드 보기」 보조 링크
- 크리에이터 프로필 저장 → 셀프 프로모션 캠페인 비공개 자동 생성 + 「마켓 공개」 스위치 실제 구현

## 제외한 것
원본 프로젝트의 `uploads/`(붙여 넣은 스크린샷 · 이전 세대 정적 HTML 500여 개) · `screenshots/` · `backup/`은 넣지 않았습니다. 용량의 대부분이 거기였고 현재 설계와 무관합니다.
