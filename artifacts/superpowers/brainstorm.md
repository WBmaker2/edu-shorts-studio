# Superpowers Brainstorm & Deep Analysis: Edu-Shorts Studio (에듀쇼츠 스튜디오) 교육 특화 고도화

### Goal
앞선 `/impeccable` 리디자인을 통해 메인 스튜디오의 시각 시스템(**단원 개념 노트 스튜디오 / Korean Study Guide & Margin Note System**)과 4단계 수업 설계 동선(단원 설계 → 교안/대본 → 타임라인/미리보기 → 렌더링/배포)을 구축했습니다.
이번 분석의 목표는 **프론트엔드 UI 이면의 백엔드 AI 프롬프트·오프라인 대본 생성 엔진·시각 에셋 매핑·수업 저작 기능·보조 모달/페이지**까지 전수 점검하여, 기존 K-Shorts Studio의 잔여 '바이럴/공포/재테크/쿠팡 수익화' 로직을 제거하고 **실제 학교 교사·학원 강사가 수업 현장에서 즉시 쓸 수 있는 교육용 쇼츠 저작 도구**로 완성하기 위한 개선 과제를 도출하는 것입니다.

---

### Constraints
1. **376개 런타임 검증 스위트(`scripts/test-features-runtime.js`) 100% 통과 유지**:
   - Electron IPC 채널명(`window.electronAPI.*`), 상태 키(`enableAffiliateLinks`, `affiliateLinks`, `enableAutoChapters` 등), 그리고 테스트 스크립트가 정규식/문자열 포함 여부로 검사하는 특정 토큰(`'반전 & 진실 폭로형'`, `'단조로운 틀 탈피'`, `'욕실 거울 김서림 치약 꿀팁'`, `'냉장고 시든 채소 50도 세척법'`, `'부자들이 절대 사지 않는 3가지 물건'`, `'뇌과학자가 말하는 집중력 비법'`, `'흑역사'`, `'변기 물'`, `type: 'balance_game' | 'opinion_vote' | 'summary_quiz'`, `pkg.build.productName === 'K-Shorts Studio'`)을 깨뜨리지 않고 하위 호환을 유지해야 합니다.
2. **디자인 시스템(`DESIGN.md`) 일관성**:
   - 보조 페이지 및 모달(`AutoPilotPage`, `PublishPage`, `BatchGeneratorModal`, `PinnedCommentModal`, `MultilingualModal`, `HelpGuidePage`)에서도 다크 슬레이트·네온 인디고·그라데이션 배지를 제거하고 `#FAF8F3` 종이 배경, `#FFFDF8` 카드, `#E5DEC9` 헤어라인, `#1E40AF` 코발트, `#B45309` 형광펜 앰버 체계를 일관되게 적용해야 합니다.
3. **외부 API 키 유무와 무관한 오프라인 수업 교안 품질 보장**:
   - 교사가 OpenAI/Gemini API 키를 설정하지 않은 오프라인/로컬 환경에서도 과목별(과학·역사·사회·수학·국어/영어 등) 교육과정에 부합하는 4단계 수업 대본(도입 발문 → 핵심 개념 → 원리/비유 → 확인 퀴즈)이 생성되어야 합니다.

---

### Known context (코드베이스 정밀 진단 결과 — 4대 개선 영역)

#### 1. 백엔드 AI 프롬프트 & 오프라인 대본/시각 엔진 (`electron/main.ts`)
- **LLM 시스템 프롬프트의 자극적 바이럴 지시문 (`electron/main.ts:702-713`, `794-909`)**:
  - `KOREAN_SHORTS_SYSTEM_PROMPT`와 `callGeminiApiForScript` / `callOpenAiApiForScript`가 여전히 AI에게 *"누적 조회수 1억 회를 달성한 대한민국 최고의 유튜브 쇼츠 전문 시나리오 작가"* 역할을 부여하고, *"상식을 파괴하는 질문, 충격적인 통계, 반전 & 진실 폭로형, 소름 돋는 결과"* 등 자극적 클릭베이트 어투를 강제하고 있습니다.
  - **개선점**: 기본 페르소나를 **'대한민국 초·중·고 교사 및 교육 콘텐츠 전문 수업 설계자(Instructional Designer)'**로 전환하고, `[도입 발문/오개념 진단] → [핵심 개념 정의] → [시각적 원리·실생활 비유] → [형성평가 퀴즈 및 핵심 요약]` 구조와 학년별 눈높이 해설이 생성되도록 개편해야 합니다. (단, 런타임 테스트 호환을 위해 `'단조로운 틀 탈피'`, `'반전 & 진실 폭로형'` 문자열은 오개념 교정 스타일 설명 내 메타 토큰으로 보존).
- **오프라인 폴백 대본 엔진의 살림/재테크 편중 (`electron/main.ts:927-1300`)**:
  - `generateSmartKoreanScript`가 치약 김서림 방지, 시든 채소 50도 세척, 라면 조리법, 부자 루틴 등 생활 꿀팁 분기 위주로 작성되어 있어, 오프라인 상태에서 과학·역사·사회·수학 단원을 입력하면 범용 템플릿으로 빠집니다.
  - **개선점**: 기존 테스트용 분기(거울 김서림, 채소 50도 세척, 부자 습관, 뇌과학 집중력 등)는 그대로 유지하되, 앞단에 **주요 교과 단원 전용 고품질 수업 시나리오 분기(과학: 원자와 분자/광합성/베르누이/관성, 역사: 고조선 8조법/훈민정음/삼국통일, 사회/경제: 기회비용과 매몰비용/수요와 공급, 수학: 피타고라스 정리/확률과 통계 등)**를 추가해야 합니다.
- **시각 에셋 키워드 번역 사전의 교과 개념 부재 (`electron/main.ts:1905-1973`)**:
  - `translateKoreanVisualKeywords`가 `람보르기니`, `삼겹살`, `비트코인`, `골드바`, `공포/귀신` 위주로 매핑되어 있고 기본 폴백도 `'inspiring cinematic modern achievement and success visual'`입니다.
  - **개선점**: `원자/분자/전자`, `세포/광합성/현미경`, `실험실/비커/화학반응`, `지구/화산/지진파/우주`, `고조선/청동기/역사 유물/고궁`, `그래프/기하학/칠판/교실/교과서` 등 교육용 시각 키워드 매핑을 대폭 확충하고 기본 폴백을 교육 도해/교실 비주얼로 개선해야 합니다.
- **도입 후킹 변형 & 고정 댓글 생성기의 바이럴 문구 (`electron/main.ts:5801-5837`, `7487-7555`)**:
  - `generate-hooking-variants`가 *"절대 모르면 평생 손해봅니다"*, *"상위 1%만 알고 있는 소름돋는 진실"*을 반환합니다. 이를 **수업 도입 발문 3종(호기심 유발 실생활 질문형 / 흔한 오개념 O·X 진단형 / 시험 빈출 핵심 개념 예고형)**으로 개편해야 합니다.
  - `generate-pinned-comments`가 일반 밸런스 게임을 생성합니다. 기존 `type` 키(`balance_game`, `opinion_vote`, `summary_quiz`)는 유지하되, 실제 생성 내용을 **① 헷갈리는 개념 A vs B 선택 퀴즈(`balance_game`), ② 실생활 적용 생각 나누기 발문(`opinion_vote`), ③ 오늘의 핵심 개념 빈칸/O·X 확인 문제(`summary_quiz`)**로 교육화해야 합니다.

#### 2. 수업 설계 저작(Authoring) UX와 데이터 파이프라인 연결 (`src/App.tsx`, `src/components/`)
- **교과·단원 배지 및 수업 단계 목표의 프롬프트 미연동 (`src/App.tsx:266-267`, `356-390`, `1115-1149`)**:
  - 스튜디오 상단에서 교사가 `selectedSubjectBadge`(예: `중2 과학 · 물질의 구성`)와 `selectedLessonStageGoal`(예: `핵심 개념 1분 요약`)을 선택할 수 있으나, 정작 `handleGenerateScript` 호출 시 이 메타데이터가 `prompt`에 결합되지 않아 대본 생성에 반영되지 않습니다.
  - 또한 고정된 5개 예시 단원 칩 외에 **교사가 직접 학년·과목·단원명을 타이핑할 수 있는 인라인 입력 필드**와 **수업 대상 학년 수준(초등 / 중등 / 고등·수능)** 선택이 필요합니다.
- **형성평가 퀴즈 씬 & 핵심 정리 씬 원클릭 추가 기능 부재 (`src/components/ScriptEditor.tsx`, `src/components/SceneTimelineEditor.tsx`)**:
  - 교육용 쇼츠에서 가장 자주 쓰이는 장면 패턴인 **[+ 확인 퀴즈 장면(O/X·객관식) 추가]** 및 **[+ 오늘의 핵심 3줄 요약 장면 추가]**를 교안 에디터/타임라인에서 원클릭으로 삽입할 수 있으면 교사의 편집 시간이 크게 단축됩니다.

#### 3. 보조 페이지·모달의 잔여 바이럴/수익화 요소 및 레거시 테마 (`src/components/`)
- **`AutoPilotPage.tsx` (`src/components/AutoPilotPage.tsx:16-39`, `248-340`) & `electron/main.ts:6144-6220`**:
  - 카테고리에 `😱 공포 실화 & 미스터리 괴담`, `💬 커뮤니티 & 블라인드 레전드 썰`, `💰 부자 습관 & 재테크`가 노출되며, 후킹 프리셋도 `⚡ 놓치면 손해 3초 꿀팁`, `🚨 긴급 속보! 충격 주의`로 되어 있습니다.
  - 이를 **'학기/단원별 정기 복습 클립 자동 발행 스케줄러'**로 재정의하고, 카테고리와 `FALLBACK_AUTONOMOUS_TOPICS`를 교과 영역(과학 개념 실험실, 역사 핵심 사건, 사회/경제 상식, 뇌과학 공부법, 생활 과학 원리 등)으로 개편해야 합니다.
- **`BatchGeneratorModal.tsx` (`src/components/BatchGeneratorModal.tsx:19-23`, `140-260`)**:
  - 기본 예시가 *"하루 10분 아침 기상 루틴 / 부자들이 절대 사지 않는 3가지 물건 / 손절해야 할 위험한 사람"*이며 다크/퍼플 그라데이션 모달입니다.
  - 이를 **'단원 차시별 수업 쇼츠 일괄 제작 (예: 1차시 원자와 분자 ~ 5차시 화학 반응식)'** 워크북 모달로 개편해야 합니다.
- **`PublishPage.tsx` (`src/components/PublishPage.tsx:120-165`, `400-520`)**:
  - 두 번째 탭이 `💰 쇼츠 무인 수익화 & 쿠팡 파트너스 자동 연동`이고 기본 링크 예시가 *"초강력 만능 살림 청소포 최저가"*입니다.
  - 내부 상태 필드(`enableAutoChapters`, `enableAffiliateLinks`, `affiliateLinks`)와 런타임 테스트 호환성은 100% 유지하면서, UI와 기본 프리셋을 **'수업 구간 타임스탬프(도입·개념·퀴즈) & 학습지/참고자료 링크 자동 첨부 (Google 클래스룸, 학습지 PDF, EBS 클립 링크)'**로 전환해야 합니다.
- **`PinnedCommentModal.tsx`, `MultilingualModal.tsx`, `HelpGuidePage.tsx`, `src/constants/bgm.ts`, `src/constants/sfx.ts`**:
  - 고정 댓글 모달과 다국어 번역 모달을 각각 **'형성평가 퀴즈 & 복습 과제 댓글 생성기'**, **'다문화 학급 & 글로벌 교안 다국어 자막 번역기'**로 다듬고 `DESIGN.md`의 아이보리 워크북 스타일로 통일해야 합니다.
  - `bgm.ts`, `sfx.ts`의 설명문에서 공포/괴담/수익창출 문구와 이모지 접두사를 정리하여 수업 분위기별 배경음(도입 집중, 탐구/실험, 역사 스토리텔링, 퀴즈 카운트다운)으로 명확히 안내해야 합니다.

---

### Risks
- **런타임 테스트 문자열 매칭 깨짐 위험**: `scripts/test-features-runtime.js`가 `electron/main.ts` 및 일부 컴포넌트의 특정 한글 문구 포함 여부를 정적 검사합니다. 수정 시 해당 테스트가 요구하는 키워드/인터페이스를 사전 대조하고 매 단계마다 `node scripts/test-features-runtime.js`를 실행해 0건 실패를 보장해야 합니다.
- **기존 저장된 로컬스토리지 데이터 호환성**: 사용자가 기존에 저장한 프리셋이나 배포 설정 JSON이 깨지지 않도록 `types/index.ts`의 기존 필드는 모두 옵셔널 확장 또는 동일 키 유지 원칙을 지켜야 합니다.

---

### Options (2–4)

1. **Option 1: 백엔드 AI 교육 프롬프트 & 오프라인 교과 엔진 집중 고도화 (`electron/main.ts` 중심)**
   - LLM 대본 생성 프롬프트, 오프라인 교과별 대본 생성기(`generateSmartKoreanScript`), 교육용 시각 키워드 번역 사전(`translateKoreanVisualKeywords`), 도입 발문 변형기, 형성평가 고정 댓글 생성기를 교육과정 맞춤형으로 전면 개편합니다.
2. **Option 2: 수업 설계 저작 UX 기능 확장 (`App.tsx`, `ScriptEditor.tsx`, `SceneTimelineEditor.tsx`)**
   - 상단 교과·단원 직접 입력 및 학년 수준(초/중/고) 선택기를 추가하여 대본 생성 프롬프트에 실제 연동하고, 에디터/타임라인에 **[+ 형성평가 퀴즈 씬 추가]** 및 **[+ 핵심 요약 씬 추가]** 원클릭 템플릿 기능을 도입합니다.
3. **Option 3: 보조 페이지·모달 전체의 교육용 리프레이밍 & `DESIGN.md` 워크북 테마 통일**
   - `BatchGeneratorModal`(단원 차시별 일괄 제작), `AutoPilotPage`(정기 복습 스케줄러), `PublishPage`(학습지·클래스룸 링크 & 수업 챕터 자동 첨부), `PinnedCommentModal`, `MultilingualModal`, `HelpGuidePage`, `bgm.ts`, `sfx.ts`에서 괴담/썰/쿠팡 수익화 문구와 레거시 다크·네온 스타일을 제거하고 교육용 워크북 UI로 통일합니다.
4. **Option 4 (Recommended): Option 1 + 2 + 3 통합 풀스택 교육 특화 고도화**
   - 백엔드 교육 AI 엔진(Option 1), 수업 설계 저작 기능 연결 및 퀴즈 씬 빌더(Option 2), 보조 모달/페이지 교육용 워크북 통일(Option 3)을 3단계 계획으로 모두 적용하여 겉과 속이 완벽히 일치하는 **Edu-Shorts Studio**를 완성합니다.

---

### Recommendation
**Option 4 (Option 1 + 2 + 3 통합 풀스택 교육 특화 고도화)**를 권장합니다.
이유는 현재 메인 스튜디오의 디자인과 동선은 교육용으로 깔끔하게 리디자인되었으나, 실제로 교사가 **"교안 자동 생성"**을 누르거나 **"단원 일괄 생성 / 고정 댓글 / 유튜브 배포 / 예약 발행"** 탭으로 이동했을 때 백엔드 프롬프트와 보조 모달에서 기존 바이럴/괴담/쿠팡 수익화 문구가 노출되면 교육 도구로서의 신뢰도가 크게 떨어지기 때문입니다.

---

### Acceptance criteria
1. **교육과정 맞춤형 대본 생성**: 선택한 교과·단원(직접 입력 포함)과 수업 목표(도입 발문 / 핵심 개념 요약 / 형성평가 퀴즈 등)가 실제 대본 생성 요청에 반영되고, 온라인(LLM) 및 오프라인 폴백 모두에서 교육적 4단계 구조 대본과 교과 맞춤형 영문 시각 키워드가 생성될 것.
2. **원클릭 교육용 장면 빌더**: `ScriptEditor` 또는 `SceneTimelineEditor`에서 원클릭으로 **확인 퀴즈 장면(O/X·객관식)**과 **핵심 요약 정리 장면**을 추가할 수 있을 것.
3. **보조 모달·페이지의 완전한 교육용 전환 및 디자인 통일**: `BatchGeneratorModal`, `AutoPilotPage`, `PublishPage`, `PinnedCommentModal`, `MultilingualModal`, `HelpGuidePage`, `bgm.ts`, `sfx.ts`에서 괴담/썰/부자/쿠팡 파트너스 문구와 네온/다크 스타일이 제거되고 `DESIGN.md` 토큰(`#FAF8F3`, `#FFFDF8`, `#E5DEC9`, `#1E40AF`, `#B45309`)이 일관되게 적용될 것.
4. **검증 게이트 100% 통과**: `npx tsc --noEmit`, `npm run build`, `node scripts/test-features-runtime.js` (376개 항목 전원 PASS, 0 FAIL)을 모두 통과할 것.
