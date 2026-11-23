import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  HelpCircle,
  Check,
} from 'lucide-react';
import type { HookingVariant, ScriptScene } from '../types';
import { generateBrowserHookingVariants } from '../utils/browserEduEngine';

interface ThumbnailABEditorProps {
  topic: string;
  onApplyTitleAndHook: (newTitle: string, newHookIntro: string, heroVisualPrompt?: string) => void;
  currentHookIntroText?: string;
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
}

const PEDAGOGICAL_TYPE_LABELS: Record<string, { label: string; tag: string }> = {
  variant_a: { label: '오개념 교정 · 주의 환기형', tag: '주의 집중' },
  variant_b: { label: '핵심 질문 · 호기심 탐구형', tag: '탐구 질문' },
  variant_c: { label: '1분 핵심 · 3단계 요약형', tag: '단원 정리' },
};

export const ThumbnailABEditor: React.FC<ThumbnailABEditorProps> = ({
  topic,
  onApplyTitleAndHook,
  scenes,
  onChangeScenes,
}) => {
  const [variants, setVariants] = useState<HookingVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('variant_c');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHeroStyle, setSelectedHeroStyle] = useState<'dramatic' | 'mystery' | 'vibrant'>('vibrant');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchVariants = async (targetTopic: string) => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.generateHookingVariants) {
        const res = await window.electronAPI.generateHookingVariants({ topic: targetTopic });
        if (res && res.length > 0) {
          setVariants(res);
          setSelectedVariantId(res[res.length - 1].id);
          return;
        }
      }
      const webRes = generateBrowserHookingVariants(targetTopic);
      setVariants(webRes);
      setSelectedVariantId(webRes[webRes.length - 1].id);
    } catch (err) {
      console.warn('Failed to generate hooking variants:', err);
      const fallbackRes = generateBrowserHookingVariants(targetTopic);
      setVariants(fallbackRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topic && topic.trim()) {
      fetchVariants(topic);
    }
  }, [topic]);

  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handleApply = (variant: HookingVariant) => {
    setSelectedVariantId(variant.id);

    let heroPrompt = variant.visualKeyword;
    if (selectedHeroStyle === 'mystery') {
      heroPrompt = `Educational documentary illustration of ${topic}, clear diagram lighting, high detail`;
    } else if (selectedHeroStyle === 'vibrant') {
      heroPrompt = `Clean educational 3D infographic showcase of ${topic}, sharp classroom diagram lighting`;
    }

    onApplyTitleAndHook(variant.title, variant.hookIntro, heroPrompt);

    if (scenes.length > 0) {
      const nextScenes = [...scenes];
      if (nextScenes[0]) {
        nextScenes[0] = {
          ...nextScenes[0],
          visualPrompt: heroPrompt,
          text: variant.title,
        };
        onChangeScenes(nextScenes);
      }
    }

    const mapped = PEDAGOGICAL_TYPE_LABELS[variant.id]?.label || variant.type;
    showToast(`'${mapped}' 도입 문구와 첫 장면 연출이 반영되었습니다.`);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#14213D] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-[#293E6D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#14213D]">
              수업 도입 3초 질문 &amp; 표지(Scene 0) 문구 설계
            </h3>
            <p className="text-xs text-[#5C6B85] font-medium">
              학생들의 첫 3초 주의를 집중시키는 도입 배너와 첫 장면 표지 문구를 비교해 선택합니다
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchVariants(topic)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] border border-[#CFC6AE] text-[#14213D] text-xs font-bold transition-colors disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1E40AF]' : ''}`} />
          <span>도입 문구 다시 제안받기</span>
        </button>
      </div>

      {/* 3 Pedagogical Hook Options in a Clean List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {variants.map((v) => {
          const isSelected = selectedVariantId === v.id;
          const meta = PEDAGOGICAL_TYPE_LABELS[v.id] || { label: v.type, tag: '추천 도입' };
          return (
            <div
              key={v.id}
              onClick={() => handleApply(v)}
              className={`p-3.5 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-[#FEF3C7]/45 border-[#B45309]'
                  : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] hover:border-[#CFC6AE]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-[#14213D]">{meta.label}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FFFDF8] text-[#78350F] border border-[#FCD34D]">
                    {meta.tag}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-[#14213D] leading-snug">
                  &ldquo;{v.title}&rdquo;
                </h4>

                <div className="text-[11px] text-[#3D4B66]">
                  <span className="font-bold text-[#14213D]">도입 배너: </span>
                  <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#E5DEC9] font-semibold">
                    {v.hookIntro}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5DEC9]">
                <span className="text-[10px] text-[#5C6B85] font-medium">
                  첫 장면 표지로 적용
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(v);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-extrabold transition-colors ${
                    isSelected
                      ? 'bg-[#14213D] text-[#FDE68A]'
                      : 'bg-[#FFFDF8] border border-[#CFC6AE] text-[#14213D] hover:bg-[#F2EFE6]'
                  }`}
                >
                  {isSelected ? '선택됨' : '적용'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* First Scene Visual Tone Bar */}
      <div className="pt-2 border-t border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="font-extrabold text-[#14213D]">
          첫 장면(표지) 시각 삽화 연출 톤:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'vibrant', label: '입체 개념 도해 (추천)' },
            { id: 'dramatic', label: '실사 클로즈업 강조' },
            { id: 'mystery', label: '다큐멘터리 조명' },
          ].map((tone) => (
            <button
              key={tone.id}
              type="button"
              onClick={() => {
                setSelectedHeroStyle(tone.id as any);
                if (activeVariant) handleApply({ ...activeVariant });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                selectedHeroStyle === tone.id
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#3D4B66] border border-[#CFC6AE]'
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
