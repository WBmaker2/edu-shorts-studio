import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  Clock,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Video,
  Share2,
  MessageSquare,
  Save,
  Check,
  ExternalLink,
  Bot,
  Zap,
  Calendar,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Flame,
  Music,
  Heading,
} from 'lucide-react';
import type { YouTubePerformanceAnalysis, AppSettings, AutoPilotSchedule, AutoPilotStatusEvent, SubtitleFontSize } from '../types';
import { SUBTITLE_STYLES, TITLE_STYLES } from './SubtitleStyleSelector';
import { ShortsPhonePreview } from './ShortsPhonePreview';
import { TEMPLATES } from './TemplateSelector';

export const HOOK_PRESETS = [
  {
    id: 'ox_quiz',
    name: '수업 시작 전 3초 O/X 점검',
    title: '잠깐! 이건 O일까요 X일까요?',
    subtitle: '시험에서 가장 자주 헷갈리는 핵심 개념',
    badge: '오개념 진단',
  },
  {
    id: 'one_min',
    name: '핵심 원리 1분 요약 노트',
    title: '단원 핵심 개념 1분 총정리',
    subtitle: '수업 도입 예습 · 시험 직전 복습',
    badge: '핵심 요약',
  },
  {
    id: 'daily_why',
    name: '일상 속 교과 원리 탐구',
    title: '왜 우리 일상에서는 이런 일이 일어날까?',
    subtitle: '친숙한 비유로 바로 이해하는 원리',
    badge: '실생활 비유',
  },
  {
    id: 'compare',
    name: '헷갈리는 개념 A vs B 비교',
    title: '비슷해 보이지만 완전히 다른 두 개념',
    subtitle: '기준 한 줄로 명확하게 구분하기',
    badge: '개념 비교',
  },
  {
    id: 'exam_point',
    name: '수능 · 내신 빈출 포인트',
    title: '출제자가 가장 자주 묻는 단원 함정',
    subtitle: '놓치기 쉬운 조건까지 1분 점검',
    badge: '시험 대비',
  },
  {
    id: 'custom',
    name: '직접 입력 (교사 커스텀 문구)',
    title: '',
    subtitle: '',
    badge: '자유 입력',
  },
];

interface AutoPilotPageProps {
  settings: AppSettings;
  onNavigateToProjects: () => void;
  onNavigateToPublish?: () => void;
}

const PRESET_NICHES = [
  { label: '중등 · 고등 물리 & 역학', value: '중고등 물리 교과 원리와 관성·부력·베르누이 법칙 등 생활 속 과학 탐구' },
  { label: '화학 · 물질의 구성', value: '원자와 분자, 이온 결합, 산과 염기 등 교과 화학 개념의 쉬운 시각화' },
  { label: '생명과학 · 세포 & 생태', value: '식물의 광합성과 호흡, 세포 구조, 인체 면역 등 생명과학 핵심 개념' },
  { label: '지구과학 · 우주 & 기후', value: '지진파, 판 구조론, 태양계, 기후 변화 등 지구과학 원리 해설' },
  { label: '한국사 · 주요 사료 & 사건', value: '고조선 8조법, 훈민정음, 삼국통일 등 한국사 교과 핵심 흐름 요약' },
  { label: '세계사 · 문명 & 근현대사', value: '고대 문명부터 근현대 세계사의 주요 전환점과 인과 관계 정리' },
  { label: '통합사회 · 경제 기초', value: '기회비용과 매몰비용, 수요·공급, 인플레이션 등 사회·경제 필수 개념' },
  { label: '수학 · 도형 & 확률 논리', value: '피타고라스 정리, 함수 그래프, 확률과 통계의 직관적 원리 설명' },
  { label: '국어 · 문해력 & 문학 비유', value: '비문학 핵심 주장 파악 전략, 품사와 문학 표현 기법 1분 정리' },
  { label: '영어 · 핵심 구문 & 뉘앙스', value: '능동태·수동태, 시제, 교과서 핵심 영문법과 어휘 구분법' },
  { label: '정보 · AI & 알고리즘 기초', value: '이진 탐색, 자료구조, 생성형 AI의 토큰·확률 원리 디지털 소양 수업' },
  { label: '학습 뇌과학 · 메타인지 공부법', value: '에빙하우스 망각곡선, 분산 인출 연습, 숙면과 기억 강화 원리' },
  { label: '초등 생활과학 · 호기심 탐구', value: '초등학생 눈높이에서 일상 현상을 관찰하며 배우는 기초 과학' },
  { label: '시민 · 환경 & 미디어 리터러시', value: '기후 위기 대응, 합리적 소비, 정보 판별 능력을 기르는 시민 교육' },
];

function formatTimeLabel(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? '오후' : '오전';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const paddedM = String(m || 0).padStart(2, '0');
  return `${period} ${displayH}시 ${paddedM}분 (${String(h).padStart(2, '0')}:${paddedM})`;
}

function getTimeUntilNextRun(nextRunAt?: string): string {
  if (!nextRunAt) return '설정 대기 중';
  const target = new Date(nextRunAt).getTime();
  const diffMs = target - Date.now();
  if (diffMs <= 0) return '곧 자동 실행됩니다!';
  
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours > 0) {
    return `약 ${diffHours}시간 ${remainingMinutes}분 후 실행 예정`;
  }
  return `약 ${diffMinutes}분 후 실행 예정`;
}

export const AutoPilotPage: React.FC<AutoPilotPageProps> = ({ settings, onNavigateToProjects, onNavigateToPublish }) => {
  const [perf, setPerf] = useState<YouTubePerformanceAnalysis | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState('');
  const handleAnalyzePerformance = async () => {
    if (!window.electronAPI?.analyzeYoutubePerformance) return;
    setPerfLoading(true);
    setPerfError('');
    try {
      const res = await window.electronAPI.analyzeYoutubePerformance();
      if (res.success && res.data) setPerf(res.data);
      else setPerfError(res.error || '성과 분석에 실패했습니다.');
    } catch (e: any) {
      setPerfError(e?.message || String(e));
    } finally {
      setPerfLoading(false);
    }
  };

  const [config, setConfig] = useState<AutoPilotSchedule>({
    enabled: false,
    scheduleTime: '18:00',
    frequency: 'daily',
    customIntervalValue: 4,
    channelNiche: '중고등 물리 교과 원리와 관성·부력·베르누이 법칙 등 생활 속 과학 탐구',
    customInstruction: '',
    durationSeconds: 55,
    titleStyleId: 'yellow_tape',
    subtitleStyleId: 'samul_1min',
    enableHookIntro: true,
    hookIntroPreset: 'ox_quiz',
    hookTitleText: '잠깐! 이건 O일까요 X일까요?',
    hookSubtitleText: '시험에서 가장 자주 헷갈리는 핵심 개념',
    autoUploadYoutube: true,
    autoComment: true,
    commentText: settings.youtubeCommentText || '📌 오늘 수업 핵심 정리 학습지 & 형성평가 퀴즈 링크를 확인하고, 헷갈리는 점은 댓글로 질문해 보세요!',
    history: [],
  });

  const [saved, setSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExecutingNow, setIsExecutingNow] = useState(false);
  const [isCommentScopeModalOpen, setIsCommentScopeModalOpen] = useState(false);
  useEscapeKey(isCommentScopeModalOpen, () => setIsCommentScopeModalOpen(false));
  const [liveStatus, setLiveStatus] = useState<AutoPilotStatusEvent | null>(null);
  const [triggerResult, setTriggerResult] = useState<{ success: boolean; message: string; videoUrl?: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock ticker for current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch / Refresh Config Function (full refresh only on initial load or manual refresh button)
  const fetchConfig = async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      if (window.electronAPI?.getAutoPilotConfig) {
        const loaded = await window.electronAPI.getAutoPilotConfig();
        if (loaded) {
          setConfig((prev) => ({
            ...prev,
            ...loaded,
            titleStyleId: loaded.titleStyleId || prev.titleStyleId || settings.defaultTitleStyleId || 'yellow_tape',
            subtitleStyleId: loaded.subtitleStyleId || prev.subtitleStyleId || settings.defaultSubtitleStyleId || 'samul_1min',
            enableHookIntro: loaded.enableHookIntro ?? prev.enableHookIntro ?? true,
            hookIntroPreset: loaded.hookIntroPreset || prev.hookIntroPreset || 'ox_quiz',
            hookTitleText: loaded.hookTitleText || prev.hookTitleText || '잠깐! 이건 O일까요 X일까요?',
            hookSubtitleText: loaded.hookSubtitleText || prev.hookSubtitleText || '시험에서 가장 자주 헷갈리는 핵심 개념',
            commentText: loaded.commentText || settings.youtubeCommentText || prev.commentText,
          }));
        }
      }
    } catch (err) {
      console.warn('[AutoPilot Fetch Error]:', err);
    } finally {
      if (showSpin) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Initial Load & Listen for Live Status (without aggressive 5s polling that wiped inputs)
  useEffect(() => {
    fetchConfig();

    if (window.electronAPI?.onAutoPilotStatus) {
      const unsub = window.electronAPI.onAutoPilotStatus((status) => {
        setLiveStatus(status);
        setIsExecutingNow(status.isRunning);
        if (status.currentStep === 'done' || (!status.isRunning && status.historyItem)) {
          fetchConfig();
        }
      });
      return () => {
        unsub();
      };
    }
  }, [settings.youtubeCommentText]);

  const handleSaveConfig = async (newConfig?: AutoPilotSchedule) => {
    const toSave = newConfig || config;
    if (window.electronAPI?.saveAutoPilotConfig) {
      const updated = await window.electronAPI.saveAutoPilotConfig(toSave);
      setConfig(updated);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Immediate auto-save handlers so user choices are never lost or reverted
  const handleScheduleTimeChange = (newTime: string) => {
    const updated = { ...config, scheduleTime: newTime };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleFrequencyChange = (newFreq: any) => {
    const updated = { ...config, frequency: newFreq };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleCustomIntervalChange = (val: number) => {
    const updated = { ...config, customIntervalValue: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleToggleEnabled = async () => {
    const nextEnabled = !config.enabled;
    const updated = { ...config, enabled: nextEnabled };
    setConfig(updated);

    if (!nextEnabled) {
      // 예약 끄기 -> 진행 중이던 모든 오토파일럿/렌더링 작업 즉각 STOP
      setIsExecutingNow(false);
      setLiveStatus(null);
      if (window.electronAPI?.stopAutoPilot) {
        try {
          await window.electronAPI.stopAutoPilot();
        } catch (e) {
          console.error('[stopAutoPilot error]:', e);
        }
      } else {
        await handleSaveConfig(updated);
      }
    } else {
      await handleSaveConfig(updated);
    }
  };

  const handleToggleAutoUpload = (val: boolean) => {
    const updated = { ...config, autoUploadYoutube: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleToggleAutoComment = (val: boolean) => {
    const updated = { ...config, autoComment: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleCleanCommentWarnings = () => {
    const cleaned = (config.history || []).map((h) => ({
      ...h,
      commentStatus: h.commentStatus === 'failed' ? ('skipped' as const) : h.commentStatus,
      commentError: undefined,
    }));
    const updated = { ...config, history: cleaned };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const hasCommentScopeWarning = (config.history || []).some(
    (h) => h.commentStatus === 'failed' && (h.commentError?.includes('youtube.force-ssl') || h.commentError?.includes('권한'))
  );

  const handleTriggerNow = async () => {
    if (isExecutingNow) return;

    setIsExecutingNow(true);
    setTriggerResult(null);

    try {
      if (window.electronAPI?.triggerAutoPilotNow) {
        const res = await window.electronAPI.triggerAutoPilotNow();
        if (res.success) {
          setTriggerResult({
            success: true,
            message: `"${res.topic}" 주제로 쇼츠 제작 및 발행이 완료되었습니다!`,
            videoUrl: res.videoUrl,
          });
          await fetchConfig();
        } else {
          setTriggerResult({
            success: false,
            message: res.error || '자율 발행 실행 중 오류가 발생했습니다.',
          });
        }
      }
    } catch (err: any) {
      setTriggerResult({
        success: false,
        message: err?.message || String(err),
      });
    } finally {
      setIsExecutingNow(false);
    }
  };

  const hasYoutubeConnected = Boolean(settings.youtubeClientId && settings.youtubeRefreshToken);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E5DEC9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#14213D] flex items-center gap-2">
              <span>정기 복습 · 단원 클립 자동 예약 발행</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]">
                학기 스케줄러
              </span>
            </h1>
            <p className="text-xs text-[#5C6B85] font-medium">
              지정한 교과 단원의 예습·복습 쇼츠를 정해진 시간에 맞춰 교안 생성부터 영상 합성, 학급 채널 발행까지 자동으로 진행합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Button */}
          <button
            onClick={() => fetchConfig(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] border border-[#CFC6AE] text-xs font-bold transition-colors"
            title="스케줄 상태 및 발행 이력 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#3D4B66] ${isRefreshing ? 'animate-spin text-[#1E40AF]' : ''}`} />
            <span>새로고침</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => handleSaveConfig()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? '설정 저장 완료' : '설정 저장'}</span>
          </button>
        </div>
      </div>

      {/* Main Status & Action Hero Banner */}
      <div className={`p-6 rounded-xl border transition-colors ${
        config.enabled
          ? 'bg-[#14213D] text-white border-[#1C2E52]'
          : 'bg-[#FFFDF8] text-[#14213D] border-[#E5DEC9]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-[#4ADE80] animate-ping' : 'bg-[#CFC6AE]'}`} />
              <span className={`text-xs font-extrabold uppercase tracking-wider ${config.enabled ? 'text-[#FDE68A]' : 'text-[#5C6B85]'}`}>
                {config.enabled ? '정기 수업 발행 가동 중' : '정기 수업 발행 대기 중'}
              </span>
              <span className={`text-xs ${config.enabled ? 'text-[#9FB2D4]' : 'text-[#5C6B85]'}`}>
                • 현재 시각: <b className={`font-mono ${config.enabled ? 'text-white' : 'text-[#14213D]'}`}>{currentTime || '--:--:--'}</b>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {config.enabled
                ? `${formatTimeLabel(config.scheduleTime)} 기준, 설정된 주기에 맞춰 단원 복습 쇼츠가 자동 발행됩니다.`
                : '스케줄러를 켜면 지정된 시간에 맞춰 새로운 교과 개념 쇼츠를 자동 발행합니다.'}
            </h2>

            <div className={`text-xs flex items-center gap-4 font-medium flex-wrap ${config.enabled ? 'text-[#E8EEF7]' : 'text-[#5C6B85]'}`}>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.enabled ? 'bg-[#1C2E52]' : 'bg-[#FAF8F3] border border-[#E5DEC9]'}`}>
                <Clock className={`w-3.5 h-3.5 ${config.enabled ? 'text-[#FDE68A]' : 'text-[#B45309]'}`} />
                <span>다음 발행: <b>{config.nextRunAt ? new Date(config.nextRunAt).toLocaleString() : '미정'}</b></span>
                <span className={`font-bold ml-1 ${config.enabled ? 'text-[#FDE68A]' : 'text-[#1E40AF]'}`}>({getTimeUntilNextRun(config.nextRunAt)})</span>
              </span>
              {config.lastRunAt && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>최근 실행: {new Date(config.lastRunAt).toLocaleTimeString()}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Instant Run Button */}
            <button
              onClick={handleTriggerNow}
              disabled={isExecutingNow}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-extrabold text-xs transition-colors ${
                isExecutingNow
                  ? 'bg-[#3D4B66] text-[#E5DEC9] cursor-not-allowed'
                  : config.enabled
                  ? 'bg-[#F59E0B] hover:bg-[#D97706] text-[#14213D]'
                  : 'bg-[#1E40AF] hover:bg-[#1E3A8A] text-white'
              }`}
            >
              {isExecutingNow ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>수업 클립 제작 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>지금 즉시 1편 시험 발행</span>
                </>
              )}
            </button>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleEnabled}
              className={`px-4 py-2.5 rounded-lg text-xs font-black transition-colors border ${
                config.enabled
                  ? 'bg-[#166534] text-white border-[#22C55E] hover:bg-[#15803D]'
                  : 'bg-[#FAF8F3] text-[#14213D] border-[#CFC6AE] hover:bg-[#F2EFE6]'
              }`}
            >
              {config.enabled ? '예약 끄기' : '예약 켜기'}
            </button>
          </div>
        </div>

        {/* Live Status Notification Box */}
        {(liveStatus?.isRunning || triggerResult) && (
          <div className="mt-5 pt-4 border-t border-white/10 text-xs">
            {liveStatus?.isRunning && (
              <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center gap-3 text-purple-100 animate-pulse">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-semibold">{liveStatus.message || 'AI 오토파일럿이 쇼츠를 제작하고 있습니다...'}</span>
              </div>
            )}

            {triggerResult && !liveStatus?.isRunning && (
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                triggerResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  {triggerResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  <span>{triggerResult.message}</span>
                </div>
                {triggerResult.videoUrl && (
                  <a
                    href={triggerResult.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-bold underline hover:text-white"
                  >
                    <span>유튜브 확인</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Guideline Alert Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 space-y-1.5 shadow-sm">
        <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>유튜브 채널 안전 업로드 한도 & 알고리즘 가이드</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          • <b>유튜브 무료 API 기본 쿼터(10,000pt) 기준</b>: 하루 <b>최대 6편(4시간 간격)</b>이 기본 쿼터 안에서 업로드할 수 있는 대략적인 한도입니다.<br />
          • <b>계정 성장기 권장</b>: 하루 <b>1~3편</b>부터 시작해 반응을 보며 늘리는 것을 권장합니다.<br />
          • 업로드 한도와 정책은 YouTube 사정에 따라 바뀔 수 있습니다.
        </p>
      </div>

      {/* Grid: Settings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Topic Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Schedule Time & Frequency */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-extrabold text-slate-900">1. 예약 발행 시간 및 주기 설정 (최대치 지원)</h2>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {formatTimeLabel(config.scheduleTime)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>기준 시작 시각 (24시간 형식)</span>
                  <span className="text-slate-400 text-[11px] font-medium">현재: {currentTime.slice(0, 5)}</span>
                </label>
                <input
                  type="time"
                  value={config.scheduleTime}
                  onChange={(e) => handleScheduleTimeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-500 font-medium">
                  * 밤 11시는 <b className="text-purple-700">23:00</b>로 표기됩니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">발행 주기 (원하는 빈도 선택)</label>
                <select
                  value={config.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                >
                  <option value="daily">매일 1편 (기준 시각에 1회 발행 - 표준)</option>
                  <option value="twice_daily">매일 2편 (12시간 간격 - 추천)</option>
                  <option value="thrice_daily">매일 3편 (8시간 간격 - 아침/점심/저녁)</option>
                  <option value="every_6h">하루 4편 (6시간마다 1편)</option>
                  <option value="every_4h">하루 6편 (4시간마다 1편 - 🛡️ API 최적 안전 한도)</option>
                  <option value="every_3h">하루 8편 (3시간마다 1편)</option>
                  <option value="every_2h">하루 12편 (2시간마다 1편 - ⚡ 폭풍 성장 최대치)</option>
                  <option value="every_1h">하루 24편 (1시간마다 1편 - 극한 자동화)</option>
                  <option value="custom_hours">⚙️ 직접 설정: N시간 간격</option>
                  <option value="custom_minutes">⚙️ 직접 설정: N분 간격</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium">안전하면서도 강력한 발행 빈도를 마음대로 고를 수 있습니다.</p>
              </div>
            </div>

            {/* Custom Interval Input (Shows when custom option is selected) */}
            {(config.frequency === 'custom_hours' || config.frequency === 'custom_minutes') && (
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-4 animate-in fade-in duration-150">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-purple-900">
                    {config.frequency === 'custom_hours' ? '직접 지정할 시간 간격' : '직접 지정할 분 간격'}
                  </span>
                  <p className="text-[10px] text-purple-600">
                    {config.frequency === 'custom_hours' ? '예: 5시간마다 1편씩 발행' : '예: 45분마다 1편씩 발행 (최소 10분 이상)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={config.frequency === 'custom_hours' ? 1 : 10}
                    max={config.frequency === 'custom_hours' ? 48 : 720}
                    value={config.customIntervalValue || (config.frequency === 'custom_hours' ? 4 : 60)}
                    onChange={(e) => handleCustomIntervalChange(Math.max(1, Number(e.target.value)))}
                    className="w-24 bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-sm font-extrabold text-purple-900 text-center focus:outline-none focus:border-purple-600 shadow-sm"
                  />
                  <span className="text-xs font-bold text-purple-800">
                    {config.frequency === 'custom_hours' ? '시간마다' : '분마다'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Curriculum Niche & AI Topic Discovery */}
          <div className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5DEC9]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E40AF]" />
                <h2 className="text-sm font-extrabold text-[#14213D]">2. 교과 단원 · 수업 주제 자동 발굴 영역</h2>
              </div>
              <span className="text-[11px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                기존 수업 주제 중복 자동 제외
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#14213D] flex items-center justify-between">
                  <span>교과 · 학습 영역 프리셋 (클릭 시 즉시 적용)</span>
                  <span className="text-[#1E40AF] text-[10px] font-bold">원클릭 커리큘럼 선택</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {PRESET_NICHES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setConfig({ ...config, channelNiche: preset.value })}
                      className={`px-2.5 py-2 rounded-lg text-left text-[11px] font-bold transition-colors border leading-snug ${
                        config.channelNiche === preset.value
                          ? 'bg-[#14213D] border-[#14213D] text-[#FDE68A]'
                          : 'bg-[#FAF8F3] border-[#E5DEC9] text-[#3D4B66] hover:bg-[#F2EFE6] hover:text-[#14213D]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#14213D]">수업 채널 주제 / 학기 커리큘럼 설명 (직접 수정 가능)</label>
                <input
                  type="text"
                  value={config.channelNiche}
                  onChange={(e) => setConfig({ ...config, channelNiche: e.target.value })}
                  placeholder="예: 중2 과학 1학기 물질의 구성~전기와 자기 핵심 1분 개념 정리"
                  className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#14213D] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
                />
                <p className="text-[10px] text-[#5C6B85] font-medium">
                  AI가 선택한 교과 영역을 바탕으로 이미 제작한 단원을 제외한 새로운 차시 개념을 자동으로 기획합니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#14213D]">교수법 · 말투 추가 지침 (선택 사항)</label>
                <textarea
                  value={config.customInstruction || ''}
                  onChange={(e) => setConfig({ ...config, customInstruction: e.target.value })}
                  rows={2}
                  placeholder="예: 중학생 눈높이에 맞춰 일상 비유로 설명하고, 마지막에 O/X 확인 퀴즈 문장으로 끝내주세요."
                  className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-3.5 py-2 text-xs font-medium text-[#14213D] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>

              <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>성과 기반 후속작(2탄) 자동 기획</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      내 채널에서 조회수가 급상승한 영상이 있으면 새 주제 대신 그 영상의 2탄을 우선 기획합니다. 없으면 기존 자율 기획으로 진행합니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!config.followUpMode}
                      onChange={(e) => {
                        const updated = { ...config, followUpMode: e.target.checked };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzePerformance}
                  disabled={perfLoading}
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 disabled:opacity-60"
                >
                  {perfLoading ? '분석 중...' : '내 채널 성과 분석해 보기'}
                </button>
                {perfError && <p className="text-[10px] text-red-600 font-medium">{perfError}</p>}
                {perf && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-slate-500">
                      최근 {perf.videoCount}개 영상 · 일평균 조회수 중앙값 {perf.baselineViewsPerDay.toLocaleString()}회
                    </p>
                    {perf.videos.length === 0 && <p className="text-[10px] text-slate-500">분석할 영상이 없습니다.</p>}
                    {perf.videos.map((v) => (
                      <div key={v.id} className="flex items-center justify-between gap-2 text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                        <span className="truncate font-medium text-slate-700">{v.title}</span>
                        <span className="shrink-0 text-slate-500">
                          {v.views.toLocaleString()}회 · {v.multiple}배
                          {v.isBreakout && (
                            <span className="ml-1.5 font-bold text-emerald-600">
                              {v.alreadyFollowedUp ? '급상승 (2탄 제작됨)' : v.id === perf.followUpCandidateId ? '급상승 → 다음 2탄 대상' : '급상승'}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: YouTube & Auto-Comment Integration Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Share2 className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-extrabold text-slate-900">4. 플랫폼 연동 및 자동 발행 설정</h2>
            </div>

            {!hasYoutubeConnected && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>유튜브 API 토큰 미등록</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  [발행 및 유튜브 연동] 메뉴에서 Google OAuth 토큰을 등록하면 쇼츠가 즉시 자동 업로드됩니다.
                </p>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {/* Auto Upload Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">유튜브 쇼츠 자동 업로드</div>
                  <p className="text-[10px] text-slate-500">렌더링 완료 즉시 공개 상태로 게시</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoUploadYoutube}
                    onChange={(e) => handleToggleAutoUpload(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Auto Comment Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>첫 댓글 자동 등록</span>
                  </div>
                  <p className="text-[10px] text-slate-500">영상 게시 직후 내 채널 첫 댓글 작성</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoComment}
                    onChange={(e) => handleToggleAutoComment(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Comment Text */}
              {config.autoComment && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">고정/등록될 첫 댓글 문구</label>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">비워두면 AI 자동 작성</span>
                  </div>
                  <textarea
                    value={config.commentText || ''}
                    onChange={(e) => setConfig({ ...config, commentText: e.target.value })}
                    onBlur={() => handleSaveConfig()}
                    rows={2}
                    placeholder="비워두시면 AI가 영상 주제에 맞춘 시청자 참여 유도 첫 댓글을 알아서 작성합니다. (직접 지정하시려면 문구를 입력하세요)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-y"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 꿀팁: 구글 API로 댓글을 달기 위해서는 OAuth 토큰 발급 시 <span className="font-semibold text-slate-600">youtube.force-ssl</span> 권한이 포함되어 있어야 합니다.
                  </p>
                </div>
              )}

              {/* BGM Auto Ducking for AutoPilot */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-violet-600" />
                    <span>배경음악(BGM) & 오디오 덕킹</span>
                  </div>
                  <p className="text-[10px] text-slate-500">주제 맞춤형 BGM 자동 믹싱 및 대사 구간 볼륨 감쇠</p>
                </div>
                <select
                  value={config.bgmMood || 'auto'}
                  onChange={(e) => {
                    const updated = { ...config, bgmMood: e.target.value };
                    setConfig(updated);
                    handleSaveConfig(updated);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="auto">🤖 AI 자동 선곡 (권장)</option>
                  <option value="bgm_upbeat">☀️ 밝고 경쾌한 팝</option>
                  <option value="bgm_suspense">🌑 미스터리 & 스릴러</option>
                  <option value="bgm_lofi">☕ 감성 힐링 & 로파이</option>
                  <option value="bgm_epic">⚔️ 웅장한 시네마틱</option>
                  <option value="bgm_tech">⚡ 모던 테크 & 지식</option>
                  <option value="none">🔇 BGM 없음</option>
                </select>
              </div>

              {/* Telegram Mobile Notification Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>텔레그램 스마트폰 푸시 알림</span>
                  </div>
                  <p className="text-[10px] text-slate-500">발행 완료 시 스마트폰으로 영상 링크와 첫 댓글 즉시 전송</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableTelegramNotify ?? settings.enableTelegramNotify ?? true}
                    onChange={(e) => {
                      const updated = { ...config, enableTelegramNotify: e.target.checked };
                      setConfig(updated);
                      handleSaveConfig(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Modern Subtitle, Title Header & 3s Hook Intro Style with Real-Time Screen Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Heading className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  3. 상단 제목 & 후킹 타이틀 & 자막 스타일
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  실시간 화면 프리뷰 연동
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                상단 고정 제목, 첫 3초 후킹 인트로, 본문 자막 스타일이 오른쪽 9:16 모바일 화면에 실시간으로 즉시 적용됩니다.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            ⚡ 시청 지속 시간 극대화
          </span>
        </div>

        {/* 2-Column Responsive Layout: Left Controls + Right Live Phone Screen Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (lg:col-span-7 xl:col-span-7): Styling Controls */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* 3-A: Top Title Header Style */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>상단 고정 제목(Header) 스타일</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">영상 상단에 고정 노출되는 핵심 타이틀</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TITLE_STYLES.map((ts) => {
                  const isSelected = (config.titleStyleId || 'yellow_tape') === ts.id;
                  return (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, titleStyleId: ts.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900">{ts.name.split('(')[0].trim()}</span>
                        {ts.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {ts.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{ts.tag}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-B: First 3s Hook Intro Banner */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>초반 이탈 방지! 첫 3초 상단 후킹 타이틀 배너</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    영상 시작 0~2.3초간 강력한 팝업 모션으로 시청자의 시선을 끕니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableHookIntro ?? true}
                    onChange={(e) => {
                      const updated = { ...config, enableHookIntro: e.target.checked };
                      setConfig(updated);
                      handleSaveConfig(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {(config.enableHookIntro ?? true) && (
                <div className="space-y-3 pt-2 border-t border-amber-200/60">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      후킹 타이틀 추천 프리셋 (원클릭 즉시 적용)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {HOOK_PRESETS.map((preset) => {
                        const isSelected = (config.hookIntroPreset || 'tips') === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              const updated: AutoPilotSchedule = {
                                ...config,
                                hookIntroPreset: preset.id,
                                hookTitleText: preset.id === 'custom' ? (config.hookTitleText || '') : preset.title,
                                hookSubtitleText: preset.id === 'custom' ? (config.hookSubtitleText || '') : preset.subtitle,
                              };
                              setConfig(updated);
                              handleSaveConfig(updated);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'border-amber-500 bg-amber-100/80 text-amber-950 shadow-xs font-black ring-2 ring-amber-300'
                                : 'border-amber-200/80 bg-white text-slate-700 hover:bg-amber-50/50 font-medium'
                            }`}
                          >
                            <span className="truncate block font-bold text-[11px]">{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customizable Hook Text Inputs with live reactive typing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                        <span>메인 후킹 문구 (상단 볼드)</span>
                        <span className="text-[9px] text-amber-600 font-semibold">실시간 화면 반영</span>
                      </label>
                      <input
                        type="text"
                        value={config.hookTitleText ?? '⚡ 놓치면 손해 3초 꿀팁 ⚡'}
                        onChange={(e) => {
                          setConfig({ ...config, hookTitleText: e.target.value });
                        }}
                        onBlur={() => handleSaveConfig()}
                        placeholder="예: ⚡ 놓치면 손해 3초 꿀팁 ⚡"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-xs font-black text-amber-950 focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                        <span>서브 후킹 문구 (하단 서브)</span>
                        <span className="text-[9px] text-amber-600 font-semibold">실시간 화면 반영</span>
                      </label>
                      <input
                        type="text"
                        value={config.hookSubtitleText ?? '끝까지 보면 인생이 바뀝니다'}
                        onChange={(e) => {
                          setConfig({ ...config, hookSubtitleText: e.target.value });
                        }}
                        onBlur={() => handleSaveConfig()}
                        placeholder="예: 끝까지 보면 인생이 바뀝니다"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3-C: Subtitle Style Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>본문 자막 비주얼 스타일</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">영상의 분위기에 맞춰 선택하세요</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SUBTITLE_STYLES.map((sub) => {
                  const isSelected = (config.subtitleStyleId || 'mrbeast') === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, subtitleStyleId: sub.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        {sub.name.split('&')[0].trim()}
                      </div>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">{sub.tag.split('/')[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-C-2: Subtitle Font Size Selection */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>본문 자막 글씨 크기</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">화면 가독성 맞춤 조절 (적정 크기 프리셋)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'small', label: '보통 (48pt)', desc: '단정한 기본 크기' },
                  { id: 'medium', label: '크게 (56pt)', desc: '추천 표준 크기', badge: '추천' },
                  { id: 'large', label: '아주 크게 (66pt)', desc: '눈에 띄는 강조형' },
                  { id: 'xlarge', label: '초대형 (78pt)', desc: '압도적 숏폼 시선집중' },
                ].map((sizeOpt) => {
                  const isSelected = (config.subtitleFontSize || 'medium') === sizeOpt.id;
                  return (
                    <button
                      key={sizeOpt.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, subtitleFontSize: sizeOpt.id as SubtitleFontSize };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`relative p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 shadow-sm ring-2 ring-indigo-200 text-indigo-950 font-black'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 text-slate-700 font-semibold'
                      }`}
                    >
                      {sizeOpt.badge && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[9px] font-black bg-indigo-600 text-white rounded-full shadow-xs">
                          {sizeOpt.badge}
                        </span>
                      )}
                      <div className="text-xs">{sizeOpt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sizeOpt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-D: Video Visual Screen Template Selection (13 Styles) */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>영상 화면 비주얼 템플릿 (AI 이미지 화풍 13종)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">채널 테마에 맞는 화풍을 선택하세요</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = (config.templateId || 'basic') === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, templateId: tmpl.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        {tmpl.name}
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 truncate max-w-full">
                        {tmpl.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-5 xl:col-span-5): Real-Time Phone Screen Preview */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5">
            <div className="w-full text-center mb-3">
              <span className="text-xs font-black text-slate-800 flex items-center justify-center gap-1.5">
                <span>📱 실제 숏폼 영상 실시간 프리뷰</span>
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                왼쪽에서 스타일이나 문구를 변경하면 즉시 화면에 반영됩니다
              </p>
            </div>

            <ShortsPhonePreview
              titleStyleId={config.titleStyleId || 'yellow_tape'}
              headerTitleText={config.channelNiche || '1분 만에 끝내는 실전 꿀팁'}
              enableHookIntro={config.enableHookIntro ?? true}
              hookTitleText={config.hookTitleText || '⚡ 놓치면 손해 3초 꿀팁 ⚡'}
              hookSubtitleText={config.hookSubtitleText || '끝까지 보면 인생이 바뀝니다'}
              subtitleStyleId={config.subtitleStyleId || 'mrbeast'}
              subtitleFontSize={config.subtitleFontSize || 'medium'}
              templateId={config.templateId || 'basic'}
              channelName={config.channelNiche?.slice(0, 8) || '쇼츠스튜디오'}
            />
          </div>
        </div>
      </div>

      {/* History Log Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-extrabold text-slate-900">AI 오토파일럿 자율 발행 이력</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchConfig(true)}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-purple-600 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span>이력 새로고침</span>
            </button>
            <button
              onClick={onNavigateToProjects}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              전체 비디오 보관함 가기 ↗
            </button>
          </div>
        </div>

        {hasCommentScopeWarning && (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in duration-200">
            <div className="space-y-0.5">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>영상은 정상 발행되었으나, 첫 댓글 작성 권한이 누락되었습니다.</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                구글 OAuth 토큰 발급 시 <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">youtube.force-ssl</code> 권한이 포함되어야 내 채널 첫 댓글 작성이 가능합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  handleToggleAutoComment(false);
                  handleCleanCommentWarnings();
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold transition-all shadow-xs"
              >
                첫 댓글 끄고 경고 정리
              </button>
              <button
                onClick={() => setIsCommentScopeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-sm transition-all active:scale-95"
              >
                권한 해결 가이드
              </button>
            </div>
          </div>
        )}

        {(!config.history || config.history.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <p className="font-bold text-slate-600">아직 오토파일럿으로 발행된 이력이 없습니다.</p>
            <p>상단의 [지금 즉시 1편 시험 발행] 버튼을 누르거나 예약 시간을 기다리면 자동으로 기록됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {config.history.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.status === 'success' && (item.uploadStatus === 'uploaded' || item.videoUrl)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.status === 'success' && (item.uploadStatus === 'uploaded' || item.videoUrl)
                        ? '발행 성공'
                        : item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')
                        ? '⚠️ 영상완성 (유튜브 업로드 실패)'
                        : '제작 실패'}
                    </span>
                    {(item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')) && onNavigateToPublish && (
                      <button
                        onClick={onNavigateToPublish}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
                        title="클릭하여 유튜브 OAuth 토큰 상태 확인 및 재발급"
                      >
                        🔑 OAuth 토큰 확인 (플랫폼 연동 ↗)
                      </button>
                    )}
                    {item.commentStatus === 'posted' && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        💬 첫 댓글 완료
                      </span>
                    )}
                    {item.telegramNotified && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                        📲 텔레그램 전송됨
                      </span>
                    )}
                    {item.commentStatus === 'failed' && (
                      <button
                        onClick={() => setIsCommentScopeModalOpen(true)}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
                        title="클릭하여 해결 가이드 확인"
                      >
                        ⚠️ 댓글 권한 확인 (해결 가이드)
                      </button>
                    )}
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">{item.topic}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                    {item.uploadError && <span className="text-amber-600 ml-2 font-medium">({item.uploadError})</span>}
                    {item.errorMessage && !item.uploadError && <span className="text-rose-500 ml-2">({item.errorMessage})</span>}
                    {item.commentError && (
                      <button
                        onClick={() => setIsCommentScopeModalOpen(true)}
                        className="text-amber-600 ml-2 underline hover:text-amber-800 font-medium"
                      >
                        (OAuth 'youtube.force-ssl' 권한 누락 - 클릭하여 해결 ↗)
                      </button>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>유튜브 쇼츠 ↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Scope Help & One-Click Fix Modal */}
      {isCommentScopeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-14 px-6 border-b border-slate-200 bg-amber-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm text-slate-900">유튜브 첫 댓글 권한(Scope) 해결 가이드</h3>
              </div>
              <button
                onClick={() => setIsCommentScopeModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-amber-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>비디오 영상 업로드는 100% 정상 완료되었습니다!</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  유튜브 쇼츠 영상 자체는 채널에 이미 정상적으로 게시되었으며, 게시 직후 내 채널 명의로 작성하려던 '첫 댓글(고정 댓글)'만 권한 부족으로 생략된 상태입니다.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">왜 댓글 권한 확인 알림이 뜨나요?</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  구글 보안 정책상 <b>비디오 업로드 권한(<code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">youtube.upload</code>)</b>과 <b>댓글 작성 권한(<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">youtube.force-ssl</code>)</b>이 별도로 분리되어 있습니다. 현재 등록된 토큰에 댓글 작성 권한이 포함되지 않아 첫 댓글 작성이 차단된 상태입니다.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800 flex items-center justify-between">
                    <span>옵션 1: 첫 댓글 자동 작성을 원하지 않는 경우 (가장 간편)</span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">원클릭 해결</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    첫 댓글 기능을 끄고 이전 경고를 정리합니다. 이후 발행되는 모든 쇼츠는 실패 알림 없이 100% [발행 성공]만 깔끔하게 표시됩니다.
                  </p>
                  <button
                    onClick={() => {
                      handleToggleAutoComment(false);
                      handleCleanCommentWarnings();
                      setIsCommentScopeModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
                  >
                    첫 댓글 기능 끄고 이전 경고 깔끔하게 정리하기
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="font-extrabold text-blue-900">
                    옵션 2: 첫 댓글까지 완전 자동으로 게시하고 싶은 경우
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Google OAuth Playground에서 <code className="bg-white px-1 rounded text-red-600 font-mono text-[10px]">youtube.upload</code>와 <code className="bg-white px-1 rounded text-blue-600 font-mono text-[10px]">youtube.force-ssl</code> 2개를 함께 체크하여 Refresh Token을 1분 만에 재발급받으시면 됩니다.
                  </p>
                  {onNavigateToPublish && (
                    <button
                      onClick={() => {
                        setIsCommentScopeModalOpen(false);
                        onNavigateToPublish();
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
                    >
                      [발행 및 유튜브 연동] 메뉴에서 상세 가이드 보기 ↗
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
