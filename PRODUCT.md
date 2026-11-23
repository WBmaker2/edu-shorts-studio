# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are school teachers (초·중·고 교사) and academy instructors (학원 강사) in Korea. They prepare short-form 9:16 micro-lesson videos for class introductions (수업 도입 동기부여), 1-minute core concept summaries (핵심 개념 1분 요약), review/reinforcement clips (복습 정리), and flipped-learning pre-study (거꾸로 수업 예습 자료).

## Product Purpose

Edu-Shorts Studio (에듀쇼츠 스튜디오) enables educators to turn a curriculum topic, learning objective, or existing lecture video into a complete 9:16 educational Shorts video (script, Korean TTS narration, scene visuals, synchronized ASS subtitles, and background audio) in a single desktop workspace—without video editing expertise.

## Positioning

Unlike generic viral or monetization-focused Shorts tools, Edu-Shorts Studio structures creation around classroom instruction: subject/grade/difficulty framing, pedagogical script structures (lesson intro, concept breakdown, quiz/check, key takeaway), and educator-ready presets, while keeping local/free TTS and rendering engines immediately usable without mandatory paid API keys.

## Operating Context

- Desktop Electron application (`electron/main.ts`, `electron/preload.ts`) running a React + TypeScript + Vite + Tailwind CSS renderer on Windows 10/11 (x64) and development environments.
- Educators operate the studio between classes or during lesson prep, often starting from a textbook unit, a single concept prompt, an Excel/CSV topic list for a full unit series, or an existing horizontal lecture recording (`video-to-shorts` / `long-to-shorts`).
- Output artifacts are 1080×1920 MP4 videos, thumbnails, and optional multi-platform/class-sharing metadata (YouTube, Instagram, TikTok, Naver Clip, multilingual bundles, and scheduled publishing).

## Capabilities and Constraints

- **Full Electron IPC & Media Pipeline Compatibility (Mandatory):** Must preserve 100% compatibility with existing `window.electronAPI` IPC handlers in `electron/preload.ts` and `electron/main.ts`—including `generate-script`, `split-script-scenes`, `render-shorts`, FFmpeg video composition, libass (ASS) subtitle burn-in, Edge-TTS / ElevenLabs audio synthesis, image/stock video engines, BGM/SFX mixing with ducking, hardware acceleration (`NVENC`, `QSV`, `AMF`), batch generation, video-to-shorts cutting, project persistence, settings persistence, license/admin session checks, and scheduled publishing.
- **Core Workflows:** Dashboard overview, AI lesson script & scene editor with 9:16 live preview, educational one-click presets, lecture video highlight cutter (`video-to-shorts`), batch unit series generator, Auto-Pilot scheduler, AI/engine settings, project library, preset/voice manager, multi-channel publishing, and help guide.
- **Free-First Engine Option:** Built-in rule-based script generation, free image generation, and Edge-TTS work with zero external API keys; Gemini, OpenAI, ElevenLabs, Fal, Stability, Pexels, and Pixabay remain optional upgrades.
- **Existing Brand Assets & Local Data:** Preserve `public/bgm`, `public/sfx`, local font assets/definitions (`Pretendard`, `GmarketSansBold`, `Black Han Sans`, `Do Hyeon`, `Noto Sans KR`), and license/storage backward compatibility where keys already exist (`kshorts_auth`, `kshorts_tokens`, `kshorts_custom_presets`).

## Brand Commitments

- **Product Name:** Edu-Shorts Studio (에듀쇼츠 스튜디오) — rebranded from K-Shorts Studio.
- **Language & Tone:** Korean primary interface tailored for Korean educators; clear, trustworthy, classroom-oriented terminology instead of viral clickbait or aggressive monetization jargon.

## Evidence on Hand

- Full React + Electron codebase (`src/`, `electron/`) with working FFmpeg, ASS subtitle, Edge-TTS, BGM/SFX (`public/bgm`, `public/sfx`), and 377-item runtime feature test suite (`scripts/test-features-runtime.js`).
- Incumbent desktop screenshots in `docs/screenshots/` (`dashboard.png`, `create.png`, `video-to-shorts.png`, `autopilot.png`, `presets.png`, `settings.png`, `sample-frames.jpg`).

## Product Principles

1. **Pedagogy Over Hype:** Every prompt, preset, subtitle option, and workflow defaults to clarity, student comprehension, and accurate classroom tone over sensational clickbait.
2. **Guided Studio Flow:** Reduce cognitive load for busy teachers—guide from topic/grade/objective to script, scene visuals, and 9:16 preview in a clear sequential rhythm.
3. **Zero-Friction Local Start:** Make free/no-API-key workflows obvious and reliable while keeping optional AI/cloud engines cleanly organized.
4. **Pipeline Integrity:** Never break underlying Electron IPC contracts, render parameters, or project persistence while transforming the interface and UX.
