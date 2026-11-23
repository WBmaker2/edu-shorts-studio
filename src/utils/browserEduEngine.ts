import { Muxer as Mp4Muxer, ArrayBufferTarget } from 'mp4-muxer';
import type {
  HookingVariant,
  MultilingualTranslationItem,
  PinnedCommentSuggestion,
  ScriptScene,
} from '../types';

export interface BrowserScriptInput {
  topic: string;
  title?: string;
  subjectBadge?: string;
  gradeLevel?: string;
  lessonGoal?: string;
}

/**
 * API 키나 데스크톱 백엔드 없이 브라우저에서도 동작하는 4단계 교육 쇼츠 대본 생성기
 */
export function generateBrowserEduScript(input: BrowserScriptInput): string {
  const displayTitle = (input.title || input.topic || '오늘의 핵심 개념').replace(/[#\r\n]/g, '').trim();
  const combined = `${displayTitle} ${input.subjectBadge || ''} ${input.topic || ''}`.toLowerCase();

  if (combined.includes('원자') || combined.includes('분자') || combined.includes('원소') || combined.includes('이온')) {
    return (
      `원자와 분자, 교과서에서 매번 나오는데 정확히 무엇이 다른지 아직 헷갈리시나요? 레고 블록으로 딱 1분 만에 구분해 드립니다!\n\n` +
      `원자는 물질을 이루는 더 이상 쪼개지지 않는 가장 작은 기본 알갱이입니다. 산소 원자, 수소 원자처럼 물질의 종류를 결정하는 재료 한 조각이라고 생각하면 쉽습니다.\n\n` +
      `반면 분자는 이 원자들이 규칙에 맞게 결합해 물질 고유의 성질을 나타내는 가장 작은 단위입니다. 수소 원자 2개와 산소 원자 1개가 만나면 비로소 '물 분자'가 됩니다.\n\n` +
      `정리해 볼까요? 기본 재료 한 알은 원자, 성질을 지닌 완성품은 분자입니다! 물 분자 1개에는 총 몇 개의 원자가 들어 있을까요? 오늘 배운 핵심을 노트에 정리해 봅시다!`
    );
  }

  if (combined.includes('광합성') || combined.includes('엽록체') || (combined.includes('세포') && combined.includes('식물'))) {
    return (
      `식물은 입도 없는데 매일 햇빛만 받고 어떻게 영양분을 만들며 자랄까요? 정답은 잎 속 초록 공장, 광합성에 있습니다!\n\n` +
      `광합성은 식물의 엽록체에서 빛에너지를 이용해 물과 이산화탄소를 포도당과 산소로 바꾸는 과정입니다.\n\n` +
      `여기서 자주 헷갈리는 함정이 있습니다. 식물은 낮에만 광합성을 하지만, 살아가기 위한 호흡은 낮과 밤 구분 없이 24시간 내내 한다는 사실입니다.\n\n` +
      `확인 문제입니다! 광합성에 꼭 필요한 기체는 이산화탄소일까요, 산소일까요? 오늘 수업 핵심 반응식을 떠올리며 답해 보세요!`
    );
  }

  if (combined.includes('관성') || combined.includes('베르누이') || combined.includes('부력') || combined.includes('작용')) {
    return (
      `버스가 갑자기 출발하면 왜 몸이 뒤로 쏠리고, 급정거하면 왜 앞으로 넘어질까요? 바로 뉴턴 운동 제1법칙, 관성 때문입니다!\n\n` +
      `관성은 물체가 원래의 운동 상태를 그대로 유지하려는 성질입니다. 정지해 있던 버스가 앞으로 튀어 나가도 우리 몸은 제자리에 있으려 하기 때문에 뒤로 쏠립니다.\n\n` +
      `반대로 달리는 버스에서 급브레이크를 밟으면 몸은 계속 앞으로 나아가려 해 앞으로 쏠리며, 이것이 안전벨트를 매야 하는 과학적 이유입니다.\n\n` +
      `오늘 확인 퀴즈! 멈춰 있던 공이 계속 멈춰 있으려는 성질도 관성일까요? 정답은 O! 핵심 원리로 꼭 기억해 봅시다!`
    );
  }

  if (combined.includes('고조선') || combined.includes('8조법') || combined.includes('훈민정음') || combined.includes('삼국통일')) {
    return (
      `우리 역사 최초의 국가 고조선에는 왜 8조법이라는 엄격한 법이 있었을까요? 남은 세 조항만으로 고조선 사회의 모습을 복원해 봅시다!\n\n` +
      `첫째, 사람을 죽인 자는 즉시 사형에 처해 생명과 노동력을 매우 중시했음을 알 수 있습니다.\n\n` +
      `둘째, 남에게 상해를 입힌 자는 곡식으로 배상하게 하여 농경 사회였음을 보여주며, 셋째, 도둑질은 노비나 50만 전으로 배상해 사유재산과 계급이 존재했음을 증명합니다.\n\n` +
      `단 세 조항만으로 생명 존중, 사유재산, 계급 사회라는 3대 핵심 키워드가 모두 읽히죠? 시험에 자주 나오는 고조선 특징을 한 번 더 정리해 보세요!`
    );
  }

  if (combined.includes('기회비용') || combined.includes('매몰비용') || (combined.includes('수요') && combined.includes('공급'))) {
    return (
      `시험 공부를 할지 영화를 볼지 고민될 때, 경제학에서는 무엇을 기준으로 합리적 선택을 내릴까요? 핵심은 바로 기회비용입니다!\n\n` +
      `기회비용은 어떤 선택으로 포기해야 하는 대안 중 가장 가치가 큰 것 하나입니다. 영화표 값뿐 아니라 포기한 공부의 가치까지 함께 계산해야 합니다.\n\n` +
      `반면 이미 지출해서 돌려받을 수 없는 비용을 매몰비용이라고 부릅니다. 재미없는 영화도 표 값이 아까워 끝까지 보는 심리가 매몰비용의 오류죠.\n\n` +
      `확인 퀴즈! 이미 결제한 헬스장 연회비는 합리적 선택 시 고려해야 할까요? 과거의 매몰비용은 잊고 미래 편익으로 결정해야 합니다!`
    );
  }

  if (combined.includes('에빙하우스') || combined.includes('망각곡선') || combined.includes('메타인지') || combined.includes('피타고라스')) {
    return (
      `열심히 공부했는데도 다음 날 시험지 앞에서 머리가 하얘지는 이유, 심리학자 에빙하우스의 망각곡선으로 설명할 수 있습니다!\n\n` +
      `실험에 따르면 학습 후 20분 만에 42퍼센트, 하루가 지나면 약 70퍼센트를 잊게 됩니다. 눈으로만 읽는 수동적 복습은 착각만 키울 뿐입니다.\n\n` +
      `가장 확실한 해법은 10분 뒤, 1일 뒤, 1주일 뒤 간격을 두고 백지에 핵심 키워드를 스스로 인출해 보는 분산 인출 연습입니다.\n\n` +
      `지금 눈을 감고 오늘 수업의 핵심 키워드 한 가지를 떠올려 보세요! 스스로 설명할 수 있어야 진짜 내 지식이 됩니다.`
    );
  }

  const gradeTag = input.gradeLevel ? `${input.gradeLevel} 눈높이` : '핵심 단원';
  const subjectTag = (input.subjectBadge || '교과 공통').trim();
  const goalTag = (input.lessonGoal || '핵심 개념 1분 요약').trim();

  return (
    `[${subjectTag}] "${displayTitle}", 교과서 설명만으로는 막연히 어렵지 않으셨나요? ${gradeTag}에 맞춰 ${goalTag} 관점으로 1분 정리해 드립니다!\n\n` +
    `먼저 가장 중요한 핵심 개념부터 짚어 보겠습니다. "${displayTitle}"에서 꼭 구분해야 할 기준은 현상 뒤에 숨은 원인과 조건의 인과 관계입니다.\n\n` +
    `우리 일상 속 친숙한 사례에 비유하면 훨씬 쉽게 기억할 수 있습니다. 결과만 단순 암기하지 말고 '왜 이런 변화가 나타나는가'를 연결해 보세요.\n\n` +
    `마지막 확인 퀴즈입니다! 오늘 배운 핵심 키워드와 적용 원리를 노트에 단 한 문장으로 요약해 적어 보며 수업을 마무리합시다!`
  );
}

/**
 * 대본 문단을 약 1분(50~60초) 호흡의 장면 배열로 분할
 */
export function splitBrowserEduScenes(script: string, title: string = ''): ScriptScene[] {
  const lines = String(script || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const sliced = lines.slice(0, 8);
  const perSceneMin = sliced.length <= 4 ? 12 : sliced.length === 5 ? 10 : 8;
  return sliced.map((text, idx) => ({
    id: idx,
    text,
    visualPrompt: `${title || '교과 핵심 개념'} 수업 시각 자료 장면 ${idx + 1}`,
    isThumbnail: idx === 0,
    estimatedDuration: Math.max(perSceneMin, Math.round(text.length / 4.2)),
    mediaType: 'image',
  }));
}

/**
 * API 없이 도입 발문 3종 변형 생성
 */
export function generateBrowserHookingVariants(topic: string): HookingVariant[] {
  const base = (topic || '').trim() || '원자와 분자의 구분 원리';
  return [
    {
      id: 'variant_a',
      type: '오개념 점검 · O/X 발문형',
      badge: '오개념 진단형',
      title: `${base}, 혹시 이렇게 잘못 알고 있진 않나요?`,
      hookIntro: '수업 시작 전 3초 O·X 개념 점검',
      visualKeyword: `Bright educational classroom diagram illustrating ${base}`,
      ctrScore: 96,
      reason: '학생들이 자주 틀리는 오개념을 정면으로 짚어 첫 3초 집중과 능동적 사고를 유도합니다.',
    },
    {
      id: 'variant_b',
      type: '호기심 · 실생활 탐구형',
      badge: '생활 연계형',
      title: `일상 속 ${base}, 왜 이런 현상이 일어날까요?`,
      hookIntro: '교과서 개념을 주변 사례로 바로 이해하기',
      visualKeyword: `Hands-on daily life classroom observation of ${base}`,
      ctrScore: 93,
      reason: '익숙한 일상 현상과 교과 개념을 연결해 학습 동기를 끌어올립니다.',
    },
    {
      id: 'variant_c',
      type: '핵심 요약 · 단원 1분 정리형',
      badge: '시험 핵심 정리',
      title: `딱 1분 만에 끝내는 ${base} 핵심 개념 정리`,
      hookIntro: '수업 전 예습 · 시험 직전 필수 포인트',
      visualKeyword: `Clean educational study card summary of ${base}`,
      ctrScore: 90,
      reason: '핵심 키워드와 1분 구성을 분명히 제시해 예습·복습 활용도를 높입니다.',
    },
  ];
}

/**
 * API 없이 형성평가 & 복습 고정 댓글 3종 생성
 */
export function generateBrowserPinnedComments(topic: string): PinnedCommentSuggestion[] {
  const topicLabel = (topic || '오늘의 핵심 개념').trim();
  return [
    {
      type: 'balance_game',
      question: `"${topicLabel}" 핵심 개념 O·X 확인 퀴즈`,
      options: ['O (핵심 원리에 부합한다)', 'X (자주 헷갈리는 오개념이다)'],
      fullCommentText:
        `📝 [3초 형성평가 O·X 퀴즈] "${topicLabel}" 핵심 원리, 정확히 이해했나요?\n` +
        `1. O — 오늘 배운 원리 그대로 이해했다\n` +
        `2. X — 헷갈리는 부분을 다시 확인하고 싶다\n` +
        `정답 번호와 이유를 댓글로 남겨보세요!`,
    },
    {
      type: 'opinion_vote',
      question: '실생활 예시 연결하기',
      fullCommentText: `💬 "${topicLabel}" 원리를 우리 일상생활에서 찾아본다면 어떤 예시가 있을까요? 떠오르는 사례를 댓글로 공유하면 복습 효과가 배가 됩니다!`,
    },
    {
      type: 'summary_quiz',
      question: '오늘의 1분 핵심 한 줄 정리',
      fullCommentText: `📌 [오늘 수업 한 줄 요약 과제]\n영상 속 핵심 개념을 내 노트에 적듯 단 한 문장으로 요약해 댓글로 남겨보세요!`,
    },
  ];
}

/**
 * API 키 없이 무료 번역 엔드포인트 기반 3개국어 수업 교안 변환
 */
export async function generateBrowserMultilingual(
  title: string,
  script: string
): Promise<Record<'en' | 'ja' | 'es', MultilingualTranslationItem>> {
  const translateOne = async (text: string, target: 'en' | 'ja' | 'es'): Promise<string | null> => {
    try {
      const url =
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${target}&dt=t&q=` +
        encodeURIComponent(text.slice(0, 3500));
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      const data: any = await res.json();
      const out = Array.isArray(data?.[0]) ? data[0].map((seg: any) => (seg && seg[0]) || '').join('') : '';
      return out.trim() || null;
    } catch {
      return null;
    }
  };

  const cleanTitle = (title || '1분 핵심 개념 수업').trim();
  const cleanScript = (script || '').trim();

  const [enT, enS, jaT, jaS, esT, esS] = await Promise.all([
    translateOne(cleanTitle, 'en'),
    translateOne(cleanScript, 'en'),
    translateOne(cleanTitle, 'ja'),
    translateOne(cleanScript, 'ja'),
    translateOne(cleanTitle, 'es'),
    translateOne(cleanScript, 'es'),
  ]);

  return {
    en: {
      lang: 'en',
      langName: 'English (영어 교안)',
      flag: '🇺🇸',
      title: enT || `1-Minute Key Lesson: ${cleanTitle}`,
      script: enS || `[Lesson Summary] ${cleanScript}`,
      recommendedVoiceId: 'en-US-ChristopherNeural',
      recommendedVoiceName: 'Christopher (명료한 강의 톤)',
      tags: ['#Shorts', '#Education', '#StudyTips'],
    },
    ja: {
      lang: 'ja',
      langName: '日本語 (일본어 교안)',
      flag: '🇯🇵',
      title: jaT || `1分でわかる重要授業: ${cleanTitle}`,
      script: jaS || `[授業まとめ] ${cleanScript}`,
      recommendedVoiceId: 'ja-JP-NanamiNeural',
      recommendedVoiceName: 'Nanami (친근한 교사 톤)',
      tags: ['#ショート授業', '#勉強法', '#わかりやすく解説'],
    },
    es: {
      lang: 'es',
      langName: 'Español (스페인어 교안)',
      flag: '🇪🇸',
      title: esT || `Lección clave en 1 minuto: ${cleanTitle}`,
      script: esS || `[Resumen de clase] ${cleanScript}`,
      recommendedVoiceId: 'es-ES-AlvaroNeural',
      recommendedVoiceName: 'Alvaro (또렷한 해설 톤)',
      tags: ['#Shorts', '#Educacion', '#Aprendizaje'],
    },
  };
}

function wrapKoreanCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (ctx.measureText(w).width > maxWidth) {
        let chunk = '';
        for (const ch of w) {
          if (ctx.measureText(chunk + ch).width > maxWidth) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
      } else {
        current = w;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

const STAGE_LABELS = ['도입 발문', '핵심 개념', '원리 · 사례', '확인 · 비교', '요약 정리'];
const CANVAS_FONT_STACK = '"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';

interface PlannedSceneSegment {
  scene: ScriptScene;
  idx: number;
  stageName: string;
  startSec: number;
  durationSec: number;
}

function buildSceneSchedule(scenes: ScriptScene[]): {
  segments: PlannedSceneSegment[];
  totalSec: number;
} {
  const activeScenes =
    scenes.length > 0
      ? scenes
      : [
          {
            id: 0,
            text: '오늘의 핵심 개념을 1분 만에 정리해 봅시다.',
            visualPrompt: '',
            isThumbnail: true,
            estimatedDuration: 15,
          },
        ];

  let cursor = 0;
  const segments: PlannedSceneSegment[] = activeScenes.map((scene, sIdx) => {
    const dur = Math.max(4, Math.round(scene.estimatedDuration || 12));
    const stageName =
      sIdx === 0
        ? STAGE_LABELS[0]
        : sIdx === activeScenes.length - 1 && activeScenes.length > 2
        ? STAGE_LABELS[4]
        : STAGE_LABELS[Math.min(sIdx, STAGE_LABELS.length - 1)];
    const seg: PlannedSceneSegment = {
      scene,
      idx: sIdx,
      stageName,
      startSec: cursor,
      durationSec: dur,
    };
    cursor += dur;
    return seg;
  });

  return { segments, totalSec: Math.max(4, cursor) };
}

function drawEduSlideFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: {
    cleanTitle: string;
    subjectBadge: string;
    channelName: string;
    seg: PlannedSceneSegment;
    totalScenes: number;
    localT: number;
    overallProgress: number;
    elapsedSec: number;
    totalSec: number;
  }
) {
  const { cleanTitle, subjectBadge, channelName, seg, totalScenes, localT, overallProgress, elapsedSec, totalSec } =
    params;

  // Ink-Navy Chalkboard & Paper Margin Note Frame
  ctx.fillStyle = '#0F1B33';
  ctx.fillRect(0, 0, width, height);

  // Subtle ruled margin grid
  ctx.strokeStyle = 'rgba(229, 222, 201, 0.07)';
  ctx.lineWidth = 1;
  for (let y = 140; y < height - 100; y += 36) {
    ctx.beginPath();
    ctx.moveTo(28, y);
    ctx.lineTo(width - 28, y);
    ctx.stroke();
  }

  // Top subject pill
  ctx.fillStyle = '#1E335C';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 125, 44, 250, 32, 16);
  ctx.fill();
  ctx.strokeStyle = '#60A5FA';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#E8EEF7';
  ctx.font = `bold 14px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.fillText(subjectBadge || '교육 개념 요약', width / 2, 65);

  // Highlighter Tape Title Header
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.roundRect(44, 96, width - 88, 56, 12);
  ctx.fill();

  ctx.fillStyle = '#14213D';
  ctx.font = `900 18px ${CANVAS_FONT_STACK}`;
  ctx.fillText(cleanTitle, width / 2, 130);

  // Central Concept Chalkboard Card with gentle zoom motion
  const scale = 1 + localT * 0.025;
  ctx.save();
  ctx.translate(width / 2, 430);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#16284C';
  ctx.beginPath();
  ctx.roundRect(-215, -170, 430, 340, 20);
  ctx.fill();
  ctx.strokeStyle = '#2F4A80';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Stage Pill inside board
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.roundRect(-80, -142, 160, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#78350F';
  ctx.font = `800 13px ${CANVAS_FONT_STACK}`;
  ctx.fillText(`STEP ${seg.idx + 1}/${totalScenes} · ${seg.stageName}`, 0, -123);

  // Scene main text inside board
  ctx.fillStyle = '#FAF8F3';
  ctx.font = `bold 21px ${CANVAS_FONT_STACK}`;
  const wrapped = wrapKoreanCanvasText(ctx, seg.scene.text, 370);
  const lineHeight = 33;
  const startY = -((wrapped.length - 1) * lineHeight) / 2 + 12;
  wrapped.slice(0, 7).forEach((line, lIdx) => {
    ctx.fillText(line, 0, startY + lIdx * lineHeight);
  });
  ctx.restore();

  // Bottom Highlighted Subtitle Band
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.beginPath();
  ctx.roundRect(36, 700, width - 72, 124, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FACC15';
  ctx.font = `900 19px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  const subLines = wrapKoreanCanvasText(ctx, seg.scene.text, width - 110).slice(0, 3);
  const subStartY = 746 - ((subLines.length - 1) * 28) / 2;
  subLines.forEach((sl, idx) => {
    ctx.fillText(sl, width / 2, subStartY + idx * 28);
  });

  // Channel & Timecode Footer
  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9FB2D4';
  ctx.font = `bold 13px ${CANVAS_FONT_STACK}`;
  ctx.fillText(`@${channelName || 'edu_classroom'} · 무료 교안 슬라이드`, 40, 882);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#E8EEF7';
  ctx.fillText(`${fmt(elapsedSec)} / ${fmt(totalSec)}`, width - 40, 882);

  ctx.fillStyle = '#1E335C';
  ctx.fillRect(40, 904, width - 80, 8);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(40, 904, Math.max(12, (width - 80) * overallProgress), 8);
}

/**
 * WebCodecs(VideoEncoder + AudioEncoder) + mp4-muxer로
 * 계획된 전체 분량(예: 45~60초)의 표준 H.264/AAC MP4 영상을 고속 오프라인 합성한다.
 */
async function renderBrowserMp4WithWebCodecs(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: BrowserRenderOptions,
  segments: PlannedSceneSegment[],
  totalSec: number
): Promise<{ videoUrl: string; filename: string; durationSeconds: number }> {
  const width = canvas.width;
  const height = canvas.height;
  const fps = 10;
  const frameDurationUs = Math.round(1_000_000 / fps);
  const cleanTitle = (options.title || '1분 핵심 개념 수업').slice(0, 34);

  const audioSupport =
    typeof AudioEncoder !== 'undefined' && typeof AudioData !== 'undefined'
      ? await AudioEncoder.isConfigSupported({
          codec: 'mp4a.40.2',
          sampleRate: 48000,
          numberOfChannels: 1,
          bitrate: 64_000,
        }).catch(() => ({ supported: false }))
      : { supported: false };

  const useAudio = Boolean(audioSupport.supported);

  const muxer = new Mp4Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
      frameRate: fps,
    },
    ...(useAudio
      ? {
          audio: {
            codec: 'aac',
            numberOfChannels: 1,
            sampleRate: 48000,
          },
        }
      : {}),
    fastStart: 'in-memory',
  });

  let encodeError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (err) => {
      encodeError = err instanceof Error ? err : new Error(String(err));
    },
  });

  videoEncoder.configure({
    codec: 'avc1.42001f',
    width,
    height,
    bitrate: 1_800_000,
    framerate: fps,
  });

  let audioEncoder: AudioEncoder | null = null;
  if (useAudio) {
    audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: (err) => {
        encodeError = err instanceof Error ? err : new Error(String(err));
      },
    });
    audioEncoder.configure({
      codec: 'mp4a.40.2',
      sampleRate: 48000,
      numberOfChannels: 1,
      bitrate: 64_000,
    });
  }

  // Generate 1-sec PCM audio chunks with gentle chime on scene transitions
  if (audioEncoder) {
    const sampleRate = 48000;
    const sceneStartSet = new Set(segments.map((s) => s.startSec));
    for (let sec = 0; sec < totalSec; sec++) {
      if (encodeError) throw encodeError;
      const pcm = new Float32Array(sampleRate);
      if (sceneStartSet.has(sec)) {
        const chimeSamples = Math.min(sampleRate, Math.round(0.35 * sampleRate));
        for (let i = 0; i < chimeSamples; i++) {
          const tSec = i / sampleRate;
          const env = Math.exp(-tSec * 9.5) * 0.14;
          pcm[i] = env * (Math.sin(2 * Math.PI * 523.25 * tSec) + 0.5 * Math.sin(2 * Math.PI * 783.99 * tSec));
        }
      }
      const audioData = new AudioData({
        format: 'f32',
        sampleRate,
        numberOfFrames: sampleRate,
        numberOfChannels: 1,
        timestamp: sec * 1_000_000,
        data: pcm,
      });
      audioEncoder.encode(audioData);
      audioData.close();
      if (audioEncoder.encodeQueueSize > 12) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  let globalFrameIndex = 0;
  const totalFrames = totalSec * fps;

  for (const seg of segments) {
    const sceneFrames = seg.durationSec * fps;
    options.onProgress?.(
      Math.min(92, Math.round(((seg.startSec + seg.durationSec * 0.2) / totalSec) * 90)),
      `장면 ${seg.idx + 1}/${segments.length} (${seg.stageName}, ${seg.durationSec}초) H.264 MP4 합성 중...`
    );

    for (let f = 0; f < sceneFrames; f++) {
      if (encodeError) throw encodeError;
      const localT = f / Math.max(1, sceneFrames - 1);
      const elapsedSec = seg.startSec + f / fps;
      drawEduSlideFrame(ctx, width, height, {
        cleanTitle,
        subjectBadge: options.subjectBadge,
        channelName: options.channelName,
        seg,
        totalScenes: segments.length,
        localT,
        overallProgress: (globalFrameIndex + 1) / totalFrames,
        elapsedSec,
        totalSec,
      });

      const frame = new VideoFrame(canvas, {
        timestamp: globalFrameIndex * frameDurationUs,
        duration: frameDurationUs,
      });
      const isKeyFrame = f === 0 || globalFrameIndex % (fps * 2) === 0;
      videoEncoder.encode(frame, { keyFrame: isKeyFrame });
      frame.close();
      globalFrameIndex++;

      if (videoEncoder.encodeQueueSize > 6 || globalFrameIndex % 10 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  options.onProgress?.(95, 'MP4 인덱스(FastStart) 마무리 중...');
  await videoEncoder.flush();
  videoEncoder.close();
  if (audioEncoder) {
    await audioEncoder.flush();
    audioEncoder.close();
  }
  if (encodeError) throw encodeError;

  muxer.finalize();
  const blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });
  const videoUrl = URL.createObjectURL(blob);
  const safeName = (cleanTitle || 'edu_shorts').replace(/[^0-9A-Za-z\uAC00-\uD7A3_-]/g, '_');

  return {
    videoUrl,
    filename: `${safeName}_9x16.mp4`,
    durationSeconds: totalSec,
  };
}

/**
 * WebCodecs 미지원 브라우저용 안전 WebM 폴백 (flush 보장)
 */
async function renderBrowserWebmFallback(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: BrowserRenderOptions,
  segments: PlannedSceneSegment[],
  totalSec: number
): Promise<{ videoUrl: string; filename: string; durationSeconds: number }> {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('이 브라우저는 영상 인코딩을 지원하지 않습니다.');
  }

  const width = canvas.width;
  const height = canvas.height;
  const cleanTitle = (options.title || '1분 핵심 개념 수업').slice(0, 34);
  const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const stream = canvas.captureStream(15);
  const recorder = new MediaRecorder(stream, { mimeType: selectedMime, videoBitsPerSecond: 1_800_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const donePromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: selectedMime }));
    };
  });

  recorder.start(500);

  const fps = 15;
  const intervalMs = Math.round(1000 / fps);
  let elapsedFrames = 0;
  const totalFrames = totalSec * fps;

  for (const seg of segments) {
    const sceneFrames = seg.durationSec * fps;
    options.onProgress?.(
      Math.min(92, Math.round(((seg.startSec + seg.durationSec * 0.2) / totalSec) * 90)),
      `장면 ${seg.idx + 1}/${segments.length} (${seg.stageName}) 녹화 합성 중...`
    );

    for (let f = 0; f < sceneFrames; f++) {
      const localT = f / Math.max(1, sceneFrames - 1);
      drawEduSlideFrame(ctx, width, height, {
        cleanTitle,
        subjectBadge: options.subjectBadge,
        channelName: options.channelName,
        seg,
        totalScenes: segments.length,
        localT,
        overallProgress: (elapsedFrames + 1) / totalFrames,
        elapsedSec: seg.startSec + f / fps,
        totalSec,
      });
      elapsedFrames++;
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  options.onProgress?.(96, '영상 파일 인코딩 마무리 중...');
  if (recorder.state === 'recording') {
    try {
      recorder.requestData();
    } catch {}
  }
  recorder.stop();
  const blob = await donePromise;
  const videoUrl = URL.createObjectURL(blob);
  const safeName = (cleanTitle || 'edu_shorts').replace(/[^0-9A-Za-z\uAC00-\uD7A3_-]/g, '_');

  return {
    videoUrl,
    filename: `${safeName}_9x16.webm`,
    durationSeconds: totalSec,
  };
}

export interface BrowserRenderOptions {
  title: string;
  subjectBadge: string;
  channelName: string;
  scenes: ScriptScene[];
  onProgress?: (percent: number, message: string) => void;
}

/**
 * API 키 및 데스크톱 앱 없이 브라우저에서 타임라인 전체 길이(예: 50~60초)와 동일한
 * 9:16 세로 교육 쇼츠 MP4(WebCodecs 우선, 미지원 시 WebM 폴백)를 합성해 반환한다.
 */
export async function renderBrowserWebmVideo(
  options: BrowserRenderOptions
): Promise<{ videoUrl: string; filename: string; durationSeconds: number }> {
  const { segments, totalSec } = buildSceneSchedule(options.scenes);

  const width = 540;
  const height = 960;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D 컨텍스트를 초기화할 수 없습니다.');

  if (typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined') {
    try {
      const avcCheck = await VideoEncoder.isConfigSupported({
        codec: 'avc1.42001f',
        width,
        height,
        bitrate: 1_800_000,
        framerate: 10,
      });
      if (avcCheck.supported) {
        return await renderBrowserMp4WithWebCodecs(canvas, ctx, options, segments, totalSec);
      }
    } catch (err) {
      console.warn('[Browser MP4 WebCodecs fallback to WebM]:', err);
    }
  }

  return await renderBrowserWebmFallback(canvas, ctx, options, segments, totalSec);
}
