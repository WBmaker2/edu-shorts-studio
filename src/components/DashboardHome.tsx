import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Key,
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Play,
  Share2,
  Bot,
  Zap,
  Layers,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageCircle,
  Scissors,
  Calendar,
  Film,
  GraduationCap,
} from 'lucide-react';
import type { ShortsProject, AppSettings, YouTubeLiveStats } from '../types';
import type { NavTab } from './Sidebar';

interface DashboardHomeProps {
  userName: string;
  projects: ShortsProject[];
  settings: AppSettings;
  onNavigate: (tab: NavTab) => void;
  onSelectProject: (p: ShortsProject) => void;
  onOpenBatchModal?: () => void;
  onOpenLongToShortsModal?: () => void;
  onOpenCalendarModal?: () => void;
}

const LESSON_ARCHETYPES = [
  {
    id: 'concept_summary',
    stage: '단원 핵심 요약',
    title: '교과서 핵심 개념 1분 정리',
    structure: '핵심 질문 → 개념 정의 → 비교·예시 → 한 줄 요약',
    duration: '50~60초',
    recommended: '선희 성우 · 노란 형광펜 자막',
  },
  {
    id: 'intro_quiz',
    stage: '수업 도입 질문',
    title: '수업 시작 3초 호기심·오개념 퀴즈',
    structure: '일상 속 의문 → 오개념 함정 → 과학·사회적 원리 → 정답 공개',
    duration: '35~50초',
    recommended: '지민 성우 · 질문 카드 헤더',
  },
  {
    id: 'inquiry_story',
    stage: '탐구·사례 해설',
    title: '역사 사건·과학 실험 스토리텔링',
    structure: '시대·실험 배경 → 결정적 전환점 → 인과 관계 → 교훈·의의',
    duration: '55~60초',
    recommended: '봉진/인준 성우 · 다큐멘터리 자막',
  },
  {
    id: 'flipped_review',
    stage: '거꾸로 수업·복습',
    title: '가정 예습 및 시험 직전 암기 노트',
    structure: '오늘의 학습 목표 → 필수 키워드 3가지 → 확인 문제 예고',
    duration: '45~55초',
    recommended: '서현 성우 · 차분한 로파이 배경음',
  },
];

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userName,
  projects,
  settings,
  onNavigate,
  onSelectProject,
  onOpenBatchModal,
  onOpenLongToShortsModal,
  onOpenCalendarModal,
}) => {
  const completedProjects = projects.filter((p) => p.status === 'done');
  const recent7DaysCount = completedProjects.filter(
    (p) => Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000
  ).length;
  const hasGeminiKey = Boolean(settings.geminiApiKey);
  const hasMediaKey = Boolean(settings.pexelsApiKey || settings.pixabayApiKey);
  const hasYoutube = Boolean(settings.youtubeRefreshToken && settings.youtubeClientId);

  const [liveStats, setLiveStats] = useState<YouTubeLiveStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchLiveStats = async () => {
    if (!hasYoutube || !window.electronAPI?.getYoutubeLiveStats) return;
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const res = await window.electronAPI.getYoutubeLiveStats();
      if (res.success && res.data) {
        setLiveStats(res.data);
      } else {
        setStatsError(res.error || '통계를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      setStatsError(err?.message || '실시간 통계 조회 오류');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (hasYoutube) {
      fetchLiveStats();
    }
  }, [hasYoutube]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Educator Desk Sheet (No eyebrow/kicker above heading) */}
      <section className="rounded-xl bg-[#FFFDF8] border border-[#E5DEC9] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#14213D]">
                {/(선생님|강사|교사|교수)$/.test(userName.trim())
                  ? `${userName.trim()}의 수업 쇼츠 연구실`
                  : `${userName.trim()} 선생님의 수업 쇼츠 연구실`}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[#78350F] text-xs font-extrabold">
                <GraduationCap className="w-3.5 h-3.5 text-[#B45309]" />
                <span>단원 개념 노트 에디션</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#3D4B66] max-w-2xl leading-relaxed font-medium">
              학습 주제 한 줄이나 기존 강의 영상으로 수업 도입 질문, 핵심 개념 1분 요약, 복습 클립까지 9:16 세로 수업 자료로 완성합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-extrabold text-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>단원 수업 쇼츠 제작</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('video-to-shorts')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] font-bold text-xs border border-[#CFC6AE] transition-colors"
            >
              <Film className="w-4 h-4 text-[#1E40AF]" />
              <span>영상 분석 쇼츠</span>
            </button>

            {onOpenLongToShortsModal && (
              <button
                type="button"
                onClick={onOpenLongToShortsModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] font-bold text-xs border border-[#CFC6AE] transition-colors"
              >
                <Scissors className="w-4 h-4 text-[#B45309]" />
                <span>강의 구간 발췌</span>
              </button>
            )}

            {onOpenBatchModal && (
              <button
                type="button"
                onClick={onOpenBatchModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] font-bold text-xs border border-[#CFC6AE] transition-colors"
              >
                <Layers className="w-4 h-4 text-[#1E40AF]" />
                <span>단원 일괄 제작</span>
              </button>
            )}

            {onOpenCalendarModal && (
              <button
                type="button"
                onClick={onOpenCalendarModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] font-extrabold text-xs border border-[#FCD34D] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#B45309]" />
                <span>배포 캘린더</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main 2-Column Workbook Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Pedagogical Lesson Archetypes & Recent Lesson Clips */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pedagogical Archetype Index Sheet */}
          <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF8F3]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1E40AF]" />
                <h2 className="text-sm font-extrabold text-[#14213D]">수업 단계별 쇼츠 설계 가이드</h2>
              </div>
              <span className="text-xs text-[#5C6B85] font-semibold">
                수업 목적에 맞는 교안 구조를 선택해 제작 스튜디오로 이동합니다
              </span>
            </div>

            <div className="divide-y divide-[#E5DEC9]">
              {LESSON_ARCHETYPES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('create')}
                  className="px-5 py-3.5 hover:bg-[#FAF8F3] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FCD34D] text-[#78350F] text-[11px] font-extrabold">
                        {item.stage}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#14213D] group-hover:text-[#1E40AF] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-[#5C6B85] font-bold tabular-nums">
                        ({item.duration})
                      </span>
                    </div>
                    <p className="text-xs text-[#3D4B66] font-medium">
                      수업 흐름: <strong className="font-bold text-[#14213D]">{item.structure}</strong> · 권장 세팅: {item.recommended}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E40AF] shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <span>교안 열기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Lesson Shorts Archive Table */}
          <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5DEC9] flex items-center justify-between bg-[#FAF8F3]">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#1E40AF]" />
                <h2 className="text-sm font-extrabold text-[#14213D]">최근 제작한 수업 클립 보관함</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="text-xs text-[#1E40AF] hover:text-[#1E3A8A] font-extrabold hover:underline tabular-nums"
              >
                전체 보관함 ({projects.length}편) →
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-3">
                <Video className="w-9 h-9 mx-auto stroke-[1.6] text-[#5C6B85]" />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-[#14213D]">아직 제작된 수업 쇼츠가 없습니다</p>
                  <p className="text-xs text-[#5C6B85] font-medium">
                    단원 학습 주제를 입력하면 대본 분할, 성우 내레이션, 자막 합성이 자동으로 진행됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('create')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E40AF] text-white hover:bg-[#1E3A8A] text-xs font-extrabold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>첫 수업 쇼츠 제작 시작</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#E5DEC9]">
                {projects.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className="group cursor-pointer px-5 py-3.5 hover:bg-[#FAF8F3] flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            p.status === 'done'
                              ? 'bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC]'
                              : 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]'
                          }`}
                        >
                          {p.status === 'done' ? '렌더링 완료' : '작업 중'}
                        </span>
                        <h3 className="font-extrabold text-xs text-[#14213D] group-hover:text-[#1E40AF] truncate transition-colors">
                          {p.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#3D4B66] line-clamp-1 font-medium">
                        {p.script || p.prompt}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 text-xs text-[#5C6B85] font-semibold tabular-nums">
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="font-bold text-[#14213D]">{p.durationSeconds || 55}초</span>
                      {p.videoPath && (
                        <span className="p-2 rounded-lg bg-[#EFF6FF] group-hover:bg-[#1E40AF] text-[#1E40AF] group-hover:text-white border border-[#BFDBFE] transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right 1 Column: Unified Studio Ledger & Engine Readiness */}
        <div className="space-y-6">
          <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5DEC9] flex items-center justify-between bg-[#FAF8F3]">
              <h2 className="text-sm font-extrabold text-[#14213D] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#1E40AF]" />
                <span>수업 제작소 현황 &amp; 엔진 점검</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('ai-settings')}
                className="text-xs text-[#1E40AF] hover:text-[#1E3A8A] font-extrabold hover:underline"
              >
                엔진 설정
              </button>
            </div>

            <dl className="divide-y divide-[#E5DEC9] text-xs">
              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">누적 완성 수업 클립</dt>
                <dd className="font-extrabold text-[#14213D] tabular-nums flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{completedProjects.length}편 (전체 {projects.length}편)</span>
                </dd>
              </div>

              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">최근 7일 제작량</dt>
                <dd className="font-extrabold text-[#B45309] tabular-nums">{recent7DaysCount}편</dd>
              </div>

              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">수업 대본 설계 AI</dt>
                <dd className="font-bold text-[#14213D]">
                  {hasGeminiKey ? 'Gemini AI 연결됨' : '내장 교육 대본 엔진 (무료)'}
                </dd>
              </div>

              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">한국어 성우 TTS</dt>
                <dd className="font-bold text-[#15803D]">Edge-TTS 6종 준비됨</dd>
              </div>

              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">시각 자료 · 삽화 엔진</dt>
                <dd className="font-bold text-[#14213D] uppercase">
                  {settings.imageEngine || 'Pollinations'} ({hasMediaKey ? '스톡 연동' : '무료 생성'})
                </dd>
              </div>

              <div className="px-5 py-3 flex items-center justify-between">
                <dt className="text-[#3D4B66] font-semibold">유튜브 · 학습 채널</dt>
                <dd className="font-bold text-[#3D4B66]">
                  {hasYoutube ? 'YouTube 자동 연동됨' : '로컬 MP4 출력 기본'}
                </dd>
              </div>
            </dl>

            <div className="p-4 bg-[#FAF8F3] border-t border-[#E5DEC9] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('ai-settings')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#FFFDF8] hover:bg-[#F2EFE6] border border-[#CFC6AE] text-[#14213D] font-bold text-xs transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-[#1E40AF]" />
                <span>API · 엔진 관리</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('autopilot')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#FFFDF8] hover:bg-[#F2EFE6] border border-[#CFC6AE] text-[#14213D] font-bold text-xs transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-[#B45309]" />
                <span>자동 예약 배포</span>
              </button>
            </div>
          </section>

          {/* Teacher Prep Checklist Note */}
          <section className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-5 space-y-2.5 text-xs text-[#78350F]">
            <h3 className="font-extrabold text-sm text-[#14213D] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#B45309]" />
              <span>수업 쇼츠 제작 3단계 활용 팁</span>
            </h3>
            <ul className="space-y-1.5 leading-relaxed list-disc list-inside font-medium">
              <li>
                <strong className="font-extrabold text-[#14213D]">수업 도입 (30~45초)</strong>: 첫 장면 질문 배너로 학생들의 호기심을 깨우고 본 수업으로 연결하세요.
              </li>
              <li>
                <strong className="font-extrabold text-[#14213D]">핵심 개념 노트 (55초)</strong>: 노란 형광펜 자막과 1.0x~1.1x 또렷한 발음으로 핵심 용어를 짚어줍니다.
              </li>
              <li>
                <strong className="font-extrabold text-[#14213D]">강의 영상 발췌</strong>: 이미 녹화한 16:9 온라인 수업 영상은 [영상 분석 쇼츠]에서 핵심 구간만 9:16으로 추출하세요.
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Live YouTube Channel Stats (When connected) */}
      {hasYoutube && (
        <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-center font-extrabold text-xs">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#14213D]">
                  {liveStats?.channelTitle || '연동된 유튜브 학습 채널'}
                </h2>
                <p className="text-xs text-[#3D4B66] font-medium tabular-nums">
                  {liveStats
                    ? `구독자 ${liveStats.subscriberCount}명 · 누적 조회수 ${liveStats.totalViewCount}회 · 게시 영상 ${liveStats.totalVideoCount}편`
                    : '유튜브 채널 실시간 지표를 불러오는 중입니다...'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchLiveStats}
              disabled={isLoadingStats}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] border border-[#CFC6AE] text-[#14213D] text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin text-[#1E40AF]' : ''}`} />
              <span>{isLoadingStats ? '동기화 중...' : '지표 새로고침'}</span>
            </button>
          </div>

          {statsError ? (
            <div className="p-3.5 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] text-xs text-[#78350F] flex items-center justify-between">
              <span>{statsError}</span>
              <button
                type="button"
                onClick={fetchLiveStats}
                className="px-3 py-1 rounded bg-[#B45309] text-white font-bold text-[11px]"
              >
                다시 시도
              </button>
            </div>
          ) : liveStats?.recentVideos && liveStats.recentVideos.length > 0 ? (
            <div className="divide-y divide-[#E5DEC9]">
              {liveStats.recentVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-2 hover:bg-[#FAF8F3] transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <span className="font-bold text-[#14213D] truncate">{video.title}</span>
                  <div className="flex items-center gap-4 text-[#3D4B66] font-semibold tabular-nums shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#1E40AF]" />
                      {video.viewCount}회
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#B45309]" />
                      {video.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#5C6B85]" />
                      {video.commentCount}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
};
