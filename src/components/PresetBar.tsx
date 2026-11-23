import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  BookOpen,
  BookmarkPlus,
  Trash2,
  Check,
  X,
  Palette,
  Mic,
  Music,
  Type,
  HelpCircle,
  Highlighter,
  Compass,
  GraduationCap,
  Bookmark,
} from 'lucide-react';
import {
  type ShortsPreset,
  DEFAULT_PRESETS,
  type SubtitleStyleId,
  type TitleStyleId,
  type SubtitleFontSize,
} from '../types';
import { VOICES } from './VoiceSelector';
import { FONTS } from './FontSelector';
import { TEMPLATES } from './TemplateSelector';
import { SUBTITLE_STYLES } from './SubtitleStyleSelector';

interface PresetBarProps {
  currentVoiceId: string;
  currentTemplateId: string;
  currentFontId: string;
  currentSubtitleStyleId: SubtitleStyleId;
  currentSubtitleFontSize: SubtitleFontSize;
  currentTitleStyleId: TitleStyleId;
  currentBgmMood: string;
  currentBgmVolume: number;
  enableBgm: boolean;
  enableHookIntro: boolean;
  enablePopupSubtitles: boolean;
  onApplyPreset: (preset: ShortsPreset) => void;
}

const STORAGE_KEY = 'kshorts_custom_presets';

const PRESET_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  preset_knowledge_1min: BookOpen,
  preset_ssul_legend: HelpCircle,
  preset_mrbeast_viral: Highlighter,
  preset_mystery_horror: Compass,
  preset_vlog_aesthetic: GraduationCap,
};

export const PresetBar: React.FC<PresetBarProps> = ({
  currentVoiceId,
  currentTemplateId,
  currentFontId,
  currentSubtitleStyleId,
  currentSubtitleFontSize,
  currentTitleStyleId,
  currentBgmMood,
  currentBgmVolume,
  enableBgm,
  enableHookIntro,
  enablePopupSubtitles,
  onApplyPreset,
}) => {
  const [customPresets, setCustomPresets] = useState<ShortsPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePresetId, setActivePresetId] = useState<string | null>('preset_knowledge_1min');
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEscapeKey(isModalOpen, () => setIsModalOpen(false));
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [newPresetIcon, setNewPresetIcon] = useState('교안');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectPreset = (preset: ShortsPreset) => {
    setActivePresetId(preset.id);
    onApplyPreset(preset);
    showToast(`'${preset.name}' 교안 프리셋이 적용되었습니다.`);
  };

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: ShortsPreset = {
      id: `custom_${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || '교사가 저장한 맞춤 수업 쇼츠 조합',
      icon: newPresetIcon || '교안',
      voiceId: currentVoiceId,
      templateId: currentTemplateId,
      fontId: currentFontId,
      subtitleStyleId: currentSubtitleStyleId,
      subtitleFontSize: currentSubtitleFontSize,
      titleStyleId: currentTitleStyleId,
      bgmMood: currentBgmMood,
      bgmVolume: currentBgmVolume,
      enableBgm,
      enableHookIntro,
      enablePopupSubtitles,
      isBuiltin: false,
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActivePresetId(newPreset.id);
    setIsModalOpen(false);
    setNewPresetName('');
    setNewPresetDesc('');
    showToast(`새 교안 프리셋 '${newPreset.name}'이(가) 저장되었습니다.`);
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('이 커스텀 교안 프리셋을 삭제하시겠습니까?')) return;
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (activePresetId === id) setActivePresetId(null);
    showToast('프리셋이 삭제되었습니다.');
  };

  const tagLabels = ['개념', '퀴즈', '암기', '탐구', '복습', '실험', '과학', '역사', '수학', '영어'];

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-3.5 space-y-2.5">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#14213D] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-[#293E6D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-6 h-6 rounded bg-[#FEF3C7] border border-[#FCD34D] text-[#B45309] flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-extrabold text-[#14213D]">교과 수업 원클릭 프리셋</h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-extrabold">
            표준 교안 세팅
          </span>
          <span className="text-[11px] text-[#5C6B85] font-medium hidden xl:inline">
            수업 단계에 맞춰 성우·칠판 자막·화풍·배경음을 한 번에 적용합니다
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F3] hover:bg-[#EFF6FF] text-[#14213D] hover:text-[#1E40AF] text-[11px] font-bold transition-colors shrink-0 self-start sm:self-auto border border-[#CFC6AE] hover:border-[#BFDBFE]"
        >
          <BookmarkPlus className="w-3 h-3 text-[#1E40AF]" />
          <span>현재 교안 세팅 저장</span>
        </button>
      </div>

      {/* Horizontal Workbook Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {allPresets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          const PresetIcon = PRESET_ICON_MAP[preset.id] || Bookmark;
          const voiceName = VOICES.find((v) => v.id === preset.voiceId)?.name?.split('(')[0]?.trim() || '선희';
          const matchedFont = FONTS.find(
            (f) =>
              f.id === preset.fontId ||
              f.id.replace(/\s+/g, '').toLowerCase() === (preset.fontId || '').replace(/\s+/g, '').toLowerCase()
          );
          const fontName = matchedFont?.name ? matchedFont.name.split('(')[0].trim() : (preset.fontId || '프리탠다드');

          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`relative text-left p-2.5 rounded-lg border transition-colors cursor-pointer group flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#EFF6FF] border-[#1E40AF]'
                  : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] hover:border-[#CFC6AE]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-[#FFFDF8] text-[#14213D] border border-[#CFC6AE]'
                      }`}
                    >
                      <PresetIcon className="w-3 h-3" />
                    </span>
                    <h4 className="text-xs font-extrabold truncate text-[#14213D]">
                      {preset.name}
                    </h4>
                  </div>
                  {!preset.isBuiltin && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                      className="p-0.5 rounded text-[#5C6B85] hover:text-[#B91C1C]"
                      title="프리셋 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#3D4B66] line-clamp-1 font-medium">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[#FFFDF8] text-[#14213D] border border-[#E5DEC9]">
                  {voiceName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#FFFDF8] text-[#1E40AF] border border-[#BFDBFE] truncate">
                  {fontName}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Preset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#14213D]/60 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-xl max-w-md w-full p-6 border border-[#CFC6AE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-[#1E40AF]" />
                <h3 className="text-sm font-extrabold text-[#14213D]">현재 수업 세팅을 프리셋으로 저장</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5C6B85] hover:text-[#14213D] hover:bg-[#F2EFE6] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomPreset} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="preset-name-input" className="text-[#14213D] font-bold block">
                  교안 프리셋 명칭
                </label>
                <input
                  id="preset-name-input"
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="예: 중2 과학 실험 정리 세팅"
                  required
                  className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-3 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#1E40AF] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="preset-desc-input" className="text-[#14213D] font-bold block">
                  수업 용도 메모
                </label>
                <input
                  id="preset-desc-input"
                  type="text"
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  placeholder="예: 선희 성우 + 형광펜 자막 + 차분한 배경음"
                  className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-3 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#1E40AF] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[#14213D] font-bold block">분류 태그 선택</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tagLabels.map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewPresetIcon(lbl)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        newPresetIcon === lbl
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] border border-[#CFC6AE]'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#E5DEC9] space-y-1.5">
                <span className="text-[11px] font-extrabold text-[#14213D] block">저장될 수업 구성:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#3D4B66]">
                  <div className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-[#1E40AF]" />
                    <span>성우: {VOICES.find((v) => v.id === currentVoiceId)?.name || currentVoiceId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="w-3 h-3 text-[#1E40AF]" />
                    <span>서체: {currentFontId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-[#B45309]" />
                    <span>자막: {currentSubtitleStyleId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="w-3 h-3 text-[#15803D]" />
                    <span>배경음: {currentBgmMood} ({Math.round(currentBgmVolume * 100)}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[#3D4B66] hover:bg-[#F2EFE6] font-bold text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="px-5 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs disabled:opacity-50"
                >
                  프리셋 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
