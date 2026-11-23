import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  Globe,
  Sparkles,
  X,
  Copy,
  Check,
  FolderOpen,
  Mic,
  FileText,
  Tag,
  RefreshCw,
} from 'lucide-react';
import type { MultilingualTranslationItem } from '../types';

interface MultilingualModalProps {
  isOpen: boolean;
  onClose: () => void;
  koreanTitle: string;
  koreanScript: string;
  onApplyScriptToEditor: (newTitle: string, newScript: string, voiceId?: string) => void;
  videoPath?: string;
  projectId?: string;
}

export const MultilingualModal: React.FC<MultilingualModalProps> = ({
  isOpen,
  onClose,
  koreanTitle,
  koreanScript,
  onApplyScriptToEditor,
  videoPath,
  projectId,
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'ja' | 'es'>('en');
  const [translations, setTranslations] = useState<Record<'en' | 'ja' | 'es', MultilingualTranslationItem> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [translateNotice, setTranslateNotice] = useState<string | null>(null);

  const fetchTranslations = async () => {
    if (!koreanScript.trim()) return;
    setIsLoading(true);
    setExportMessage(null);
    setTranslateNotice(null);
    try {
      if (window.electronAPI?.translateScriptMultilingual) {
        const res = await window.electronAPI.translateScriptMultilingual({
          title: koreanTitle,
          script: koreanScript,
        });
        if (res.success && res.translations) {
          setTranslations(res.translations);
          if (res.warning) setTranslateNotice(res.warning);
        } else {
          setTranslateNotice(res.error || '번역에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      }
    } catch (err) {
      console.warn('Multilingual translation error:', err);
      setTranslateNotice('번역에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !translations) {
      fetchTranslations();
    }
  }, [isOpen]);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const currentItem = translations ? translations[activeLang] : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToEditor = () => {
    if (!currentItem) return;
    onApplyScriptToEditor(currentItem.title, currentItem.script, currentItem.recommendedVoiceId);
    onClose();
  };

  const handleExportBundle = async () => {
    if (!translations || !window.electronAPI?.exportMultilingualBundle) return;
    try {
      const res = await window.electronAPI.exportMultilingualBundle({
        projectId: projectId || `global_${Date.now()}`,
        videoPath: videoPath || '',
        originalTitle: koreanTitle,
        translations,
      });
      if (res.success) {
        setExportMessage(res.message || '글로벌 번들이 성공적으로 내보내졌습니다.');
        if (res.outputFolder && window.electronAPI.showInFolder) {
          window.electronAPI.showInFolder(res.outputFolder);
        }
      }
    } catch (err: any) {
      setExportMessage(`내보내기 실패: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#14213D]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFDF8] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#CFC6AE] flex flex-col max-h-[90vh] overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#14213D] flex items-center gap-2">
                <span>다문화 학급 · 글로벌 3개국어 수업 교안 번역</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] font-extrabold border border-[#FCD34D]">
                  영어·일본어·스페인어
                </span>
              </h3>
              <p className="text-xs text-[#5C6B85] font-medium">
                한국어 수업 대본을 다문화 학생과 외국어 학습을 위한 3개국어 교안·성우 버전으로 변환합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTranslations}
              disabled={isLoading}
              className="p-2 rounded-lg text-[#3D4B66] hover:bg-[#F2EFE6] transition-colors"
              title="다시 번역하기"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1E40AF]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#5C6B85] hover:text-[#14213D] hover:bg-[#F2EFE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5DEC9] pb-2 shrink-0">
          <button
            onClick={() => setActiveLang('en')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black transition-colors ${
              activeLang === 'en'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] border border-[#E5DEC9] hover:bg-[#F2EFE6]'
            }`}
          >
            <span>🇺🇸</span>
            <span>English (영어)</span>
          </button>
          <button
            onClick={() => setActiveLang('ja')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black transition-colors ${
              activeLang === 'ja'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] border border-[#E5DEC9] hover:bg-[#F2EFE6]'
            }`}
          >
            <span>🇯🇵</span>
            <span>日本語 (일본어)</span>
          </button>
          <button
            onClick={() => setActiveLang('es')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black transition-colors ${
              activeLang === 'es'
                ? 'bg-[#14213D] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] border border-[#E5DEC9] hover:bg-[#F2EFE6]'
            }`}
          >
            <span>🇪🇸</span>
            <span>Español (스페인어)</span>
          </button>
        </div>

        {/* Translation Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#BFDBFE] border-t-[#1E40AF] rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#3D4B66]">
                교과 개념과 설명 호흡에 맞춰 3개 언어로 수업 대본을 번역하고 있습니다...
              </p>
            </div>
          ) : currentItem ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Localized Title */}
              <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#5C6B85] uppercase">
                    번역된 수업 제목
                  </span>
                  <button
                    onClick={() => handleCopy(currentItem.title, 'title')}
                    className="flex items-center gap-1 text-[11px] text-[#1E40AF] hover:underline font-bold"
                  >
                    {copiedKey === 'title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'title' ? '복사됨' : '제목 복사'}</span>
                  </button>
                </div>
                <h4 className="text-sm font-black text-[#14213D] leading-snug">
                  {currentItem.title}
                </h4>
              </div>

              {/* Recommended Voice & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-[#1E40AF] shrink-0" />
                  <div className="text-xs min-w-0">
                    <span className="text-[10px] text-[#1E40AF] font-bold block">추천 다국어 성우</span>
                    <span className="font-extrabold text-[#14213D] truncate block">
                      {currentItem.recommendedVoiceName}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#B45309] shrink-0" />
                  <div className="text-xs min-w-0">
                    <span className="text-[10px] text-[#78350F] font-bold block">학습 분야 해시태그</span>
                    <span className="font-extrabold text-[#14213D] truncate block">
                      {currentItem.tags.join(' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Localized Script */}
              <div className="bg-[#FAF8F3] border border-[#E5DEC9] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#5C6B85] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>번역된 수업 대본 전문 ({currentItem.script.length}자)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(currentItem.script, 'script')}
                    className="flex items-center gap-1 text-[11px] text-[#1E40AF] hover:underline font-bold"
                  >
                    {copiedKey === 'script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'script' ? '복사됨' : '대본 복사'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#14213D] whitespace-pre-line leading-relaxed font-medium">
                  {currentItem.script}
                </p>
              </div>

              {translateNotice && (
                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] text-xs text-[#78350F] font-bold">
                  {translateNotice}
                </div>
              )}

              {exportMessage && (
                <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#14532D] font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#15803D]" />
                  <span>{exportMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-[#5C6B85] text-xs">
              {translateNotice || '수업 대본을 먼저 입력하거나 AI 교안 생성을 진행해주세요.'}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E5DEC9] pt-3 shrink-0">
          <button
            type="button"
            onClick={handleExportBundle}
            disabled={!translations}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] border border-[#CFC6AE] text-[#14213D] text-xs font-bold transition-colors disabled:opacity-50"
          >
            <FolderOpen className="w-4 h-4 text-[#1E40AF]" />
            <span>다국어 교안 번들 폴더로 내보내기</span>
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#3D4B66] hover:bg-[#F2EFE6] text-xs font-bold transition-colors"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleApplyToEditor}
              disabled={!currentItem}
              className="px-5 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>현재 편집창에 {currentItem?.flag || ''} {currentItem?.langName ? currentItem.langName.split('(')[0] : '선택'} 대본 적용</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
