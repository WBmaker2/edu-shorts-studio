import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Disc3,
  Play,
  Pause,
  BookOpen,
  Heading,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { SubtitleStyleId, TitleStyleId, SubtitleFontSize } from '../types';

interface ShortsPhonePreviewProps {
  titleStyleId: TitleStyleId;
  headerTitleText?: string;
  enableHookIntro: boolean;
  hookTitleText?: string;
  hookSubtitleText?: string;
  subtitleStyleId: SubtitleStyleId;
  subtitleFontSize?: SubtitleFontSize;
  templateId?: string;
  sampleScriptText?: string;
  channelName?: string;
  activeVideoUrl?: string;
  subjectBadge?: string;
}

const TEMPLATE_STAGE_THEMES: Record<string, { bg: string; panelBg: string; accentBorder: string; tag: string }> = {
  basic: { bg: 'bg-[#0F172A]', panelBg: 'bg-[#1E293B]', accentBorder: 'border-[#334155]', tag: '교과 실사 화면' },
  k_documentary: { bg: 'bg-[#18181B]', panelBg: 'bg-[#27272A]', accentBorder: 'border-[#B45309]', tag: '한국 교육 다큐' },
  k_webtoon: { bg: 'bg-[#172554]', panelBg: 'bg-[#1E3A8A]', accentBorder: 'border-[#60A5FA]', tag: '학습 만화 · 웹툰' },
  cozy_korea: { bg: 'bg-[#1C1917]', panelBg: 'bg-[#292524]', accentBorder: 'border-[#D97706]', tag: '차분한 복습 노트' },
  luxury_lifestyle: { bg: 'bg-[#14213D]', panelBg: 'bg-[#1E335C]', accentBorder: 'border-[#F59E0B]', tag: '경제 · 진로 탐구' },
  motion_graphic: { bg: 'bg-[#0F2942]', panelBg: 'bg-[#163B5C]', accentBorder: 'border-[#38BDF8]', tag: '1분 개념 인포그래픽' },
  '3d': { bg: 'bg-[#1E1B4B]', panelBg: 'bg-[#312E81]', accentBorder: 'border-[#818CF8]', tag: '3D 입체 시각 모형' },
  anime: { bg: 'bg-[#172554]', panelBg: 'bg-[#1E3A8A]', accentBorder: 'border-[#93C5FD]', tag: '애니메이션 일러스트' },
  mystery_horror: { bg: 'bg-[#18181B]', panelBg: 'bg-[#27272A]', accentBorder: 'border-[#EF4444]', tag: '역사 미스터리 탐구' },
  claymation: { bg: 'bg-[#134E4A]', panelBg: 'bg-[#115E59]', accentBorder: 'border-[#2DD4BF]', tag: '클레이 입체 교구' },
  cyberpunk: { bg: 'bg-[#090D16]', panelBg: 'bg-[#111827]', accentBorder: 'border-[#22D3EE]', tag: '미래 과학 · AI' },
  noir: { bg: 'bg-[#09090B]', panelBg: 'bg-[#18181B]', accentBorder: 'border-[#71717A]', tag: '흑백 아카이브 사료' },
  retrogaming: { bg: 'bg-[#1E1B4B]', panelBg: 'bg-[#312E81]', accentBorder: 'border-[#34D399]', tag: '픽셀 코딩 · 알고리즘' },
};

const SUBTITLE_SIZE_CLASSES: Record<SubtitleFontSize, { scale: string }> = {
  small: { scale: 'scale-95' },
  medium: { scale: 'scale-100' },
  large: { scale: 'scale-105' },
  xlarge: { scale: 'scale-110' },
};

export const ShortsPhonePreview: React.FC<ShortsPhonePreviewProps> = ({
  titleStyleId,
  headerTitleText,
  enableHookIntro,
  hookTitleText = '오늘의 핵심 질문 3초 체크',
  hookSubtitleText = '교과서 핵심 원리를 1분 만에 정리합니다',
  subtitleStyleId,
  subtitleFontSize = 'medium',
  templateId = 'basic',
  sampleScriptText,
  channelName = '에듀쇼츠_교실',
  activeVideoUrl,
  subjectBadge = '단원 핵심 요약',
}) => {
  const [viewMode, setViewMode] = useState<'hook' | 'subtitle'>('subtitle');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [simulatedTime, setSimulatedTime] = useState<number>(3.2);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToRead = (sampleScriptText || headerTitleText || '원자와 분자의 차이를 1분 만에 정리해 봅시다.').trim();
    if (!textToRead) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(textToRead);
    utter.lang = 'ko-KR';
    utter.rate = 1.05;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setSimulatedTime((prev) => {
        const next = (prev + 0.25) % 5.5;
        if (enableHookIntro) {
          setViewMode(next < 2.2 ? 'hook' : 'subtitle');
        } else {
          setViewMode('subtitle');
        }
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isAutoPlaying, enableHookIntro]);

  useEffect(() => {
    if (!enableHookIntro && viewMode === 'hook') {
      setViewMode('subtitle');
    }
  }, [enableHookIntro, viewMode]);

  const displayHeader = (headerTitleText || '원자와 분자는 무엇이 다를까?').trim();
  const rawCleaned = displayHeader.replace(/^[💡⚡🚨📌\s]+/, '');
  const cleanHeader =
    rawCleaned.includes('?')
      ? rawCleaned.split('?')[0].trim() + '?'
      : rawCleaned.includes(',')
      ? rawCleaned.split(',')[0].trim()
      : rawCleaned.slice(0, 22) || '원자와 분자 1분 개념 정리';
  const firstSentence = (sampleScriptText || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)[0];
  const previewLine =
    firstSentence && firstSentence.length <= 32
      ? firstSentence
      : '더 이상 쪼개지지 않는 기본 입자를 원자라고 부릅니다';

  const currentTheme = TEMPLATE_STAGE_THEMES[templateId] || TEMPLATE_STAGE_THEMES.basic;

  return (
    <div className="flex flex-col items-center w-full max-w-[330px] mx-auto select-none">
      {/* Simulation Controller Toolbar */}
      <div className="w-full mb-2.5 bg-[#FFFDF8] border border-[#CFC6AE] rounded-lg p-2 text-xs">
        <div className="flex items-center justify-between gap-1 mb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-[#14213D] font-extrabold text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>9:16 교실 화면 미리보기</span>
          </div>
          <div className="flex items-center gap-1">
            {typeof window !== 'undefined' && 'speechSynthesis' in window && (
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  isSpeaking
                    ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]'
                    : 'bg-[#FAF8F3] text-[#14213D] hover:bg-[#F2EFE6] border border-[#CFC6AE]'
                }`}
                title="API 키 없이 브라우저 내장 한국어 음성으로 대본을 미리 들어봅니다"
              >
                {isSpeaking ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5 text-[#1E40AF]" />}
                <span>{isSpeaking ? '음성 중지' : '음성 듣기'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors tabular-nums ${
                isAutoPlaying
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-[#FAF8F3] text-[#14213D] hover:bg-[#F2EFE6] border border-[#CFC6AE]'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-2.5 h-2.5 fill-current" />
                  <span>순환 중 ({simulatedTime.toFixed(1)}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>구간 순환</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Segmented Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-[#F2EFE6] p-1 rounded-md border border-[#E5DEC9]">
          <button
            type="button"
            disabled={!enableHookIntro}
            onClick={() => {
              setIsAutoPlaying(false);
              setViewMode('hook');
              setSimulatedTime(1.0);
            }}
            className={`py-1 px-2 rounded text-[10px] font-extrabold transition-colors flex items-center justify-center gap-1 ${
              !enableHookIntro
                ? 'opacity-40 cursor-not-allowed text-[#5C6B85]'
                : viewMode === 'hook'
                ? 'bg-[#14213D] text-[#FDE68A]'
                : 'text-[#3D4B66] hover:text-[#14213D]'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>0~3초 도입 배너</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAutoPlaying(false);
              setViewMode('subtitle');
              setSimulatedTime(3.2);
            }}
            className={`py-1 px-2 rounded text-[10px] font-extrabold transition-colors flex items-center justify-center gap-1 ${
              viewMode === 'subtitle'
                ? 'bg-[#1E40AF] text-white'
                : 'text-[#3D4B66] hover:text-[#14213D]'
            }`}
          >
            <Heading className="w-3 h-3" />
            <span>본문 수업 자막</span>
          </button>
        </div>
      </div>

      {/* 9:16 Classroom Screen Stage */}
      <div className={`relative w-full aspect-[9/16] max-w-[244px] rounded-[22px] ${currentTheme.bg} border-[4px] border-[#14213D] overflow-hidden flex flex-col justify-between`}>
        {/* Top Status Strip */}
        <div className="relative z-30 pt-2.5 px-4 flex items-center justify-between text-[9px] font-bold text-[#C6D6F2] tabular-nums">
          <span>EDU 9:16</span>
          <span className="px-1.5 py-0.5 rounded bg-black/40 text-[#FDE68A] border border-white/15">
            {subjectBadge}
          </span>
          <span>1080P</span>
        </div>

        {/* Background Media or Structured Visual Plate */}
        {activeVideoUrl ? (
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <video
              src={activeVideoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 flex flex-col justify-center px-4 pointer-events-none">
            <div className={`rounded-xl ${currentTheme.panelBg} border ${currentTheme.accentBorder} p-3.5 text-center space-y-1.5`}>
              <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded bg-black/30 text-[#FDE68A]">
                {currentTheme.tag}
              </span>
              <p className="text-[11px] font-bold text-[#E8EEF7] leading-snug line-clamp-2">
                {cleanHeader}
              </p>
              <p className="text-[9px] text-[#9FB2D4] font-medium">
                장면별 AI 시각 삽화 및 켄 번스 모션 합성 영역
              </p>
            </div>
          </div>
        )}

        {/* LAYER 1: Top Header Title Ribbon */}
        <div className="relative z-20 pt-3 px-3 flex justify-center text-center">
          {titleStyleId === 'yellow_tape' && (
            <div className="inline-flex items-center gap-1 bg-[#FACC15] text-[#14213D] px-2.5 py-1 rounded border border-[#CA8A04] max-w-[94%]">
              <span className="text-[11px] font-black tracking-tight truncate">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'breaking' && (
            <div className="inline-flex items-center gap-1.5 bg-[#14213D] border border-[#EF4444] text-white px-2.5 py-1 rounded-full max-w-[94%]">
              <span className="bg-[#DC2626] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                핵심
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'ssul_badge' && (
            <div className="inline-flex items-center gap-1.5 bg-[#14213D] border border-[#F97316] text-white px-2.5 py-1 rounded-full max-w-[94%]">
              <span className="bg-[#EA580C] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                탐구
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'caution_hazard' && (
            <div className="inline-flex items-center gap-1 bg-[#FBBF24] text-[#14213D] px-3 py-1 rounded border-x-4 border-black max-w-[94%]">
              <span className="text-[10px] font-black tracking-tight truncate">
                [오개념 주의] {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'gold_luxury' && (
            <div className="inline-flex items-center gap-1 bg-[#FEF08A] text-[#14213D] px-2.5 py-1 rounded-full border border-[#EAB308] max-w-[94%]">
              <span className="text-[10px] font-black truncate text-[#14213D]">
                [필수 개념] {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'quiz_card' && (
            <div className="inline-flex items-center gap-1.5 bg-[#14213D] border border-[#60A5FA] text-white px-2.5 py-1 rounded-full max-w-[94%]">
              <span className="bg-[#1E40AF] text-[#FDE68A] text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                Q.
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'dark_pill' && (
            <div className="inline-flex items-center gap-1 bg-black/75 border border-white/25 text-white px-2.5 py-1 rounded-full max-w-[94%]">
              <span className="text-[10px] font-bold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'none' && <div className="h-2" />}
        </div>

        {/* LAYER 2: First 3s Lesson Hook Intro Banner */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-3 pointer-events-none">
          {enableHookIntro && viewMode === 'hook' && (
            <div className="w-full bg-[#14213D]/95 border-2 border-[#FACC15] rounded-xl p-3 text-center">
              <div className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] text-[9px] font-black mb-1">
                0~3초 수업 도입 질문
              </div>
              <div className="text-[#FDE047] font-black text-xs tracking-tight leading-snug">
                {hookTitleText || '오늘의 핵심 질문 3초 체크'}
              </div>
              <div className="text-white font-bold text-[10px] mt-1 leading-normal">
                {hookSubtitleText || '교과서 핵심 원리를 1분 만에 정리합니다'}
              </div>
            </div>
          )}
        </div>

        {/* LAYER 3: Subtitle Visual Style */}
        <div className="relative z-20 px-3 pb-3">
          <div className="min-h-[54px] flex items-center justify-center text-center px-2 mb-2">
            {viewMode === 'subtitle' && (() => {
              const currentSize = SUBTITLE_SIZE_CLASSES[subtitleFontSize] || SUBTITLE_SIZE_CLASSES.medium;
              return (
                <div className={`w-full transition-transform duration-200 transform ${currentSize.scale} origin-bottom`}>
                  {subtitleStyleId === 'mrbeast' && (
                    <p
                      className="text-white font-black text-xs tracking-tight leading-snug"
                      style={{
                        textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                      }}
                    >
                      {previewLine.slice(0, 14)}{' '}
                      <span className="text-[#FDE047] font-black">
                        {previewLine.slice(14) || '핵심 원리'}
                      </span>
                    </p>
                  )}

                  {subtitleStyleId === 'karaoke' && (
                    <p className="bg-black/80 px-2.5 py-1.5 rounded-lg text-xs font-black leading-snug text-white border border-[#38BDF8]/40">
                      <span className="text-[#38BDF8]">{previewLine.slice(0, 12)}</span>{' '}
                      <span className="text-[#FDE047]">{previewLine.slice(12) || '핵심 개념'}</span>
                    </p>
                  )}

                  {subtitleStyleId === 'black_box' && (
                    <span className="inline-block bg-black/85 text-white px-2.5 py-1.5 rounded-lg border border-white/20 text-[11px] font-black leading-snug">
                      {previewLine.slice(0, 15)}{' '}
                      <span className="text-[#38BDF8] font-black">{previewLine.slice(15) || '핵심 정의'}</span>
                    </span>
                  )}

                  {subtitleStyleId === 'neon' && (
                    <p className="bg-[#090D16]/90 px-2.5 py-1.5 rounded-lg border border-[#22D3EE] text-[#22D3EE] font-black text-xs leading-snug">
                      {previewLine.slice(0, 14)}{' '}
                      <span className="text-[#FB7185] font-black">{previewLine.slice(14) || '포인트'}</span>
                    </p>
                  )}

                  {subtitleStyleId === 'news' && (
                    <p className="bg-[#18181B]/90 px-2.5 py-1.5 rounded border border-[#F59E0B]/60 text-[#FEF08A] font-black text-[11px] leading-snug">
                      {previewLine}
                    </p>
                  )}

                  {subtitleStyleId === 'highlighter' && (
                    <span className="inline-block bg-[#FEF08A] text-[#14213D] px-2.5 py-1 rounded font-black text-[11px] border border-[#EAB308] leading-snug">
                      {previewLine.slice(0, 15)}{' '}
                      <span className="text-[#B91C1C] font-black underline">{previewLine.slice(15) || '필수 암기'}</span>
                    </span>
                  )}

                  {subtitleStyleId === 'ssul_talk' && (
                    <div className="inline-block bg-[#14213D]/95 text-white px-3 py-1.5 rounded-xl border border-[#3B63D6] text-[11px] font-bold max-w-[96%] leading-snug">
                      질문: &ldquo;{previewLine}&rdquo;
                    </div>
                  )}

                  {subtitleStyleId === 'samul_1min' && (
                    <p
                      className="text-[#FACC15] font-black text-xs tracking-tight leading-snug"
                      style={{
                        textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                      }}
                    >
                      {previewLine}
                    </p>
                  )}

                  {subtitleStyleId === 'vlog_aesthetic' && (
                    <p className="bg-black/65 px-2.5 py-1 rounded text-white font-bold text-[11px] leading-snug">
                      {previewLine}
                    </p>
                  )}

                  {subtitleStyleId === 'mystery_crime' && (
                    <p className="bg-black/85 px-2.5 py-1.5 rounded border border-[#EF4444]/50 text-white font-black text-xs leading-snug">
                      {previewLine}
                    </p>
                  )}

                  {subtitleStyleId === 'ranking_top' && (
                    <span className="inline-block bg-[#14213D]/95 border border-[#F59E0B] text-[#FDE047] px-2.5 py-1 rounded font-black text-xs leading-snug">
                      {previewLine}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Bottom Classroom Metadata Overlay */}
          <div className="flex items-end justify-between border-t border-white/15 pt-2">
            <div className="space-y-0.5 text-left max-w-[74%]">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#F59E0B] flex items-center justify-center text-[#14213D] text-[8px] font-black">
                  E
                </div>
                <span className="text-[10px] font-bold text-white truncate">
                  @{channelName}
                </span>
              </div>
              <p className="text-[9px] text-[#C6D6F2] font-medium line-clamp-1">
                {cleanHeader}
              </p>
              <div className="flex items-center gap-1 text-[8px] text-[#9FB2D4]">
                <Disc3 className="w-2.5 h-2.5" />
                <span className="truncate">성우 음성 + 배경음 자동 덕킹</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-white/80">
              <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                <ThumbsUp className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                <MessageSquare className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                <Share2 className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/25 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-200"
              style={{ width: `${(simulatedTime / 5.5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#3D4B66]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
        <span>1080×1920 (9:16) 실제 렌더링 비율과 동일</span>
      </div>
    </div>
  );
};
