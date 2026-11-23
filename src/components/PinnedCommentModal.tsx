import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, MessageSquare, Copy, Check, RefreshCw } from 'lucide-react';
import type { PinnedCommentSuggestion } from '../types';

interface PinnedCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  script: string;
  onSelectComment?: (commentText: string) => void;
}

export const PinnedCommentModal: React.FC<PinnedCommentModalProps> = ({
  isOpen,
  onClose,
  topic,
  script,
  onSelectComment,
}) => {
  const [suggestions, setSuggestions] = useState<PinnedCommentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    if (!window.electronAPI) return;
    setIsLoading(true);
    try {
      const res = await window.electronAPI.generatePinnedComments({ topic, script });
      if (res.success && res.suggestions) {
        setSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error('[Pinned Comment Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, topic]);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApply = (text: string) => {
    if (onSelectComment) {
      onSelectComment(text);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14213D]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDF8] rounded-2xl shadow-2xl border border-[#CFC6AE] max-w-xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5DEC9] flex items-center justify-between bg-[#FAF8F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-[#B45309]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#14213D]">
                  형성평가 퀴즈 & 복습 고정 댓글 생성기
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]">
                  수업 참여 유도
                </span>
              </div>
              <p className="text-xs text-[#5C6B85] font-medium">
                영상 시청 직후 학생이 스스로 정답을 확인하고 핵심을 한 줄 요약하도록 돕는 고정 댓글을 만듭니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5C6B85] hover:text-[#14213D] rounded-lg hover:bg-[#F2EFE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-[#FFFDF8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#14213D]">
              AI 추천 수업 고정 댓글 3종 세트
            </span>
            <button
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>새로운 질문 생성</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-2 border-[#BFDBFE] border-t-[#1E40AF] rounded-full animate-spin" />
              <p className="text-xs text-[#5C6B85] font-bold animate-pulse">
                수업 대본을 분석하여 형성평가 확인 질문 3종을 작성하고 있습니다...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s, idx) => {
                const isCopied = copiedIdx === idx;
                const typeBadge =
                  s.type === 'balance_game'
                    ? { name: '개념 비교 · O/X 확인 퀴즈', color: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]' }
                    : s.type === 'opinion_vote'
                    ? { name: '실생활 사례 탐구 질문', color: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' }
                    : { name: '오늘의 1분 핵심 요약 과제', color: 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]' };

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E5DEC9] bg-[#FAF8F3] hover:bg-white transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${typeBadge.color}`}>
                        {typeBadge.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(s.fullCommentText, idx)}
                          className="px-2.5 py-1 rounded-md border border-[#CFC6AE] bg-white hover:bg-[#F2EFE6] text-[11px] font-bold text-[#14213D] flex items-center gap-1 transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#5C6B85]" />}
                          <span>{isCopied ? '복사됨!' : '댓글 복사'}</span>
                        </button>
                        {onSelectComment && (
                          <button
                            onClick={() => handleApply(s.fullCommentText)}
                            className="px-2.5 py-1 rounded-md bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[11px] font-extrabold transition-colors"
                          >
                            적용하기
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-bold text-[#14213D] leading-snug">
                      {s.question}
                    </p>

                    <div className="bg-white p-3 rounded-lg border border-[#E5DEC9] text-[11px] text-[#3D4B66] font-mono whitespace-pre-line leading-relaxed select-text">
                      {s.fullCommentText}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5DEC9] bg-[#FAF8F3] flex items-center justify-between">
          <span className="text-[11px] text-[#5C6B85] font-medium">
            수업 채널 업로드 시 첫 댓글로 등록하고 상단 고정하면 학생들의 복습 참여가 높아집니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E5DEC9] hover:bg-[#CFC6AE] text-[#14213D] text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
