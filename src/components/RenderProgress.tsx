import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Mic, FileText, Video, Copy, Check, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import type { ProjectStatus } from '../types';

interface RenderProgressProps {
  status: ProjectStatus;
  progressPercent: number;
  statusMessage: string;
  errorDetails?: string;
  onDismiss?: () => void;
}

export const RenderProgress: React.FC<RenderProgressProps> = ({
  status,
  progressPercent,
  statusMessage,
  errorDetails,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (status === 'draft') return null;

  const steps = [
    { key: 'generating_script', label: '수업 대본 설계', icon: FileText, percent: 15 },
    { key: 'generating_audio', label: '성우 음성 · 자막', icon: Mic, percent: 40 },
    { key: 'rendering_video', label: 'FFmpeg 9:16 합성', icon: Video, percent: 80 },
    { key: 'done', label: '수업 클립 완성', icon: CheckCircle2, percent: 100 },
  ];

  const handleCopyError = async () => {
    const errorTextToCopy = [
      '=== [Edu-Shorts Studio 오류 리포트] ===',
      `시간: ${new Date().toLocaleString()}`,
      `진행 단계: ${statusMessage}`,
      '----------------------------------------',
      errorDetails || statusMessage || '상세 오류 정보가 없습니다.',
      '========================================',
    ].join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(errorTextToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isError = status === 'error';

  return (
    <div
      className={`rounded-xl p-5 space-y-4 border ${
        isError
          ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#7F1D1D]'
          : 'bg-[#14213D] border-[#293E6D] text-[#E8EEF7]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'done' ? (
            <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-[#B91C1C]" />
          ) : (
            <Loader2 className="w-5 h-5 text-[#FBBF24] animate-spin" />
          )}
          <span className="font-extrabold text-sm">
            {status === 'done'
              ? '9:16 수업 쇼츠 제작이 완료되었습니다!'
              : isError
              ? '수업 영상 합성 중 오류가 발생했습니다'
              : '9:16 수업 쇼츠 자동 렌더링 진행 중...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isError && (
            <span className="text-xs font-extrabold text-[#FDE68A] tabular-nums">{progressPercent}%</span>
          )}
          {isError && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-[#FAF8F3] text-[#7F1D1D] font-bold border border-[#FCA5A5]"
            >
              닫기
            </button>
          )}
        </div>
      </div>

      {!isError && (
        <div className="w-full bg-[#1C2E52] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[#F59E0B] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {steps.map((step) => {
            const isPassed = progressPercent >= step.percent;
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className={`flex flex-col items-center p-2 rounded-lg border text-center ${
                  isPassed
                    ? 'bg-[#1E3A8A] border-[#3B63D6] text-white'
                    : 'bg-[#172646] border-[#253A66] text-[#9FB2D4]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isPassed ? 'text-[#FDE68A]' : 'text-[#9FB2D4]'}`} />
                <span className="text-[11px] font-bold leading-tight">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <div
        className={`text-xs font-medium ${
          isError
            ? 'bg-white border border-[#FCA5A5] rounded-lg p-3.5 space-y-3 text-[#7F1D1D]'
            : 'text-center text-[#B6C7E6]'
        }`}
      >
        {isError ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <p className="font-bold text-[#7F1D1D] text-xs flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />
                  {statusMessage}
                </p>
                <p className="text-[11px] text-[#991B1B] leading-relaxed">
                  오류 내용을 복사해 점검하거나 네트워크·API 키 설정을 확인해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyError}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
                  copied
                    ? 'bg-[#15803D] text-white'
                    : 'bg-[#B91C1C] hover:bg-[#991B1B] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>오류 로그 복사</span>
                  </>
                )}
              </button>
            </div>

            {errorDetails && (
              <div className="pt-2 border-t border-[#FCA5A5] mt-3">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#7F1D1D] hover:underline"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>상세 로그 접기</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>상세 로그 보기</span>
                    </>
                  )}
                </button>
                {showDetails && (
                  <pre className="mt-2 p-3 rounded bg-[#FAF8F3] border border-[#E5DEC9] text-[10px] text-[#14213D] font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
                    {errorDetails}
                  </pre>
                )}
              </div>
            )}
          </div>
        ) : (
          <span>{statusMessage}</span>
        )}
      </div>
    </div>
  );
};
