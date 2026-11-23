# Implementation Plan: Edu-Shorts Studio 교육 특화 풀스택 고도화 (Option 1 + 2 + 3 통합)

### Goal
`edu-shorts-studio`의 백엔드 AI 대본·시각 키워드·댓글 생성 엔진(`electron/main.ts`), 수업 설계 저작 UX(`src/App.tsx`, `ScriptEditor.tsx`, `SceneTimelineEditor.tsx`), 그리고 보조 페이지·모달·음향 메타데이터(`AutoPilotPage.tsx`, `BatchGeneratorModal.tsx`, `PublishPage.tsx`, `PinnedCommentModal.tsx`, `MultilingualModal.tsx`, `HelpGuidePage.tsx`, `bgm.ts`, `sfx.ts`, `README.ko.md`) 전체를 학교·학원 교사용 교육 쇼츠 저작 워크플로에 맞게 일관되게 고도화하고 `DESIGN.md` 워크북 디자인 시스템으로 통일합니다.

---

### Assumptions
1. Electron IPC 채널명 및 기존 `AppSettings` 키(`enableAutoChapters`, `enableAffiliateLinks`, `affiliateLinks`, `youtubeCommentMode`, `type: 'balance_game' | 'opinion_vote' | 'summary_quiz'`)는 기존 저장 데이터 및 런타임 테스트 호환을 위해 그대로 유지하고 UI 레이블·프롬프트·기본값만 교육용으로 전환합니다.
2. `scripts/test-features-runtime.js`가 정적/동적으로 검사하는 필수 문자열 토큰(`반전 & 진실 폭로형`, `단조로운 틀 탈피`, `흑역사`, `변기 물`, `욕실 거울 김서림 치약 꿀팁` 등 `generateSmartKoreanScript` 기존 분기)을 보존하며, `generateSmartKoreanScript` 내부에 `\n}\n`가 포함되지 않도록 들여쓰기 규칙을 준수합니다.
3. 빌드 검증은 `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && npx tsc --noEmit && npm run build && node scripts/test-features-runtime.js`로 수행합니다.

---

### Plan

1. **Step 1: 백엔드 AI 교육 프롬프트 · 오프라인 교과 엔진 · 시각/댓글 생성기 고도화**
   - Files: `electron/main.ts`
   - Change:
     - `KOREAN_SHORTS_SYSTEM_PROMPT`, `callGeminiApiForScript`, `callOpenAiApiForScript`를 초·중·고 수업 설계자(Instructional Designer) 페르소나와 4단계 수업 교안 구조(`도입 발문 → 핵심 개념 정의 → 원리·실생활 비유 → 확인 퀴즈·핵심 요약`) 중심으로 개편 (`반전 & 진실 폭로형`, `단조로운 틀 탈피` 호환 토큰 보존).
     - `generateSmartKoreanScript` 상단에 주요 교과(과학 원자와 분자/광합성/베르누이/관성, 역사 고조선 8조법/훈민정음/삼국통일, 사회·경제 기회비용/수요공급, 수학 피타고라스/확률통계) 전용 오프라인 수업 시나리오 분기를 추가하고 기존 테스트 분기를 보존.
     - `translateKoreanVisualKeywords`에 교과 개념 시각 키워드 매핑(원자·분자·세포·실험·역사유물·기하학·칠판/교실 등) 추가, `generate-hooking-variants`를 도입 발문 3종으로 개편, `generate-pinned-comments`를 형성평가 O/X·개념 비교·요약 댓글로 개편, `FALLBACK_AUTONOMOUS_TOPICS`에서 괴담/썰 제거 및 교과 영역 주제로 교체, 다국어 번역 프롬프트 교육 맥락화.
   - Verify: `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && npm run build:electron && node scripts/test-features-runtime.js`

2. **Step 2: 수업 설계 저작(Authoring) UX 확장 — 학년·단원 직접 입력 연동 & 퀴즈/요약 씬 원클릭 빌더**
   - Files: `src/App.tsx`, `src/components/ScriptEditor.tsx`, `src/components/SceneTimelineEditor.tsx`, `src/types/index.ts`
   - Change:
     - `App.tsx`에서 교사가 선택한 교과·단원(`selectedSubjectBadge`), 학년 수준(`초등 / 중등 / 고등`), 수업 단계 목표(`selectedLessonStageGoal`)를 자유 입력 가능한 인라인 컨트롤로 확장하고, `handleGenerateScript` 실행 시 백엔드 `generateScript` 페이로드 프롬프트 컨텍스트로 실제 결합.
     - `SceneTimelineEditor.tsx`와 `ScriptEditor.tsx`에 **`[+ 형성평가 퀴즈 씬 추가]`** 및 **`[+ 핵심 3줄 요약 씬 추가]`** 원클릭 버튼을 구현하여 수업 마무리 장면을 타임라인 및 대본에 즉시 삽입.
   - Verify: `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && npx tsc --noEmit`

3. **Step 3: 음향 상수 및 오토파일럿 · 일괄 생성 모달 교육용 워크북 전환**
   - Files: `src/constants/bgm.ts`, `src/constants/sfx.ts`, `src/components/BatchGeneratorModal.tsx`, `src/components/AutoPilotPage.tsx`
   - Change:
     - `bgm.ts`·`sfx.ts`의 설명에서 공포/범죄/수익창출 문구와 이모지 접두사를 제거하고 수업 분위기/강조 효과음 설명으로 재정비.
     - `BatchGeneratorModal.tsx`의 기본 예시를 *중학교/고등학교 단원 차시별 수업 목록(1~5차시)*으로 바꾸고 `DESIGN.md` 워크북 모달 테마(아이보리 카드, `#14213D` 잉크 네이비, `#1E40AF` 코발트 액션)로 통일 (`failedItems`, `maxParallel`, `activeItems` 등 런타임 테스트 체크 항목 유지).
     - `AutoPilotPage.tsx`의 괴담/썰/부자 카테고리와 클릭베이트 `HOOK_PRESETS`를 교과 영역 및 수업 도입 발문 프리셋으로 교체하고 워크북 스타일로 정돈 (`stopAutoPilot` 연동 유지).
   - Verify: `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && npx tsc --noEmit && npm run build:vite`

4. **Step 4: 배포 · 고정댓글 · 다국어 · 가이드북 페이지 교육용 전환 및 DESIGN.md 통일**
   - Files: `src/components/PublishPage.tsx`, `src/components/PinnedCommentModal.tsx`, `src/components/MultilingualModal.tsx`, `src/components/HelpGuidePage.tsx`, `README.ko.md`
   - Change:
     - `PublishPage.tsx`의 두 번째 탭을 *수업 챕터 타임스탬프 & 학습지·참고자료 링크 자동 첨부*로 리프레이밍(기존 `enableAffiliateLinks`, `affiliateLinks`, `enableAutoChapters` 키 유지, 기본 예시를 EBS/구글 클래스룸/학습지 PDF로 교체)하고 SNS 기본 해시태그와 설명 문구를 교육 채널용으로 정리.
     - `PinnedCommentModal.tsx`를 *형성평가 퀴즈 & 복습 고정 댓글 도우미*로, `MultilingualModal.tsx`를 *다문화 학급 & 글로벌 수업 교안 번역기*로, `HelpGuidePage.tsx`를 `Edu-Shorts Studio` 교사용 가이드북으로 정돈하고 다크/퍼플·네온 그라데이션을 `DESIGN.md` 토큰으로 교체. `README.ko.md`도 프로젝트 정체성에 맞게 갱신.
   - Verify: `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && npx tsc --noEmit && npm run build && node scripts/test-features-runtime.js`

5. **Step 5: 통합 검증, Review 패스 및 Superpowers 완료 기록**
   - Files: `artifacts/superpowers/execution.md`, `artifacts/superpowers/review.md`, `artifacts/superpowers/finish.md`
   - Change:
     - 전체 `tsc --noEmit`, `npm run build`, `node scripts/test-features-runtime.js` (376개 전체 통과) 재실행 및 Playwright 실화면 캡처/DOM 점검(종료 시 `browser.close()` 및 프로세스 정리 엄수).
     - Blocker/Major/Minor/Nit 리뷰를 `artifacts/superpowers/review.md`에, 최종 요약을 `artifacts/superpowers/finish.md`에 기록.
   - Verify: `node scripts/test-features-runtime.js` (FAIL 0 확인) 및 `ps aux | grep headless_shell` 잔존 0건 확인.

---

### Risks & mitigations
- **`generateSmartKoreanScript` 문자열 추출 파싱 오류 위험**: `test-features-runtime.js` 939행이 `\n}\n`으로 함수 끝을 탐색하므로 함수 내부 모든 제어문 닫는 중괄호는 반드시 2칸 이상 들여쓰기(`  }`), 그리고 외부 헬퍼 호출 없이 함수 내부에 완결 구현합니다.
- **기존 IPC 및 테스트 문자열 불일치 위험**: Step 1과 Step 4 종료 직후 각각 `npm run build` 및 `node scripts/test-features-runtime.js`를 즉시 실행해 조기에 검증합니다.

---

### Rollback plan
- 각 단계별 변경은 Git 추적 하에 있으므로 문제 발생 시 `git diff -- <file>` 또는 `git checkout -- <file>`로 특정 파일만 즉시 원복할 수 있습니다.
