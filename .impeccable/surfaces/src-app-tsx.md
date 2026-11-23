---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Sidebar.tsx","src/components/DashboardHome.tsx","src/components/PromptSection.tsx","src/components/PresetBar.tsx","src/components/ScriptEditor.tsx","src/components/SceneTimelineEditor.tsx","src/components/ShortsPhonePreview.tsx"]
---

# Surface Brief — Edu-Shorts Studio Desktop Workspace

- **Scope & Mode:** `src/App.tsx` and all studio views (`operate`)
- **Audience & Task:** Korean school teachers and academy instructors preparing 60-second 9:16 micro-lesson Shorts (lesson intro, concept summary, quiz check, flipped learning) from a topic or lecture video.
- **Constraints:** Preserve 100% compatibility with Electron IPC (`window.electronAPI`), FFmpeg/ASS rendering, Edge-TTS/ElevenLabs voices, BGM/SFX, batch/video-to-shorts tools, and license/project storage.

## Direction contract

- **THESIS:** An educator's lesson-prep workbook and 9:16 classroom stage side-by-side—refusing the generic viral SaaS creator dashboard of neon gradients, clickbait badges, and stacked metric cards.
- **OWN-WORLD:** Warm uncoated study-paper ground (`#FAF8F3`), elevated ivory sheet panels (`#FFFDF8`) with crisp warm stone hairlines (`#E5DEC9`), deep textbook ink-navy rail and primary ink (`#14213D`), oxford cobalt interactive focus (`#1E40AF`), and highlighter amber (`#D97706` / `#FEF3C7`) reserved for learning objectives, key concepts, and pedagogical stages.
- **STORY:** A teacher selects a subject/grade and lesson goal, structures a 4–6 step pedagogical script (도입 질문 → 핵심 개념 → 비교/사례 → 확인 퀴즈 → 핵심 정리), verifies the live 9:16 classroom preview, and renders an MP4 lesson clip.
- **FIRST VIEWPORT:** Left 236px ink-navy curriculum rail (`#14213D`), top 64px lesson-context header with subject/grade chips and primary render/create CTA, main study-sheet workspace with pedagogical preset strip, topic/objective prompt, duration-proportional scene timeline (`tabular-nums`), and a persistent right-docked 9:16 classroom preview stage on the studio tab.
- **FORM:** Candidate 1 of 7 (단원 개념 노트 스튜디오 — Korean Study Guide & Margin Note System), raised with flat zone clarity, right-docked 9:16 stage primacy, duration-proportional scene bars, and strict tabular numerals (`seed:caa687c1a8626aad`).
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
