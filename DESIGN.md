---
name: "Edu-Shorts Studio (에듀쇼츠 스튜디오)"
description: "Korean Study Guide & Margin Note System (단원 개념 노트 스튜디오) for 9:16 classroom micro-lesson video creation"
colors:
  oxford-cobalt: "#1E40AF"
  oxford-cobalt-deep: "#1E3A8A"
  cobalt-wash: "#EFF6FF"
  cobalt-rule: "#BFDBFE"
  highlighter-amber: "#B45309"
  highlighter-amber-bright: "#F59E0B"
  highlighter-wash: "#FEF3C7"
  highlighter-rule: "#FCD34D"
  highlighter-ink: "#78350F"
  chalkboard-pine: "#15803D"
  pine-wash: "#DCFCE7"
  pine-rule: "#86EFAC"
  pine-ink: "#14532D"
  crimson-alert: "#B91C1C"
  study-paper: "#FAF8F3"
  ivory-sheet: "#FFFDF8"
  recessed-vellum: "#F2EFE6"
  stone-hairline: "#E5DEC9"
  stone-rule-strong: "#CFC6AE"
  textbook-ink-navy: "#14213D"
  navy-rail-header: "#0F1930"
  navy-rail-card: "#1A2B4E"
  navy-rail-border: "#24365C"
  slate-graphite: "#3D4B66"
  muted-margin-slate: "#5C6B85"
typography:
  display:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Noto Sans KR, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Noto Sans KR, sans-serif"
    fontSize: "1rem"
    fontWeight: 900
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Noto Sans KR, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Noto Sans KR, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Noto Sans KR, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  stage: "22px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.oxford-cobalt}"
    textColor: "{colors.ivory-sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.oxford-cobalt-deep}"
    textColor: "{colors.ivory-sheet}"
  button-secondary-workbook:
    backgroundColor: "{colors.study-paper}"
    textColor: "{colors.textbook-ink-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  button-secondary-workbook-hover:
    backgroundColor: "{colors.recessed-vellum}"
    textColor: "{colors.textbook-ink-navy}"
  chip-curriculum-stage:
    backgroundColor: "{colors.highlighter-wash}"
    textColor: "{colors.highlighter-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  input-lesson-topic:
    backgroundColor: "{colors.study-paper}"
    textColor: "{colors.textbook-ink-navy}"
    typography: "{typography.title}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  nav-rail-item:
    backgroundColor: "{colors.textbook-ink-navy}"
    textColor: "{colors.ivory-sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  nav-rail-item-active:
    backgroundColor: "{colors.oxford-cobalt}"
    textColor: "{colors.ivory-sheet}"
  row-scene-timeline-cue:
    backgroundColor: "{colors.ivory-sheet}"
    textColor: "{colors.textbook-ink-navy}"
    typography: "{typography.body}"
    padding: "10px 14px"
---

# Design System: Edu-Shorts Studio (에듀쇼츠 스튜디오)

## Overview

**Creative North Star: "Korean Study Guide & Margin Note System (단원 개념 노트 스튜디오)"**

Edu-Shorts Studio pairs an educator's structured lesson-prep workbook with a live 9:16 classroom stage side-by-side. Tailored for Korean school teachers and academy instructors preparing 60-second micro-lesson Shorts between classes, the interface treats video creation as curriculum authoring rather than social-media content hacking. Every surface feels like a well-typeset Korean reference book (`개념서`) and teacher's margin-note planner: tactile warm paper grounds, crisp ruled hairlines, authoritative textbook ink-navy typography, and deliberate pedagogical stage tags (`도입 질문`, `핵심 개념`, `원리 · 사례`, `확인 · 비교`, `요약 정리`).

The visual world explicitly rejects the generic viral creator-SaaS dashboard aesthetic of dark neon gradients, clickbait badges, and stacked metric cards. Information density is high yet calm, organized through flat workbook sheets, structured ledger dividers, and duration-proportional cue rows that keep script text, voice timing, and 1080×1920 vertical framing legible at a glance.

**Key Characteristics:**
- Warm uncoated study-paper canvas (`#FAF8F3`) paired with elevated ivory workbook sheets (`#FFFDF8`) and 1px stone hairlines (`#E5DEC9`).
- High-contrast textbook ink-navy left navigation rail (`#14213D`) anchored by an amber graduation emblem (`#F59E0B`) and cobalt active indicators (`#1E40AF`).
- Pedagogical stage pills and highlighter-amber margin accents (`#FEF3C7` / `#B45309`) that structure every 60-second clip into classroom teaching phases.
- Persistent right-docked 9:16 classroom screen stage (`244px` max frame width, `22px` bezel radius, `4px` ink-navy frame) synchronized with a compact lesson spec ledger.
- Strict tabular numeral discipline (`font-variant-numeric: tabular-nums`) across cumulative scene timecodes, duration bars, character counts, and version badges.

## Colors

The palette balances warm, low-glare paper neutrals and deep textbook navy ink with purposeful academic accents—Oxford Cobalt for primary interactive commitment, Highlighter Amber for pedagogical stage markers, and Chalkboard Pine for local engine readiness and live media binding.

### Primary
- **Oxford Cobalt** (`#1E40AF`): Primary interactive action color used for main studio CTAs ("9:16 수업 영상 렌더링", "AI 수업 대본 생성"), active navigation rail items, selected timeline duration bars, focus rings, and form caret/accent states.
- **Oxford Cobalt Deep** (`#1E3A8A`): Hover and pressed state for primary cobalt buttons and inline action links.
- **Cobalt Wash** (`#EFF6FF`): Soft selection wash for the active timeline cue row, selected one-click preset cards, and curriculum subject badges.
- **Cobalt Rule** (`#BFDBFE`): Crisp border stroke framing cobalt-washed subject chips, selected cards, and play action badges.

### Secondary
- **Highlighter Amber** (`#B45309`): Pedagogical accent for unselected scene duration bars, teacher tip icons, 7-day production counts, and margin emphasis.
- **Highlighter Amber Bright** (`#F59E0B`): High-visibility fill for the brand graduation cap emblem, token recharge triggers, update notifications, and 9:16 stage playback progress.
- **Highlighter Wash** (`#FEF3C7`): Warm margin-highlighter surface used for lesson goal badges (`핵심 개념 1분 요약`), intro-question stage pills (`도입 질문`), teacher prep tip callouts, and offline resilience banners.
- **Highlighter Rule** (`#FCD34D`): Border stroke pairing with Highlighter Wash (`#FEF3C7`) to give stage tags and tip sheets a crisp printed label edge.
- **Highlighter Ink** (`#78350F`): High-contrast warm umber text rendered inside highlighter-washed badges and callout boxes.

### Tertiary
- **Chalkboard Pine** (`#15803D`): Readiness and media-binding accent used for free stock video auto-matching CTAs, active video tab toggles, and local Edge-TTS readiness checkmarks.
- **Pine Wash** (`#DCFCE7`): Soft mint-pine surface for completed render status chips (`렌더링 완료`), summary stage pills (`요약 정리`), and bound 9:16 video clip cards.
- **Pine Rule** (`#86EFAC`): Border stroke for Pine Wash (`#DCFCE7`) status badges and video-linked indicators.
- **Pine Ink** (`#14532D`): Deep forest ink for labels inside Pine Wash (`#DCFCE7`) pills.
- **Crimson Alert** (`#B91C1C`): Reserved strictly for invalid form borders, scene deletion actions, and token-shortage warnings.

### Neutral
- **Study Paper** (`#FAF8F3`): Default desktop workspace background, table header strips, secondary workbook button surfaces, and resting text inputs.
- **Ivory Sheet** (`#FFFDF8`): Elevated workbook sheet surface for primary cards, the top 64px context header, timeline cue sheets, and the right-docked 9:16 preview console.
- **Recessed Vellum** (`#F2EFE6`): Recessed well fill for segmented mode switches, secondary button hover states, and comparison stage pills (`확인 · 비교`).
- **Stone Hairline** (`#E5DEC9`): Standard 1px structural border separating workbook sheets, internal card headers, and ledger rows.
- **Stone Rule Strong** (`#CFC6AE`): Higher-contrast 1px border for interactive secondary buttons, form textareas, active scene inspectors, and segmented control frames.
- **Textbook Ink Navy** (`#14213D`): Primary typographic ink across all paper surfaces and the foundational background of the 256px left curriculum navigation rail.
- **Navy Rail Header** (`#0F1930`): Deepened ink-navy grounding the top brand identity header and bottom local-engine status dock inside the left rail.
- **Navy Rail Card** (`#1A2B4E`): Contained card fill inside the left rail for the educator profile and token ledger.
- **Navy Rail Border** (`#24365C`): Structural 1px divider line inside the dark ink-navy rail.
- **Slate Graphite** (`#3D4B66`): Secondary body copy, ledger field labels, and unselected tab text.
- **Muted Margin Slate** (`#5C6B85`): Helper instructions, keyboard shortcut hints (`Ctrl+Enter`), and input placeholders.

### Named Rules
**The Paper-and-Ink Polarity Rule.** Keep the dark Textbook Ink Navy (`#14213D`) strictly confined to the left navigation rail, the 9:16 phone bezel/stage interior, and dark media drawers; the authoring workspace itself must remain light, warm Study Paper (`#FAF8F3`) and Ivory Sheet (`#FFFDF8`) with zero dark-mode SaaS cards.

**The Pedagogical Highlighter Rule.** Highlighter Wash (`#FEF3C7`) with Highlighter Ink (`#78350F`) and Highlighter Rule (`#FCD34D`) is reserved for pedagogical stages, learning objectives, and teacher tips—never use it as a generic decorative background.

## Typography

**Display Font:** `Pretendard Variable`, `Pretendard` (with `-apple-system`, `BlinkMacSystemFont`, `system-ui`, `Apple SD Gothic Neo`, `Noto Sans KR`, `Malgun Gothic`, `sans-serif` fallbacks; `GmarketSansBold` loaded for rendered video title plates)
**Body Font:** `Pretendard Variable`, `Pretendard`
**Label/Mono Font:** `Pretendard Variable` with `font-variant-numeric: tabular-nums` (`.tabular-nums`)

**Character:** Pretendard Variable delivers dense, authoritative Korean hangul legibility reminiscent of modern Korean secondary-school study guides (`개념서`). Heavy weights (`800`–`900`) with tight tracking (`-0.025em`) anchor section titles without decorative display serifs, while compact `12px` (`0.75rem`) and `11px` (`0.6875rem`) labels keep multi-parameter studio controls scannable in a single desktop viewport.

### Hierarchy
- **Display** (`900` weight, `1.25rem`–`1.5rem` / `20px`–`24px`, line-height `1.25`, letter-spacing `-0.025em`): Educator study-room greeting (`선생님의 수업 쇼츠 연구실`) at the top of the dashboard workbook sheet.
- **Headline** (`900` weight, `1rem` / `16px`, line-height `1.35`, letter-spacing `-0.025em`): Top 64px lesson-context bar title announcing the active studio workspace.
- **Title** (`800` weight, `0.875rem` / `14px`, line-height `1.4`, letter-spacing `-0.015em`): Workbook sheet headers (`단원 학습 주제 및 성취 목표`, `수업 대본 검수 및 단계별 타임라인`), lesson archetype titles, and primary topic textarea input.
- **Body** (`500`–`700` weight, `0.75rem` / `12px`, line-height `1.6`): Standard studio control copy, scene narration lines, button labels, ledger rows, and teacher checklist notes.
- **Label** (`700`–`800` weight, `0.625rem`–`0.6875rem` / `10px`–`11px`, line-height `1.2`, `tabular-nums`): Pedagogical stage badges, cumulative scene timecodes (`00:00–00:08`), duration counters (`55초`), token balances, and version tags (`v1.4.15`).

### Named Rules
**The Tabular Timecode Rule.** Every numeric counter, cumulative timecode range (`00:08–00:19`), scene duration (`11s`), character count (`178자`), version tag, and token balance must enforce `font-variant-numeric: tabular-nums` so columns never jitter during script editing or playback simulation.

**The No-Kicker Heading Rule.** Workbook sheet headings open directly with a functional icon badge and an extra-bold Korean title (`14px`–`24px`, weight `800`–`900`), never preceded by uppercase English marketing kickers or decorative eyebrows.

## Layout

The desktop application uses a fixed full-viewport three-zone shell (`h-screen overflow-hidden`) designed for distraction-free lesson preparation:

1. **Left Curriculum Navigation Rail (`256px` / `w-64`, `hidden md:flex`):** Full-height fixed rail in Textbook Ink Navy (`#14213D`) with a `64px` (`h-16`) brand header, a compact educator profile and token ledger card, 9 primary studio navigation items, a schedule calendar trigger, and a bottom local-engine status dock. Under the `md` (`768px`) breakpoint, the left rail collapses into a horizontal scrollable dark navy bar directly beneath the top header.
2. **Top Lesson Context Header (`64px` / `h-16`):** Full-width Ivory Sheet (`#FFFDF8`) bar with `24px` (`px-6`) horizontal padding and a `1px` Stone Hairline (`#E5DEC9`) bottom border. Houses the active workspace headline, current curriculum subject/goal badges (`중2 과학 · 물질의 구성`, `핵심 개념 1분 요약`), batch creation trigger, version status button, and primary render CTA.
3. **Main Scrollable Study-Sheet Canvas (`flex-1 overflow-y-auto p-4 md:p-5`):**
   - **Dashboard View (`max-w-6xl mx-auto`):** Vertical stack with `24px` (`space-y-6`) rhythm—a full-width educator desk sheet on top, followed by a 3-column asymmetric grid (`grid-cols-1 lg:grid-cols-3 gap-6`) pairing a 2-column pedagogical archetype index and recent clip archive on the left with a 1-column unified studio ledger and highlighter-amber teacher tip note on the right.
   - **Studio Creation View (`max-w-[1360px] mx-auto`):** Compact `14px` (`space-y-3.5`) vertical rhythm opening with a curriculum metadata & 4-step focus filter strip, followed by an asymmetric 2-column studio grid (`grid-cols-1 xl:grid-cols-[1fr_336px] gap-4 items-start`). The left fluid column holds the 5-column one-click preset strip, lesson topic prompt, scene timeline editor, and voice/font/subtitle/media sheets; the right `336px` sticky column (`xl:sticky xl:top-2`) docks the live 9:16 classroom preview stage and render specification ledger.

## Elevation & Depth

Edu-Shorts Studio operates on a **Flat Ruled-Sheet & Tonal Layering** model. Workbook cards, timeline rows, preset tiles, and the right-docked preview console use zero drop shadows at rest, relying instead on warm tonal contrast between Study Paper (`#FAF8F3`), Ivory Sheet (`#FFFDF8`), and Recessed Vellum (`#F2EFE6`), bounded by crisp `1px` borders (`#E5DEC9` for structural containers, `#CFC6AE` for interactive controls).

### Shadow Vocabulary
- **Floating Toast Elevation** (`0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`): Applied exclusively to transient fixed viewport notifications such as the top-center network connectivity resilience toast.
- **Chalkboard Text Outline** (`-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`): Hard 4-corner black text stroke used inside the 9:16 preview stage to simulate libass (`ASS`) burned-in classroom subtitles (`samul_1min`, `mrbeast`).

### Named Rules
**The Flat Sheet Discipline Rule.** Workbook panels, preset cards, and ledger tables never cast box shadows or lift with vertical hover transforms; state changes are communicated strictly through border shifts (`#E5DEC9` → `#CFC6AE` or `#1E40AF`) and tonal background washes (`#FFFDF8` → `#FAF8F3` or `#EFF6FF`).

## Shapes

The form language combines tight editorial corner radii on paper sheets with a physical hardware bezel for the 9:16 classroom stage:

- **Workbook Sheets & Modals (`12px` / `rounded-xl`):** Outer section containers (`PromptSection`, `ScriptEditor`, `PresetBar`, `DashboardHome` panels, and the right-docked preview console) use a `12px` radius with a `1px solid #E5DEC9` border and `overflow-hidden` so internal header strips and row dividers clip cleanly.
- **Interactive Controls, Inputs & Preset Cards (`8px` / `rounded-lg`):** Primary buttons, secondary workbook buttons, navigation rail items, textareas, segmented control tracks, and individual preset cards use an `8px` radius.
- **Segmented Pills & Toolbar Actions (`6px` / `rounded-md`):** Compact toolbar buttons, subject badges in the top header, and active segmented tab pills use a `6px` radius.
- **Pedagogical Stage Chips & Inline Counters (`4px` / `rounded`):** Dense inline tags (`도입 질문`, `핵심 개념`, `v1.4.15`, `60초`) use a crisp `4px` radius with a `1px` border.
- **9:16 Classroom Screen Stage (`22px` / `rounded-[22px]`):** The vertical `aspect-[9/16]` preview viewport (`max-w-[244px]`) uses a `22px` corner radius framed by a solid `4px` Textbook Ink Navy (`#14213D`) border, visually separating the simulated student screen from the surrounding paper sheets.
- **Duration Bars & Status Dots (`9999px` / `rounded-full`):** Scene duration proportion meters (`h-2`), playback scrubbers (`h-1`), and engine online indicator dots (`6px`) use full pill geometry.

## Components

Every component feels like a precision curriculum authoring instrument—compact, bordered, and immediately legible without decorative chrome.

### Buttons
- **Shape:** Gently rounded corners (`8px` radius for primary and secondary actions; `6px` radius for compact toolbar actions).
- **Primary Button:** Solid Oxford Cobalt (`#1E40AF`) background with white (`#FFFFFF` / `#FFFDF8`) text, `12px` (`0.75rem`) extra-bold (`800`) typography, `10px 16px` (`px-4 py-2.5`) or `12px 16px` (`py-3 px-4`) padding, and an inline `14px`–`16px` icon.
- **Hover / Focus / Disabled:** Shifts cleanly to Oxford Cobalt Deep (`#1E3A8A`) via `transition-colors` (`150ms`); keyboard `:focus-visible` renders a `2px solid #1E40AF` outline with a `2px` offset; disabled states drop to `50%` opacity (`disabled:opacity-50`).
- **Secondary Workbook Button:** Study Paper (`#FAF8F3`) or Ivory Sheet (`#FFFDF8`) background, Textbook Ink Navy (`#14213D`) bold (`700`) text, `1px solid #CFC6AE` border, shifting to Recessed Vellum (`#F2EFE6`) on hover.
- **Semantic Action Variants:** Chalkboard Pine (`#15803D`, hover `#166534`) for one-click stock video auto-matching; Highlighter Amber Bright (`#F59E0B`, hover `#D97706`) with Textbook Ink Navy (`#14213D`) text for local PC video selection, token recharge, and software update CTAs.

### Chips
- **Pedagogical Stage Chips:** `4px` radius (`rounded`), `2px 8px` (`px-2 py-0.5`) padding, `11px` extra-bold (`800`) text, and a `1px` border coded by lesson phase:
  - `도입 질문` (Intro Question): Highlighter Wash (`#FEF3C7`) fill, Highlighter Ink (`#78350F`) text, Highlighter Rule (`#FCD34D`) border.
  - `핵심 개념` & `원리 · 사례` (Core Concept / Principle): Cobalt Wash (`#EFF6FF`) fill, Oxford Cobalt (`#1E40AF`) text, Cobalt Rule (`#BFDBFE`) border.
  - `확인 · 비교` (Check & Compare): Recessed Vellum (`#F2EFE6`) fill, Textbook Ink Navy (`#14213D`) text, Stone Rule Strong (`#CFC6AE`) border.
  - `요약 정리` (Summary Takeaway): Pine Wash (`#DCFCE7`) fill, Pine Ink (`#14532D`) text, Pine Rule (`#86EFAC`) border.
- **Curriculum Subject Filter Chips:** `4px`–`8px` radius, `11px`–`12px` bold text. Unselected chips sit on Study Paper (`#FAF8F3`) with Slate Graphite (`#3D4B66`) text and Stone Hairline (`#E5DEC9`) borders; active curriculum chips invert to Textbook Ink Navy (`#14213D`) with warm amber (`#FDE68A`) or white text.

### Cards / Containers
- **Corner Style:** `12px` radius (`rounded-xl`) on outer workbook sheets; `8px` radius (`rounded-lg`) on nested inspector wells and preset tiles.
- **Background:** Ivory Sheet (`#FFFDF8`) for primary containers, paired with a `1px` bottom-bordered header strip in Study Paper (`#FAF8F3`) when a sheet contains a multi-row table or archetype list.
- **Shadow Strategy:** Strictly flat (`box-shadow: none`), adhering to the Flat Sheet Discipline Rule.
- **Border:** `1px solid #E5DEC9` on resting sheets; `1px solid #CFC6AE` on active scene inspector wells; `1px solid #1E40AF` with Cobalt Wash (`#EFF6FF`) fill on selected preset tiles.
- **Internal Padding:** `14px`–`20px` (`p-3.5` to `p-5`) in the dense studio workspace; `20px`–`24px` (`p-5` to `p-6`) on dashboard overview sheets.

### Inputs / Fields
- **Style:** `8px` radius (`rounded-lg`), `1px solid #CFC6AE` border, Study Paper (`#FAF8F3`) or Ivory Sheet (`#FFFDF8`) background, `10px 14px` (`px-3.5 py-2.5`) padding, Textbook Ink Navy (`#14213D`) semi-bold (`600`) text, and Muted Margin Slate (`#5C6B85`) placeholders.
- **Focus:** Border shifts to Oxford Cobalt (`#1E40AF`) and background brightens to pure white (`#FFFFFF`) with `outline: none` (or global `:focus-visible` `2px solid #1E40AF` outline on keyboard navigation). Korean IME composition is protected so `Ctrl+Enter` / `Cmd+Enter` submits only when `!event.nativeEvent.isComposing`.
- **Error / Invalid:** `:user-invalid` shifts the border stroke to Crimson Alert (`#B91C1C`).

### Navigation
- **Left Textbook Ink-Navy Rail (`Sidebar`):** `256px` (`w-64`) fixed vertical rail in `#14213D` with `#24365C` borders. Each nav item is a full-width `8px`-rounded button (`px-3 py-2.5`, `12px` font size) featuring a `4px × 14px` (`w-1 h-3.5`) vertical pill indicator on the far left, a `16px` icon, a Korean label, and an optional right-aligned tabular badge (`60초`, `NEW`, `자동`, or project count).
- **Default / Hover / Active States:** Default items use `#B6C7E6` text and `#9FB2D4` icons; hover shifts background to `#1C2E52` with white text and a subtle `#3B5998` left bar; active items fill with Oxford Cobalt (`#1E40AF`), a `#3B63D6` border, a bright amber (`#FBBF24`) left indicator pill, `#FDE68A` icon, and a dark `#14213D` badge pill.
- **Segmented Workbook Filters:** Recessed Vellum (`#F2EFE6`) container (`p-1 rounded-lg border border-[#CFC6AE]`) holding compact `11px`–`12px` bold buttons that invert to Oxford Cobalt (`#1E40AF`) or Textbook Ink Navy (`#14213D`) when active.

### Pedagogical Cue-Sheet & Duration-Proportional Timeline (`SceneTimelineEditor`)
The signature component of Edu-Shorts Studio replaces complex multi-track NLE timelines with a scannable 4-column pedagogical cue sheet (`grid-cols-1 md:grid-cols-[88px_90px_1fr_130px] items-center gap-2.5 px-3.5 py-2.5`) divided by `1px` Stone Hairlines (`#E5DEC9`):
1. **Cumulative Tabular Timecode (`88px`):** Displays exact start–end range (`00:00–00:08`) in `12px` extra-bold Slate Graphite (`#3D4B66`) with `tabular-nums`.
2. **Pedagogical Stage Pill (`90px`):** Auto-assigns the scene's instructional role (`도입 질문` → `핵심 개념` → `원리 · 사례` → `확인 · 비교` → `요약 정리`) based on sequence position.
3. **Narration Line (`1fr`):** Single-line truncated preview of the teacher's spoken script in `12px` semi-bold Textbook Ink Navy (`#14213D`).
4. **Duration-Proportional Bar & Media Badge (`130px`):** A `64px × 8px` (`w-16 h-2`) rounded track in Stone Hairline (`#E5DEC9`) whose inner fill width (`18%`–`100%`) scales proportionally to the scene's estimated speech duration—colored Oxford Cobalt (`#1E40AF`) when selected and Highlighter Amber (`#B45309`) at rest—paired with a tabular seconds readout (`11s`) and an AI illustration (`#EFF6FF`/`#1E40AF`) or stock video (`#DCFCE7`/`#14532D`) icon badge.

## Do's and Don'ts

### Do:
- **Do** build every workspace panel on Study Paper (`#FAF8F3`) and Ivory Sheet (`#FFFDF8`) with `1px` Stone Hairlines (`#E5DEC9`) and stronger `#CFC6AE` borders on interactive controls.
- **Do** apply `tabular-nums` (`font-variant-numeric: tabular-nums`) to every timecode (`00:00–00:08`), duration readout (`55초`), character count, version badge, and token counter.
- **Do** tag lesson scenes and presets with the 5 pedagogical stage badges (`도입 질문`, `핵심 개념`, `원리 · 사례`, `확인 · 비교`, `요약 정리`) using their designated semantic washes.
- **Do** keep the 9:16 Classroom Screen Stage (`max-w-[244px]`, `rounded-[22px]`, `border-[4px] border-[#14213D]`) docked in the right `336px` studio column alongside the compact 2-column lesson spec ledger.
- **Do** guard Korean text inputs and textareas against IME composition (`!event.nativeEvent.isComposing`) on keyboard shortcuts (`Ctrl+Enter` / `Enter`).

### Don't:
- **Don't** introduce dark-mode slate/zinc cards, neon purple/cyan gradients, glassmorphism (`backdrop-blur`), or glowing box shadows into the paper workbook workspace.
- **Don't** stack 4 equal KPI metric cards in a row at the top of the dashboard; consolidate operational counts and engine readiness into the single bordered `<dl>` studio ledger.
- **Don't** place uppercase English marketing kickers or decorative eyebrow labels above Korean section headings.
- **Don't** use viral clickbait or monetization jargon ("떡상", "어그로", "수익화 폭격") in labels, presets, or helper copy; always use classroom-oriented educator terminology (`단원 학습 주제`, `교안 프리셋`, `수업 도입 질문`).
- **Don't** animate cards or buttons with vertical lift transforms (`-translate-y-*` or `scale-*`) on hover; rely on crisp border and background color transitions.
