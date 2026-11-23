import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Check,
  BookOpen,
  Mic,
  Type,
  Palette,
  Music,
  Layout,
  BookmarkPlus,
  HelpCircle,
  Highlighter,
  Compass,
  GraduationCap,
  Bookmark,
} from 'lucide-react';
import { type ShortsPreset, DEFAULT_PRESETS } from '../types';
import { VOICES, VoiceSelector } from './VoiceSelector';
import { FONTS, FontSelector } from './FontSelector';
import { TEMPLATES, TemplateSelector } from './TemplateSelector';
import { SUBTITLE_STYLES } from './SubtitleStyleSelector';
import type { NavTab } from './Sidebar';

interface PresetsManagementPageProps {
  onApplyPresetAndNavigate: (preset: ShortsPreset) => void;
  onNavigate: (tab: NavTab) => void;
  currentVoiceId: string;
  onChangeVoiceId: (id: string) => void;
  currentTemplateId: string;
  onChangeTemplateId: (id: string) => void;
  currentImageEngine?: string;
}

const STORAGE_KEY = 'kshorts_custom_presets';

const PRESET_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  preset_knowledge_1min: BookOpen,
  preset_ssul_legend: HelpCircle,
  preset_mrbeast_viral: Highlighter,
  preset_mystery_horror: Compass,
  preset_vlog_aesthetic: GraduationCap,
};

export const PresetsManagementPage: React.FC<PresetsManagementPageProps> = ({
  onApplyPresetAndNavigate,
  onNavigate,
  currentVoiceId,
  onChangeVoiceId,
  currentTemplateId,
  onChangeTemplateId,
  currentImageEngine,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'voices' | 'templates' | 'fonts'>('presets');
  const [customPresets, setCustomPresets] = useState<ShortsPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  const handleDeleteCustom = (id: string) => {
    if (!confirm('정말 이 교안 프리셋을 삭제하시겠습니까?')) return;
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('프리셋이 삭제되었습니다.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#14213D] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-[#293E6D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Sheet (No eyebrow/kicker above heading) */}
      <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-xl font-black tracking-tight text-[#14213D]">
              교과 프리셋 · 성우 · 서체 라이브러리
            </h1>
            <p className="text-xs sm:text-sm text-[#3D4B66] font-medium max-w-2xl">
              수업 단계별 추천 조합을 선택해 즉시 쇼츠 제작을 시작하거나, 한국어 Neural TTS 성우와 시각 화풍을 미리 탐색합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold transition-colors shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>수업 제작실로 이동</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-[#E5DEC9] flex-wrap tabular-nums">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'presets'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>수업 교안 프리셋 ({allPresets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'voices'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span>교사 내레이션 성우 ({VOICES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'templates'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>교육 삽화 화풍 ({TEMPLATES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fonts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'fonts'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>OFL 무료 서체 ({FONTS.length})</span>
          </button>
        </div>
      </section>

      {/* Tab 1: Presets Ledger */}
      {activeTab === 'presets' && (
        <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl overflow-hidden divide-y divide-[#E5DEC9]">
          {allPresets.map((preset) => {
            const PresetIcon = PRESET_ICON_MAP[preset.id] || Bookmark;
            const voice = VOICES.find((v) => v.id === preset.voiceId);
            const font = FONTS.find(
              (f) =>
                f.id === preset.fontId ||
                f.id.replace(/\s+/g, '').toLowerCase() === (preset.fontId || '').replace(/\s+/g, '').toLowerCase()
            );
            const template = TEMPLATES.find((t) => t.id === preset.templateId);
            const subtitleStyle = SUBTITLE_STYLES.find((s) => s.id === preset.subtitleStyleId);

            return (
              <div
                key={preset.id}
                className="p-5 hover:bg-[#FAF8F3] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] flex items-center justify-center shrink-0">
                    <PresetIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-[#14213D]">
                        {preset.name}
                      </h3>
                      {preset.isBuiltin ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]">
                          표준 교안
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                          내 저장 세팅
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#3D4B66] font-medium">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-[#3D4B66]">
                      <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] flex items-center gap-1">
                        <Mic className="w-3 h-3 text-[#1E40AF]" />
                        {voice?.name || preset.voiceId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] flex items-center gap-1">
                        <Type className="w-3 h-3 text-[#1E40AF]" />
                        {font?.name ? font.name.split('(')[0].trim() : preset.fontId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] flex items-center gap-1">
                        <Palette className="w-3 h-3 text-[#B45309]" />
                        {subtitleStyle?.name || preset.subtitleStyleId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] flex items-center gap-1">
                        <Layout className="w-3 h-3 text-[#15803D]" />
                        {template?.name?.split('(')[0]?.trim() || preset.templateId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] flex items-center gap-1 tabular-nums">
                        <Music className="w-3 h-3 text-[#15803D]" />
                        {preset.enableBgm ? `${Math.round(preset.bgmVolume * 100)}%` : '음소거'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!preset.isBuiltin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustom(preset.id)}
                      className="p-2 rounded-lg text-[#5C6B85] hover:text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onApplyPresetAndNavigate(preset)}
                    className="px-4 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-extrabold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>이 교안으로 제작 시작</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Tab 2: Voices Library */}
      {activeTab === 'voices' && (
        <VoiceSelector selectedVoiceId={currentVoiceId} onSelectVoice={onChangeVoiceId} />
      )}

      {/* Tab 3: Templates Library */}
      {activeTab === 'templates' && (
        <TemplateSelector
          selectedTemplateId={currentTemplateId}
          onSelectTemplate={onChangeTemplateId}
          onOpenSettings={() => onNavigate('ai-settings')}
          currentEngine={currentImageEngine}
        />
      )}

      {/* Tab 4: Commercial-Free Fonts Library */}
      {activeTab === 'fonts' && (
        <FontSelector selectedFontId="Pretendard" onSelectFont={() => {}} />
      )}
    </div>
  );
};
