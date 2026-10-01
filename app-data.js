/* IPBeginz — 앱 데이터 (화면 로직과 분리)
   화면 로직은 "IPBeginz Web.dc.html" 안에 있습니다.
   여기에는 순수 데이터와 데이터 헬퍼만 둡니다. this / React 사용 금지. */
(function () {
const CREATE_SPEC = [
          { id: 'type', label: '속성 표시', desc: '이 프로필은 무엇을 대표하나요?', fields: [
            { k: 'kind', label: '프로필 속성', req: true, kind: 'cards',
              single: true,
              hint: '프로필 하나에 속성 하나입니다. IP와 Brand / Client로 모두 활동하려면 프로필을 각각 만들어 주세요.',
              cards: [
                { id: 'IP 홀더', title: 'IP 홀더', glyph: 'draw', desc: '콘텐츠/사람/캐릭터등 원천 IP를 등록하고 라이선스를 판매 ·2차 창작' },
                { id: 'Brand / Client', title: 'Brand / Client', glyph: 'storefront', desc: '브랜드 · 광고주 , OTT · 방송사 · 유통사 · 게임 퍼블리셔가. 광고 또는  IP를 구매 ·' },
                { id: '크리에이터', title: '크리에이터', glyph: 'movie', desc: '본인 채널을 연결해  마케팅 캠페인 참여\nIP를 활용 2차 창작' }
              ] }
          ]},
          { id: 'basic', label: '기본 정보', desc: '여기서 입력한 항목만 골라 마켓 카드와 프로필 헤더로 올라갑니다', fields: [
            { k: 'major', label: 'IP 유형 카테고리', req: true, kind: 'major', top: true,
              hint: '이 프로필이 어떤 분야에 속하는지 고릅니다. 왼쪽에서 대분류 하나, 오른쪽에서 소분류를 여러 개 고르며, 마켓 검색 · 추천에 사용됩니다.' },
            { k: 'minor', label: '', req: true, kind: 'hidden' },
            { k: 'names', label: '프로필명', req: true, kind: 'names', top: true, nameLabel: true,
              hint: '거래와 2차 창작 계약서에 표기되는 이름입니다. 국가마다 다르게 불린다면 언어를 추가하세요. 「기본」으로 지정한 이름이 대표 이름이 되고, 마켓에서는 보는 사람의 언어에 맞는 이름을 먼저 보여주며 없으면 기본 이름으로 표시됩니다.' },
            { k: 'blurb', label: 'IP 소개', req: true, kind: 'text', ph: '세계관과 거래 가능한 범위를 한 문장으로' },
            { k: 'cover', label: '프로필 이미지', kind: 'images',
              hint: '프로필 아이콘과 헤더 커버를 올립니다. 커버 자리는 가로형(520×430)이며, 넣지 않으면 딥퍼플 배경으로 비워 둡니다.' },
            { k: 'links', label: '채널 · 링크', kind: 'links', top: true, notFor: ['크리에이터'],
              hint: '주소만 넣으면 방문자가 눌러 이동하는 공개 링크가 됩니다. 「계정 연결」까지 하면 팔로워 · 구독자 · 조회수를 1시간마다 자동 갱신해 프로필에 표시하고, 크리에이터 등급과 캠페인 지원 자격 심사 기준으로 사용합니다.' }
          ]},
          { id: 'rights', label: '권리 증명', only: ['IP 홀더'], desc: '이 IP를 거래할 권한이 있음을 증명합니다', fields: [
            { k: 'holder', label: '권리 보유 형태', req: true, kind: 'cards', top: true, compact: true,
              hint: '직접 만들었거나 양도받아 저작권을 가진 IP라면 「저작권 보유」를, 계약으로 사용권만 확보했다면 라이선스 형태를 고르고 계약서를 증빙으로 올립니다. 형태를 바꾸면 아래 권리 종류는 다시 고릅니다.',
              cards: [
                { id: '저작권 보유', title: '저작권 보유 (원저작자 · 양수)', glyph: 'draw', desc: '내가 만들었거나 양도받아 저작권을 소유합니다. 등록하지 않았어도 창작 · 양도 증빙만 있으면 됩니다.' },
                { id: '독점 라이선스', title: '독점 라이선스', glyph: 'handshake', desc: '원권리자와 계약해 정해진 범위를 독점으로 쓰고 거래할 권한을 확보했습니다.' },
                { id: '비독점 라이선스', title: '비독점 라이선스', glyph: 'share', desc: '계약으로 사용권은 있지만 독점은 아닙니다. 계약이 허용한 권리만 거래합니다.' },
                { id: '위임 · 대리', title: '위임 · 대리', glyph: 'assignment_ind', desc: '에이전시 · 대리인으로서 원권리자를 대신해 거래합니다. 위임장이 필요합니다.' }
              ] },
            { k: 'sublicense', label: '재라이선스(서브라이선스) 허용', req: true, kind: 'choice', holderOnly: ['독점 라이선스', '비독점 라이선스'],
              opts: ['계약서에 허용 조항 있음', '원권리자 동의 후 가능', '허용되지 않음'],
              hint: '사용권만 가진 경우, 남에게 다시 사용권을 팔 수 있는지는 계약에 따릅니다. 「허용되지 않음」이면 IP판매 · 사용권 판매 캠페인을 열 수 없고 퀵오더 · 홍보 · PPL · 콜라보만 가능합니다.' },
            { k: 'mandate', label: '위임 범위', req: true, kind: 'multi', holderOnly: ['위임 · 대리'],
              opts: ['사용권 판매 · 라이선스', 'IP 매매 (저작권 양도)', '홍보 · 제작 의뢰', '계약 체결 대리'],
              hint: '위임장에 적힌 범위만 고릅니다. 원권리자를 대신하는 것이므로 위임장에 있으면 매매 · 사용권 판매도 할 수 있고, 없는 거래 유형은 캠페인에서 열리지 않습니다.' },
            { k: 'scope', label: '보유 권리 종류', req: true, kind: 'multi',
              opts: ['저작권 (원작 · 스토리)', '캐릭터 · 미술 저작권', '상표권', '디자인권', '상품화권', '영상화권', '게임화권', '출판 · 번역권', '음원 · OST', '초상 · 퍼블리시티권'],
              hint: '권리 종류만 고릅니다(역할 · 자산 이름이 아님). 저작권 보유면 모두 고를 수 있고, 라이선스 · 위임이면 계약서 · 위임장에 적힌 권리만 고르세요. 심사에서 서류와 대조합니다.' },
            { k: 'regno', label: '저작권 등록번호', kind: 'text', holderOnly: ['저작권 보유'], ph: '예: C-2024-012345 (등록한 경우에만)',
              hint: '저작권을 소유한 경우에만 해당합니다. 등록번호를 넣으면 심사가 빨라지고, 미등록 창작물은 비워 두고 창작 증빙만 올리면 됩니다.' },
            { k: 'proof', label: '권리 증빙 자료', kind: 'upload', top: true,
              ph: '저작권 등록증 · 계약서 · 위임장 · 창작 증빙 (PDF · 이미지 · ZIP, 최대 20MB)',
              hint: '라이선스 · 위임이면 계약서 · 위임장이 증빙입니다. 저작권 보유는 등록증이 없어도 됩니다. 미등록 창작물은 연재 페이지 주소, 최초 공개 기록, 원본 작업 파일(PSD · AI 등), 초안 · 스케치, 계정 소유 증명 중 하나 이상으로 심사합니다.' },
            { k: 'licensor', label: '원천 IP 권리자 정보', kind: 'text', ph: '예: 달빛 미디어 (주) · 계약 상대방 이름',
              hint: '저작권 보유가 아니면 필수입니다. 서류상 계약 상대방과 일치해야 합니다.' },
            { k: 'dealpreview', label: '거래 조건으로 열리는 항목', kind: 'dealpreview',
              hint: '고른 권리 종류에 따라 기본값이 정해지지만, 항목별 스위치로 직접 열거나 닫을 수 있습니다. 증빙에 없는 권리를 열면 「열림 · 확인」으로 표시되고 심사에서 서류와 대조합니다.' },
            { k: 'territory', label: '거래 가능 지역', req: true, kind: 'territory',
              hint: '이 IP를 거래 · 사용할 수 있는 국가입니다. 몇 나라만 빼려면 「전 세계에서 제외」를 고르고 제외할 국가만 체크하세요 — 「거래 가능 n개국 · 제외 m」으로 요약됩니다.' }
          ]},
          { id: 'pieces', label: '자산 등록', only: ['IP 홀더'], desc: '권리를 보유한 자산을 등록합니다', fields: [
            { k: 'pieces', label: 'IP 자산', req: true, kind: 'assets', top: true,
              hint: '자산 이름과 카테고리(대분류 · 소분류)를 지정하고, 파일을 올리거나 이미 공개된 자산이면 주소만 넣어도 됩니다. 판매 방식 · 피스 · 금액은 프로필 생성 후 「거래 조건」에서 설정합니다.' }
          ]},
          { id: 'brandinfo', label: '사업자 · 제품', only: ['Brand / Client'], desc: '회사와 사업 정보를 등록합니다', fields: [
            { k: 'bizproof', label: '사업자 · 브랜드 증빙', kind: 'upload', ph: '사업자등록증 · 상표 등록증 · 총판 계약서 (PDF · 이미지)',
              top: true, hint: '본인 브랜드가 아니면 판매 · 유통 · 사업화 권한을 증명하는 계약서를 올려 주세요.' },
            { k: 'products', label: '제품 · 서비스', req: true, kind: 'assets', top: true,
              hint: '광고할 제품을 등록합니다. 등록한 제품이 캠페인의 홍보 대상과 카탈로그 항목이 됩니다.' },
            { k: 'bizsite', label: '공식 판매 페이지', kind: 'text', ph: 'https://smartstore.naver.com/…' }
          ]},
          { id: 'creatorinfo', label: '채널 연결', only: ['크리에이터'], desc: '활동 채널을 연결하면 등급이 산정됩니다', fields: [
            { k: 'clinks', label: '활동 채널', kind: 'links', top: true,
              hint: '아직 채널이 없으면 비워 두고 넘어가도 됩니다. 계정 연결까지 하면 팔로워 · 구독자 · 조회수를 1시간마다 불러와 등급과 캠페인 지원 자격에 사용합니다. 연결한 채널이 없으면 「미검증 크리에이터」로 표시됩니다.' },
            { k: 'cmain', label: '주력 콘텐츠', req: true, kind: 'multi',
              opts: ['라이브 커머스', '리뷰 · 언박싱', '숏폼', '브이로그', '게임 방송', '웹툰 · 일러스트', '음악 · 커버'] },
            { k: 'crate', label: '기본 단가', kind: 'text', ph: '예: 숏폼 1건 ₩800,000 · 라이브 1회 ₩1,800,000' }
          ]},
          { id: 'guide', label: '가이드라인', desc: '허용 범위를 명확히 할수록 문의가 줄어듭니다', fields: [
            { k: 'allow', label: '허용 범위', req: true, kind: 'area', ph: '예: SNS 홍보물, 굿즈 제작, 오프라인 팝업 전시' },
            { k: 'deny', label: '금지 사항', req: true, kind: 'area', ph: '예: 정치·종교 콘텐츠, 성인물, 재라이선싱' },
            { k: 'credit', label: '크레딧 표기', kind: 'text', ph: '예: © 달빛서고 / Demon Child' },
            { k: 'refpack', label: '참고 자료 (누구나 열람)', kind: 'upload', top: true,
              ph: '가이드 PDF · 톤앤매너 이미지 · 색상 지정표 (이미지 · PDF · ZIP)',
              hint: '마켓 방문자와 지원 검토 중인 파트너가 볼 수 있는 자료입니다. 원본 소스는 올리지 마세요.' },
            { k: 'deliverpack', label: '거래 성사 후 제공 자료', kind: 'upload', top: true,
              ph: '원본 파일 · 편집 가능 소스 · 폰트 · 로고 원본 (ZIP 권장)',
              hint: '계약이 체결되고 결제가 완료된 상대만 내려받을 수 있습니다. 다운로드 링크는 72시간 · 3회로 만료되고, 파일에는 구매자 식별 워터마크가 삽입되며 열람 · 다운로드 기록이 남습니다.' }
          ]},
          { id: 'review', label: '검토 및 게시', desc: '제출하면 권리 증빙 검수가 시작됩니다', fields: [
            { k: 'checklist', label: '심사 제출 조건', kind: 'checklist',
              items: [
                { k: 'proof', only: ['IP 홀더'], text: '권리 증빙 자료 제출 — 등록증 · 계약서 · 위임장 · 창작 증빙 중 1건' },
                { k: 'holder', only: ['IP 홀더'], text: '권리 보유 형태 선택 — 위임 · 대리는 위임장 필수' },
                { k: 'names', text: '프로필명(기본 언어)과 IP 소개 입력' },

                { k: 'allow', text: '허용 범위 · 금지 사항 작성' },
                { k: 'pieces', only: ['IP 홀더'], text: 'IP 자산 1개 이상 등록' },
                { k: 'bizproof', only: ['Brand / Client'], text: '사업자 · 브랜드 증빙 제출' },
                { k: 'products', only: ['Brand / Client'], text: '제품 · 사업 영역 1개 이상 등록' },
                { k: 'clinks', only: ['크리에이터'], text: '활동 채널 1개 이상 연결' }
              ],
              hint: '심사는 영업일 기준 2~3일 걸립니다. 통과 전에는 프로필이 비공개 상태로 유지되고, 캠페인 개설과 라이선스 판매는 잠깁니다. 보완 요청이 오면 해당 항목만 다시 제출하면 됩니다.' },
            { k: 'visibility', label: '공개 범위', req: true, kind: 'choice', opts: ['전체 공개', '링크 공개', '비공개'] },
            { k: 'note', label: '검수 담당자에게 남길 말', kind: 'area', ph: '증빙 서류 관련 참고 사항이 있다면 적어 주세요' }
          ]}
];

const ACCOUNT = { id: 'account', name: '달빛서고', kind: '내 계정', img: 'assets/demon-child.png' };

const SCOPES = [
  { id: '전체 공개', glyph: 'public', hint: '누구나 볼 수 있고 검색·Showcase에 노출됩니다.' },
  { id: '팔로워', glyph: 'group', hint: '팔로우한 계정에게만 공개됩니다.' },
  { id: '구독자', glyph: 'workspace_premium', hint: '유료 구독 중인 계정에게만 공개됩니다.' },
  { id: '링크 공개', glyph: 'link', hint: '검색에는 노출되지 않고, 주소를 아는 사람만 볼 수 있습니다.' },
  { id: '비공개', glyph: 'lock', hint: '나와 공동 운영자만 볼 수 있습니다.' }
];

const LINK_KINDS = [
  { id: 'campaign', label: '캠페인' }, { id: 'content', label: '콘텐츠' },
  { id: 'ip', label: 'IP 자산' }, { id: 'catalog', label: '카탈로그' }
];

const TRI = "clip-path: polygon(97.8% 70.1%, 80.6% 85.4%, 64.9% 95.3%, 50.5% 100.0%, 37.6% 99.4%, 26.0% 93.4%, 15.9% 82.2%, 7.3% 65.7%, 0.0% 43.9%, 10.1% 81.8%, 5.5% 59.2%, 4.8% 40.6%, 7.9% 25.8%, 14.9% 14.9%, 25.8% 7.9%, 40.6% 4.8%, 59.2% 5.5%, 81.8% 10.1%, 43.9% 0.0%, 65.7% 7.3%, 82.2% 15.9%, 93.4% 26.0%, 99.4% 37.6%, 100.0% 50.5%, 95.3% 64.9%, 85.4% 80.6%, 70.1% 97.8%); ";

const PROFILES = [
  { id: 'demon-child', name: '데몬 차일드', type: 'IP', verified: true, kind: '웹소설 · 캐릭터', img: 'assets/demon-child.png', subs: '1,284', campaigns: 4,
    blurb: '황혼의 성도를 배경으로 한 판타지 웹소설 IP. 캐릭터 5인, 세계관 설정집, 삽화 120컷을 라이선스로 제공합니다.' },
  { id: 'neon-paws', name: '네온 포즈', type: 'IP', verified: true, kind: '애니메이션 · 캐릭터', img: 'assets/neon-paws.png', subs: '742', campaigns: 2,
    blurb: '비 내리는 사이버 도시의 배달 고양이. 숏폼 애니메이션과 굿즈 중심으로 확장 중인 캐릭터 IP입니다.' },
  { id: 'sky-post', name: '스카이 포스트', type: 'IP', verified: false, kind: '게임 · 세계관', img: 'assets/sky-post.png', subs: '318', campaigns: 1,
    blurb: '떠 있는 섬 사이를 오가는 우편 배달 게임 IP. 맵·건축 에셋과 캐릭터 시트를 창작자에게 개방합니다.' },
  { id: 'seo-harin', name: '서하린', type: 'IP', verified: false, kind: '인물 · 배우', person: true, img: 'assets/sky-post.png', subs: '58.2K', campaigns: 0,
    holder: '문라이트 엔터테인먼트', holderRole: '소속사 · 매니지먼트',
    blurb: '드라마 · 광고 중심으로 활동하는 배우. 초상 · 이름 · 목소리 사용 범위를 라이선스로 나누어 엽니다.' },
  { id: 'moonlight-brand', name: '달빛서고 라이선싱', type: '브랜드', kind: '라이선싱 · 판권 관리', img: 'assets/sky-post.png', subs: '2,010', campaigns: 3,
    blurb: 'IP 판권과 상업 이용 계약을 관리하는 브랜드 프로필. 구독 라이선스 승인과 캠페인 조건 협의를 담당합니다.' },
  { id: 'momo', name: '모모', type: '크리에이터', kind: '라이브 커머스 · 숏폼', img: 'assets/neon-paws.png', subs: '96.4K', campaigns: 1,
    blurb: '주 3회 라이브로 캐릭터 굿즈를 판매하는 라이브 홍보 전문 크리에이터. 라이브 회차 평균 시청 8,200명, 실판매 전환 3.4%.' },
  { id: 'loop', name: '루프 스튜디오', type: '크리에이터', kind: '영상 제작 · 모션', img: 'assets/sky-post.png', subs: '12.8K', campaigns: 1,
    blurb: '숏폼·광고 영상 제작 크리에이터. IP 캐릭터 리깅과 모션 그래픽이 주력이며 납품 건수 148건.' },
  { id: 'hanul', name: '하늘리뷰', type: '크리에이터', external: true, kind: '웹툰 · 도서 리뷰 · 숏폼', img: 'assets/demon-child.png', subs: '58.1K', campaigns: 1,
    blurb: '웹툰·웹소설 리뷰 숏폼 크리에이터. 신작 소개 영상 평균 조회 14만, 작품 페이지 클릭 전환 6.1%.' }
];

const PROOFS = {
  momo: [
    { ch: '유튜브 라이브', handle: '@momo_live', followers: '96.4K', n: 96400, metric: '라이브 평균 시청 8,200', eng: '4.8%', verified: true, synced: '2시간 전' },
    { ch: '인스타그램', handle: '@momo.official', followers: '41.2K', n: 41200, metric: '릴스 평균 조회 12.4만', eng: '3.9%', verified: true, synced: '2시간 전' },
    { ch: '네이버 쇼핑라이브', handle: '모모하우스', followers: '—', n: 0, metric: '회차 평균 매출 ₩11.8M', eng: '', verified: false, synced: '직접 입력' }
  ],
  hanul: [
    { ch: '유튜브 쇼츠', handle: '@hanul.review', followers: '58.1K', n: 58100, metric: '숏폼 평균 조회 14.2만', eng: '6.1%', verified: true, synced: '어제' },
    { ch: '인스타그램', handle: '@hanul_review', followers: '22.6K', n: 22600, metric: '릴스 평균 조회 5.8만', eng: '4.4%', verified: true, synced: '어제' }
  ],
  loop: [
    { ch: '유튜브', handle: '@loopstudio', followers: '12.8K', n: 12800, metric: '광고 영상 148건 납품', eng: '2.1%', verified: true, synced: '3일 전' },
    { ch: '비메오 포트폴리오', handle: 'loop.works', followers: '—', n: 0, metric: '평균 제작 기간 12일', eng: '', verified: false, synced: '직접 입력' },
    { ch: '틱톡', handle: '@loop.motion', followers: '8.1K', n: 8100, metric: '숏폼 평균 조회 6.2만', eng: '5.2%', verified: true, synced: '3일 전' }
  ]
};

const CAMPAIGNS = [
  { id: 'dc-affiliate', ipId: 'demon-child', kind: 'affiliate', kindLabel: '어필리에이트', glyph: '↗', status: '모집 중',
    title: '데몬 차일드 3권 예약판매 어필리에이트', reward: '판매액 22%', rewardKind: '판매 수익 배분', slots: '무제한',
    desc: '추적 링크로 발생한 예약판매 매출의 22%를 커미션으로 정산합니다. 링크 유효기간 60일, 쿠키 기준 라스트 클릭.',
    tags: ['판매 수익 배분', '숏폼 · 블로그', '쿠키 60일'],
    terms: [['보상', '판매액 22%'], ['정산 주기', '월 1회 · 익월 15일'], ['어트리뷰션', '라스트 클릭 60일'], ['최소 정산액', '₩30,000']],
    reqs: ['팔로워 수 제한 없음 · 프로필 공개 상태 필수', '게시물에 유료 광고 표기 필수', '원작 텍스트 무단 전재 금지, 공식 이미지 12종만 사용', '전환 어트리뷰션은 라스트 클릭 60일 기준'] },
  { id: 'dc-remix', ipId: 'demon-child', kind: 'remix', kindLabel: '2차 창작 의뢰', glyph: '✦', status: '모집 중',
    title: '데몬 차일드 포스터 · 아크릴 스탠드 제작', reward: '수익 35%', rewardKind: '창작자 수익 배분', slots: '8명',
    desc: '공식 설정집을 기반으로 굿즈용 일러스트를 제작합니다. 채택된 창작물은 IP 숍에 등록되고 판매 수익을 배분합니다.',
    tags: ['굿즈', '일러스트', '숍 등록'],
    terms: [['보상', '판매 수익 35%'], ['제작 기간', '4주'], ['채택 인원', '8명'], ['권리', '공동 저작 · IP 귀속']],
    reqs: ['구독 라이선스 Creator 이상 필요', '원작 캐릭터 비율·색조 가이드 준수', '제출물은 원본 파일(PSD/AI) 포함', '채택 시 숍 등록 및 수익 배분 계약 체결'] },
  { id: 'dc-sub', ipId: 'demon-child', kind: 'license', kindLabel: '구독 라이선스', glyph: '◈', status: '상시',
    title: '설정집 · 삽화 라이브러리 구독', reward: '₩39,000/월', rewardKind: '창작자 구독료', slots: '상시',
    desc: '캐릭터 시트, 배경 설정, 삽화 120컷을 구독으로 사용합니다. 상업적 2차 창작은 Creator 플랜부터 허용됩니다.',
    tags: ['라이선스', '상업 이용', '월 구독'],
    terms: [['가격', '₩39,000/월'], ['상업 이용', 'Creator 이상'], ['해지', '언제든 가능'], ['에셋', '설정집 · 삽화 120컷']],
    reqs: ['계정 프로필 인증 완료', '창작물마다 IP 출처 표기', '플랜 해지 시 신규 제작 중단 · 기존 판매물은 유지', '재라이선싱 및 원본 에셋 재배포 금지'] },
  { id: 'np-affiliate', ipId: 'neon-paws', kind: 'affiliate', kindLabel: '어필리에이트', glyph: '↗', status: '모집 중',
    title: '네온 포즈 굿즈 스토어 파트너', reward: '건당 ₩4,500', rewardKind: 'CPA 정액', slots: '40명',
    desc: '스토어에서 첫 구매가 발생할 때마다 정액 커미션을 지급합니다. 신규 고객 기준, 반품 시 차감됩니다.',
    tags: ['CPA 정액', '굿즈 스토어', '신규 고객'],
    terms: [['보상', '건당 ₩4,500'], ['정산 주기', '주 1회'], ['어트리뷰션', '라스트 클릭 30일'], ['조건', '신규 고객 한정']],
    reqs: ['숏폼 또는 커뮤니티 채널 1개 이상 운영', '반품·취소 건은 커미션에서 차감', '브랜드 키워드 검색광고 입찰 금지', '주간 정산 · 최소 정산액 없음'] },
  { id: 'np-remix', ipId: 'neon-paws', kind: 'remix', kindLabel: '2차 창작 의뢰', glyph: '✦', status: '모집 중',
    title: '네온 포즈 숏폼 애니메이션 6컷', reward: '₩1,200,000', rewardKind: '고정 보수', slots: '3명',
    desc: '15초 숏폼 6편 제작. 고정 제작비 지급 후 광고 성과에 따라 추가 인센티브가 붙습니다.',
    tags: ['숏폼', '애니메이션', '인센티브'],
    terms: [['제작비', '₩1,200,000'], ['인센티브', '조회 10만당 ₩150,000'], ['기간', '5주'], ['채택 인원', '3명']],
    reqs: ['모션 그래픽 포트폴리오 제출', '캐릭터 리깅 가이드 준수', '납품 형식 1080×1920 / ProRes', '2차 활용 범위는 IP 프로필 광고에 한정'] },
  { id: 'sp-affiliate', ipId: 'sky-post', kind: 'affiliate', kindLabel: '어필리에이트', glyph: '↗', status: '모집 중',
    title: '스카이 포스트 얼리액세스 초대 캠페인', reward: '가입 ₩2,000', rewardKind: 'CPA 정액', slots: '무제한',
    desc: '초대 링크를 통한 얼리액세스 가입 1건당 정액 커미션. 7일 이상 활성 유지된 계정만 인정합니다.',
    tags: ['CPA 정액', '게임', '얼리액세스'],
    terms: [['보상', '가입 ₩2,000'], ['조건', '7일 활성 유지'], ['정산 주기', '월 1회'], ['상한', '월 500건']],
    reqs: ['게임 관련 채널 운영 권장', '어뷰징 계정 적발 시 전액 회수', '스토어 리뷰 유도 금지', '월 최대 500건까지 인정'] },
  { id: 'dc-sale', ipId: 'demon-child', kind: 'license', kindLabel: 'IP판매', glyph: '◆', status: '모집 중',
    title: '데몬 차일드 IP 양도 — 저작재산권 전부 이전', reward: '₩480,000,000', rewardKind: '협의 가능', slots: '1건',
    desc: '웹소설 · 캐릭터 IP의 저작재산권을 전부 이전합니다. 판매 페이지 없이 당사자 협의로 이전 절차를 진행하고, 이전이 확인되면 에스크로에서 대금이 지급됩니다.',
    tags: ['저작재산권 전부 이전', '에스크로', '상표 · 디자인 포함'],
    terms: [['희망 금액', '₩480,000,000'], ['이전 범위', '저작재산권 전부'], ['포함 권리', '상표권 · 디자인권 · 캐릭터'], ['대금', '에스크로 예치 후 지급']],
    reqs: ['사업자 또는 법인 구매자 우선', 'NDA 체결 후 자산 목록 열람', '저작인격권은 양도 대상이 아니며 불행사 특약으로 처리', '이전 확인 후 원본 자산 일괄 인도'] },
  { id: 'ml-order', ipId: 'moonlight-brand', kind: 'remix', kindLabel: '퀵오더', glyph: '✦', status: '모집 중',
    title: '신제품 소개 영상 제작 — 30초 광고 1편 + 숏폼 3편', reward: '₩2,400,000', rewardKind: '고정 보수', slots: '2명',
    desc: '신제품 라인 소개 영상을 제작해 주실 팀을 찾습니다. 촬영 없이 제공 소스와 모션 그래픽으로 구성합니다.',
    tags: ['영상 제작', '모션 그래픽', '납기 3주'],
    terms: [['제작비', '₩2,400,000'], ['납기', '3주'], ['수정', '2회 포함'], ['채택 인원', '2명']],
    reqs: ['광고 영상 포트폴리오 제출', '납품 형식 1920×1080 + 1080×1920', '제공 소스 외 유료 소재 사용 시 사전 협의', '저작권은 브랜드 귀속 · 포트폴리오 사용 허용'] },
  { id: 'ml-promo', ipId: 'moonlight-brand', kind: 'affiliate', kindLabel: '홍보(마케팅)', glyph: '↗', status: '모집 중',
    title: '가을 신간 프로모션 — 크리에이터 20명 모집', reward: '기본 ₩250,000 + 판매 7%', rewardKind: '고정 + 성과', slots: '20명',
    desc: '신간 3종을 소개하는 콘텐츠를 올려 주실 크리에이터를 모집합니다. 도서는 무료 제공되고 판매 성과에 따라 커미션이 붙습니다.',
    tags: ['도서 홍보', '숏폼 · 블로그', '성과 커미션'],
    terms: [['기본 보상', '₩250,000'], ['성과 보상', '판매액 7%'], ['기간', '4주'], ['제공', '신간 3종 무료']],
    reqs: ['팔로워 3,000 이상', '콘텐츠 2건 이상 게시', '추적 링크 필수 사용', '광고 표기 의무 준수'] },
  { id: 'ml-ppl', ipId: 'moonlight-brand', kind: 'remix', kindLabel: 'PPL', glyph: '▤', status: '모집 중',
    title: '웹드라마 PPL — 브랜드 서점 공간 노출', reward: '₩5,000,000', rewardKind: '고정 보수', slots: '1편',
    desc: '제작 중인 웹드라마에 브랜드 서점과 신간을 자연스럽게 노출합니다. 대본 협의 후 촬영 지원을 제공합니다.',
    tags: ['PPL', '웹드라마', '공간 협찬'],
    terms: [['협찬비', '₩5,000,000'], ['노출', '3화 이상 · 누적 90초'], ['기간', '촬영 6주'], ['추가', '공간 대여 무료']],
    reqs: ['공개 예정 플랫폼과 회차 계획 제출', '대본 내 노출 장면 사전 협의', '경쟁 브랜드 동시 노출 금지', '공개 후 90일간 다시보기 유지'] },
  { id: 'momo-service', ipId: 'momo', kind: 'service', kindLabel: '셀프 프로모션', glyph: '◉', status: '섭외 가능',
    title: '라이브 커머스 진행 — 굿즈·IP 상품 실판매', reward: '회당 ₩1,800,000', rewardKind: '고정 보수 + 성과 보너스 5%', slots: '월 4회',
    desc: '라이브 커머스 진행을 맡습니다. 대본·시연·댓글 응대까지 포함하고, 판매 성과에 따라 커미션을 함께 받는 조건도 가능합니다.',
    tags: ['라이브 커머스', '굿즈 실판매', '주 3회 방송'],
    terms: [['진행비', '회당 ₩1,800,000'], ['성과 보상', '판매액 5%'], ['가능 일정', '월 4회 · 화·목·토'], ['평균 회차 매출', '₩11.8M']],
    reqs: ['라이브 2시간 진행 · 대본 및 시연 구성 포함', '사전 제품 수령 후 리허설 1회', '판매 링크·쿠폰 세팅은 광고주 제공', '경쟁 브랜드 동시 진행 제한 (방송 전후 7일)'],
    offer: ['라이브 커머스 진행 (2시간)', '숏폼 하이라이트 3편', '댓글·CS 응대', '판매 리포트 제공'] },
  { id: 'loop-service', ipId: 'loop', kind: 'service', kindLabel: '셀프 프로모션', glyph: '◉', status: '섭외 가능',
    title: '광고·숏폼 영상 제작 — IP 캐릭터 모션 전문', reward: '편당 ₩650,000', rewardKind: '제작 단가', slots: '월 6편',
    desc: '기획·촬영·모션 그래픽까지 영상 제작을 맡습니다. IP 캐릭터 리깅 경험이 있어 캐릭터 광고물에 강합니다.',
    tags: ['숏폼 제작', '모션 그래픽', '캐릭터 리깅'],
    terms: [['제작 단가', '편당 ₩650,000'], ['작업 기간', '평균 12일'], ['가능 물량', '월 6편'], ['수정 횟수', '2회 포함']],
    reqs: ['기획안 또는 레퍼런스 1건 전달', '캐릭터 사용 라이선스는 광고주 확보', '납품 형식 1080×1920 / 16:9 동시 제공', '2차 활용 범위는 계약 시 명시'],
    offer: ['기획·콘티 구성', '촬영 또는 소재 편집', '모션 그래픽 · 자막', '플랫폼별 리사이즈 3종'] },
  { id: 'hanul-service', ipId: 'hanul', kind: 'service', kindLabel: '크리에이터', glyph: '◉', status: '섭외 가능',
    title: '웹툰 · 웹소설 신작 리뷰 숏폼 — 작품 페이지로 보내기', reward: '편당 ₩750,000', rewardKind: '고정 보수 + 성과 보너스', slots: '월 8편',
    desc: '신작 웹툰·웹소설을 60초 리뷰 숏폼으로 소개하고 작품 페이지로 보냅니다. 추적 링크 · 프로모 코드를 넣어 열람 · 구매 전환을 함께 봅니다.',
    tags: ['웹툰 리뷰', '숏폼', '작품 페이지 전환'],
    terms: [['제작 단가', '편당 ₩750,000'], ['성과 보상', '전환 건당 ₩300'], ['가능 물량', '월 8편'], ['평균 조회', '14.2만']],
    reqs: ['작품 열람 링크 · 시놉시스 전달', '스포일러 범위 사전 합의', '게시 후 30일 유지', '유료 광고 표기 필수'],
    offer: ['리뷰 숏폼 1편 (60초)', '내 채널 게시 · 30일 유지', '추적 링크 · 코드 삽입', '7일 성과 리포트'] }
];

/* 마켓 필터 확장 메타 — id별. platforms(채널) · tier(팔로워 규모) · rating · reply(응답 속도) · lang · exclusive(독점) · term(사용 기간) */
const CAMPAIGN_EXT = {
  'momo-service': { platforms: ['Instagram', 'YouTube'], tier: '마이크로 (1만~10만)', rating: 4.9, reply: '24시간 내', lang: ['한국어', '일본어'] },
  'hanul-service': { platforms: ['YouTube'], tier: '마이크로 (1만~10만)', rating: 4.8, reply: '24시간 내', lang: ['한국어', '영어'] },
  'loop-service': { platforms: ['YouTube', 'TikTok'], tier: '미드 (10만~50만)', rating: 4.7, reply: '3일 내', lang: ['한국어'] },
  'dc-sub': { exclusive: '비독점', term: '1년', lang: ['한국어', '영어'] },
  'dc-sale': { exclusive: '독점', term: '영구', lang: ['한국어'] },
  'dc-remix': { exclusive: '비독점', term: '6개월', lang: ['한국어', '영어', '일본어'] },
  'dc-affiliate': { platforms: ['Instagram', 'TikTok'], reply: '24시간 내', lang: ['한국어'] },
  'np-affiliate': { platforms: ['Instagram', 'YouTube'], reply: '3일 내', lang: ['한국어', '영어'] },
  'np-remix': { platforms: ['YouTube'], reply: '24시간 내', lang: ['한국어'] },
  'sp-affiliate': { platforms: ['Twitch', 'YouTube'], reply: '3일 내', lang: ['한국어', '영어'] },
  'ml-order': { platforms: ['Instagram'], reply: '1주 내', lang: ['한국어'] },
  'ml-promo': { platforms: ['Instagram', 'TikTok'], reply: '24시간 내', lang: ['한국어', '일본어'] },
  'ml-ppl': { platforms: ['YouTube'], reply: '3일 내', lang: ['한국어'] }
};

/* 마켓 필터용 캠페인 메타 — owner(개설 주체) · industry(산업) · seed(유가/무가) · pay(보상 방식)
   registered: 저작권 등록 / certified: 권리 증빙 인증 / isNew: 신규 / budget: 총 집행 규모(필터 슬라이더용) */
const CAMPAIGN_META = {
  'dc-affiliate': { subType: '홍보(마케팅)', owner: 'IP', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'paid', pay: '성과', registered: true, certified: true, isNew: false, budget: 8000000 },
  'dc-remix': { subType: '퀵오더', owner: 'IP', industry: '유통 · 이커머스 · 리테일', minor: '굿즈 · 머천다이즈', seed: 'paid', pay: '고정 + 성과', registered: true, certified: true, isNew: true, budget: 12000000 },
  'dc-sub': { subType: '사용권 판매', owner: 'IP', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'paid', pay: '고정', registered: true, certified: true, isNew: false, budget: 470000 },
  'np-affiliate': { subType: '홍보(마케팅)', owner: 'IP', industry: '패션', minor: '의류', seed: 'paid', pay: '성과', registered: true, certified: false, isNew: true, budget: 180000 },
  'np-remix': { subType: '퀵오더', owner: 'IP', industry: '게임 · 엔터테인먼트', minor: '영상 · 애니메이션', seed: 'paid', pay: '고정 + 성과', registered: true, certified: true, isNew: false, budget: 3600000 },
  'sp-affiliate': { subType: '홍보(마케팅)', owner: 'IP', industry: '게임 · 엔터테인먼트', minor: '게임 타이틀', seed: 'free', pay: '성과', registered: false, certified: true, isNew: false, budget: 1000000 },
  'dc-sale': { subType: 'IP판매', owner: 'IP', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'paid', pay: '고정', registered: true, certified: true, isNew: true, budget: 480000000 },
  'ml-order': { subType: '퀵오더', owner: '브랜드', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'paid', pay: '고정', registered: false, certified: true, isNew: true, budget: 4800000 },
  'ml-promo': { subType: '홍보(마케팅)', owner: '브랜드', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'free', pay: '고정 + 성과', registered: false, certified: true, isNew: true, budget: 9000000 },
  'ml-ppl': { subType: 'PPL', owner: '브랜드', industry: '게임 · 엔터테인먼트', minor: '웹툰 · 웹소설', seed: 'paid', pay: '고정', registered: false, certified: true, isNew: false, budget: 5000000 },
  'momo-service': { subType: '크리에이터', owner: '크리에이터', industry: '뷰티 · 퍼스널케어', minor: '메이크업', seed: 'paid', pay: '고정 + 성과', registered: false, certified: true, isNew: true, budget: 7200000 },
  'hanul-service': { subType: '크리에이터', owner: '크리에이터', industry: '인물 · 캐릭터', minor: '성우 · 목소리', seed: 'paid', pay: '고정 + 성과', registered: false, certified: true, isNew: true, budget: 6000000 },
  'loop-service': { subType: '크리에이터', owner: '크리에이터', industry: '게임 · 엔터테인먼트', minor: '영상 · 애니메이션', seed: 'paid', pay: '고정', registered: false, certified: true, isNew: false, budget: 3900000 }
};

/* 마켓 필터: 공통 분야(대분류, mInd) — IP · Brand · Creator 모두 같은 목록 */
/* 2026-09-28: 캠페인 만들기의 대카테고리(CAT_MAJOR)와 같은 목록을 쓴다 — 아래 CAT_MAJOR 참조 */
const MKT_FIELDS = ['인물 · 캐릭터', '뷰티 · 퍼스널케어', '식음료', '패션', '디지털 · 가전 · 테크', '게임 · 엔터테인먼트', '라이브', '유통 · 이커머스 · 리테일', '금융 · 보험', '여행 · 레저'];
/* 마켓 필터: 사용분야별 세부(소분류 = 무엇을 하는가) [라벨, 필터키, 매칭값] */
const IP_CATS = [['웹툰', 'mGenre', '웹툰'], ['웹소설', 'mGenre', '웹소설'], ['애니메이션', 'mGenre', '애니메이션'],
  ['게임 · 세계관', 'mGenre', '게임'], ['캐릭터', 'mGenre', '캐릭터'], ['영상 · 드라마', 'mGenre', '영상'],
  ['인물 · 배우 · 모델', 'mGenre', '배우'], ['인물 · 성우 · 목소리', 'mGenre', '성우'], ['인물 · 버추얼 · AI', 'mGenre', '버추얼']];
const BRAND_CATS = [['홍보 의뢰', 'mKind', '홍보(마케팅)'], ['제작 의뢰 · 퀵오더', 'mKind', '퀵오더'],
  ['PPL', 'mKind', 'PPL'], ['콜라보', 'mKind', '콜라보'], ['사용권 신청', 'mKind', '사용권 신청']];
const CREATOR_CATS = [['인플루언서 홍보', 'mGenre', '인플루언서'], ['라이브 방송', 'mGenre', '라이브'],
  ['영상 제작', 'mGenre', '영상'], ['콘텐츠 제작', 'mGenre', '콘텐츠'],
  ['성우 · 목소리', 'mGenre', '성우'], ['모델 · 출연', 'mGenre', '배우']];

/* 마켓에 열린 IP 라이선스 라인 (캠페인 카드와 섞여 한 그리드에 나오는 목록) */
const LICENSE_LINES = [
  { ip: '데몬 차일드', owner: '달빛서고 · 웹소설 · 캐릭터', img: 'assets/demon-child.png', use: '웹툰화', region: '아시아', price: '₩18,000,000', state: '판매 중', ok: true, terms: ['국내 · 아시아', '2년', '부분 독점'] },
  { ip: '데몬 차일드', owner: '달빛서고 · 웹소설 · 캐릭터', img: 'assets/demon-child.png', use: '드라마 · 영상', region: '글로벌', price: '₩48,000,000', state: '판매 중', ok: true, terms: ['글로벌', '3년', '완전 독점'] },
  { ip: '데몬 차일드', owner: '달빛서고 · 웹소설 · 캐릭터', img: 'assets/demon-child.png', use: '게임화', region: '대한민국', price: '₩24,000,000', state: '계약 완료', ok: false, terms: ['국내', '2년', '비독점'] },
  { ip: '네온 포즈', owner: '달빛서고 · 애니메이션 · 캐릭터', img: 'assets/neon-paws.png', use: '굿즈 · 상품화', region: '대한민국', price: '₩3,000,000 +8%', state: '판매 중', ok: true, terms: ['국내', '1년', '러닝 8%'] },
  { ip: '네온 포즈', owner: '달빛서고 · 애니메이션 · 캐릭터', img: 'assets/neon-paws.png', use: '광고 · 콜라보', region: '아시아', price: '₩2,400,000', state: '판매 중', ok: true, terms: ['아시아', '3개월', '비독점'] },
  { ip: '스카이 포스트', owner: '달빛서고 · 게임 · 세계관', img: 'assets/sky-post.png', use: '게임화', region: '글로벌', price: '₩32,000,000', state: '판매 중', ok: true, terms: ['글로벌', '3년', '부분 독점'] },
  { ip: '스카이 포스트', owner: '달빛서고 · 게임 · 세계관', img: 'assets/sky-post.png', use: '굿즈 · 상품화', region: '대한민국', price: '₩2,600,000 +6%', state: '판매 중', ok: true, terms: ['국내', '1년', '러닝 6%'] },
  { ip: '데몬 차일드', owner: '달빛서고 · 웹소설 · 캐릭터', img: 'assets/demon-child.png', use: '광고 · 콜라보', region: '대한민국', price: '₩2,400,000', state: '판매 중', ok: true, terms: ['국내', '3개월', '비독점'] }
];

/* 사용권(2차 라이선스) 용도별 기본 타겟층 — 자동 생성된 IP 라이선스 캠페인에 실립니다 */
const LICENSE_TARGETS = {
  '웹툰화': ['10·20대', '웹툰 · 웹소설 독자', '국내 플랫폼 연재'],
  '드라마 · 영상': ['20·30대', '드라마 · OTT 시청자', '글로벌 배급'],
  '게임화': ['10·20대 남성', '게임 이용자', '모바일 · PC'],
  '굿즈 · 상품화': ['20·30대 여성', '캐릭터 · 굿즈 소비자', '온라인 스토어'],
  '광고 · 콜라보': ['20·30대', '브랜드 캠페인', 'SNS 중심']
};

/* 프로필 인증 정책
   IP: 플랫폼이 저작권자 확인 → 확인 전에는 캠페인을 만들 수는 있으나 게시 불가
   브랜드: 별도 확인 없이 바로 승인
   크리에이터: 소셜 계정 연결로 구독자 · 좋아요 수를 불러와 인증 */
const PROFILE_VERIFY = {
  'IP': { label: '저작권자 확인 중', need: true, note: '권리 증빙(등록증 · 계약서)을 플랫폼이 확인한 뒤 게시가 열립니다.' },
  '브랜드': { label: '자동 승인', need: false, note: '브랜드 프로필은 별도 확인 없이 바로 게시할 수 있습니다.' },
  '크리에이터': { label: '소셜 연결 필요', need: true, note: '소셜 계정을 연결하면 구독자 · 좋아요 수를 불러와 인증됩니다.' }
};

/* 크리에이터 소셜 연결 — 로그인 연결 시 채널명(name) · 핸들 · 프로필 사진 · 구독자 · 좋아요를 계정에서 자동으로 불러옵니다(수정 불가) */
const SOCIAL_LINKS = {
  'momo': [
    { platform: '인스타그램', glyph: 'photo_camera', handle: '@momo.live', name: '모모 라이브', subs: '58.2K', likes: '1.2M', connected: true },
    { platform: '유튜브', glyph: 'smart_display', handle: '@momolive', name: '모모 LIVE', subs: '12.4K', likes: '184K', connected: true },
    { platform: '틱톡', glyph: 'music_note', handle: '', subs: '', likes: '', connected: false }
  ],
  'loop': [
    { platform: '유튜브', glyph: 'smart_display', handle: '@loopstudio', name: '루프 스튜디오', subs: '7.8K', likes: '96K', connected: true },
    { platform: '인스타그램', glyph: 'photo_camera', handle: '', subs: '', likes: '', connected: false }
  ]
};

const PLANS = [
  { name: 'Fan', price: '무료', scope: '설정집 열람 · 비상업 팬아트 허용. 판매 및 광고 활용 불가.' },
  { name: 'Creator', price: '₩39,000/월', scope: '삽화 120컷 사용 · 상업적 2차 창작 허용 · IP 숍 등록 가능. 수익 배분 65:35.' },
  { name: 'Studio', price: '₩290,000/월', scope: '전체 에셋 · 캠페인 개설 권한 · 브랜드 협업 단독 조건 협의. 배분 협의.' }
];

const TERMS = [
  { mark: '✓', color: '#4f9a72', text: '캐릭터 재해석, 굿즈 제작, 숏폼 영상 제작 허용' },
  { mark: '✓', color: '#4f9a72', text: '창작물마다 IP 출처 표기 · 숍 등록 시 자동 삽입' },
  { mark: '✕', color: '#c73c4b', text: '원작 텍스트 전재, 세계관 설정 재판매 금지' },
  { mark: '✕', color: '#c73c4b', text: '정치·도박·성인 카테고리 광고 활용 금지' }
];

const SHOP = [
  { slot: '포스터 목업', name: '황혼의 성도 A2 포스터', maker: '모모 · 2차 창작', price: '₩24,000', split: '35%' },
  { slot: '아크릴 스탠드', name: '데몬 차일드 아크릴', maker: '루프 스튜디오', price: '₩18,000', split: '30%' },
  { slot: '엽서 세트', name: '설정집 엽서 8종', maker: '달빛서고', price: '₩12,000', split: '공식' },
  { slot: '티셔츠', name: '문 앤 스타 티셔츠', maker: '베어랩', price: '₩39,000', split: '25%' }
];

const PARTNERS = [
  { initial: '모', name: '모모', role: '크리에이터 · 숏폼', clicks: '12,480', conv: '312', rate: '2.5%', commission: '₩1,842,000' },
  { initial: '루', name: '루프 스튜디오', role: '2차 창작 · 굿즈', clicks: '6,120', conv: '188', rate: '3.1%', commission: '₩996,400' },
  { initial: '베', name: '베어랩', role: '커뮤니티 · 블로그', clicks: '4,905', conv: '96', rate: '2.0%', commission: '₩512,300' },
  { initial: '하', name: '하늘상점', role: '리셀러', clicks: '2,340', conv: '74', rate: '3.2%', commission: '₩388,900' },
  { initial: '김', name: '김노아', role: '개인 파트너', clicks: '1,208', conv: '21', rate: '1.7%', commission: '₩104,500' }
];

const REPLIES = [
  { key: '업종', text: '뷰티·리빙 업종이면 「네온 포즈」(굿즈 전환율 3.1%)와 「스카이 포스트」(20대 남성 비중 62%)가 맞습니다. 두 IP 모두 Creator 플랜부터 상업 이용이 열립니다.' },
  { key: '채널', text: '숏폼 중심 채널이면 「네온 포즈 숏폼 애니메이션 6컷」(제작비 ₩1,200,000 + 조회 인센티브)과 「굿즈 스토어 파트너」(건당 ₩4,500)를 추천합니다.' },
  { key: '허용', text: '확인했습니다. 캐릭터 재해석·굿즈·숏폼은 Creator 플랜 범위 안입니다. 원작 텍스트 전재와 정치·도박 카테고리 활용은 제외되니 문구는 직접 작성해 주세요.' },
  { key: '@데몬', text: '「데몬 차일드」 자산에서 야경 장면 삽화 14컷을 찾았습니다. 상업 이용 가능 12컷, 팬아트 전용 2컷입니다.' },
  { key: '', text: '해당 조건으로 IP 3건과 캠페인 5건을 찾았습니다. 마켓에서 필터가 적용된 결과를 확인해 보세요.' }
];

const PROFILE_REPLIES = [
  { key: '정리', text: '{P}는 판타지 웹소설 IP입니다. 등록 자산은 설정집 84p · 캐릭터 시트 12장 · 공식 삽화 120컷이고, 상업 이용은 Creator 플랜부터 열립니다. 거래 조건은 매체별로 게임화 ₩1.2억(국내 3년 독점), 웹툰화 ₩4,500만(국내·일본 5년 비독점), 드라마화 ₩3.8억(글로벌 7년 독점)입니다.' },
  { key: '장면', text: '광고에 바로 쓸 수 있는 조각은 세 개입니다. ① 황혼의 성도 야경 씬 — 제품을 씬에 배치하는 PPL, ₩2,400,000 · 6개월. ② 주인공 단독 컷 12종 — 키비주얼·SNS 소재, ₩900,000 · 3개월. ③ 검은 고양이 캐릭터 — 굿즈·광고 사용 가능. 브랜드 톤이 어둡고 서정적이면 ①을 권합니다.' },
  { key: '이용권', text: '구독은 자산을 계속 열어두고 창작하는 방식(Creator 월 ₩39,000, 수익 배분 65:35)이고, 이용권은 특정 씬·컷·매체를 정해진 기간·지역에서만 쓰는 단건 계약입니다. 광고 한 편만 만든다면 조각 이용권이, 굿즈를 계속 낸다면 구독이 유리합니다.' },
  { key: '허용', text: '{P} 기준으로 캐릭터 재해석·굿즈·숏폼은 Creator 플랜 안입니다. 다만 노을·계단·계약의 대가라는 세 축은 유지해야 하고, 원작 텍스트 전재와 정치·도박·성인 카테고리 활용은 제외됩니다. 상업 판매물은 시안 1회 검수가 필요합니다.' },
  { key: '', text: '{P}의 등록 자산과 거래 조건을 기준으로 답변할 수 있습니다. 세계관·캐릭터·조각 이용권·매체별 금액 중 무엇이 궁금하신가요?' }
];

const TEMPLATE_CARDS = [
  { name: '어필리에이트 모집', glyph: '↗', cat: '판매·전환', badge: '자주 씀', hint: '커미션 % 설정', view: 'market', desc: '추적 링크로 판매를 만드는 파트너를 모집합니다. 커미션·어트리뷰션·정산 주기가 채워집니다.' },
  { name: 'CPA 정액 캠페인', glyph: '◎', cat: '판매·전환', badge: '', hint: '건당 보상', view: 'market', desc: '가입·첫 구매 등 행동 1건당 정액을 지급하는 조건으로 시작합니다.' },
  { name: '2차 창작 제작 의뢰', glyph: '✦', cat: '2차 창작', badge: '인기', hint: '수익 배분', view: 'remix', preset: { remixMode: 'commission' }, desc: '굿즈·일러스트·숏폼 제작을 창작자에게 의뢰하고 판매 수익을 배분합니다.' },
  { name: '구독 라이선스 개설', glyph: '◈', cat: '2차 창작', badge: '', hint: '월 구독료', view: 'profile', desc: 'Fan / Creator / Studio 플랜으로 IP 자산을 열고 상업 이용 범위를 정합니다.' },
  { name: '굿즈 숍 판매 파트너', glyph: '▣', cat: '굿즈·숍', badge: '', hint: '리셀러 모집', view: 'market', desc: '창작물과 공식 굿즈를 대신 판매할 리셀러·스토어 파트너를 모집합니다.' },
  { name: '숏폼 시딩 캠페인', glyph: '✧', cat: '홍보·시딩', badge: '', hint: '무상 시딩', view: 'market', desc: '샘플·에셋을 무상 제공하고 숏폼 리뷰 게시를 받는 시딩 캠페인입니다.' },
  { name: '브랜드 협업 제안', glyph: '◧', cat: '홍보·시딩', badge: '', hint: '제안서 첨부', view: 'market', desc: 'IP 소개와 예상 성과를 담아 브랜드·광고주에게 협업을 제안합니다.' },
  { name: '라이브 홍보 셀프 프로모션', glyph: '◉', cat: '크리에이터', badge: '내 홍보', hint: '채널·팔로워 노출', view: 'selfpromo',
    desc: '“내가 라이브로 팔아드립니다”. 활동 채널·팔로워·회차 실적을 카드에 얹어 광고주가 섭외하도록 만듭니다.',
    preset: { spId: 'momo', spService: '라이브 커머스 진행', spPay: '성과', spRate: 1800000, spCap: '월 4회' } },
  { name: '영상 제작 셀프 프로모션', glyph: '▶', cat: '크리에이터', badge: '내 홍보', hint: '편당 단가', view: 'selfpromo',
    desc: '“광고·숏폼 제작을 맡습니다”. 포트폴리오 실적과 편당 단가·가능 물량을 카드로 공개합니다.',
    preset: { spId: 'loop', spService: '광고 영상 제작', spPay: '고정', spRate: 650000, spCap: '월 6편' } },
  { name: '앰배서더 장기 계약', glyph: '◉', cat: '크리에이터', badge: '', hint: '월 고정 보수 + 성과 보너스', view: 'selfpromo',
    desc: '고정 리테이너와 성과 인센티브를 함께 두는 장기 파트너 캠페인.',
    preset: { spId: 'momo', spService: '앰배서더 계약', spPay: '성과', spRate: 3000000, spCap: '주 1회' } },
  { name: '출시·공개 공지', glyph: '▤', cat: '홍보·시딩', badge: '', hint: '피드 게시', view: 'hub', desc: '신작 공개와 예약판매 링크를 함께 알리는 프로필 소식 초안.' }
];

const DASH = {
  '30일': { commission: '₩4.86M', commissionDelta: '+18.2% 전월 대비', partners: '214', partnersDelta: '+18명', works: '86', worksDelta: '+7건', subs: '2,344', subsDelta: '갱신율 91%',
    bars: [['4월', 2.8], ['5월', 3.4], ['6월', 3.1], ['7월', 4.2], ['8월', 4.1], ['9월', 4.9]] },
  '90일': { commission: '₩13.1M', commissionDelta: '+11.4% 전분기 대비', partners: '214', partnersDelta: '+42명', works: '86', worksDelta: '+19건', subs: '2,344', subsDelta: '갱신율 89%',
    bars: [['1월', 2.1], ['3월', 2.6], ['5월', 3.4], ['7월', 4.2], ['8월', 4.1], ['9월', 4.9]] },
  '올해': { commission: '₩31.2M', commissionDelta: '+34.6% 전년 대비', partners: '214', partnersDelta: '+96명', works: '86', worksDelta: '+51건', subs: '2,344', subsDelta: '갱신율 87%',
    bars: [['4월', 2.8], ['5월', 3.4], ['6월', 3.1], ['7월', 4.2], ['8월', 4.1], ['9월', 4.9]] }
};

const RAIL = [
  { id: 'dashboard', label: '대시보드', glyph: 'space_dashboard', title: '대시보드', landing: { view: 'dash' } },
  { id: 'home', label: '홈', glyph: 'home', title: '홈 피드', landing: { view: 'home', homeTab: 'all' } },
  { id: 'market', label: '마켓', glyph: 'explore', title: '마켓', landing: { view: 'market' } },
  { id: 'project', label: '인박스', glyph: 'inbox', title: '인박스', landing: { view: 'work', workTab: 'received' } },
  { id: 'chat', label: '채팅', glyph: 'chat_bubble', title: '채팅', landing: { view: 'chat', chatId: '' } },
  { id: 'my', label: '마이', glyph: 'person', title: '내 계정 프로필', landing: { view: 'hub', accountTab: 'projects' } }
];

const SETTINGS_GROUPS = [
  { id: 'auth', label: '설정 · 인증', desc: '본인 · 사업자 · KYC 인증과 정산 계좌, 결제 수단, 보안을 관리합니다.',
    items: ['identity', 'business', 'kyc', 'payout', 'billing', 'security'] },
  { id: 'env', label: '환경 · 지원', desc: '표시 언어와 지역, 알림 · 개인정보, 도움말과 문의 창구입니다.',
    items: ['locale', 'privacy', 'support'] },
  { id: 'account', label: '계정 관리', desc: '프로필 편집, 플랜, 로그아웃과 회원 탈퇴입니다.',
    items: ['overview', 'leave'] }
];

const SET_STATE = {
  done: { label: '완료', bg: '#e9f4ee', fg: '#3f8460' },
  review: { label: '심사 중', bg: '#fdf3e8', fg: '#96681a' },
  todo: { label: '미등록', bg: '#fbeef0', fg: '#b0405c' },
  warn: { label: '설정 필요', bg: '#fdf3e8', fg: '#96681a' }
};

const SETTINGS_SECTIONS = [
  { id: 'identity', label: '본인 인증', glyph: 'phone_iphone', state: 'done',
    desc: '휴대폰 본인인증 정보입니다. 번호를 바꾸려면 재인증이 필요합니다.',
    rows: [['국가', '대한민국 (+82)'], ['휴대폰', '010-****-4821'], ['인증 수단', '카카오 본인확인'], ['인증일', '2026-08-02']],
    actions: [['번호 변경 · 재인증', true]] },
  { id: 'business', label: '사업자 정보', glyph: 'business_center', state: 'todo',
    desc: '사업자등록증을 제출하면 세금계산서 발행과 사업자 정산이 열립니다. 심사는 영업일 1~2일 걸립니다.',
    fields: [
      ['사업자 등록 국가', '국가를 선택하세요', 'half', ['대한민국', '미국', '일본', '중국', '대만', '싱가포르', '베트남', '인도네시아', '영국', '독일', '프랑스', '캐나다', '호주', '기타 (글로벌)']],
      ['사업자 유형', '유형을 선택하세요', 'half', ['개인사업자', '법인사업자', '해외 법인 (Corporation)', '해외 개인사업자 (Sole proprietor)']],
      ['상호', '예: 달빛서고', 'half'], ['사업자등록번호 · Tax ID', '000-00-00000 / VAT · EIN', 'half'],
      ['대표자명', '예: 김달빛', 'half'], ['개업일', 'YYYY-MM-DD', 'half'],
      ['업태 · 종목', '예: 정보통신업 · 콘텐츠 제작', 'full'],
      ['사업장 주소', '도로명 주소', 'full'],
      ['계산서 수신 이메일', 'billing@example.com', 'full']
    ],
    actions: [['임시 저장', false], ['제출하고 심사 요청', true]] },
  { id: 'kyc', label: 'KYC 인증', glyph: 'verified_user', state: 'todo',
    desc: '신분증과 거주지 증빙을 제출해야 출금이 열립니다. 해외 거주자는 조세조약 서류(W-8BEN 등)를 함께 냅니다.',
    fields: [
      ['영문 이름', 'GILDONG HONG', 'half'], ['생년월일', 'YYYY-MM-DD', 'half'],
      ['거주 국가', '거주 국가를 선택하세요', 'half', ['대한민국', '미국', '일본', '중국', '대만', '싱가포르', '베트남', '인도네시아', '영국', '독일', '프랑스', '캐나다', '호주', '기타 (글로벌)']],
      ['신분증 종류', '신분증을 선택하세요', 'half', ['주민등록증', '운전면허증', '여권', '외국인등록증']],
      ['거주지 주소', '영문 주소 권장', 'full']
    ],
    actions: [['임시 저장', false], ['KYC 제출하기', true]] },
  { id: 'payout', label: '정산 계좌 · 세금', glyph: 'account_balance', state: 'todo',
    desc: '지급 통화와 원천징수율은 거주 국가와 계정 유형에 따라 결정됩니다.',
    fields: [
      ['거주 국가', '거주 국가를 선택하세요', 'half', ['대한민국', '미국', '일본', '중국', '대만', '싱가포르', '베트남', '인도네시아', '영국', '독일', '프랑스', '캐나다', '호주', '기타 (글로벌)']],
      ['계정 유형', '개인 · 사업자', 'half', ['개인', '사업자']],
      ['은행', '예: 국민은행', 'half'], ['계좌번호', '숫자만 입력', 'half'],
      ['예금주', '계좌와 동일한 명의', 'half'], ['최소 출금액', '30,000', 'half']
    ],
    actions: [['임시 저장', false], ['계좌 등록', true]] },
  { id: 'billing', label: '결제 수단 · 플랜', glyph: 'credit_card', state: 'todo',
    desc: '플랜 요금과 루비 · 스타 충전에 쓰이는 결제 수단입니다.',
    fields: [
      ['카드 번호', '0000 0000 0000 0000', 'full'],
      ['유효기간', 'MM/YY', 'half'], ['CVC', '000', 'half'],
      ['카드 명의', '영문 이름', 'half'], ['청구 이메일', 'billing@example.com', 'half']
    ],
    actions: [['카드 등록', true]] },
  { id: 'security', label: '보안', glyph: 'shield_lock', state: 'todo',
    desc: '비밀번호와 2단계 인증, 로그인한 기기를 관리합니다.',
    fields: [
      ['현재 비밀번호', '소셜 로그인만 사용 중이면 비워 두세요', 'full'],
      ['새 비밀번호', '영문 · 숫자 · 기호 8자 이상', 'half'], ['새 비밀번호 확인', '다시 입력', 'half'],
      ['2단계 인증 수단', '인증 앱 · 문자', 'half'], ['백업 이메일', 'backup@example.com', 'half']
    ],
    actions: [['로그인 기기 보기', false], ['보안 설정 저장', true]] },
  { id: 'locale', label: '표시 언어 · 지역', glyph: 'language', state: 'todo',
    desc: '화면과 알림에 사용할 언어, 시간대와 통화 표시를 정합니다. 협업 가능 언어는 프로필 편집에서 설정합니다.',
    fields: [
      ['표시 언어', '한국어 · English · 日本語', 'half'], ['알림 언어', '표시 언어와 동일', 'half'],
      ['시간대', 'KST (UTC+9)', 'half'], ['통화 표시', 'KRW ₩', 'half']
    ],
    actions: [['저장', true]] },
  { id: 'privacy', label: '알림 · 개인정보', glyph: 'notifications', state: 'todo',
    desc: '알림 채널과 개인정보 처리를 관리합니다.',
    fields: [
      ['이메일 알림', '캠페인 · 정산 · 전체 중 선택', 'half'], ['카카오 알림톡', '사용 · 사용 안 함', 'half'],
      ['마케팅 수신', '동의 · 미동의', 'half'], ['데이터 내보내기', '요청 사유 (선택)', 'half']
    ],
    actions: [['데이터 내보내기 요청', false], ['저장', true]] },
  { id: 'overview', label: '계정 개요', glyph: 'badge', state: null,
    desc: '계정 기본 정보와 가입 상태입니다. 공개 정보는 프로필 편집에서, 인증은 설정 · 인증에서 관리합니다.',
    rows: [['계정 이름', '달빛서고'], ['계정 아이디', '@moonlight-archive'], ['계정 유형', '사업자'], ['가입일', '2026-08-02'], ['현재 플랜', 'Creator · 월 결제']],
    actions: [['플랜 변경', false], ['프로필 편집', true]] },
  { id: 'support', label: '도움말 · 문의', glyph: 'help', state: null,
    desc: '이용 가이드와 문의 창구입니다. 캠페인 · 정산 분쟁은 전용 창구로 접수됩니다.',
    rows: [['도움말 센터', 'help.ipbeginz.com'], ['1:1 문의', '영업일 24시간 내 회신'], ['분쟁 · 신고', '캠페인 상세에서 접수'], ['약관 · 정책', '이용약관 · 개인정보처리방침']],
    actions: [['1:1 문의하기', false], ['도움말 열기', true]] },
  { id: 'leave', label: '회원 탈퇴', glyph: 'person_remove', state: null, danger: true,
    desc: '탈퇴하면 계정과 모든 프로젝트 프로필이 비공개로 전환되고 30일 뒤 영구 삭제됩니다. 진행 중인 캠페인과 미정산 금액이 있으면 탈퇴할 수 없습니다.',
    rows: [['진행 중 캠페인', '3건 — 종료 후 탈퇴 가능'], ['미정산 잔액', '₩1,842,000 — 출금 필요'], ['보유 크레딧', '루비 2,480 · 환불 불가'], ['삭제 유예', '탈퇴 후 30일']],
    actions: [['탈퇴 요청', false]] }
];

/* 플랜 정책 (2026-09-18)
   - 캠페인 개설은 유료 구독 전용. Free는 개설 0건 — 탐색 · 지원 · 수주(수행자 쪽)는 영구 무료
   - 동시 진행 캠페인 수는 플랜 한도로 제한 (impact.com · Partnerize식 티어 구조 참조)
   - 예치금은 지출형 캠페인에만 필요 (SPEC 9-1) — 구독과 별개 */
const PLAN_LIMITS = {
  free: { campaigns: 0, profiles: 1, partners: 0, fee: '12%' },
  pro: { campaigns: 3, profiles: 5, partners: 50, fee: '8%' },
  business: { campaigns: 20, profiles: 0, partners: 500, fee: '5%' },
  enterprise: { campaigns: 0, profiles: 0, partners: 0, fee: '협의' }
};

const PLATFORM_PLANS = [
  { id: 'free', name: 'Free', tag: '탐색', monthly: '₩0', yearly: '₩0',
    who: '마켓을 둘러보고 캠페인에 지원해 수주하는 쪽(크리에이터 · 파트너)은 계속 무료입니다.',
    ruby: '월 300 루비 지원',
    features: ['캠페인 개설 불가 — 지원 · 수주만', 'IP 프로필 1개', '마켓 탐색 · 찜 · 지원 무제한', '정산 수수료 12%', 'AI 에이전트 월 300 루비'] },
  { id: 'pro', name: 'Pro', tag: '추천', recommended: true, monthly: '₩39,000', yearly: '₩390,000',
    who: 'IP를 직접 팔고 캠페인을 돌리는 창작자 · 소규모 스튜디오용.',
    ruby: '월 3,000 루비 지원',
    features: ['동시 진행 캠페인 3건', 'IP 프로필 5개', '승인 파트너 50명까지', '정산 수수료 8%', '추적 링크 · 파트너 성과 리포트', 'AI 에이전트 월 3,000 루비'] },
  { id: 'business', name: 'Business', tag: '팀', monthly: '₩149,000', yearly: '₩1,490,000',
    who: '판권 관리와 다수 브랜드 캠페인을 함께 운영하는 팀 · 에이전시용.',
    ruby: '월 12,000 루비 지원',
    features: ['동시 진행 캠페인 20건', 'IP 프로필 무제한', '승인 파트너 500명까지', '정산 수수료 5%', '팀 계정 · 권한 관리', 'API · 정산 데이터 내보내기'] },
  { id: 'enterprise', name: 'Enterprise', tag: '문의', monthly: '별도 견적', yearly: '별도 견적',
    who: '전사 단위 라이선싱 · 대규모 파트너 네트워크를 운영하는 기업용.',
    ruby: '루비 별도 계약',
    features: ['캠페인 · 파트너 무제한', '정산 수수료 협의', '전담 매니저 · 계약서 커스텀', 'SSO · 감사 로그', '전용 SLA'] }
];

const RUBY_PACKS = [
  { id: 'r500', amount: 500, price: '₩5,500', bonus: '' },
  { id: 'r1500', amount: 1500, price: '₩15,000', bonus: '+100 보너스' },
  { id: 'r5000', amount: 5000, price: '₩45,000', bonus: '+600 보너스' },
  { id: 'r12000', amount: 12000, price: '₩99,000', bonus: '+2,000 보너스' }
];

const STAR_PACKS = [
  { id: 's50', amount: 50, price: '₩5,000', bonus: '' },
  { id: 's200', amount: 200, price: '₩20,000', bonus: '+10 보너스' },
  { id: 's1000', amount: 1000, price: '₩98,000', bonus: '+80 보너스' },
  { id: 's5000', amount: 5000, price: '₩470,000', bonus: '+600 보너스' }
];

const NC_KINDS = [
  { label: '어필리에이트', desc: '추적 링크로 판매·전환을 만드는 파트너 모집.', rewards: ['고정', '성과', '고정 + 성과'], value: '22%',
    titlePh: '예: 데몬 차일드 3권 예약판매 어필리에이트' },
  { label: '2차 창작 의뢰', desc: '굿즈·영상·일러스트 제작을 창작자에게 의뢰.', rewards: ['고정', '성과', '고정 + 성과'], value: '35%',
    titlePh: '예: 데몬 차일드 포스터 · 아크릴 스탠드 제작' },
  { label: '구독 라이선스', desc: 'IP 자산을 상시 개방하고 월 구독료를 받습니다.', rewards: ['고정', '성과', '고정 + 성과'], value: '₩39,000',
    titlePh: '예: 설정집 · 삽화 라이브러리 구독' },
  { label: '무가시딩', desc: '자산을 무상 제공하고 게시를 받습니다.', rewards: ['고정', '성과', '고정 + 성과'], value: '보상 없음',
    titlePh: '예: 네온 포즈 팬 창작 시딩' }
];

const JOINED_META = {
  'sp-affiliate': { by: 'momo', state: '진행 중', applied: '2026-09-12', approved: '2026-09-14' },
  'momo-service': { by: 'momo', state: '정산 대기', applied: '2026-08-21', approved: '2026-08-22' }
};

const SAVED_META = {
  'np-remix': { added: '2026-09-05', deadline: '2026-09-28' },
  'loop-service': { added: '2026-08-30', deadline: '2026-10-12' }
};

const MANAGE_SCOPE = {
  'dc-sale': '만든 캠페인',
  'ml-order': '만든 캠페인',
  'ml-promo': '만든 캠페인',
  'ml-ppl': '만든 캠페인',
  'dc-affiliate': '만든 캠페인',
  'dc-remix': '만든 캠페인',
  'dc-sub': '만든 캠페인',
  'np-affiliate': '만든 캠페인',
  'np-remix': '찜 · 팔로우',
  'sp-affiliate': '참여 캠페인',
  'momo-service': '만든 캠페인',
  'loop-service': '만든 캠페인',
  'hanul-service': '찜 · 팔로우' // 하늘리뷰는 외부 크리에이터 — 내가 만든 캠페인이 아님
};

const CAMPAIGN_FLOW = {
  license: 'earn',
  affiliate: 'spend',
  remix: 'spend',
  service: 'earn'
};

const RUBY_COST = { 'Claude Sonnet 4.5': 5, 'Claude Opus 4.6': 15, 'Claude Haiku 4.5': 2 };

const VIEWNAV = {
  wallet: { back: '마이', groups: [
    { title: '지갑', items: [
      { label: '잔액 · 예치금', view: 'wallet', walletTab: 'balance' },
      { label: '충전 · 구매', view: 'wallet', walletTab: 'topup' },
      { label: '주문 · 인보이스', view: 'wallet', walletTab: 'orders' },
      { label: '정산 · 출금', view: 'wallet', walletTab: 'payout' }
    ]}
  ]},
  settings: { back: '마이', groups: [
    { title: '설정', items: [
      { label: '설정 · 인증', view: 'settings', setGroup: 'auth', groupState: true },
      { label: '환경 · 지원', view: 'settings', setGroup: 'env', groupState: true },
      { label: '계정 관리', view: 'settings', setGroup: 'account' }
    ]}
  ]},
  plan: { back: '마이', groups: [
    { title: '요금제', items: [{ label: '요금제 비교', view: 'plan' }] }
  ]},
  create: { always: true, back: '마이', groups: [{ title: '등록 항목', dynamic: 'createsteps', items: [] }] },
  post: { always: true, groups: [
    { title: '소식 등록', items: [
      { label: '글 종류 · 게시 주체', view: 'post', anchor: 'kind' },
      { label: '제목 · 본문', view: 'post', anchor: 'body' },
      { label: '미디어 · 연결', view: 'post', anchor: 'link' }
    ]}
  ]},
  assetupload: { always: true, groups: [
    { title: '콘텐츠 · 자산 등록', items: [
      { label: '파일', view: 'assetupload', anchor: 'file' },
      { label: '유형 · 이름 · 설명', view: 'assetupload', anchor: 'kind' },
      { label: '접근 플랜 · 공개', view: 'assetupload', anchor: 'access' }
    ]}
  ]},
  docupload: { always: true, groups: [
    { title: '등록 항목', items: [
      { label: '자료 종류 · 파일', view: 'docupload', anchor: 'kind' },
      { label: '폴더 이름 · 설명', view: 'docupload', anchor: 'name' },
      { label: '공개 범위 · 사용 조건', view: 'docupload', anchor: 'access' },
      { label: '권리 확인', view: 'docupload', anchor: 'rights' }
    ]}
  ]},
  newcampaign: { always: true, groups: [
    { title: '등록 항목', dynamic: 'campaignsections', items: [] }
  ] }
};

const SUBNAV = {
  dashboard: [
    { title: '대시보드', items: [
      { label: '대시보드 홈', view: 'dash' },
      { label: '어필리에이트 정산', view: 'affiliate' }
    ]},
    { title: '바로가기', items: [
      { label: '캠페인 관리', view: 'hub', tab: 'campaigns' },
      { label: '지갑 · 정산', view: 'wallet', walletTab: 'balance' }
    ]},
    { title: '문서', items: [
      { label: '기획문서', href: '기획문서.dc.html' },
      { label: 'IA 정보구조도', href: 'IA 정보구조도.dc.html' }
    ]}
  ],
  home: [
    { title: '소식', items: [
      { label: '추천', view: 'home', homeTab: 'all' },
      { label: '팔로우', view: 'home', homeTab: 'following' },
      { label: '플랫폼 공식', view: 'home', homeTab: 'official' },
      { label: '광고 중인 소식', view: 'home', homeTab: 'promoted' },
      { label: '내 계정 피드', view: 'hub', tab: 'feed' }
    ]},
    { title: '올리기', items: [
      { label: '소식 · 공지 올리기', view: 'post' },
      { label: '콘텐츠 올리기', view: 'upload' }
    ]}
  ],
  market: [
    { title: '둘러보기', items: [
      { label: '마켓 둘러보기', view: 'market', marketMode: '전체' },
      { label: '찜한 캠페인', view: 'hub', tab: 'campaigns', manageFilter: '찜 · 팔로우' }
    ]},
    { title: '만들기', items: [
      { label: '캠페인 만들기', view: 'newcampaign' },
      { label: '템플릿 고르기', view: 'market', panel: 'template' }
    ]}
  ],
  project: [
    { title: '요청', items: [
      { label: '지원 · 섭외 요청', view: 'work', workTab: 'received', workTabs: ['received', 'applied', 'offers', 'sent'] }
    ]},
    { title: '진행 중', items: [
      { label: '진행 중', view: 'work', workTab: 'active' },
      { label: '계약', view: 'work', workTab: 'contracts' }
    ]},
    { title: '보관', items: [
      { label: '저장함', view: 'work', workTab: 'saved' },
      { label: '구매한 권리', view: 'work', workTab: 'rights' },
      { label: '공유됨', view: 'work', workTab: 'shared' }
    ]}
  ],
  chat: [
    { title: 'AI 에이전트', dynamic: 'aichats', items: [] },
    { title: '다이렉트 메시지', dynamic: 'dmchats', items: [] }
  ],
  my: [
    { title: '내 계정', items: [
      { label: '내 계정 프로필', view: 'hub', tab: 'projects' },
      { label: '프로필 편집', view: 'edit' }
    ]},
    { title: '작성 중', items: [
      { label: '임시 저장', view: 'drafts', draftsBadge: true }
    ]},
    { title: '돈', items: [
      { label: '지갑 · 정산', view: 'wallet', walletTab: 'balance', kindTag: '예치금 ₩1,200,000', plainTag: true },
      { label: '결제 관리', view: 'wallet', walletTab: 'billing', kindTag: '카드 2장', plainTag: true },
      { label: '요금제', view: 'plan', kindTag: 'Creator', plainTag: true }
    ]},
    { title: '설정', items: [
      { label: '설정 · 인증', view: 'settings', setGroup: 'auth', kindTag: 'KYC 미완료', plainTag: true },
      { label: '도움말 · 문의', view: 'settings', setGroup: 'env' }
    ]}
  ],
  settings: [
    { title: '내 프로젝트 프로필', dynamic: 'profiles', items: [] }
  ],
  account: [
    { title: '내 계정', items: [
      { label: '내 계정 프로필', view: 'hub', tab: 'info' },
      { label: '지갑 · 정산', view: 'wallet', walletTab: 'balance' },
      { label: '결제 관리', view: 'wallet', walletTab: 'billing' },
      { label: '요금제', view: 'plan' },
      { label: '계정 설정', view: 'settings', setGroup: 'auth' }
    ]}
  ]
};

const ACCOUNT_TABS = [
  { id: 'projects', label: '프로젝트 프로필' },
  { id: 'campaigns', label: '캠페인 관리' },
  { id: 'info', label: '정보' },
  { id: 'feed', label: '피드' },
  { id: 'content', label: '콘텐츠' },
  { id: 'showcase', label: 'Showcase' }
];

const FEED = [
  { by: 'demon-child', author: '데몬 차일드', img: 'assets/demon-child.png', date: '2026-09-05', kind: '출시·공개', title: '데몬 차일드 3권 예약판매 시작', likes: '412', comments: '38', shares: '96',
    body: '3권 예약판매를 시작합니다. 어필리에이트 파트너는 오늘부터 추적 링크를 발급받을 수 있고, 판매액 22%가 커미션으로 정산됩니다.' },
  { by: 'neon-paws', author: '네온 포즈', img: 'assets/neon-paws.png', date: '2026-08-28', kind: '협업 모집', title: '네온 포즈 숏폼 애니메이션 창작자 3명 모집', likes: '286', comments: '54', shares: '61',
    body: '15초 숏폼 6편을 함께 만들 창작자를 찾습니다. 고정 제작비 ₩1,200,000에 조회 10만당 인센티브가 붙습니다.' },
  { by: 'account', author: '달빛서고', img: 'assets/demon-child.png', date: '2026-08-20', kind: '공지', title: '달빛서고 파트너 정산 주기 변경', likes: '58', comments: '7', shares: '4',
    body: '9월부터 어필리에이트 정산이 월 1회에서 격주로 바뀝니다. 계정에 연결된 모든 프로필에 동일하게 적용됩니다.' },
  { by: 'sky-post', author: '스카이 포스트', img: 'assets/sky-post.png', date: '2026-08-14', kind: '공지', title: '구독 라이선스 약관 개정 안내', likes: '74', comments: '12', shares: '9',
    body: 'Creator 플랜의 상업 이용 범위에 오프라인 팝업 판매가 추가됩니다. 기존 구독자는 자동 적용됩니다.' }
];

const ASSETS = [
  { slot: '설정집 PDF', name: '데몬 차일드 세계관 설정집', meta: 'PDF · 84p · 24MB', plan: 'Creator', downloads: '318', cat: '소설', ipId: 'demon-child' },
  { slot: '캐릭터 시트', name: '주요 캐릭터 5인 시트', meta: 'PNG 12장 · 릴리즈 v3', plan: 'Creator', downloads: '502', cat: '웹툰', ipId: 'demon-child' },
  { slot: '삽화 라이브러리', name: '공식 삽화 120컷', meta: 'PSD 원본 포함', plan: 'Creator', downloads: '1,204', cat: '웹툰', ipId: 'demon-child' },
  { slot: '캐릭터 리깅', name: '네온 포즈 리깅 파일', meta: 'AEP · 모션 가이드', plan: 'Studio', downloads: '86', cat: '웹툰', ipId: 'neon-paws' },
  { slot: '맵 에셋', name: '스카이 포스트 섬 에셋', meta: 'FBX · 텍스처 32종', plan: 'Studio', downloads: '41', cat: '게임', ipId: 'sky-post' },
  { slot: '브랜드 가이드', name: '로고·컬러 사용 규정', meta: 'PDF · 18p', plan: 'Fan', downloads: '907', cat: '소설', ipId: 'moonlight-brand' }
];

/* 프로필별 대표 소개 영상 — 캠페인 상세 「IP 소개」 섹션에 노출 */
const INTRO_VIDEOS = {
  'demon-child': { title: '데몬 차일드 IP 소개 — 황혼의 성도 세계관', dur: '2:14', updated: '2026-08-30', img: 'assets/demon-child.png' },
  'neon-paws': { title: '네온 포즈 캐릭터 소개 릴', dur: '1:08', updated: '2026-08-12', img: 'assets/neon-paws.png' },
  'sky-post': { title: '스카이 포스트 게임 플레이 소개', dur: '3:02', updated: '2026-07-28', img: 'assets/sky-post.png' }
};

/* 임시 저장 — 만들다 멈춘 것 (kind: campaign · profile · post · promo · doc · remix) */
const DRAFTS = [
  { id: 'dr-1', kind: 'campaign', title: '네온 포즈 굿즈 PPL 2차', profile: '네온 포즈', profileId: 'neon-paws', step: '3 / 5 단계 · 조건', saved: '오늘 14:20', img: 'assets/neon-paws.png', resume: { view: 'newcampaign', ncStep: 2, ncProfile: 'neon-paws' } },
  { id: 'dr-2', kind: 'profile', title: '', profile: '', profileId: '', step: '2 / 6 단계 · 기본 정보', saved: '어제 21:05', img: '', resume: { view: 'create', cOpen: 'basic' } },
  { id: 'dr-3', kind: 'post', title: '시즌2 티저 공개 일정', profile: '데몬 차일드', profileId: 'demon-child', step: '본문 작성 중', saved: '9월 27일', img: 'assets/demon-child.png', resume: { view: 'post' } },
  { id: 'dr-4', kind: 'promo', title: '데몬 차일드 3권 예약판매 어필리에이트', profile: '데몬 차일드', profileId: 'demon-child', step: '규격 선택 · 소재 미첨부', saved: '9월 26일', img: 'assets/demon-child.png', resume: { view: 'promote' } },
  { id: 'dr-5', kind: 'doc', title: '스카이 포스트 맵 에셋 v2', profile: '스카이 포스트', profileId: 'sky-post', step: '파일 3개 · 규격 점검 전', saved: '9월 24일', img: 'assets/sky-post.png', resume: { view: 'docupload', duKind: 'source' } }
];

const WORK_TABS = [
  { id: 'received', label: '받은 지원' },
  { id: 'applied', label: '내 지원' },
  { id: 'offers', label: '받은 섭외' },
  { id: 'sent', label: '보낸 섭외' },
  { id: 'active', label: '진행 중' },
  { id: 'contracts', label: '계약' },
  { id: 'saved', label: '저장함' },
  { id: 'rights', label: '구매한 권리' },
  { id: 'shared', label: '공유됨' }
];

/* 계약 6종 — side: 'sell' 내가 판 것 / 'buy' 내가 산 것
   stage: 체결 대기 · 진행 중 · 검수 중 · 정산 대기 · 종료 */
const CONTRACTS = [
  { id: 'ct-1', profileId: '', kind: 'IP 사용권', title: '데몬 차일드 · 웹툰화 사용권', side: 'sell', counterpart: '루프 스튜디오',
    amount: '₩12,000,000', terms: '국내 · 2년 · 독점', period: '2026-08-01 ~ 2028-07-31', stage: '진행 중',
    next: '2차 중도금 ₩4,000,000 지급 예정 (10/15)', doc: '사용권_계약서_루프스튜디오.pdf', img: 'assets/demon-child.png' },
  { id: 'ct-2', profileId: '', kind: '프랜차이즈 독점', title: '네온 포즈 · 굿즈 제조 독점', side: 'sell', counterpart: '베어랩',
    amount: '₩8,000,000 + 러닝 7%', terms: '아시아 · 3년 · 독점 · 최소보장 ₩5,000,000', period: '2026-05-20 ~ 2029-05-19', stage: '진행 중',
    next: '분기 러닝 정산 리포트 대기 (10/31)', doc: '프랜차이즈_독점_베어랩.pdf', img: 'assets/neon-paws.png' },
  { id: 'ct-3', profileId: '', kind: 'IP판매', title: '스카이 포스트 · 저작재산권 전부 양도', side: 'sell', counterpart: '한빛 미디어',
    amount: '₩45,000,000', terms: '매매권 5건 · 운영권 2건 · 인도 자산 6건', period: '2026-09-10 체결', stage: '검수 중',
    next: '구매자 이전 확인 대기 — 확인되면 예치금이 지급됩니다', doc: 'IP판매_양도계약_한빛미디어.pdf', img: 'assets/sky-post.png' },
  { id: 'ct-4', profileId: '', kind: '캠페인 참여', title: '시즌2 홍보 · 크리에이터 12명', side: 'sell', counterpart: '승인 파트너 12명',
    amount: '₩6,300,000 예치', terms: '고정 ₩300,000 + 성과 · 1인 상한 ₩250,000', period: '2026-09-05 ~ 2026-10-05', stage: '진행 중',
    next: '게시물 URL 미제출 3명 — 마감 D-7', doc: '캠페인_표준계약_시즌2홍보.pdf', img: 'assets/demon-child.png' },
  { id: 'ct-5', profileId: '', kind: 'IP 사용권', title: '모닝브루 · 캐릭터 사용권', side: 'buy', counterpart: '모닝브루',
    amount: '월 ₩390,000', terms: '굿즈 · 광고 · 비독점', period: '2026-01-01 ~ 2026-12-31', stage: '진행 중',
    next: '만료 D-104 · 자동 갱신 꺼짐', doc: '사용권_계약서_모닝브루.pdf', img: 'assets/sky-post.png' },
  { id: 'ct-6', profileId: '', kind: '어필리에이트', title: '베어랩 캐릭터 · 커미션 파트너', side: 'buy', counterpart: '베어랩',
    amount: '판매액 18%', terms: '쿠키 60일 · 라스트 클릭', period: '2026-03-14 ~ 2027-03-13', stage: '정산 대기',
    next: '9월 커미션 ₩1,240,000 정산 예정 (10/10)', doc: '어필리에이트_약정_베어랩.pdf', img: 'assets/neon-paws.png' },
  { id: 'ct-7', profileId: '', kind: '공동 운영', title: '네온 포즈 · 공동 운영자 위임', side: 'sell', counterpart: '루프 스튜디오',
    amount: '무상', terms: '프로필 편집 · 캠페인 개설 권한', period: '2026-06-01 ~ 무기한', stage: '진행 중',
    next: '권한 재확인 주기 도달 (12/01)', doc: '권한위임_동의서_루프스튜디오.pdf', img: 'assets/neon-paws.png' },
  { id: 'ct-8', profileId: '', kind: '캠페인 참여', title: '모닝브루 여름 PPL', side: 'buy', counterpart: '모닝브루',
    amount: '₩2,400,000 수령', terms: '노출 3회 · 2차 활용 6개월', period: '2026-06-10 ~ 2026-08-31', stage: '종료',
    next: '정산 완료 · 2차 활용 기한 2027-02-28', doc: 'PPL_계약서_모닝브루.pdf', img: 'assets/sky-post.png' }
];

/* 지원 현황 — dir: 'out' 내가 지원한 것(viaId = 지원에 쓴 내 프로필) / 'in' 내 캠페인에 온 지원(받은 프로필은 campaignId → CAMPAIGNS.ipId) */
const APPLICATIONS = [
  { id: 'ap-1', dir: 'out', viaId: 'momo', campaignId: 'ml-promo', campaign: '가을 신간 프로모션 — 크리에이터 20명 모집', owner: '달빛서고 라이선싱', img: 'assets/sky-post.png',
    reward: '고정 ₩450,000 + 성과', applied: '2026-09-14', status: '검토 중', note: '평균 응답 2일 · 지원자 38명' },
  { id: 'ap-2', dir: 'out', viaId: 'loop', campaignId: 'np-remix', campaign: '네온 포즈 숏폼 애니메이션 6컷', owner: '네온 포즈', img: 'assets/neon-paws.png',
    reward: '수익 배분 30%', applied: '2026-09-08', status: '승인', note: '소재 3건 · 추적 링크 발급됨' },
  { id: 'ap-3', dir: 'out', viaId: 'loop', campaignId: 'ml-order', campaign: '신제품 소개 영상 제작 — 30초 광고 1편 + 숏폼 3편', owner: '달빛서고 라이선싱', img: 'assets/demon-child.png',
    reward: '고정 ₩1,200,000', applied: '2026-08-30', status: '반려', note: '사유 · 포트폴리오 형식 불일치' },
  { id: 'ap-4', dir: 'in', campaignId: 'dc-affiliate', campaign: '데몬 차일드 3권 예약판매 어필리에이트', owner: '데몬 차일드', img: 'assets/demon-child.png',
    reward: '고정 ₩300,000 + 성과', applied: '오늘 4명', status: '승인 대기', pending: 7, note: '대기 7명 · 모집 12/20명 · 마감 D-7' },
  { id: 'ap-5', dir: 'in', campaignId: 'dc-remix', campaign: '데몬 차일드 포스터 · 아크릴 스탠드 제작', owner: '데몬 차일드', img: 'assets/demon-child.png',
    reward: '수익 배분 40%', applied: '이번 주 9명', status: '승인 대기', pending: 3, note: '대기 3명 · 상시 모집 · 승인 28명' },
  { id: 'ap-6', dir: 'in', campaignId: 'np-remix', campaign: '네온 포즈 숏폼 애니메이션 6컷', owner: '네온 포즈', img: 'assets/neon-paws.png',
    reward: '고정 ₩1,200,000', applied: '2026-08-28', status: '선정 완료', note: '3명 선정 · 제작 진행 중' }
];

/* 저장함 — 마켓 카드에서 북마크한 것 */
const SAVED = [
  { id: 'sv-1', kind: '캠페인', badge: 'Promotion', title: '모닝브루 가을 신메뉴 인스타 홍보', owner: '모닝브루', img: 'assets/sky-post.png',
    meta: '고정 ₩400,000 + 성과 · 모집 8/15명', saved: '2026-09-16', note: '마감 D-5' },
  { id: 'sv-2', kind: '사용권', badge: '2nd License', title: '베어랩 캐릭터 · 굿즈 제작 사용권', owner: '베어랩', img: 'assets/neon-paws.png',
    meta: '기준가 ₩3,000,000 + 러닝 5%', saved: '2026-09-12', note: '국내 · 1년 · 비독점' },
  { id: 'sv-3', kind: '캠페인', badge: 'Commission', title: '한빛 미디어 썸네일 디자인 퀵오더', owner: '한빛 미디어', img: 'assets/demon-child.png',
    meta: '고정 ₩600,000 · 납기 10일', saved: '2026-09-09', note: '모집 중' },
  { id: 'sv-4', kind: '사용권', badge: 'Sale', title: '스카이 포스트 · IP 전체 양도', owner: '스카이 포스트', img: 'assets/sky-post.png',
    meta: '희망 ₩45,000,000', saved: '2026-09-02', note: '거래 완료 — 참고용' }
];

const RIGHTS = [
  { ip: '모닝브루', piece: '모닝브루 마스코트 캐릭터 시트', img: 'assets/sky-post.png', type: '캐릭터', plan: 'Creator · 월 구독', scope: '굿즈 · 광고', period: '2026-12-31까지', status: '이용 중' },
  { ip: '베어랩 캐릭터', piece: '베어랩 캐릭터 3종 아트팩', img: 'assets/neon-paws.png', type: '캐릭터', plan: 'Studio · 연 계약', scope: '전 상업 이용', period: '2027-03-14까지', status: '이용 중' },
  { ip: '하늘상점 폰트팩', piece: '하늘상점 서체 6종', img: 'assets/demon-child.png', type: '디자인 · 폰트', plan: '단건 구매', scope: '인쇄물 한정', period: '영구', status: '보유' },
  { ip: '루프 모션 프리셋', piece: '루프 모션 프리셋 24종', img: 'assets/sky-post.png', type: '영상', plan: 'Creator · 월 구독', scope: '영상 편집', period: '2026-09-30까지', status: '만료 예정' }
];

const PLATFORMS = ['네이버 스마트스토어', '쿠팡', '11번가', '카카오 선물하기', '텐바이텐', '무신사', '스팀', '자사몰 (직접 URL)'];

const CAT_MAJOR = ['인물 · 캐릭터', '뷰티 · 퍼스널케어', '식음료', '패션', '디지털 · 가전 · 테크', '게임 · 엔터테인먼트', '라이브', '유통 · 이커머스 · 리테일', '금융 · 보험', '여행 · 레저'];

const TIER_STYLE = {
  '프리미엄': 'background: #e6f3ea; color: #2f7350',
  '골드': 'background: #fbf0d8; color: #9a6a17',
  '블루': 'background: #e4eefb; color: #2f5f96',
  '레드': 'background: #fbe4e6; color: #a83a45'
};

const APPLICANTS = [
  { id: 'a1', profileId: 'momo', channels: 'TikTok · Instagram', tier: '프리미엄', name: '오로지', handle: '@oroji', views: 249402, likes: 14329, comments: 91, followers: 39202, category: '애니 · 만화', rate: 600000, img: 'assets/neon-paws.png' },
  { id: 'a0', profileId: 'hanul', channels: 'YouTube Shorts · Instagram', tier: '골드', name: '하늘리뷰', handle: '@hanul.review', views: 142000, likes: 9820, comments: 412, followers: 58100, category: '웹툰 · 도서', rate: 750000, img: 'assets/demon-child.png' },
  { id: 'a2', profileId: 'loop', channels: 'YouTube · Shorts', tier: '프리미엄', name: '릴스몬', handle: '@reelsmon', views: 170373, likes: 1458, comments: 1607, followers: 39693, category: 'AI · 영상', rate: 2200000, img: 'assets/sky-post.png' },
  { id: 'a3', profileId: 'momo', channels: 'Instagram', tier: '프리미엄', name: '피치프롬프트', handle: '@peachprompt', views: 235080, likes: 4939, comments: 70, followers: 18242, category: 'AI · 애니', rate: 1100000, img: 'assets/demon-child.png' },
  { id: 'a4', profileId: 'loop', channels: 'TikTok', tier: '골드', name: '뉴피디', handle: '@newpd', views: 72507, likes: 777, comments: 143, followers: 35392, category: 'AI · 사진 · 영상', rate: 900000, img: 'assets/neon-paws.png' },
  { id: 'a5', profileId: 'momo', channels: 'Instagram', tier: '골드', name: '룩백노트', handle: '@lookbacknote', views: 96897, likes: 4588, comments: 24, followers: 3043, category: '애니 · 만화', rate: 500000, img: 'assets/sky-post.png' },
  { id: 'a6', profileId: 'loop', channels: 'YouTube · TikTok', tier: '골드', name: '최피티', handle: '@choipt', views: 42417, likes: 446, comments: 616, followers: 20613, category: 'AI 가이드', rate: 700000, img: 'assets/demon-child.png' },
  { id: 'a7', profileId: 'momo', channels: 'Instagram', tier: '레드', name: '제이시', handle: '@jaysee', views: 2867, likes: 17, comments: 85, followers: 2317, category: 'AI 화보 · 영상', rate: 350000, img: 'assets/neon-paws.png' },
  { id: 'a8', profileId: 'loop', channels: 'YouTube', tier: '프리미엄', name: '난쟁이성현', handle: '@sunghyun', views: 175921, likes: 6295, comments: 93, followers: 72888, category: '애니 · 드라마', rate: 1200000, img: 'assets/sky-post.png' },
  { id: 'a9', profileId: 'momo', channels: 'TikTok · Instagram', tier: '골드', name: '쿠키퀸', handle: '@cookiequeen', views: 48613, likes: 4861, comments: 47, followers: 5253, category: '웹툰 · 웹소설', rate: 500000, img: 'assets/demon-child.png' },
  { id: 'a10', profileId: 'loop', channels: 'YouTube', tier: '골드', name: '먹콩', handle: '@meokkong', views: 44183, likes: 1211, comments: 39, followers: 26169, category: '애니 · 굿즈', rate: 600000, img: 'assets/neon-paws.png' }
];

// 크리에이터 공개 프로필 요약 (시청자 국가 · 완료 건수 · 평점). 인사이트(연령 · 성별)는 성사 뒤 열람
// 크리에이터 재능 · 전문 분야와 대표 작업(포트폴리오). 캠페인 만들기 05에서 입력한 값의 예시
const CREATOR_SKILLS = {
  momo: { fields: ['라이브', '인플루언서'], content: ['라이브커머스 진행', '라이브 중 PPL 노출', '제품 협찬 게시', '공동 구매'], cats: ['캐릭터 굿즈', '뷰티', '리빙'] },
  hanul: { fields: ['홍보', '인플루언서'], content: ['숏폼 리뷰', 'SNS 게시', '제품 협찬 게시'], cats: ['웹툰 · 웹소설', '도서', '게임'] },
  loop: { fields: ['제작'], content: ['영상 제작', '영상 편집', '숏툰 · 애니', '번역 · 자막'], cats: ['캐릭터 IP', '광고', '게임'] }
};
const CREATOR_PORTFOLIO = {
  momo: [
    { label: '네온포우즈 굿즈 라이브 — 회차 매출 ₩14.2M', url: 'youtube.com/live/momo-neonpaws', img: 'assets/neon-paws.png', kind: '라이브', when: '2026.08' },
    { label: '데몬 차일드 3권 예약판매 라이브', url: 'shoppinglive.naver.com/momo/dc3', img: 'assets/demon-child.png', kind: '라이브', when: '2026.07' },
    { label: '뷰티 브랜드 S 공동 구매 — 전환 4.1%', url: 'instagram.com/reel/momo-s', img: 'assets/sky-post.png', kind: '숏폼', when: '2026.06' }
  ],
  hanul: [
    { label: '「마왕의 아이로 살아남는 법」 신작 리뷰 — 조회 21만', url: 'youtube.com/shorts/hanul-demon', img: 'assets/demon-child.png', kind: '숏폼', when: '2026.08' },
    { label: '여름 웹툰 추천 5선 — 작품 페이지 클릭 6.8%', url: 'youtube.com/shorts/hanul-summer', img: 'assets/sky-post.png', kind: '숏폼', when: '2026.07' },
    { label: '네온포우즈 굿즈 언박싱', url: 'instagram.com/reel/hanul-neon', img: 'assets/neon-paws.png', kind: '릴스', when: '2026.05' }
  ],
  loop: [
    { label: '네온포우즈 캐릭터 광고 30초 — 리깅 · 모션', url: 'vimeo.com/loop/neonpaws', img: 'assets/neon-paws.png', kind: '광고 영상', when: '2026.08' },
    { label: '데몬 차일드 티저 15초', url: 'vimeo.com/loop/dc-teaser', img: 'assets/demon-child.png', kind: '티저', when: '2026.06' }
  ]
};

const CREATOR_STATS = {
  momo: { countries: ['대한민국 91%', '일본 4%', '미국 2%'], done: 37, rating: '4.9', onTime: '97%', reply: '2시간 내' },
  hanul: { countries: ['대한민국 88%', '미국 5%', '일본 3%'], done: 21, rating: '4.8', onTime: '100%', reply: '5시간 내' },
  loop: { countries: ['대한민국 76%', '미국 11%', '일본 6%'], done: 148, rating: '4.9', onTime: '94%', reply: '1일 내' }
};

// 크리에이터 서비스 가격표 (마켓 카드 · 서비스 주문용). 프로필 id 기준
const CREATOR_SERVICES = {
  momo: [
    { id: 'ms1', title: '라이브 커머스 진행 (2시간)', mode: '라이브 진행', format: '라이브 · 라이브커머스', pricing: 'tiers',
      tiers: [{ name: '기본', desc: '진행 · 시연 · 댓글 응대', qty: '1', len: '120', days: '7', price: '1,800,000' },
              { name: '표준', desc: '기본 + 하이라이트 숏폼 3편', qty: '1', len: '120', days: '7', price: '2,400,000' },
              { name: '프리미엄', desc: '표준 + 사전 예고 게시 2회 + 판매 리포트', qty: '1', len: '120', days: '10', price: '3,100,000' }],
      comm: '5', ex: { rush: { on: true, val: '30', days: '3' }, excl: { on: true, val: '20', sel: '30일 동종업계 독점' }, more: { on: true, val: '1,500,000' } } },
    { id: 'ms2', title: '숏폼 리뷰 1편 · 내 채널 게시', mode: '제작 + 내 SNS 게시', format: '숏폼 · 릴스 · 쇼츠', pricing: 'single',
      tiers: [{ name: '', desc: '', qty: '1', len: '45', days: '7', rev: '1', keep: '30', price: '900,000' }],
      comm: '', ex: { use: { on: true, val: '30', sel: '브랜드 리포스트 30일' }, raw: { on: true, val: '300,000' } } }
  ],
  hanul: [
    { id: 'hs1', title: '신작 리뷰 숏폼 1편 · 내 채널 게시', mode: '제작 + 내 SNS 게시', format: '숏폼 · 릴스 · 쇼츠', pricing: 'tiers',
      tiers: [{ name: '기본', desc: '리뷰 60초 · 추적 링크', qty: '1', len: '60', days: '7', rev: '1', keep: '30', price: '750,000' },
              { name: '표준', desc: '기본 + 커뮤니티 게시 1회 + 코멘트 고정', qty: '1', len: '60', days: '7', rev: '2', keep: '30', price: '980,000' },
              { name: '프리미엄', desc: '표준 + 인스타 릴스 동시 게시 + 리포트', qty: '1', len: '60', days: '10', rev: '2', keep: '60', price: '1,350,000' }],
      comm: '', ex: { rush: { on: true, val: '25', days: '3' }, use: { on: true, val: '30', sel: '브랜드 리포스트 30일' }, more: { on: true, val: '650,000' } } },
    { id: 'hs2', title: '작품 소개 라이브 (60분)', mode: '라이브 진행', format: '라이브', pricing: 'single',
      tiers: [{ name: '', desc: '', qty: '1', len: '60', days: '7', price: '1,200,000' }],
      comm: '3', ex: { excl: { on: true, val: '20', sel: '14일 동종 작품 독점' } } }
  ],
  loop: [
    { id: 'ls1', title: '광고 · 숏폼 영상 제작', mode: '제작 · 납품만', format: '숏폼 · 릴스 · 쇼츠', pricing: 'tiers',
      tiers: [{ name: '기본', desc: '편집 · 자막', qty: '1', len: '30', days: '7', rev: '1', price: '650,000' },
              { name: '표준', desc: '기획 · 촬영 · 모션', qty: '1', len: '45', days: '12', rev: '2', price: '1,200,000' },
              { name: '프리미엄', desc: '캐릭터 리깅 + 3종 리사이즈', qty: '1', len: '60', days: '14', rev: '3', price: '2,000,000' }],
      comm: '', ex: { rush: { on: true, val: '30', days: '4' }, rev: { on: true, val: '150,000' }, raw: { on: true, val: '400,000' }, use: { on: true, val: '30', sel: '유료 광고 전환 90일' } } }
  ]
};

// 내가 크리에이터에게 먼저 보낸 섭외 제안(campaignId = 섭외가 걸린 캠페인. 받은 쪽 인박스에서는 이 캠페인 카드로 보인다) — 초기 데이터는 모두 종료 상태(declined · expired)여서 마켓에서 다시 「섭외 제안」할 수 있다. pending · accepted 가 있으면 그 크리에이터는 재섭외 불가
const OUTREACH = [
  { id: 'o1', profileId: 'momo', campaignId: 'ml-promo', name: '모모', handle: '@momo_live', channels: 'YouTube Live · Instagram', tier: '프리미엄',
    followers: 96400, rate: 1800000, category: '라이브 커머스', img: 'assets/sky-post.png',
    sentAt: '9월 18일', status: 'declined', note: '라이브 2회차 · 커미션 15% + 고정비 제안 — 조건 재협의 요청' },
  { id: 'o2', profileId: 'loop', campaignId: 'np-remix', name: '루프 스튜디오', handle: '@loopstudio', channels: 'YouTube · TikTok', tier: '프리미엄',
    followers: 12800, rate: 1200000, category: '영상 제작', img: 'assets/demon-child.png',
    sentAt: '9월 19일', status: 'expired', note: '숏폼 3편 제작 · 납기 2주 — 7일 내 응답 없음' },
  { id: 'o3', profileId: 'momo', campaignId: 'ml-ppl', name: '난쟁이성현', handle: '@sunghyun', channels: 'YouTube', tier: '프리미엄',
    followers: 72888, rate: 1200000, category: '애니 · 드라마', img: 'assets/neon-paws.png',
    sentAt: '9월 20일', status: 'declined', note: '리뷰 영상 1편 · 성과 보상 포함 — 일정상 거절' },
  { id: 'o4', profileId: 'loop', campaignId: 'ml-order', name: '쿠키퀸', handle: '@cookiequeen', channels: 'TikTok · Instagram', tier: '골드',
    followers: 5253, rate: 500000, category: '웹툰 · 웹소설', img: 'assets/sky-post.png',
    sentAt: '9월 15일', status: 'declined', note: '일정 중복으로 거절 — 10월 재제안 가능' },
  { id: 'o5', profileId: 'momo', campaignId: 'dc-remix', name: '최피티', handle: '@choipt', channels: 'YouTube · TikTok', tier: '골드',
    followers: 20613, rate: 700000, category: 'AI 가이드', img: 'assets/demon-child.png',
    sentAt: '9월 12일', status: 'expired', note: '7일 내 응답 없음 — 자동 만료' }
];

const MINE_TASKS = [
  { label: '가이드 확인 및 소재 다운로드', hint: '캐릭터 비율·색조 가이드와 공식 이미지 12종을 확인합니다.', due: '완료 권장' },
  { label: '숏폼 1편 업로드', hint: '유료 광고 표기 필수 · 본문에 추적 링크 삽입', due: '~9/18' },
  { label: '라이브 커머스 1회 진행', hint: '2시간 · 제품 시연과 댓글 응대 포함', due: '~9/24' },
  { label: '결과 리포트 제출', hint: '조회·클릭·판매 스크린샷을 함께 올립니다.', due: '~9/30' }
];

const MINE_TASKS_MAKE = [
  { label: '가이드 · 원본 에셋 확인', hint: '캐릭터 비율·색조 가이드와 사용 가능한 원본 파일을 받습니다.', due: '완료 권장' },
  { label: '시안 제출', hint: '채택 전 1차 시안. 수정 2회까지 포함됩니다.', due: '~9/16' },
  { label: '최종 결과물 제출', hint: '원본 파일(PSD/AI 또는 ProRes) 포함해 업로드합니다.', due: '~9/26' },
  { label: '숍 등록 동의 · 계약 체결', hint: '채택 시 판매 수익 배분 조건에 서명합니다.', due: '~9/30' }
];

const MINE_SUBS = [
  { title: '데몬 차일드 3권 소개 숏폼', channel: '인스타그램', date: '2026-09-06', status: '승인' },
  { title: '예약판매 라이브 1회차', channel: '유튜브 라이브', date: '2026-09-08', status: '검토 중' },
  { title: '중간 성과 리포트', channel: '파일 업로드', date: '—', status: '대기' }
];

const PROFILE_ROLES = [
  { id: 'holder', label: 'IP 권리자', glyph: 'copyright', hint: '이용권을 팔아 수익을 받는 쪽입니다. 구독 라이선스와 2차 창작 조건을 정합니다.',
    desc: 'IP를 빌려주고 이용료를 받습니다.',
    types: [
      { id: '캐릭터·스토리', label: '캐릭터 · 스토리 IP', glyph: 'auto_stories', desc: '웹툰·소설·게임·세계관. 설정집과 삽화를 라이선스로 엽니다.' },
      { id: '인물 IP', label: '인물 IP', glyph: 'face', desc: '작가·성우·모델·아티스트. 초상·이름 사용 조건을 관리합니다.' },
      { id: '아트·디자인', label: '아트 · 디자인 IP', glyph: 'palette', desc: '일러스트·폰트·패턴·로고. 상업 이용 범위를 플랜으로 나눕니다.' }
    ]
  },
  { id: 'business', label: 'Brand / Client · 제품', glyph: 'storefront', hint: '홍보·제작을 의뢰하며 비용을 쓰는 쪽입니다. 캠페인 예산과 커미션을 집행합니다.',
    desc: 'IP를 빌려 쓰고 상품을 팝니다.',
    types: [
      { id: 'Brand', label: 'Brand', glyph: 'apartment', desc: '자기 제품·서비스를 가진 브랜드. 여러 제품과 캠페인을 묶어 운영합니다.' },
      { id: 'Client', label: 'Client', glyph: 'domain', desc: 'OTT · 방송사 · 유통사 · 게임 퍼블리셔 등 IP를 사들여 사업화하는 기업입니다.' },
      { id: '제품', label: '제품', glyph: 'inventory_2', desc: '실물·디지털 상품 단위. Brand 아래에 붙고 카탈로그·판매를 갖습니다.' }
    ]
  },
  { id: 'worker', label: '크리에이터', glyph: 'campaign', hint: '일해주고 대가를 받는 쪽입니다. 채널·팔로워·실적을 공개해 섭외를 받습니다.',
    desc: '홍보하거나 제작해주고 보수를 받습니다.',
    types: [
      { id: '크리에이터', label: '크리에이터', glyph: 'movie_edit', desc: '라이브·숏폼으로 홍보하거나 영상·일러스트·굿즈를 제작합니다. 어필리에이트와 2차 창작 의뢰에 모두 참여합니다.' }
    ]
  }
];

const PROFILE_SLUG = {
  '캐릭터·스토리': 'my-ip', '인물 IP': 'my-persona', '아트·디자인': 'my-art',
  'Brand': 'my-brand', 'Client': 'my-client', '제품': 'my-product',
  '크리에이터': 'my-studio'
};

const PROFILE_PH = {
  '캐릭터·스토리': '예: 데몬 차일드', '인물 IP': '예: 서하윤 작가', '아트·디자인': '예: 달빛 일러스트 팩',
  'Brand': '예: 달빛서고 라이선싱', 'Client': '예: 스타플릭스 OTT', '제품': '예: 데몬 차일드 아크릴 스탠드',
  '크리에이터': '예: 루프 스튜디오'
};

const PROFILE_BLURB = {
  '캐릭터·스토리': '예: 황혼의 성도를 배경으로 한 판타지 웹소설',
  '인물 IP': '예: 판타지 장편 전문 작가 · 초상 사용 협의 가능',
  '아트·디자인': '예: 상업 이용 가능한 일러스트 120컷',
  'Brand': '예: IP 판권과 상업 이용 계약을 관리합니다',
  'Client': '예: 오리지널 시리즈로 제작할 IP를 찾습니다',
  '제품': '예: 공식 굿즈 라인 · 전국 배송',
  '크리에이터': '예: 캐릭터 모션 그래픽 전문 · 납품 148건'
};

const CAT_GOODS = {
  '인물 · 캐릭터': ['실제 인물 (배우 · 모델 · 아티스트)', '가상 캐릭터 (웹툰 · 소설 · 게임)', '버추얼 인물 (버튜버 · AI 아바타)', '성우 · 목소리', '인플루언서 · 크리에이터', '스포츠 선수'],
  '뷰티 · 퍼스널케어': ['스킨케어', '메이크업', '헤어 · 바디', '향수', '뷰티 디바이스', '네일'],
  '식음료': ['가공식품', '음료 · 주류', '건강식품', '디저트 · 베이커리', '밀키트', '카페 · 외식'],
  '패션': ['의류', '신발', '가방 · 잡화', '주얼리 · 시계', '키즈 · 베이비'],
  '디지털 · 가전 · 테크': ['모바일 · PC', '음향 · 영상', '생활가전', '주변기기', '소프트웨어 · 앱'],
  '게임 · 엔터테인먼트': ['게임 타이틀', '인게임 아이템', '웹툰 · 웹소설', '영상 · 애니메이션', '공연 · 이벤트'],
  '라이브': ['라이브 커머스', '게임 방송', '토크 · 버라이어티', '뮤직 · 공연 라이브', '스포츠 중계', '버추얼 라이브'],
  '유통 · 이커머스 · 리테일': ['굿즈 · 머천다이즈', '생활용품', '리빙 · 인테리어', '반려동물', '문구 · 팬시'],
  '금융 · 보험': ['카드 · 페이', '대출 · 투자', '보험', '앱 · 서비스 가입'],
  '여행 · 레저': ['숙박', '항공 · 교통', '액티비티 · 티켓', '여행용품', '스포츠 · 피트니스']
};

const CAT_FORMATS = ['캐릭터', '이미지 · 아트', '상품 · 굿즈', '숏폼 영상', '롱폼 영상', '라이브 · 방송', '일러스트 · 디자인', '음악 · 사운드', '글 · 카피'];

function catMinorGroupsFor(major) {
  return [
    { group: (major || '') + ' 상품군', items: CAT_GOODS[major] || [] },
    { group: 'IP 활용 형식', items: CAT_FORMATS }
  ].filter(g => g.items.length);
}

const SELLING = [
  { id: 's1', ownerId: 'demon-child', campaignId: 'dc-affiliate', title: '데몬 차일드 3권 예약판매 라이브', format: '라이브 커머스', channel: '유튜브 라이브', date: '2026-09-08', live: true, result: '판매 312건', earned: '₩1,842,000' },
  { id: 's2', ownerId: 'neon-paws', campaignId: 'np-affiliate', title: '네온 포즈 굿즈 언박싱 숏폼', format: '숏폼 광고', channel: '인스타그램 릴스', date: '2026-09-06', live: false, result: '조회 12.4만 · 판매 188건', earned: '₩846,000' },
  { id: 's3', ownerId: 'neon-paws', campaignId: 'np-remix', title: '네온 포즈 캐릭터 애니메이션 6편', format: '제작 납품', channel: '광고 소재', date: '2026-09-02', live: false, result: '납품 6편 · 조회 118만', earned: '₩1,200,000' },
  { id: 's4', ownerId: 'sky-post', campaignId: 'sp-affiliate', title: '스카이 포스트 얼리액세스 초대 방송', format: '라이브 플레이', channel: '트위치', date: '2026-08-28', live: false, result: '가입 74건', earned: '₩148,000' }
];

const CATALOG = [
  { name: '황혼의 성도 A2 포스터', kind: '굿즈', cat: '유통 · 이커머스 · 리테일', subs: ['상품 · 굿즈', '이미지 · 아트'], ipId: 'demon-child', campaignId: 'dc-affiliate', price: '₩24,000', commission: '22%', sellers: ['momo', 'loop'], sold: '판매 1,204장', status: '판매 중', place: '내부', platform: 'IPBeginz 숍' },
  { name: '데몬 차일드 3권 (예약판매)', kind: '도서', cat: '게임 · 엔터테인먼트', subs: ['글 · 카피'], ipId: 'demon-child', campaignId: 'dc-affiliate', price: '₩18,000', commission: '22%', sellers: ['momo'], sold: '판매 3,180권', status: '판매 중', place: '외부', platform: '네이버 스마트스토어', url: 'smartstore.naver.com/moonlight/3180' },
  { name: '데몬 차일드 아크릴 스탠드', kind: '굿즈', cat: '유통 · 이커머스 · 리테일', subs: ['상품 · 굿즈', '캐릭터'], ipId: 'demon-child', campaignId: 'dc-remix', price: '₩18,000', commission: '30%', sellers: ['loop'], sold: '판매 862개', status: '판매 중', place: '내부', platform: 'IPBeginz 숍' },
  { name: '네온 포즈 굿즈 세트', kind: '굿즈', cat: '유통 · 이커머스 · 리테일', subs: ['상품 · 굿즈'], ipId: 'neon-paws', campaignId: 'np-affiliate', price: '₩39,000', commission: '건당 ₩4,500', sellers: ['momo', 'loop'], sold: '판매 2,410세트', status: '판매 중', place: '외부', platform: '쿠팡', url: 'coupang.com/vp/products/neonpaws' },
  { name: '네온 포즈 숏폼 광고 패키지', kind: '콘텐츠', cat: '게임 · 엔터테인먼트', subs: ['숏폼 영상', '음악 · 사운드'], ipId: 'neon-paws', campaignId: 'np-remix', price: '₩1,200,000', commission: '고정 제작비', sellers: [], sold: '제작 6편', status: '모집 중', place: '내부', platform: 'IPBeginz 숍' },
  { name: '스카이 포스트 얼리액세스 키', kind: '게임', cat: '게임 · 엔터테인먼트', subs: ['라이브 · 방송'], ipId: 'sky-post', campaignId: 'sp-affiliate', price: '', commission: '가입 ₩2,000', sellers: ['momo'], sold: '가입 1,860건', status: '판매 중', place: '외부', platform: '스팀', url: 'store.steampowered.com/app/skypost' },
  { name: '설정집 · 삽화 라이브러리', kind: '라이선스', cat: '게임 · 엔터테인먼트', subs: ['이미지 · 아트', '캐릭터'], ipId: 'demon-child', campaignId: 'dc-sub', price: '₩39,000/월', commission: '—', sellers: [], sold: '구독 318명', status: '상시', place: '내부', platform: 'IPBeginz 숍' }
];

const SHARED = [
  { item: '네온 포즈', kind: 'IP 프로필', with: '루프 스튜디오', img: 'assets/neon-paws.png', role: '공동 운영자', status: '편집 가능' },
  { item: '데몬 차일드', kind: 'IP 프로필', with: '베어랩', img: 'assets/demon-child.png', role: '캠페인 매니저', status: '편집 가능' },
  { item: '스카이 포스트', kind: 'IP 프로필', with: '하늘상점', img: 'assets/sky-post.png', role: '열람자', status: '읽기 전용' },
  { item: '달빛서고 라이선싱', kind: '브랜드 프로필', with: '모모', img: 'assets/sky-post.png', role: '공동 운영자', status: '편집 가능' }
];

const HISTORY = {
  momo: [
    { client: '베어랩', job: '굿즈 라이브 3회차', date: '2026-08-21', result: '매출 ₩14.2M', score: '4.9' },
    { client: '달빛서고', job: '신작 예약판매 라이브', date: '2026-07-09', result: '매출 ₩9.6M', score: '4.8' },
    { client: '하늘상점', job: '숏폼 홍보 4편', date: '2026-06-14', result: '조회 42만', score: '4.7' }
  ],
  loop: [
    { client: '네온 포즈', job: '숏폼 애니메이션 6편', date: '2026-08-30', result: '조회 118만', score: '5.0' },
    { client: '모닝브루', job: '광고 영상 2편', date: '2026-07-22', result: 'CTR 3.8%', score: '4.8' },
    { client: '달빛서고', job: '캐릭터 리깅 · 모션', date: '2026-05-18', result: '납품 12일', score: '4.9' }
  ]
};

const SP_SERVICES = {
  influencer: ['라이브 커머스 진행', '숏폼 홍보', '제품 리뷰', '오프라인 행사 진행', '앰배서더 계약'],
  creator: ['광고 영상 제작', '숏폼 시리즈 제작', '모션 그래픽', '캐릭터 애니메이션', '촬영·편집 대행']
};

const SP_PAY = [
  { label: '고정', desc: '회차·편당 정액으로 받습니다. 판매 실적과 무관합니다.' },
  { label: '성과', desc: '판매·전환 실적에 따라 정해진 비율로 받습니다.' }
];

const TEMPLATE_CATS = ['판매·전환', '2차 창작', '굿즈·숍', '홍보·시딩', '크리에이터'];

const TEMPLATES = [
  { glyph: '↗', name: '어필리에이트 판매', badge: '가장 많이 씀', cat: '판매·전환', kind: '어필리에이트',
    desc: '추적 링크로 판매를 만드는 파트너를 모집합니다. 성과 커미션만 지급합니다.', hint: '성과 15~25% 권장' },
  { glyph: '▦', name: '숍 상품 홍보', badge: '', cat: '판매·전환', kind: '어필리에이트',
    desc: '판매 페이지를 연결해 파트너별 링크를 발급합니다. 전환 기준 정산.', hint: '외부 URL 연결' },
  { glyph: '✦', name: '2차 창작 의뢰', badge: '', cat: '2차 창작', kind: '2차 창작 의뢰',
    desc: '자산을 열어 창작자에게 제작을 맡깁니다. 고정 또는 성과로 지급합니다.', hint: '납품 확인 후 정산' },
  { glyph: '◈', name: '팬 창작 공모', badge: '', cat: '2차 창작', kind: '2차 창작 의뢰',
    desc: '가이드라인 안에서 팬 창작을 모으고 우수작을 상품화합니다.', hint: '비상업 허용 범위 필요' },
  { glyph: '▣', name: '굿즈 선주문', badge: '', cat: '굿즈·숍', kind: '어필리에이트',
    desc: '굿즈 판매 페이지를 열고 크리에이터가 선주문을 모읍니다.', hint: '재고 없이 시작' },
  { glyph: '◉', name: '콜라보 상품', badge: '', cat: '굿즈·숍', kind: '어필리에이트',
    desc: '브랜드와 IP가 함께 상품을 만들고 수익을 나눕니다.', hint: '수익 배분 협의' },
  { glyph: '✧', name: '체험단 · 시딩', badge: '', cat: '홍보·시딩', kind: '홍보 · 시딩',
    desc: '제품을 무상 제공하고 후기를 받습니다. 판매보다 인지도 목적입니다.', hint: '고정 보수 없음' },
  { glyph: '◐', name: '신규 IP 알리기', badge: '', cat: '홍보·시딩', kind: '홍보 · 시딩',
    desc: '새로 등록한 IP를 마켓과 홈 피드에 노출합니다.', hint: '프로필 공개 후 가능' },
  { glyph: '▷', name: '라이브 커머스 섭외', badge: '', cat: '크리에이터', kind: '크리에이터 섭외',
    desc: '라이브로 판매를 진행할 크리에이터를 섭외합니다.', hint: '고정 + 성과' },
  { glyph: '◆', name: '내 채널 홍보하기', badge: '크리에이터용', cat: '크리에이터', kind: '셀프 프로모션',
    desc: '내 채널과 단가를 카드로 만들어 광고주에게 노출합니다.', hint: '섭외 요청 받기' }
];

const AUTH_PROVIDERS = [
  { id: 'google', label: 'Google', particle: '로', mark: 'G', bg: '#fff', color: '#3c4043' },
  { id: 'apple', label: 'Apple', particle: '로', mark: 'A', bg: '#111', color: '#fff' },
  { id: 'meta', label: 'Facebook', particle: '으로', mark: 'f', bg: '#1877f2', color: '#fff' },
  { id: 'naver', label: '네이버', particle: '로', mark: 'N', bg: '#03c75a', color: '#fff' },
  { id: 'kakao', label: '카카오', particle: '로', mark: 'K', bg: '#fee500', color: '#3c1e1e' },
  { id: 'line', label: 'LINE', particle: '으로', mark: 'L', bg: '#06c755', color: '#fff' },
  { id: 'discord', label: 'Discord', particle: '로', mark: 'D', bg: '#5865f2', color: '#fff' },
  { id: 'x', label: 'X', particle: '로', mark: 'X', bg: '#111', color: '#fff' },
  { id: 'twitch', label: 'Twitch', particle: '로', mark: 'T', bg: '#9146ff', color: '#fff' }
];

const AUTH_ROLES = [
  { id: 'holder', label: 'IP 보유자', glyph: 'auto_stories', desc: '웹툰 · 소설 · 캐릭터 · 게임 IP를 가지고 라이선스와 굿즈로 넓힙니다.' },
  { id: 'brand', label: '브랜드 · 광고주', glyph: 'storefront', desc: 'IP를 붙인 상품을 팔거나 창작자를 섭외해 홍보합니다.' },
  { id: 'creator', label: '크리에이터', glyph: 'brush', desc: '2차 창작과 홍보를 맡아 제작비와 커미션을 받습니다.' },
  { id: 'reseller', label: '유통 · 리셀러', glyph: 'local_shipping', desc: '추적 링크와 프로모 코드로 남의 상품을 대신 팝니다.' }
];

const AUTH_TERM_LIST = [
  { id: 'service', tag: '필수', label: '이용약관', sub: '' },
  { id: 'privacy', tag: '필수', label: '개인정보 수집 · 이용', sub: '' },
  { id: 'partner', tag: '필수', label: '파트너십 정책', sub: '계약 · 트래킹 · Action Locking · 환수 · Character Guard 검수 규칙' },
  { id: 'referral', tag: '필수', label: '다층 추천 보상 규제 고지', sub: 'Referral 보상은 판매 · 액션 성과(CPS/CPA)에만 지급되며, 가입 · 모집 자체에 대한 보상은 없음을 확인합니다' },
  { id: 'marketing', tag: '선택', label: '마케팅 정보 수신', sub: '' }
];

const AUTH_REQUIRED_TERMS = AUTH_TERM_LIST.filter(t => t.tag === '필수').map(t => t.id);

/* 사용 지역 · 타깃 국가 공통 목록 — 캠페인 만들기와 마켓 필터가 같은 값을 쓴다. 「전 세계」는 모든 국가 포함 */
const USE_COUNTRIES = ['대한민국', '미국', '영국', '일본', '중국', '대만', '홍콩', '싱가포르', '베트남', '태국', '인도네시아', '필리핀', '인도', '호주', '캐나다', '독일', '프랑스', '스페인', '이탈리아', '브라질', '멕시코', 'UAE', '사우디아라비아', '전 세계'];

/* 거래 · 노출 지역 선택용 전 세계 국가 목록(대륙별, 약 190개국). 3택(전 세계 / 선택 국가만 / 전 세계에서 제외) + 검색 드롭다운에서 쓴다 */
const WORLD_COUNTRIES = [
  { region: '동아시아', items: ['대한민국', '일본', '중국', '대만', '홍콩', '마카오', '몽골', '북한'] },
  { region: '동남아시아', items: ['싱가포르', '베트남', '태국', '인도네시아', '필리핀', '말레이시아', '캄보디아', '라오스', '미얀마', '브루나이', '동티모르'] },
  { region: '남아시아', items: ['인도', '파키스탄', '방글라데시', '스리랑카', '네팔', '부탄', '몰디브', '아프가니스탄'] },
  { region: '중앙아시아', items: ['카자흐스탄', '우즈베키스탄', '키르기스스탄', '타지키스탄', '투르크메니스탄'] },
  { region: '중동', items: ['아랍에미리트', '사우디아라비아', '카타르', '쿠웨이트', '바레인', '오만', '이스라엘', '요르단', '레바논', '이라크', '이란', '시리아', '예멘', '팔레스타인', '튀르키예'] },
  { region: '북미', items: ['미국', '캐나다', '멕시코'] },
  { region: '중미 · 카리브', items: ['과테말라', '온두라스', '엘살바도르', '니카라과', '코스타리카', '파나마', '벨리즈', '쿠바', '도미니카공화국', '아이티', '자메이카', '푸에르토리코', '트리니다드토바고', '바하마', '바베이도스'] },
  { region: '남미', items: ['브라질', '아르헨티나', '칠레', '콜롬비아', '페루', '베네수엘라', '에콰도르', '볼리비아', '파라과이', '우루과이', '가이아나', '수리남'] },
  { region: '서유럽', items: ['영국', '아일랜드', '프랑스', '독일', '네덜란드', '벨기에', '룩셈부르크', '스위스', '오스트리아', '리히텐슈타인', '모나코'] },
  { region: '북유럽', items: ['스웨덴', '노르웨이', '덴마크', '핀란드', '아이슬란드', '에스토니아', '라트비아', '리투아니아'] },
  { region: '남유럽', items: ['스페인', '포르투갈', '이탈리아', '그리스', '몰타', '키프로스', '안도라', '산마리노', '바티칸'] },
  { region: '동유럽 · 발칸', items: ['폴란드', '체코', '슬로바키아', '헝가리', '루마니아', '불가리아', '우크라이나', '벨라루스', '몰도바', '러시아', '슬로베니아', '크로아티아', '보스니아헤르체고비나', '세르비아', '몬테네그로', '북마케도니아', '알바니아', '코소보', '조지아', '아르메니아', '아제르바이잔'] },
  { region: '오세아니아', items: ['호주', '뉴질랜드', '파푸아뉴기니', '피지', '사모아', '통가', '바누아투', '솔로몬제도', '괌', '팔라우', '미크로네시아', '마셜제도', '키리바시', '나우루', '투발루'] },
  { region: '북아프리카', items: ['이집트', '모로코', '알제리', '튀니지', '리비아', '수단'] },
  { region: '서아프리카', items: ['나이지리아', '가나', '세네갈', '코트디부아르', '말리', '부르키나파소', '니제르', '기니', '베냉', '토고', '시에라리온', '라이베리아', '감비아', '모리타니', '카보베르데', '기니비사우'] },
  { region: '동아프리카', items: ['케냐', '에티오피아', '탄자니아', '우간다', '르완다', '부룬디', '소말리아', '지부티', '에리트레아', '남수단', '모잠비크', '마다가스카르', '모리셔스', '세이셸', '코모로'] },
  { region: '중부 · 남부 아프리카', items: ['남아프리카공화국', '나미비아', '보츠와나', '짐바브웨', '잠비아', '말라위', '앙골라', '콩고민주공화국', '콩고공화국', '카메룬', '가봉', '적도기니', '차드', '중앙아프리카공화국', '레소토', '에스와티니'] }
];
const WORLD_COUNTRY_COUNT = WORLD_COUNTRIES.reduce((n, g) => n + g.items.length, 0);

const WORLD_REGIONS = [
  { region: '동아시아', items: [['대한민국','🇰🇷'],['일본','🇯🇵'],['중국','🇨🇳'],['대만','🇹🇼'],['홍콩','🇭🇰'],['몽골','🇲🇳']] },
  { region: '동남아시아', items: [['싱가포르','🇸🇬'],['베트남','🇻🇳'],['태국','🇹🇭'],['인도네시아','🇮🇩'],['필리핀','🇵🇭'],['말레이시아','🇲🇾']] },
  { region: '북미', items: [['미국','🇺🇸'],['캐나다','🇨🇦'],['멕시코','🇲🇽']] },
  { region: '유럽', items: [['영국','🇬🇧'],['독일','🇩🇪'],['프랑스','🇫🇷'],['이탈리아','🇮🇹'],['스페인','🇪🇸'],['폴란드','🇵🇱'],['네덜란드','🇳🇱']] },
  { region: '중남미', items: [['브라질','🇧🇷'],['아르헨티나','🇦🇷'],['칠레','🇨🇱'],['콜롬비아','🇨🇴']] },
  { region: '오세아니아 · 기타', items: [['호주','🇦🇺'],['뉴질랜드','🇳🇿'],['인도','🇮🇳'],['튀르키예','🇹🇷'],['사우디아라비아','🇸🇦'],['아랍에미리트','🇦🇪']] }
];

const PHONE_COUNTRIES = [
  { name: '대한민국', dial: '+82', flag: '🇰🇷' },
  { name: '미국 · 캐나다', dial: '+1', flag: '🇺🇸' },
  { name: '일본', dial: '+81', flag: '🇯🇵' },
  { name: '중국', dial: '+86', flag: '🇨🇳' },
  { name: '대만', dial: '+886', flag: '🇹🇼' },
  { name: '홍콩', dial: '+852', flag: '🇭🇰' },
  { name: '싱가포르', dial: '+65', flag: '🇸🇬' },
  { name: '태국', dial: '+66', flag: '🇹🇭' },
  { name: '베트남', dial: '+84', flag: '🇻🇳' },
  { name: '인도네시아', dial: '+62', flag: '🇮🇩' },
  { name: '인도', dial: '+91', flag: '🇮🇳' },
  { name: '영국', dial: '+44', flag: '🇬🇧' },
  { name: '독일', dial: '+49', flag: '🇩🇪' },
  { name: '프랑스', dial: '+33', flag: '🇫🇷' },
  { name: '호주', dial: '+61', flag: '🇦🇺' },
  { name: '브라질', dial: '+55', flag: '🇧🇷' },
  { name: '아랍에미리트', dial: '+971', flag: '🇦🇪' }
];

const CHANNEL_TYPES = [
  { label: '유튜브', ph: 'youtube.com/@channel', mark: '▶', bg: '#ff0033', fg: '#fff', particle: '로' },
  { label: '인스타그램', ph: 'instagram.com/id', mark: '◎', bg: '#d62976', fg: '#fff', particle: '으로' },
  { label: '틱톡', ph: 'tiktok.com/@id', mark: '♪', bg: '#111', fg: '#fff', particle: '으로' },
  { label: 'X (트위터)', ph: 'x.com/id', mark: '✕', bg: '#1d1d1f', fg: '#fff', particle: '로' },
  { label: '트위치', ph: 'twitch.tv/id', mark: '▮', bg: '#9146ff', fg: '#fff', particle: '로' },
  { label: '네이버 블로그', ph: 'blog.naver.com/id', mark: 'N', bg: '#03c75a', fg: '#fff', particle: '로' },
  { label: '자사몰 · 기타', ph: 'https://', mark: '⌂', bg: '#eee8fa', fg: '#5836c4', particle: '로' }
];

const AUTH_STEPPER = [
  { n: '1', title: '소셜로 시작', desc: '로그인할 계정을 선택해요' },
  { n: '2', title: '개인·사업자 선택', desc: '가입할 계정의 유형을 정해요' },
  { n: '3', title: '기본정보 입력', desc: '나를 소개할 정보를 입력해요' },
  { n: '4', title: '소셜 연결', desc: '채널을 연결하거나 링크만 등록해요 · 선택', tag: true },
  { n: '5', title: 'KYC 인증', desc: '세금 · 정산을 위한 확인 · 선택', tag: true }
];


Object.assign(window, { DRAFTS, CAMPAIGN_EXT, USE_COUNTRIES, WORLD_COUNTRIES, WORLD_COUNTRY_COUNT, MKT_FIELDS, CREATOR_SERVICES, CREATOR_SKILLS, CREATOR_PORTFOLIO, CREATOR_STATS, WORK_TABS, CONTRACTS, APPLICATIONS, SAVED, CREATE_SPEC, ACCOUNT, SCOPES, LINK_KINDS, TRI, PROFILES, PROOFS, CAMPAIGNS, PLANS, TERMS, SHOP, PARTNERS, REPLIES, PROFILE_REPLIES, TEMPLATE_CARDS, CAMPAIGN_META, LICENSE_LINES, LICENSE_TARGETS, PROFILE_VERIFY, SOCIAL_LINKS, IP_CATS, BRAND_CATS, CREATOR_CATS, DASH, RAIL, SETTINGS_GROUPS, SET_STATE, SETTINGS_SECTIONS, PLATFORM_PLANS, RUBY_PACKS, STAR_PACKS, NC_KINDS, JOINED_META, SAVED_META, MANAGE_SCOPE, CAMPAIGN_FLOW, RUBY_COST, VIEWNAV, SUBNAV, ACCOUNT_TABS, FEED, ASSETS, RIGHTS, PLATFORMS, CAT_MAJOR, TIER_STYLE, APPLICANTS, OUTREACH, MINE_TASKS, MINE_TASKS_MAKE, MINE_SUBS, PROFILE_ROLES, PROFILE_SLUG, PROFILE_PH, PROFILE_BLURB, CAT_GOODS, CAT_FORMATS, SELLING, CATALOG, SHARED, HISTORY, SP_SERVICES, SP_PAY, TEMPLATE_CATS, TEMPLATES, AUTH_PROVIDERS, AUTH_ROLES, AUTH_TERM_LIST, AUTH_REQUIRED_TERMS, WORLD_REGIONS, PHONE_COUNTRIES, CHANNEL_TYPES, AUTH_STEPPER, catMinorGroupsFor });
})();
