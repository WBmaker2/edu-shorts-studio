import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Sparkles,
  FolderOpen,
  Share2,
  HelpCircle,
  LogOut,
  User,
  Film,
  Zap,
  Calendar,
  Crown,
  Coins,
  GraduationCap,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'create' | 'video-to-shorts' | 'autopilot' | 'ai-settings' | 'projects' | 'templates' | 'publish' | 'help';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userName: string;
  projectCount: number;
  onLogout: () => void;
  isAdmin?: boolean;
  licenseKey?: string;
  tokens?: number;
  onOpenUpdate?: () => void;
  onOpenCalendarModal?: () => void;
  onOpenRechargeModal?: () => void;
  hasUpdate?: boolean;
  latestVersion?: string;
  currentVersion?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userName,
  projectCount,
  onLogout,
  isAdmin,
  tokens,
  onOpenUpdate,
  onOpenCalendarModal,
  onOpenRechargeModal,
  hasUpdate,
  latestVersion,
  currentVersion,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: '교사 대시보드', icon: LayoutDashboard },
    { id: 'create', label: '단원 수업 쇼츠 제작', icon: BookOpen, badge: '60초' },
    { id: 'video-to-shorts', label: '강의·영상 분석 쇼츠', icon: Film, badge: 'NEW' },
    { id: 'templates', label: '교과 프리셋 · 성우', icon: Sparkles },
    { id: 'projects', label: '수업 클립 보관함', icon: FolderOpen, badge: projectCount > 0 ? projectCount : undefined },
    { id: 'autopilot', label: '예약 배포 (Auto-Pilot)', icon: Zap, badge: '자동' },
    { id: 'publish', label: '학습 채널 · SNS 연동', icon: Share2 },
    { id: 'ai-settings', label: 'AI · 로컬 엔진 설정', icon: Bot },
    { id: 'help', label: '교사용 제작 가이드', icon: HelpCircle },
  ];

  const displayVersion = currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.15');

  return (
    <aside className="hidden md:flex w-64 bg-[#14213D] border-r border-[#24365C] flex-col justify-between shrink-0 select-none h-screen text-[#E8EEF7]">
      <div>
        {/* Brand Identity Header */}
        <div className="h-16 px-4 flex items-center gap-2.5 border-b border-[#24365C] bg-[#0F1930]">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center text-[#14213D] font-black text-base shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-extrabold text-[13px] text-white tracking-tight whitespace-nowrap">Edu-Shorts Studio</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1E335C] text-[#C6D6F2] border border-[#2F4A80] font-bold tabular-nums shrink-0">
                v{displayVersion}
              </span>
            </div>
            <span className="text-[10px] text-[#9FB2D4] font-semibold tracking-tight block truncate">
              단원 개념 노트 &amp; 9:16 수업 스튜디오
            </span>
          </div>
        </div>

        {/* Open Classroom Mode Card (No login, No tokens, No API required) */}
        <div className="p-3 mx-3 my-3 rounded-lg bg-[#1A2B4E] border border-[#293E6D] space-y-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 border bg-[#1E3A8A] border-[#3B63D6] text-[#DBEAFE]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                오픈 교실 스튜디오
              </p>
              <div className="text-[10px] text-[#86EFAC] font-semibold flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shrink-0" />
                <span className="truncate">로그인 없이 무료 이용</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#293E6D] flex items-center justify-between text-[10px]">
            <span className="text-[#B6C7E6] font-semibold">교안·음성·영상 엔진</span>
            <span className="font-extrabold text-[#FDE68A] bg-[#3B2F14] px-2 py-0.5 rounded border border-[#B45309]">
              API 없이 바로 제작
            </span>
          </div>
        </div>

        {/* Curriculum Studio Navigation */}
        <nav className="px-3 space-y-1 mt-1" aria-label="스튜디오 주 메뉴">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors group ${
                  isActive
                    ? 'bg-[#1E40AF] text-white border border-[#3B63D6] font-bold'
                    : 'text-[#B6C7E6] hover:text-white hover:bg-[#1C2E52] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-1 h-3.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#FBBF24]' : 'bg-transparent group-hover:bg-[#3B5998]'
                    }`}
                  />
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#FDE68A]' : 'text-[#9FB2D4] group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums shrink-0 ${
                      isActive
                        ? 'bg-[#14213D] text-[#FDE68A]'
                        : 'bg-[#1C2E52] text-[#C6D6F2] border border-[#2C4475]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {onOpenCalendarModal && (
          <div className="px-3 mt-2.5">
            <button
              type="button"
              onClick={onOpenCalendarModal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1A2B4E] hover:bg-[#223763] text-[#FDE68A] border border-[#B45309] font-bold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FBBF24]" />
                <span>수업 배포 캘린더</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#14213D] font-black">
                일정표
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Engine Status & Session Controls */}
      <div className="p-3 border-t border-[#24365C] space-y-2 bg-[#0F1930]">
        <div className="bg-[#162442] rounded-lg p-2.5 border border-[#253A66] text-[11px] text-[#B6C7E6] space-y-1">
          <div className="flex items-center justify-between font-semibold text-white">
            <span>로컬 수업 엔진</span>
            <span className="text-[#86EFAC] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              준비 완료
            </span>
          </div>
          <div className="text-[10px] text-[#9FB2D4] tabular-nums">
            {typeof window !== 'undefined' && (window as any).electronAPI
              ? 'FFmpeg 9:16 · 무료 Neural TTS'
              : '브라우저 내장 엔진 · WebM 9:16'}
          </div>
        </div>

        {onOpenUpdate && typeof window !== 'undefined' && (window as any).electronAPI && (() => {
          const isRealUpdate = Boolean(
            hasUpdate &&
            latestVersion &&
            displayVersion &&
            latestVersion.replace(/^v/, '').trim() !== displayVersion.replace(/^v/, '').trim()
          );
          return (
            <button
              type="button"
              onClick={onOpenUpdate}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                isRealUpdate
                  ? 'text-[#14213D] bg-[#F59E0B] hover:bg-[#D97706] border border-[#FCD34D]'
                  : 'text-[#B6C7E6] hover:text-white bg-[#162442] hover:bg-[#1E3158] border border-[#253A66]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className={`w-3.5 h-3.5 ${isRealUpdate ? 'text-[#14213D]' : 'text-[#FBBF24]'}`} />
                <span>{isRealUpdate ? '새 버전 업데이트' : '버전 상태 확인'}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold tabular-nums ${
                  isRealUpdate ? 'bg-[#14213D] text-[#FDE68A]' : 'bg-[#21345E] text-[#D5E1F7]'
                }`}
              >
                {isRealUpdate ? `v${latestVersion || 'NEW'}` : `v${displayVersion}`}
              </span>
            </button>
          );
        })()}
      </div>
    </aside>
  );
};
