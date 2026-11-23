# Superpowers Debug Report: 웹 브라우저 렌더링 영상 길이(8초) 및 로컬 재생 중단(4초) 버그

## Symptom
- **사용자 증상**:
  1. 웹페이지(`https://wbmaker2.github.io/edu-shorts-studio/`)의 사이드바 배지 및 타임라인/목표 설정에는 **약 50~60초(1분)** 수업 쇼츠 제작으로 안내되어 있었으나, 실제로 렌더링된 영상이 **약 8초**로 출력됨.
  2. 해당 영상을 다운로드(`_9x16.webm`)해 로컬 동영상 플레이어에서 실행하면 **4초 지점에서 멈추고 끝까지 재생되지 않음**.

## Repro steps
1. Vite 프로덕션 빌드(`npm run build`)를 `http://localhost:4173`으로 실행.
2. Playwright로 `단원 수업 쇼츠 제작` → `[9:16 수업 쇼츠 제작 시작]` 클릭 후 생성된 `blob:` 영상 다운로드(`repro_downloaded.webm`).
3. 브라우저 `<video>` 요소 상태 및 `ffprobe`로 패킷/컨테이너 메타데이터 계측.

## Observed Instrumentation (`repro_downloaded.webm`)
- **렌더 소요 및 전체 길이**: `renderElapsedMs: 7876ms` (약 7.9초), `ffprobe` 마지막 패킷 `pts_time = 7.478000s` (총 180패킷).
- **컨테이너 결함**:
  - `video.duration`이 브라우저 DOM에서 `null`(`Infinity`)로 표시됨(시킹바 전체 길이 미확정).
  - `ffprobe -show_format`: **`duration` 필드 누락**, `avg_frame_rate: "0/0"`.
  - `ffprobe -show_packets`: 키프레임이 단 2개(`KEY: 0.000000`, `KEY: 4.224000`)만 존재하며 WebM **`Duration` / `Cues` 탐색 인덱스 누락**.

## Root causes
1. **하드코딩된 9초 상한 (`src/utils/browserEduEngine.ts:339`)**:
   - `const msPerScene = Math.min(2000, Math.max(1200, Math.round(9000 / activeScenes.length)));`
   - 각 장면의 실제 예상 분량(`scene.estimatedDuration`, 예: 44~60초)을 무시하고, `MediaRecorder` 실시간 녹화 대기 시간을 줄이기 위해 전체 길이를 9초(장면당 최대 2초 → 4장면 총 ~8초)로 강제 절단하고 있었음.
2. **Chromium `MediaRecorder` + `canvas.captureStream()`의 비정형 WebM 컨테이너 (`src/utils/browserEduEngine.ts:324-337, 465-466`)**:
   - Chromium의 `MediaRecorder`는 스트리밍 방식으로 WebM을 기록하므로 파일 헤더(`Segment > Info > Duration`)에 전체 재생 길이를 기록하지 않으며 탐색 인덱스(`Cues`)도 생성하지 않음.
   - 두 번째 키프레임(`4.224s` 클러스터 경계) 전후에서 로컬 플레이어가 전체 길이나 다음 클러스터 인덱스를 인식하지 못해 **약 4초 지점에서 재생이 중단**되는 현상이 발생함. 또한 macOS QuickTime 등 주요 기본 플레이어는 `.webm` 자체 호환성도 떨어짐.

## Fix Plan (WebCodecs H.264/AAC MP4 오프라인 고속 합 + 레거시 폴백 보강)
1. **WebCodecs (`VideoEncoder` `avc1.42001f` + `AudioEncoder` `mp4a.40.2`) + `mp4-muxer` 도입**:
   - 벽시계(`setTimeout`) 대기 없이 각 프레임에 **명시적 마이크로초 타임스탬프(`timestamp`)**를 부여해, 타임라인에 표시된 **계획 시간 전체(예: 45~60초)를 100% 그대로 인코딩**하면서도 실제 렌더링 소요 시간은 수 초 내로 단축.
   - 장면 전환마다 부드러운 차임 톤이 포함된 48kHz AAC 오디오 트랙을 함께 먹싱하고, 표준 ISO BMFF `.mp4`(`moov/mvhd` 정확한 `duration`, 키프레임 주기 2초 정렬)를 출력해 브라우저·macOS·Windows 모든 플레이어에서 `00:00`부터 종료 시점까지 멈춤 없이 재생·탐색 가능하게 개선.
2. **타임라인과 기본 교안 길이 일치**:
   - `INITIAL_EDU_SCENES` 및 `splitBrowserEduScenes`의 장면 길이를 실제 1분(약 50~60초) 수업 호흡에 맞게 일관화.
3. **WebCodecs 미지원 브라우저용 폴백 개선**:
   - `VideoEncoder` 미지원 환경에서는 `MediaRecorder` 폴백 시에도 WebM `Duration` EBML 패치를 적용하고 `requestData()` 플러시를 보장하도록 보강.
4. **회귀 테스트 추가**:
   - 실제 렌더링 후 다운로드한 `.mp4` 파일에 대해 `ffprobe`로 **정확한 `format.duration`(예: ≥ 40초, 타임라인 총합과 오차 0.5초 이내), H.264+AAC 스트림 존재, 다중 키프레임 및 마지막 패킷 PTS 검증, headless browser clean exit**를 자동 검증.

## Verification Results (Post-Fix)
- `npx tsc --noEmit`: 0 errors
- `npm run build`: Vite + Electron 프로덕션 빌드 완료
- `node scripts/test-features-runtime.js`: **PASS 380건 / FAIL 0건** (브라우저 MP4 오프라인 합성·확장자 보존 회귀 테스트 4건 추가 통과)
- Playwright + `ffprobe` 실측 (`fixed_downloaded.mp4`):
  - 타임라인 표시 시간: `총 00:57 (57초)`
  - 합성 소요 시간: `2,347ms`
  - `<video>` DOM `duration`: `57.066667` (`seekedTime: 54.319265`, `readyState: 4`, `error: null`)
  - `ffprobe`: `format_name: "mov,mp4,m4a,3gp,3g2,mj2"`, `duration: "57.066667"`, `size: 2,284,253 bytes`, Video `h264 (540x960, 10fps)`, Audio `aac (48kHz)`, `video_packets: 570`, `keyframes: 31`, `first_pts: 0.000000`, `last_pts: 56.900000`.
  - 잔존 `headless_shell` 프로세스: `0`건
