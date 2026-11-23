import React from 'react';
import { Highlighter, Check, Box, Heading, EyeOff, Sparkles, Film } from 'lucide-react';
import type { SubtitleStyleId, TitleStyleId, SubtitleStyleOption, TitleStyleOption, SubtitleFontSize } from '../types';

export const SUBTITLE_STYLES: SubtitleStyleOption[] = [
  {
    id: 'samul_1min',
    name: '1분 개념 노란 강조 자막',
    tag: '교실 가독성 1위',
    description: '선명한 노란색 고딕과 짙은 외곽선으로 어떤 삽화 위에서도 핵심 문장이 또렷하게 보입니다',
    colors: {
      primary: '#facc15',
      highlight: '#ffffff',
      border: '#000000',
      bg: '#14213d',
    },
  },
  {
    id: 'highlighter',
    name: '교과서 형광펜 마커 노트',
    tag: '핵심 용어 · 정의 암기',
    description: '참고서에 노란 형광펜을 칠한 듯한 마커 박스로 필수 개념과 정의를 직관적으로 강조합니다',
    colors: {
      primary: '#14213d',
      highlight: '#b91c1c',
      border: '#eab308',
      bg: '#fef08a',
    },
  },
  {
    id: 'black_box',
    name: '칠판 반투명 다크 박스',
    tag: '실험 · 복잡한 배경용',
    description: '반투명 다크 박스 안에 백색과 하늘색 강조어를 담아 실사 영상 위에서도 가독성을 보장합니다',
    colors: {
      primary: '#ffffff',
      highlight: '#38bdf8',
      border: 'transparent',
      bg: '#0f172a',
    },
  },
  {
    id: 'news',
    name: '교육 다큐 & 시사 정갈형',
    tag: '역사 · 사회 · 과학 탐구',
    description: '차분한 크림 옐로우 자막과 안정적인 하단 배치로 EBS 다큐멘터리 같은 신뢰감을 줍니다',
    colors: {
      primary: '#fef08a',
      highlight: '#fb923c',
      border: '#000000',
      bg: '#1c1917',
    },
  },
  {
    id: 'ssul_talk',
    name: '교사 · 학생 문답 말풍선',
    tag: '도입 질문 · 대화형 수업',
    description: '질문과 답변을 주고받는 말풍선 카드 형태로 학생들의 호기심과 사고를 자극합니다',
    colors: {
      primary: '#ffffff',
      highlight: '#38bdf8',
      border: '#14213d',
      bg: '#14213d',
    },
  },
  {
    id: 'karaoke',
    name: '단어 단위 발음 따라읽기 (가라오케)',
    tag: '어학 · 초등 읽기 학습',
    description: '성우가 발음하는 단어 순서대로 하이라이트 컬러가 실시간으로 채워져 집중도를 높입니다',
    colors: {
      primary: '#ffffff',
      highlight: '#38bdf8',
      border: '#000000',
      bg: '#0f172a',
    },
  },
  {
    id: 'mrbeast',
    name: '파워 임팩트 키워드 바운스',
    tag: '핵심 숫자 · 법칙 강조',
    description: '굵은 볼드 서체와 숫자·핵심어 옐로우 하이라이트로 짧은 시간에 강렬하게 요점을 전달합니다',
    colors: {
      primary: '#ffffff',
      highlight: '#ffff00',
      border: '#000000',
      bg: '#0f172a',
    },
  },
  {
    id: 'vlog_aesthetic',
    name: '차분한 복습 노트 미니멀',
    tag: '거꾸로 수업 · 문학 감상',
    description: '정갈한 화이트 서체와 부드러운 음영으로 가정 학습 및 복습 클립에서 눈의 피로를 줄입니다',
    colors: {
      primary: '#ffffff',
      highlight: '#fb7185',
      border: '#000000',
      bg: '#27272a',
    },
  },
  {
    id: 'ranking_top',
    name: '핵심 요점 TOP 정리형',
    tag: '시험 전 3대 포인트 요약',
    description: '골드 옐로우 포인트로 첫째·둘째·셋째 핵심 요약 순서를 구조적으로 보여줍니다',
    colors: {
      primary: '#fef08a',
      highlight: '#f59e0b',
      border: '#000000',
      bg: '#14213d',
    },
  },
  {
    id: 'neon',
    name: '미래 과학 & 코딩 시안 팝',
    tag: '정보 · AI · 디지털 수업',
    description: '선명한 시안·코랄 대비로 정보 교과, 알고리즘, 미래 기술 주제를 현대적으로 연출합니다',
    colors: {
      primary: '#22d3ee',
      highlight: '#f43f5e',
      border: '#0f172a',
      bg: '#090d16',
    },
  },
  {
    id: 'mystery_crime',
    name: '역사 미스터리 & 심층 추적',
    tag: '역사 사건 · 과학 추리',
    description: '고대비 화이트와 레드 포인트로 역사 속 미결 사건이나 과학적 반전을 극적으로 다룹니다',
    colors: {
      primary: '#f8fafc',
      highlight: '#ef4444',
      border: '#000000',
      bg: '#09090b',
    },
  },
];

export const TITLE_STYLES: TitleStyleOption[] = [
  {
    id: 'yellow_tape',
    name: '단원 형광 라벨 테이프',
    tag: '핵심 단원명 · 학습 주제',
    description: '노란색 단원 라벨 위 짙은 네이비 글씨로 오늘 배울 주제를 상단에 선명히 고정합니다',
    badge: '단원 라벨',
  },
  {
    id: 'quiz_card',
    name: '수업 도입 질문 카드 (Q.)',
    tag: '퀴즈 · 생각 열기 수업',
    description: '[Q.] 질문 배지와 함께 학생들의 사고를 여는 핵심 발문을 상단에 띄웁니다',
    badge: 'Q. 발문',
  },
  {
    id: 'dark_pill',
    name: '교과서 미니멀 다크 캡슐',
    tag: '차분한 개념 · 복습 클립',
    description: '반투명 다크 캡슐 안에 단원명과 학년·과목을 단정하게 표시하는 표준 헤더입니다',
    badge: '표준 캡슐',
  },
  {
    id: 'breaking',
    name: '시험 필수 핵심 배지',
    tag: '중요 성취기준 · 출제 포인트',
    description: '강렬한 레드 [핵심] 배지로 반드시 기억해야 할 필수 개념임을 강조합니다',
    badge: '필수 핵심',
  },
  {
    id: 'ssul_badge',
    name: '탐구 주제 오렌지 배지',
    tag: '사례 탐구 · 실생활 연결',
    description: '오렌지색 [탐구] 배지로 일상 속 현상과 교과 원리를 연결하는 주제를 표시합니다',
    badge: '탐구 주제',
  },
  {
    id: 'caution_hazard',
    name: '오개념 주의 스트라이프',
    tag: '자주 틀리는 함정 · 주의',
    description: '학생들이 시험이나 실험에서 자주 혼동하는 오개념을 교정할 때 적합합니다',
    badge: '오개념 주의',
  },
  {
    id: 'gold_luxury',
    name: '심화 개념 골드 라벨',
    tag: '심화 학습 · 상위권 정리',
    description: '골드 옐로우 배너로 단원 최종 정리나 심화 탐구 주제를 품격 있게 표시합니다',
    badge: '심화 정리',
  },
  {
    id: 'none',
    name: '상단 헤더 숨김 (시각자료 전체)',
    tag: '도표 · 실험 화면 전체 몰입',
    description: '상단 제목 배너 없이 9:16 시각 자료와 하단 자막에만 온전히 집중합니다',
  },
];

interface SubtitleStyleSelectorProps {
  selectedSubtitleStyle: SubtitleStyleId;
  onSelectSubtitleStyle: (style: SubtitleStyleId) => void;
  selectedFontSize?: SubtitleFontSize;
  onSelectFontSize?: (size: SubtitleFontSize) => void;
  selectedTitleStyle: TitleStyleId;
  onSelectTitleStyle: (style: TitleStyleId) => void;
  enableEmojiStickers?: boolean;
  onToggleEmojiStickers?: (enabled: boolean) => void;
  selectedMotionType?: 'bounce' | 'slide_up' | 'fade' | 'typewriter';
  onSelectMotionType?: (motion: 'bounce' | 'slide_up' | 'fade' | 'typewriter') => void;
  highlightKeywords?: boolean;
  onToggleHighlightKeywords?: (enabled: boolean) => void;
}

export const SubtitleStyleSelector: React.FC<SubtitleStyleSelectorProps> = ({
  selectedSubtitleStyle,
  onSelectSubtitleStyle,
  selectedFontSize = 'medium',
  onSelectFontSize,
  selectedTitleStyle,
  onSelectTitleStyle,
  enableEmojiStickers = true,
  onToggleEmojiStickers,
  selectedMotionType = 'bounce',
  onSelectMotionType,
  highlightKeywords = true,
  onToggleHighlightKeywords,
}) => {
  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
            <Highlighter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
              수업 자막 &amp; 상단 단원 배너 디자인
            </h2>
            <p className="text-xs text-[#5C6B85] font-medium">
              교과서 형광펜 마커, 1분 개념 노란 자막, 질문 카드 헤더 등 수업 집중도를 높이는 시각 스타일을 고릅니다
            </p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D] font-extrabold self-start sm:self-auto">
          ASS 하드웨어 자막 합성
        </span>
      </div>

      {/* Part 1: Subtitle Style Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#14213D] flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>본문 수업 자막 스타일</span>
          </span>
          <span className="text-[11px] text-[#5C6B85] font-medium">우측 9:16 미리보기에 즉시 반영됩니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SUBTITLE_STYLES.map((style) => {
            const isSelected = selectedSubtitleStyle === style.id;
            return (
              <div
                key={style.id}
                onClick={() => onSelectSubtitleStyle(style.id)}
                className={`group relative cursor-pointer rounded-lg p-3.5 border transition-colors ${
                  isSelected
                    ? 'bg-[#FEF3C7]/45 border-[#B45309] text-[#14213D]'
                    : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] hover:border-[#CFC6AE]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-extrabold text-xs text-[#14213D] truncate">{style.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#B45309] border-[#B45309] text-white'
                        : 'border-[#CFC6AE] bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Live Sample Box */}
                <div
                  className="rounded-md p-2.5 my-2 text-center select-none flex items-center justify-center min-h-[50px] border border-black/10"
                  style={{ backgroundColor: style.colors.bg }}
                >
                  {style.id === 'highlighter' ? (
                    <span className="inline-block bg-[#FEF08A] text-[#14213D] px-2 py-0.5 rounded font-black text-xs">
                      물질의 성질을 지닌 <span className="text-[#B91C1C] font-black underline">최소 단위 분자</span>
                    </span>
                  ) : style.id === 'ssul_talk' ? (
                    <div className="bg-[#1E293B] text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-[#475569] truncate">
                      질문: &ldquo;원자와 <span className="text-[#38BDF8] font-black">분자</span>의 차이는?&rdquo;
                    </div>
                  ) : (
                    <p className="text-xs font-black tracking-tight" style={{ color: style.colors.primary }}>
                      물질의 기본 입자 <span style={{ color: style.colors.highlight }}>원자와 분자</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#E5DEC9] mt-1">
                  <span className="font-extrabold text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 rounded">
                    {style.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 1-2: Subtitle Font Size Selector */}
      {onSelectFontSize && (
        <div className="space-y-2.5 pt-3 border-t border-[#E5DEC9]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#14213D]">교실 화면 자막 크기</span>
            <span className="text-[11px] text-[#5C6B85] font-medium">모바일과 전자칠판 모두에서 잘 보이는 크기</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'small', label: '보통 (48pt)', desc: '긴 설명문 중심 교안' },
              { id: 'medium', label: '표준 (56pt)', desc: '가장 권장하는 수업 표준', badge: '권장' },
              { id: 'large', label: '크게 (66pt)', desc: '칠판·모바일 강조형' },
              { id: 'xlarge', label: '특대 (78pt)', desc: '핵심 어휘·단어 카드용' },
            ].map((sizeOpt) => {
              const isSelected = selectedFontSize === sizeOpt.id;
              return (
                <button
                  key={sizeOpt.id}
                  type="button"
                  onClick={() => onSelectFontSize(sizeOpt.id as SubtitleFontSize)}
                  className={`relative p-2.5 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#14213D] font-extrabold'
                      : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs tabular-nums">{sizeOpt.label}</span>
                    {sizeOpt.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#1E40AF] text-white rounded">
                        {sizeOpt.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#5C6B85] mt-0.5">{sizeOpt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Part 2: Header Title Style Grid */}
      <div className="space-y-2.5 pt-3 border-t border-[#E5DEC9]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#14213D] flex items-center gap-1.5">
            <Heading className="w-3.5 h-3.5 text-[#B45309]" />
            <span>상단 단원 타이틀 배너</span>
          </span>
          <span className="text-[11px] text-[#5C6B85] font-medium">9:16 화면 상단에 상시 표시되는 단원·주제 헤더</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TITLE_STYLES.map((t) => {
            const isSelected = selectedTitleStyle === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTitleStyle(t.id)}
                className={`group relative cursor-pointer rounded-lg p-3 border transition-colors ${
                  isSelected
                    ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#14213D]'
                    : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] hover:border-[#CFC6AE]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-extrabold text-xs text-[#14213D] truncate">{t.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#1E40AF] border-[#1E40AF] text-white'
                        : 'border-[#CFC6AE] bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                <div className="h-9 rounded bg-[#14213D] flex items-center justify-center px-2 my-1.5 overflow-hidden">
                  {t.id === 'yellow_tape' && (
                    <span className="bg-[#FACC15] text-[#14213D] px-2 py-0.5 rounded text-[10px] font-black truncate">
                      중2 과학 · 원자와 분자
                    </span>
                  )}
                  {t.id === 'breaking' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-[#DC2626] text-white text-[8px] font-black px-1.5 py-0.5 rounded">핵심</span>
                      <span className="text-white text-[10px] font-extrabold truncate">시험 필수 개념</span>
                    </div>
                  )}
                  {t.id === 'ssul_badge' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-[#EA580C] text-white text-[8px] font-black px-1.5 py-0.5 rounded">탐구</span>
                      <span className="text-white text-[10px] font-extrabold truncate">실생활 과학 원리</span>
                    </div>
                  )}
                  {t.id === 'caution_hazard' && (
                    <div className="bg-[#FBBF24] text-[#14213D] px-2 py-0.5 rounded text-[10px] font-black truncate border-x-2 border-black">
                      [오개념 주의] 자주 틀리는 문제
                    </div>
                  )}
                  {t.id === 'gold_luxury' && (
                    <span className="bg-[#FEF08A] text-[#14213D] px-2 py-0.5 rounded text-[10px] font-black truncate">
                      [심화 정리] 단원 총정리
                    </span>
                  )}
                  {t.id === 'quiz_card' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-[#1E40AF] text-[#FDE68A] text-[8px] font-black px-1.5 py-0.5 rounded">Q.</span>
                      <span className="text-white text-[10px] font-bold truncate">오늘의 핵심 질문은?</span>
                    </div>
                  )}
                  {t.id === 'dark_pill' && (
                    <span className="bg-white/15 text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20 truncate">
                      통합사회 · 핵심 요약
                    </span>
                  )}
                  {t.id === 'none' && (
                    <span className="text-[#9FB2D4] text-[10px] flex items-center gap-1 font-medium">
                      <EyeOff className="w-3 h-3" />
                      <span>상단 배너 숨김</span>
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#5C6B85] line-clamp-1">{t.tag}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 3: Subtitle Motion Animation */}
      {onSelectMotionType && (
        <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#1E40AF]" />
            <div>
              <span className="text-xs font-extrabold text-[#14213D]">자막 등장 모션 효과</span>
              <p className="text-[11px] text-[#5C6B85]">
                성우 발화 시점에 맞춰 자막이 화면에 나타나는 애니메이션을 지정합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'bounce', label: '바운스 팝업', desc: '명쾌한 탄성 등장' },
              { id: 'slide_up', label: '슬라이드 업', desc: '단정한 상향 등장' },
              { id: 'fade', label: '부드러운 페이드', desc: '차분한 디졸브 등장' },
              { id: 'typewriter', label: '타자기 타이핑', desc: '판서하듯 순차 등장' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMotionType(m.id as any)}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  (selectedMotionType || 'bounce') === m.id
                    ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#14213D]'
                    : 'border-[#E5DEC9] bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#FFFDF8]'
                }`}
              >
                <div className="text-xs font-extrabold">{m.label}</div>
                <div className="text-[10px] text-[#5C6B85] mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Part 4: Keyword Highlight & Reaction Stickers Toggles */}
      <div className="pt-3 border-t border-[#E5DEC9] grid grid-cols-1 md:grid-cols-2 gap-3">
        {onToggleHighlightKeywords && (
          <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Highlighter className="w-4 h-4 text-[#B45309] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-[#14213D] block">
                  핵심 단어 & 숫자 자동 하이라이트 컬러
                </span>
                <p className="text-[11px] text-[#5C6B85]">
                  연도, 수치, 핵심 개념어를 형광 컬러로 자동 강조해 학습 기억률을 높입니다.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highlightKeywords}
              onChange={() => onToggleHighlightKeywords(!highlightKeywords)}
              className="w-4 h-4 shrink-0 cursor-pointer"
            />
          </div>
        )}

        {onToggleEmojiStickers && (
          <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#1E40AF] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-[#14213D] block">
                  핵심 어휘 반응형 시각 아이콘 오버레이
                </span>
                <p className="text-[11px] text-[#5C6B85]">
                  중요 포인트나 주의 어휘 등장 시 보조 시각 스티커를 함께 합성합니다.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableEmojiStickers}
              onChange={() => onToggleEmojiStickers(!enableEmojiStickers)}
              className="w-4 h-4 shrink-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </section>
  );
};
