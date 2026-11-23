import React from 'react';
import { LayoutGrid, Check, Video, Sparkles } from 'lucide-react';
import type { TemplateOption } from '../types';
import { PORTAL_KO } from '../constants/portal';

export const TEMPLATES: TemplateOption[] = [
  { id: 'motion_graphic', name: '1분 개념 인포그래픽 (Infographic)', tag: '교과 개념 도해 · 2D 그래픽' },
  { id: 'k_documentary', name: '한국 교육 다큐 실사 (K-Docu)', tag: 'EBS 지식채널 · 역사·과학 실사' },
  { id: 'basic', name: '선명한 교실 실사 (Basic)', tag: '고화질 표준 실사 · 자연·사회' },
  { id: 'k_webtoon', name: '학습 만화 & K-웹툰 (K-Webtoon)', tag: `${PORTAL_KO} 웹툰풍 · 흥미 유발` },
  { id: '3d', name: '3D 입체 학습 모형 (3D Pixar)', tag: '초·중등 과학 · 입체 시각 모형' },
  { id: 'cozy_korea', name: '차분한 학습 노트 일러스트 (Study)', tag: '거꾸로 수업 · 문학·인문 에세이' },
  { id: 'anime', name: '밝은 애니메이션 삽화 (Anime)', tag: '스토리텔링 · 인물·일화 소개' },
  { id: 'claymation', name: '입체 클레이 교구 (Clay Model)', tag: '초등 수업 · 친근한 스톱모션' },
  { id: 'luxury_lifestyle', name: '경제 · 금융 · 진로 다큐 (Economy)', tag: '사회·경제 · 기업 사례 분석' },
  { id: 'cyberpunk', name: '미래 과학 · AI 테크 (Future Tech)', tag: '정보·코딩 · 첨단 기술 시각화' },
  { id: 'noir', name: '근현대사 흑백 아카이브 (Archive)', tag: '역사 사료 · 고대비 기록 사진풍' },
  { id: 'mystery_horror', name: '심층 탐구 · 미스터리 (Deep Inquiry)', tag: '과학 난제 · 역사 추리 연출' },
  { id: 'retrogaming', name: '16비트 알고리즘 픽셀 (Pixel Code)', tag: '정보 교과 · 컴퓨터 원리 도트' },
];

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onOpenSettings?: () => void;
  currentEngine?: string;
  enableStockVideo?: boolean;
  onToggleStockVideo?: (val: boolean) => void;
  hasPexelsKey?: boolean;
  transitionType?: 'cut' | 'fade' | 'zoom';
  onChangeTransitionType?: (val: 'cut' | 'fade' | 'zoom') => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onOpenSettings,
  currentEngine = 'pollinations',
  enableStockVideo = false,
  onToggleStockVideo,
  hasPexelsKey = false,
  transitionType = 'fade',
  onChangeTransitionType,
}) => {
  const engineLabels: Record<string, string> = {
    pollinations: 'Pollinations AI (무료)',
    gemini: 'Google Gemini Imagen',
    openai: 'OpenAI DALL-E 3',
    fal: 'Fal.ai (Flux Pro)',
    stability: 'Stability AI (SD3)',
    pexels: 'Pexels 고화질 실사',
    pixabay: 'Pixabay 무료 미디어',
  };

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
              수업 시각 자료 엔진 &amp; 삽화 화풍
            </h2>
            <p className="text-xs text-[#5C6B85] font-medium">
              교과 내용에 맞춰 AI 교육 삽화 또는 무료 실사 비디오 클립을 장면 배경으로 합성합니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onToggleStockVideo && (
            <div className="flex items-center p-1 bg-[#F2EFE6] rounded-lg border border-[#CFC6AE]">
              <button
                type="button"
                onClick={() => onToggleStockVideo(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  !enableStockVideo
                    ? 'bg-[#14213D] text-white'
                    : 'text-[#3D4B66] hover:text-[#14213D]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#FBBF24]" />
                <span>AI 교육 삽화</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleStockVideo(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  enableStockVideo
                    ? 'bg-[#15803D] text-white'
                    : 'text-[#3D4B66] hover:text-[#14213D]'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>무료 실사 비디오 우선</span>
              </button>
            </div>
          )}

          <span className="text-[11px] px-2.5 py-1 rounded bg-[#FAF8F3] text-[#14213D] border border-[#CFC6AE] font-bold">
            엔진: {engineLabels[currentEngine] || currentEngine}
          </span>
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-xs text-[#1E40AF] hover:underline font-extrabold px-2 py-1"
            >
              엔진·API 설정
            </button>
          )}
        </div>
      </div>

      {/* Guide Banner for Stock Video Mode */}
      {enableStockVideo && (
        <div className="p-3 rounded-lg bg-[#DCFCE7]/60 border border-[#86EFAC] flex items-center justify-between text-xs text-[#14532D]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#15803D] text-white text-[10px] font-extrabold shrink-0">
              비디오 모드 ON
            </span>
            <span className="font-semibold text-xs">
              {hasPexelsKey
                ? 'Pexels 고화질 9:16 실사 세로 영상이 수업 대본 주제에 맞추어 자동 매칭됩니다.'
                : 'Pexels API 키가 등록되지 않았습니다. 기본 교육 비디오 카탈로그로 매칭되며, [엔진·API 설정]에서 무료 키 등록 시 수천만 건의 실사 자료를 활용합니다.'}
            </span>
          </div>
          {onOpenSettings && !hasPexelsKey && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-xs font-extrabold text-[#14532D] underline shrink-0 ml-2"
            >
              키 등록 ↗
            </button>
          )}
        </div>
      )}

      {/* Transition Effect Selector */}
      {onChangeTransitionType && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#14213D]">씬 전환 효과:</span>
            <span className="text-[#5C6B85] text-[11px]">수업 단계 장면 간 화면 전환 방식</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'fade', label: '부드러운 페이드 (추천)' },
              { id: 'zoom', label: '다이내믹 줌' },
              { id: 'cut', label: '기본 컷 전환' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeTransitionType(t.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  transitionType === t.id
                    ? 'bg-[#14213D] text-[#FDE68A]'
                    : 'bg-[#FFFDF8] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#CFC6AE]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`group relative cursor-pointer rounded-lg p-3.5 border transition-colors ${
                isSelected
                  ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#14213D]'
                  : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] hover:border-[#CFC6AE]'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-xs text-[#14213D] truncate">{tmpl.name}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-[#1E40AF] border-[#1E40AF] text-white'
                      : 'border-[#CFC6AE] bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFFDF8] text-[#3D4B66] border border-[#E5DEC9]">
                {tmpl.tag}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
