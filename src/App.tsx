import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Wifi, WifiOff, Coins, BookOpen, GraduationCap, Sparkles, Video, RefreshCw, Layers } from 'lucide-react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardHome } from './components/DashboardHome';

// Creation Section Core Components
import { PromptSection } from './components/PromptSection';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceSelector, VOICES } from './components/VoiceSelector';
import { FontSelector, FONTS } from './components/FontSelector';
import { SubtitleStyleSelector, SUBTITLE_STYLES, TITLE_STYLES } from './components/SubtitleStyleSelector';
import { TemplateSelector, TEMPLATES } from './components/TemplateSelector';
import { BgmSelector } from './components/BgmSelector';
import { RenderProgress } from './components/RenderProgress';
import { PresetBar } from './components/PresetBar';
import { ShortsPhonePreview } from './components/ShortsPhonePreview';
import { UpdateNotificationToast } from './components/UpdateNotificationToast';

// Lazy Loaded Subpages and Modals
const AISettingsPage = lazy(() => import('./components/AISettingsPage').then((m) => ({ default: m.AISettingsPage })));
const PublishPage = lazy(() => import('./components/PublishPage').then((m) => ({ default: m.PublishPage })));
const AutoPilotPage = lazy(() => import('./components/AutoPilotPage').then((m) => ({ default: m.AutoPilotPage })));
const ProjectManagementPage = lazy(() => import('./components/ProjectManagementPage').then((m) => ({ default: m.ProjectManagementPage })));
const HelpGuidePage = lazy(() => import('./components/HelpGuidePage').then((m) => ({ default: m.HelpGuidePage })));
const PresetsManagementPage = lazy(() => import('./components/PresetsManagementPage').then((m) => ({ default: m.PresetsManagementPage })));
const ThumbnailABEditor = lazy(() => import('./components/ThumbnailABEditor').then((m) => ({ default: m.ThumbnailABEditor })));

const VideoPlayerModal = lazy(() => import('./components/VideoPlayerModal').then((m) => ({ default: m.VideoPlayerModal })));
const ProjectHistoryModal = lazy(() => import('./components/ProjectHistoryModal').then((m) => ({ default: m.ProjectHistoryModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));
const UpdateModal = lazy(() => import('./components/UpdateModal').then((m) => ({ default: m.UpdateModal })));
const BatchGeneratorModal = lazy(() => import('./components/BatchGeneratorModal').then((m) => ({ default: m.BatchGeneratorModal })));
const LongToShortsModal = lazy(() => import('./components/LongToShortsModal').then((m) => ({ default: m.LongToShortsModal })));
const VideoToShortsPage = lazy(() => import('./components/VideoToShortsPage').then((m) => ({ default: m.VideoToShortsPage })));
const PublishCalendarModal = lazy(() => import('./components/PublishCalendarModal').then((m) => ({ default: m.PublishCalendarModal })));
import { TokenRechargeModal } from './components/TokenRechargeModal';

const PageLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[360px] text-[#3D4B66] space-y-3 py-16">
    <div className="w-7 h-7 border-2 border-[#BFDBFE] border-t-[#1E40AF] rounded-full animate-spin" />
    <span className="text-xs font-bold tracking-tight text-[#3D4B66]">교안 작업실을 불러오는 중입니다...</span>
  </div>
);

import type { LicenseStatus, ShortsProject, AppSettings, ProjectStatus, UpdateCheckResult, SubtitleStyleId, TitleStyleId, SubtitleFontSize, ScriptScene, ShortsPreset } from './types';

const INITIAL_EDU_SCRIPT =
  '물 한 방울을 끝까지 쪼개면 레고 블록 한 조각 같은 기본 입자가 나옵니다.\n\n더 이상 쪼개지지 않는 물질의 기본 입자를 바로 원자라고 부릅니다.\n\n반면 원자들이 결합해 물질 고유의 성질을 나타내는 가장 작은 단위가 분자입니다.\n\n그럼 물의 성질을 지닌 최소 단위는 원자일까요, 분자일까요? 정답은 물 분자(H2O)입니다!';

const INITIAL_EDU_SCENES: ScriptScene[] = [
  {
    id: 0,
    text: '물 한 방울을 끝까지 쪼개면 레고 블록 한 조각 같은 기본 입자가 나옵니다.',
    visualPrompt: 'Educational 3D diagram comparing water droplet and lego building blocks',
    isThumbnail: true,
    estimatedDuration: 8,
    mediaType: 'image',
  },
  {
    id: 1,
    text: '더 이상 쪼개지지 않는 물질의 기본 입자를 바로 원자라고 부릅니다.',
    visualPrompt: 'Clean science textbook illustration of an atom nucleus and electrons',
    isThumbnail: false,
    estimatedDuration: 11,
    mediaType: 'image',
  },
  {
    id: 2,
    text: '반면 원자들이 결합해 물질 고유의 성질을 나타내는 가장 작은 단위가 분자입니다.',
    visualPrompt: 'H2O water molecule bonding diagram for middle school science',
    isThumbnail: false,
    estimatedDuration: 13,
    mediaType: 'image',
  },
  {
    id: 3,
    text: '그럼 물의 성질을 지닌 최소 단위는 원자일까요, 분자일까요? 정답은 물 분자(H2O)입니다!',
    visualPrompt: 'Classroom summary quiz card showing atom vs molecule comparison',
    isThumbnail: false,
    estimatedDuration: 12,
    mediaType: 'image',
  },
];

export default function App() {
  const [user, setUser] = useState<{
    name: string;
    isLoggedIn: boolean;
    licenseKey: string;
    isAdmin: boolean;
  } | null>(() => {
    const savedAuth = localStorage.getItem('kshorts_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (__BUYER_BUILD__ && (parsed.isAdmin === true || parsed.licenseKey === 'KSH-MASTER-ADMIN-SESSION')) {
          localStorage.removeItem('kshorts_auth');
          return null;
        }
        if (parsed.isAdmin === true || parsed.licenseKey === 'KSH-MASTER-ADMIN-SESSION') {
          const sanitized = {
            name: parsed.name || '마스터 교사',
            licenseKey: 'KSH-MASTER-ADMIN-SESSION',
            isAdmin: true,
            isLoggedIn: true,
          };
          localStorage.setItem('kshorts_auth', JSON.stringify(sanitized));
          return sanitized;
        }
        if (parsed.isLoggedIn && parsed.licenseKey) {
          return {
            name: parsed.name || '교사 크리에이터',
            licenseKey: String(parsed.licenseKey),
            isAdmin: false,
            isLoggedIn: true,
          };
        }
      } catch (e) {
        return null;
      }
    }
    if (typeof window !== 'undefined' && !window.electronAPI && !__BUYER_BUILD__) {
      return {
        name: '웹 체험 교사',
        licenseKey: 'WEB-PREVIEW-DEMO',
        isAdmin: false,
        isLoggedIn: true,
      };
    }
    return null;
  });

  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem('kshorts_tokens');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    if (typeof window !== 'undefined' && !window.electronAPI) {
      return 99999;
    }
    return 0;
  });

  // Navigation & Studio Section Filter
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [studioStepFilter, setStudioStepFilter] = useState<'all' | 'script' | 'style' | 'media'>('all');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<'초등' | '중등' | '고등'>('중등');
  const [selectedSubjectBadge, setSelectedSubjectBadge] = useState<string>('중2 과학 · 물질의 구성');
  const [selectedLessonStageGoal, setSelectedLessonStageGoal] = useState<string>('핵심 개념 1분 요약');

  // Generator State
  const [prompt, setPrompt] = useState('원자와 분자는 무엇이 다를까? 레고 블록 비유로 1분 만에 이해하기');
  const [script, setScript] = useState(INITIAL_EDU_SCRIPT);
  const [scenes, setScenes] = useState<ScriptScene[]>(INITIAL_EDU_SCENES);
  const [voiceId, setVoiceId] = useState('ko-KR-SunHiNeural');
  const [templateId, setTemplateId] = useState('motion_graphic');
  const [fontId, setFontId] = useState('Pretendard');
  const [subtitleStyleId, setSubtitleStyleId] = useState<SubtitleStyleId>('samul_1min');
  const [subtitleFontSize, setSubtitleFontSize] = useState<SubtitleFontSize>('medium');
  const [titleStyleId, setTitleStyleId] = useState<TitleStyleId>('yellow_tape');
  const [durationSeconds, setDurationSeconds] = useState(55);
  const [bgmMood, setBgmMood] = useState<string>('auto');
  const [bgmVolume, setBgmVolume] = useState<number>(0.18);
  const [enableBgm, setEnableBgm] = useState<boolean>(true);
  const [enableHookIntro, setEnableHookIntro] = useState<boolean>(true);
  const [enablePopupSubtitles, setEnablePopupSubtitles] = useState<boolean>(true);
  const [enableKaraoke, setEnableKaraoke] = useState<boolean>(false);
  const [enableEmojiStickers, setEnableEmojiStickers] = useState<boolean>(true);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [sfxVolume, setSfxVolume] = useState<number>(0.35);
  const [enableStockVideo, setEnableStockVideo] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.1);
  const [subtitleMotionType, setSubtitleMotionType] = useState<'bounce' | 'slide_up' | 'fade' | 'typewriter'>('bounce');
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);
  const [syncHighlightSfx, setSyncHighlightSfx] = useState<boolean>(true);
  const [transitionType, setTransitionType] = useState<'cut' | 'fade' | 'zoom'>('fade');
  const [isTokenRechargeModalOpen, setIsTokenRechargeModalOpen] = useState<boolean>(false);

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<ProjectStatus>('draft');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMessage, setRenderMessage] = useState('');
  const [renderErrorDetails, setRenderErrorDetails] = useState<string | undefined>(undefined);

  // App Update State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult | null>(null);
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  const [projects, setProjects] = useState<ShortsProject[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultVoiceId: 'ko-KR-SunHiNeural',
    defaultTemplateId: 'motion_graphic',
    defaultFontId: 'Pretendard',
  });

  const [currentProject, setCurrentProject] = useState<ShortsProject | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isLongToShortsModalOpen, setIsLongToShortsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Network Connectivity Resilience State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [networkToast, setNetworkToast] = useState<{ type: 'offline' | 'restored'; message: string } | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkToast({ type: 'restored', message: '인터넷 연결이 복구되었습니다.' });
      setTimeout(() => setNetworkToast(null), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkToast({
        type: 'offline',
        message: '오프라인 상태입니다. 내장 교육 대본 생성기는 계속 사용할 수 있습니다.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.electronAPI?.checkNetworkStatus) {
      window.electronAPI.checkNetworkStatus().then(({ online }) => {
        setIsOnline(online);
        if (!online) {
          setNetworkToast({
            type: 'offline',
            message: '오프라인 상태입니다. 내장 교육 대본 생성기는 계속 사용할 수 있습니다.',
          });
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getProjects().then(setProjects).catch(console.error);
      window.electronAPI
        .getSettings()
        .then((s) => {
          setSettings(s);
          if (s.defaultVoiceId) setVoiceId(s.defaultVoiceId);
          if (s.defaultTemplateId) setTemplateId(s.defaultTemplateId);
          if (s.defaultFontId) setFontId(s.defaultFontId);
          if (s.defaultSubtitleStyleId) setSubtitleStyleId(s.defaultSubtitleStyleId);
          if (s.defaultSubtitleFontSize) setSubtitleFontSize(s.defaultSubtitleFontSize);
          if (s.defaultTitleStyleId) setTitleStyleId(s.defaultTitleStyleId);
        })
        .catch(console.error);

      window.electronAPI
        .checkUpdate()
        .then((res) => {
          if (res) {
            setUpdateInfo(res);
          }
        })
        .catch(console.error);

      let lastUpdateCheck = Date.now();
      const runUpdateCheck = () => {
        lastUpdateCheck = Date.now();
        window.electronAPI
          ?.checkUpdate()
          .then((res) => {
            if (res) {
              setUpdateInfo(res);
            }
          })
          .catch(() => {});
      };
      const updateInterval = setInterval(runUpdateCheck, 3 * 60 * 1000);
      const onFocusCheck = () => { if (Date.now() - lastUpdateCheck > 60 * 1000) runUpdateCheck(); };
      window.addEventListener('focus', onFocusCheck);

      const cleanupRender = window.electronAPI.onRenderProgress((data) => {
        setRenderStatus(data.status as ProjectStatus);
        setRenderProgress(data.progress);
        setRenderMessage(data.message);
        if (data.errorDetails) {
          setRenderErrorDetails(data.errorDetails);
        }
      });

      const cleanupUpdate = window.electronAPI.onUpdateStatus?.((data) => {
        setUpdateStatus(data.message);
      });

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('focus', onFocusCheck);
        cleanupRender?.();
        cleanupUpdate?.();
      };
    }
  }, []);

  const handleStartUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus('업데이트 준비 중...');
    setUpdateResult(null);

    try {
      if (window.electronAPI?.performUpdate) {
        const res = await window.electronAPI.performUpdate({
          downloadUrl: updateInfo?.downloadUrl,
          sha256: updateInfo?.sha256,
          latestVersion: updateInfo?.latestVersion,
        });
        setUpdateResult(res);
      } else {
        setUpdateResult({ success: true, message: '업데이트 및 화면 새로고침이 실행되었습니다.' });
      }
    } catch (err: any) {
      setUpdateResult({ success: false, error: err?.message || String(err) });
    } finally {
      setIsUpdating(false);
    }
  };

  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);

  const applyLicenseStatus = useCallback((s: LicenseStatus) => {
    setLicenseStatus(s);
    setTokens(s.tokens);
    localStorage.setItem('kshorts_tokens', String(s.tokens));
  }, []);

  useEffect(() => {
    const api = window.electronAPI;
    if (!user || !api?.getLicenseStatus) return;
    if (user.isAdmin) {
      void api.setAdminSession?.(true);
      return;
    }
    let cancelled = false;
    const kickOut = (s: LicenseStatus) => {
      alert(`⚠️ ${s.error || '라이선스가 확인되지 않아 로그아웃되었습니다.'}\n\n키를 다시 입력해 주세요.`);
      handleLogout();
    };
    api.refreshLicense().then((s) => {
      if (cancelled) return;
      if (!s.hasKey) kickOut(s);
      else applyLicenseStatus(s);
    }).catch(() => {});
    const off = api.onLicenseStatus((s) => {
      if (!s.hasKey) kickOut(s);
      else applyLicenseStatus(s);
    });
    const onFocus = () => { void api.refreshLicense().catch(() => {}); };
    window.addEventListener('focus', onFocus);
    return () => {
      cancelled = true;
      off();
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.isAdmin, user?.isLoggedIn, applyLicenseStatus]);

  const handleLogin = (data: { userName: string; licenseKey: string; isAdmin: boolean; tokens?: number }) => {
    const newUser = {
      name: data.userName,
      licenseKey: data.isAdmin ? 'KSH-MASTER-ADMIN-SESSION' : data.licenseKey,
      isAdmin: data.isAdmin,
      isLoggedIn: true,
    };
    setUser(newUser);
    localStorage.setItem('kshorts_auth', JSON.stringify(newUser));
    void window.electronAPI?.setAdminSession?.(data.isAdmin);

    const initialTokens = data.isAdmin ? 999999999 : (typeof data.tokens === 'number' ? data.tokens : 0);
    setTokens(initialTokens);
    localStorage.setItem('kshorts_tokens', String(initialTokens));
  };

  const handleLogout = () => {
    void window.electronAPI?.logoutLicense?.();
    setUser(null);
    localStorage.removeItem('kshorts_auth');
    localStorage.removeItem('kshorts_user');
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;

    if (!navigator.onLine) {
      setNetworkToast({
        type: 'offline',
        message: '인터넷 연결이 없어 내장 오프라인 교육 대본 생성기로 작성합니다.',
      });
    }

    setIsGeneratingScript(true);
    try {
      if (window.electronAPI) {
        const cleanTopic = prompt.trim();
        const contextualPrompt = `[대상: ${selectedGradeLevel}] [단원: ${selectedSubjectBadge.trim() || '공통 교과'}] [목표: ${selectedLessonStageGoal}] ${cleanTopic}`;
        const generated = await window.electronAPI.generateScript({
          prompt: contextualPrompt,
          title: cleanTopic,
          durationSeconds: 55,
          geminiApiKey: settings.geminiApiKey,
          apiKey: settings.openaiApiKey,
          loopMode,
        });
        setScript(generated);
        if (window.electronAPI.splitScriptScenes) {
          try {
            const splitRes = await window.electronAPI.splitScriptScenes({
              script: generated,
              title: cleanTopic,
            });
            if (splitRes && splitRes.length > 0) {
              setScenes(splitRes);
            }
          } catch {}
        }
      } else {
        const cleanTopic = prompt.trim();
        const subjectLabel = selectedSubjectBadge.trim() || '핵심 단원';
        const previewScript =
          `[${selectedGradeLevel} · ${subjectLabel}] "${cleanTopic}", 1분 만에 핵심만 정리해 볼까요?\n\n` +
          `먼저 ${selectedLessonStageGoal} 관점에서 학생들이 가장 자주 헷갈리는 기준 한 가지를 정확히 짚고 넘어가겠습니다.\n\n` +
          `우리 주변의 친숙한 예시와 인과 관계를 연결해 보면 추상적인 교과 개념도 그림처럼 한눈에 이해할 수 있습니다.\n\n` +
          `오늘 배운 핵심 원리를 떠올리며 마지막 확인 퀴즈를 노트에 한 줄로 정리해 봅시다!`;
        setScript(previewScript);
        const lines = previewScript.split(/\n+/).map((s) => s.trim()).filter(Boolean);
        setScenes(
          lines.map((text, idx) => ({
            id: idx,
            text,
            visualPrompt: `${subjectLabel} 수업 시각 자료 장면 ${idx + 1}`,
            isThumbnail: idx === 0,
            estimatedDuration: Math.max(6, Math.round(text.length / 5.5)),
            mediaType: 'image',
          }))
        );
      }
    } catch (e: any) {
      console.error(e);
      alert(`⚠️ 대본 생성 중 예외가 발생했습니다.\n${e?.message || e}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleStartRender = async () => {
    if (!prompt.trim() && !script.trim()) return;

    if (!navigator.onLine) {
      alert('⚠️ 인터넷 연결이 끊겨 있습니다.\n\nAI 음성 합성 및 시각 자료 생성을 위해 네트워크 연결 상태를 확인하신 후 다시 시도해주세요.');
      return;
    }

    if (!user?.isAdmin) {
      if (tokens < 100) {
        alert(
          `⚠️ [포인트 부족 안내]\n\n` +
          `포인트를 모두 소진하셨거나 보유 포인트가 100P 미만(${tokens.toLocaleString()} P)으로 쇼츠를 제작할 수 없습니다.\n\n` +
          `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
          `• 현재 보유 포인트: ${tokens.toLocaleString()} P\n\n` +
          `구매하신 곳(판매자)에 문의하여 토큰을 충전해주세요.`
        );
        setIsTokenRechargeModalOpen(true);
        return;
      }
    }

    setIsRendering(true);
    setRenderErrorDetails(undefined);
    setRenderStatus('generating_script');
    setRenderProgress(10);
    setRenderMessage('수업 쇼츠 제작 준비 중...');

    const projectId = 'proj-' + Date.now();
    const newProject: ShortsProject = {
      id: projectId,
      title: prompt.trim() || '새로운 수업 쇼츠 프로젝트',
      prompt: prompt.trim(),
      script: script.trim(),
      voiceId,
      templateId,
      fontId,
      subtitleStyleId,
      subtitleFontSize,
      titleStyleId,
      durationSeconds,
      status: 'generating_script',
      progressPercent: 10,
      statusMessage: '수업 쇼츠 제작 준비 중...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      let scenesForRender: ScriptScene[] | undefined = scenes.length > 0 ? scenes : undefined;
      const looseText = (t: string) => (t || '').replace(/[^0-9A-Za-z\uAC00-\uD7A3]/g, '');
      const scenesMatchScript = (list: ScriptScene[]) => {
        const body = looseText(script);
        const [first, ...rest] = list;
        const firstOk = !first || body.includes(looseText(first.text)) || looseText(first.text) === looseText(prompt);
        const restText = looseText(rest.map((sc) => sc.text).join(''));
        return firstOk && (restText === '' || body.includes(restText));
      };
      if (scenesForRender && script.trim() && !scenesMatchScript(scenesForRender)) {
        scenesForRender = undefined;
        try {
          const resplit = await window.electronAPI?.splitScriptScenes?.({ script: script.trim(), title: prompt.trim() });
          if (resplit && resplit.length > 0) {
            scenesForRender = resplit;
            setScenes(resplit);
          }
        } catch {}
      }
      if (window.electronAPI) {
        const result = await window.electronAPI.renderShorts({
          id: projectId,
          title: newProject.title,
          prompt: newProject.prompt,
          script: script.trim(),
          voiceId,
          templateId,
          fontId,
          subtitleStyleId,
          subtitleFontSize,
          titleStyleId,
          durationSeconds,
          bgmMood,
          bgmVolume,
          enableBgm,
          enableHookIntro,
          enablePopupSubtitles,
          enableSfx,
          sfxVolume,
          enableStockVideo,
          loopMode,
          enableKaraoke: enableKaraoke || subtitleStyleId === 'karaoke',
          enableEmojiStickers,
          voiceSpeed,
          subtitleMotionType,
          highlightKeywords,
          syncHighlightSfx,
          transitionType,
          customScenes: scenesForRender,
        });

        newProject.status = 'done';
        newProject.progressPercent = 100;
        newProject.statusMessage = '수업 쇼츠 제작 완료!';
        newProject.videoPath = result.videoPath;
        newProject.videoUrl = result.videoUrl;

        await window.electronAPI.saveProject(newProject);
        setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== projectId)]);
        setCurrentProject(newProject);
        setIsVideoModalOpen(true);

        if (settings.youtubeAutoUpload && settings.youtubeClientId && result.videoPath) {
          window.electronAPI
            .uploadToYoutube({
              videoPath: result.videoPath,
              title: newProject.title || newProject.prompt,
              description: newProject.script || newProject.prompt,
              tags: ['Shorts', '교육쇼츠', '1분개념', '수업자료'],
              privacyStatus: 'public',
              autoComment: settings.youtubeAutoComment,
              commentText: settings.youtubeCommentText,
            })
            .then((upRes) => {
              if (!upRes.success) {
                alert(`⚠️ [유튜브 자동 업로드 실패]\n${upRes.error || '알 수 없는 오류'}\n\n[학습 채널 연동] 메뉴에서 구글 OAuth 토큰 상태를 확인해주세요.`);
              }
            })
            .catch((upErr) => {
              alert(`⚠️ [유튜브 자동 업로드 오류]\n${upErr?.message || upErr}`);
            });
        }
      } else {
        setRenderStatus('done');
        setRenderProgress(100);
        setRenderMessage('웹 미리보기 시뮬레이션 완료! 실제 MP4 영상 합성은 Electron 데스크톱 앱에서 실행됩니다.');
        alert('웹 미리보기 모드입니다.\n교안 대본·장면 타임라인·9:16 교실 미리보기를 자유롭게 체험할 수 있으며, 실제 1080×1920 MP4 영상 합성과 TTS 음원은 데스크톱 앱(npm run start)에서 동작합니다.');
      }
    } catch (err: any) {
      console.error('Render error:', err);
      const errMsg = err?.message || String(err);
      setRenderStatus('error');
      setRenderMessage(errMsg.split('\n')[0] || '영상 렌더링 중 오류가 발생했습니다.');
      setRenderErrorDetails(errMsg);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDismissProgress = () => {
    setRenderStatus('draft');
    setRenderProgress(0);
    setRenderMessage('');
    setRenderErrorDetails(undefined);
  };

  const handleDeleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    const title = target?.title || '해당 수업 쇼츠 영상';
    if (!window.confirm(`"${title}" 프로젝트를 정말로 삭제하시겠습니까?`)) {
      return;
    }

    if (window.electronAPI) {
      await window.electronAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) setCurrentProject(null);
    }
  };

  const handleShowInFolder = (path: string) => {
    if (window.electronAPI) {
      window.electronAPI.showInFolder(path);
    }
  };

  const handleOpenVideoFile = (path: string) => {
    if (window.electronAPI) {
      window.electronAPI.openVideoFile(path);
    }
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (window.electronAPI) {
      await window.electronAPI.saveSettings(newSettings);
    }
  };

  const handleSelectOutputDirectory = async () => {
    if (window.electronAPI) {
      return await window.electronAPI.selectOutputDirectory();
    }
    return null;
  };

  const handleApplyPreset = (preset: ShortsPreset) => {
    setVoiceId(preset.voiceId);
    setTemplateId(preset.templateId);
    setFontId(preset.fontId);
    setSubtitleStyleId(preset.subtitleStyleId);
    setSubtitleFontSize(preset.subtitleFontSize);
    setTitleStyleId(preset.titleStyleId);
    setBgmMood(preset.bgmMood);
    setBgmVolume(preset.bgmVolume);
    setEnableBgm(preset.enableBgm);
    setEnableHookIntro(preset.enableHookIntro);
    setEnablePopupSubtitles(preset.enablePopupSubtitles);
  };

  if (!user || !user.isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const activeVoiceName = VOICES.find((v) => v.id === voiceId)?.name || '선희 (여성)';
  const activeFontName = (() => {
    const matchedFont = FONTS.find(
      (f) =>
        f.id === fontId ||
        f.id.replace(/\s+/g, '').toLowerCase() === (fontId || 'Pretendard').replace(/\s+/g, '').toLowerCase()
    );
    return matchedFont?.name ? matchedFont.name.split('(')[0].trim() : (fontId || '프리탠다드');
  })();
  const activeSubtitleName = SUBTITLE_STYLES.find((s) => s.id === subtitleStyleId)?.name || '1분 개념 노란 강조';
  const activeTitleStyleName = TITLE_STYLES.find((t) => t.id === titleStyleId)?.name || '단원 형광 라벨';
  const activeTemplateName = TEMPLATES.find((t) => t.id === templateId)?.name?.split('(')[0]?.trim() || '1분 개념 인포그래픽';
  const firstVideoSceneUrl = scenes.find((s) => s.mediaType === 'video' && s.videoUrl?.startsWith('http'))?.videoUrl;

  return (
    <div className="flex h-screen bg-[#FAF8F3] text-[#14213D] overflow-hidden font-sans relative">
      {/* Network Connectivity Notification Toast */}
      {networkToast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-bold border ${
            networkToast.type === 'offline'
              ? 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]'
              : 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]'
          }`}
        >
          {networkToast.type === 'offline' ? (
            <WifiOff className="w-4 h-4 shrink-0" />
          ) : (
            <Wifi className="w-4 h-4 shrink-0" />
          )}
          <span>{networkToast.message}</span>
          <button
            type="button"
            onClick={() => setNetworkToast(null)}
            className="ml-2 px-1.5 py-0.5 rounded hover:bg-black/10 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Left Textbook Ink-Navy Navigation Rail */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userName={user.name}
        isAdmin={user.isAdmin}
        licenseKey={user.licenseKey}
        tokens={user.isAdmin ? 999999999 : tokens}
        projectCount={projects.length}
        onLogout={handleLogout}
        onOpenUpdate={() => setIsUpdateModalOpen(true)}
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenRechargeModal={() => setIsTokenRechargeModalOpen(true)}
        hasUpdate={updateInfo?.hasUpdate}
        latestVersion={updateInfo?.latestVersion}
        currentVersion={updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.15')}
      />

      {/* 2. Main Study-Sheet Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#FAF8F3]">
        {/* Top Lesson Context Bar */}
        <header className="h-16 px-6 border-b border-[#E5DEC9] bg-[#FFFDF8] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-base font-black text-[#14213D] tracking-tight truncate">
              {currentTab === 'dashboard' && '교사 수업 준비 대시보드'}
              {currentTab === 'create' && '단원 개념 노트 & 9:16 수업 쇼츠 스튜디오'}
              {currentTab === 'video-to-shorts' && '강의 영상 하이라이트 발췌 스튜디오'}
              {currentTab === 'autopilot' && '정기 수업 자료 자동 예약 배포'}
              {currentTab === 'ai-settings' && 'AI 모델 및 로컬 렌더링 엔진 설정'}
              {currentTab === 'projects' && '수업 교안 및 완성 클립 보관함'}
              {currentTab === 'templates' && '교과별 프리셋 · 성우 · 서체 라이브러리'}
              {currentTab === 'publish' && '학습 채널 · 유튜브 · 멀티 플랫폼 연동'}
              {currentTab === 'help' && '교사용 수업 쇼츠 제작 가이드'}
            </h2>
            {currentTab === 'create' && (
              <div className="hidden md:flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] text-xs font-extrabold">
                  {selectedSubjectBadge}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D] text-xs font-extrabold">
                  {selectedLessonStageGoal}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsBatchModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] border border-[#CFC6AE] text-xs font-bold transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#1E40AF]" />
              <span>단원 일괄 제작</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsUpdateModalOpen(true);
                setIsToastDismissed(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors relative tabular-nums ${
                updateInfo?.hasUpdate
                  ? 'bg-[#F59E0B] hover:bg-[#D97706] text-[#14213D] border border-[#FCD34D]'
                  : 'bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#3D4B66] border border-[#CFC6AE]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updateInfo?.hasUpdate ? 'text-[#14213D] animate-spin' : 'text-[#1E40AF]'}`} />
              <span>
                {updateInfo?.hasUpdate
                  ? `v${updateInfo.latestVersion || '1.4.15'} 업데이트`
                  : `v${updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.15')}`}
              </span>
            </button>

            {currentTab !== 'create' ? (
              <button
                type="button"
                onClick={() => setCurrentTab('create')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>수업 쇼츠 제작</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRender}
                disabled={isRendering || (!prompt.trim() && !script.trim())}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold disabled:opacity-50 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isRendering ? '렌더링 중...' : '9:16 수업 영상 렌더링'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation Strip (visible under md breakpoint) */}
        <nav
          className="md:hidden px-3 py-2 bg-[#14213D] border-b border-[#24365C] flex items-center gap-1.5 overflow-x-auto shrink-0 select-none"
          aria-label="모바일 메뉴"
        >
          {[
            { id: 'dashboard', label: '교사 대시보드' },
            { id: 'create', label: '단원 수업 쇼츠 제작' },
            { id: 'video-to-shorts', label: '영상 분석 쇼츠' },
            { id: 'templates', label: '교과 프리셋' },
            { id: 'projects', label: '보관함' },
            { id: 'ai-settings', label: '엔진 설정' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setCurrentTab(m.id as NavTab)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${
                currentTab === m.id
                  ? 'bg-[#1E40AF] text-white'
                  : 'text-[#B6C7E6] hover:text-white bg-[#1C2E52]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 bg-[#FAF8F3]">
          <Suspense fallback={<PageLoadingFallback />}>
            {/* Dashboard Tab */}
            {currentTab === 'dashboard' && (
              <DashboardHome
                userName={user.name}
                projects={projects}
                settings={settings}
                onNavigate={setCurrentTab}
                onSelectProject={(p) => {
                  setCurrentProject(p);
                  setIsVideoModalOpen(true);
                }}
                onOpenBatchModal={() => setIsBatchModalOpen(true)}
                onOpenLongToShortsModal={() => setIsLongToShortsModalOpen(true)}
                onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
              />
            )}

            {/* Create Lesson Shorts Tab — 2-Column Workbook + Persistent Right 9:16 Stage */}
            {currentTab === 'create' && (
              <div className="max-w-[1360px] mx-auto space-y-3.5 pb-12">
                <RenderProgress
                  status={renderStatus}
                  progressPercent={renderProgress}
                  statusMessage={renderMessage}
                  errorDetails={renderErrorDetails}
                  onDismiss={handleDismissProgress}
                />

                {/* Curriculum Metadata & Workbook Section Filter Strip */}
                <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl px-3.5 py-2.5 space-y-2">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-extrabold text-[#14213D] flex items-center gap-1.5 mr-1">
                        <GraduationCap className="w-4 h-4 text-[#1E40AF]" />
                        <span>교과 · 단원:</span>
                      </span>
                      <div className="flex items-center p-0.5 bg-[#F2EFE6] rounded border border-[#CFC6AE] mr-1">
                        {(['초등', '중등', '고등'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setSelectedGradeLevel(g)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                              selectedGradeLevel === g
                                ? 'bg-[#1E40AF] text-white'
                                : 'text-[#3D4B66] hover:text-[#14213D]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      {[
                        '중2 과학 · 물질의 구성',
                        '고1 통합사회 · 합리적 선택',
                        '초5 역사 · 고조선과 8조법',
                        '중3 국어 · 문학과 비유',
                        '고등 정보 · AI와 알고리즘',
                      ].map((subj) => (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => setSelectedSubjectBadge(subj)}
                          className={`px-2 py-1 rounded font-bold transition-colors text-[11px] ${
                            selectedSubjectBadge === subj
                              ? 'bg-[#14213D] text-[#FDE68A]'
                              : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
                          }`}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>

                    {/* Workbook Focus Step Filter */}
                    <div className="flex items-center p-1 bg-[#F2EFE6] rounded-lg border border-[#CFC6AE] text-[11px] font-bold shrink-0 self-start lg:self-auto overflow-x-auto max-w-full">
                      {[
                        { id: 'all', label: '전체 교안 워크북' },
                        { id: 'script', label: '주제 · 대본 · 타임라인' },
                        { id: 'style', label: '성우 · 서체 · 자막' },
                        { id: 'media', label: '시각자료 · 배경음' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setStudioStepFilter(tab.id as any)}
                          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                            studioStepFilter === tab.id
                              ? 'bg-[#1E40AF] text-white'
                              : 'text-[#3D4B66] hover:text-[#14213D]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Unit Input & Pedagogical Goal Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E5DEC9]/70 text-[11px]">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-bold text-[#5C6B85] shrink-0">단원 직접 입력:</span>
                      <input
                        type="text"
                        value={selectedSubjectBadge}
                        onChange={(e) => setSelectedSubjectBadge(e.target.value)}
                        placeholder="예: 고2 물리학Ⅰ · 열역학 법칙"
                        className="flex-1 max-w-xs bg-[#FAF8F3] border border-[#CFC6AE] rounded px-2.5 py-1 text-xs font-semibold text-[#14213D] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#5C6B85] mr-0.5">수업 목표:</span>
                      {['수업 도입 발문', '핵심 개념 1분 요약', '오개념 교정 · 비교', '단원 형성평가 복습'].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => setSelectedLessonStageGoal(goal)}
                          className={`px-2 py-0.5 rounded font-bold transition-colors ${
                            selectedLessonStageGoal === goal
                              ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]'
                              : 'bg-[#FAF8F3] text-[#5C6B85] hover:text-[#14213D] border border-[#E5DEC9]'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Main 2-Column Educator Studio Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_336px] gap-4 items-start">
                  {/* Left Column: Educator Workbook Sheets */}
                  <div className="space-y-3.5 min-w-0">
                    <PresetBar
                      currentVoiceId={voiceId}
                      currentTemplateId={templateId}
                      currentFontId={fontId}
                      currentSubtitleStyleId={subtitleStyleId}
                      currentSubtitleFontSize={subtitleFontSize}
                      currentTitleStyleId={titleStyleId}
                      currentBgmMood={bgmMood}
                      currentBgmVolume={bgmVolume}
                      enableBgm={enableBgm}
                      enableHookIntro={enableHookIntro}
                      enablePopupSubtitles={enablePopupSubtitles}
                      onApplyPreset={(preset) => {
                        handleApplyPreset(preset);
                        setSelectedLessonStageGoal(preset.name);
                      }}
                    />

                    {(studioStepFilter === 'all' || studioStepFilter === 'script') && (
                      <>
                        <PromptSection
                          prompt={prompt}
                          setPrompt={setPrompt}
                          onGenerateScript={handleGenerateScript}
                          isGeneratingScript={isGeneratingScript}
                          loopMode={loopMode}
                          setLoopMode={setLoopMode}
                        />

                        <ScriptEditor
                          script={script}
                          setScript={setScript}
                          title={prompt}
                          onChangeTitle={setPrompt}
                          scenes={scenes}
                          onChangeScenes={setScenes}
                          onChangeVoiceId={setVoiceId}
                        />

                        <ThumbnailABEditor
                          topic={prompt}
                          scenes={scenes}
                          onChangeScenes={setScenes}
                          onApplyTitleAndHook={(newTitle) => {
                            setPrompt(newTitle);
                          }}
                        />
                      </>
                    )}

                    {(studioStepFilter === 'all' || studioStepFilter === 'style') && (
                      <>
                        <VoiceSelector
                          selectedVoiceId={voiceId}
                          onSelectVoice={setVoiceId}
                          voiceSpeed={voiceSpeed}
                          onChangeVoiceSpeed={setVoiceSpeed}
                        />

                        <FontSelector selectedFontId={fontId} onSelectFont={setFontId} />

                        <SubtitleStyleSelector
                          selectedSubtitleStyle={subtitleStyleId}
                          onSelectSubtitleStyle={setSubtitleStyleId}
                          selectedFontSize={subtitleFontSize}
                          onSelectFontSize={setSubtitleFontSize}
                          selectedTitleStyle={titleStyleId}
                          onSelectTitleStyle={setTitleStyleId}
                          enableEmojiStickers={enableEmojiStickers}
                          onToggleEmojiStickers={setEnableEmojiStickers}
                          selectedMotionType={subtitleMotionType}
                          onSelectMotionType={setSubtitleMotionType}
                          highlightKeywords={highlightKeywords}
                          onToggleHighlightKeywords={setHighlightKeywords}
                        />
                      </>
                    )}

                    {(studioStepFilter === 'all' || studioStepFilter === 'media') && (
                      <>
                        <TemplateSelector
                          selectedTemplateId={templateId}
                          onSelectTemplate={setTemplateId}
                          onOpenSettings={() => setCurrentTab('ai-settings')}
                          currentEngine={settings.imageEngine}
                          enableStockVideo={enableStockVideo}
                          onToggleStockVideo={setEnableStockVideo}
                          hasPexelsKey={Boolean(settings.pexelsApiKey)}
                          transitionType={transitionType}
                          onChangeTransitionType={setTransitionType}
                        />

                        <BgmSelector
                          selectedMood={bgmMood}
                          onSelectMood={setBgmMood}
                          bgmVolume={bgmVolume}
                          onChangeVolume={setBgmVolume}
                          enableBgm={enableBgm}
                          onToggleBgm={setEnableBgm}
                          enableHookIntro={enableHookIntro}
                          onToggleHookIntro={setEnableHookIntro}
                          enablePopupSubtitles={enablePopupSubtitles}
                          onTogglePopupSubtitles={setEnablePopupSubtitles}
                          enableSfx={enableSfx}
                          onToggleSfx={setEnableSfx}
                          sfxVolume={sfxVolume}
                          onChangeSfxVolume={setSfxVolume}
                          currentTopic={prompt}
                          syncHighlightSfx={syncHighlightSfx}
                          onToggleHighlightSfx={setSyncHighlightSfx}
                        />
                      </>
                    )}
                  </div>

                  {/* Right Column: Persistent 9:16 Classroom Stage & Render Console */}
                  <aside className="xl:sticky xl:top-2 space-y-4 bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-4">
                    <ShortsPhonePreview
                      titleStyleId={titleStyleId}
                      headerTitleText={prompt}
                      enableHookIntro={enableHookIntro}
                      hookTitleText={`${selectedSubjectBadge} · 핵심 질문`}
                      hookSubtitleText={prompt}
                      subtitleStyleId={subtitleStyleId}
                      subtitleFontSize={subtitleFontSize}
                      templateId={templateId}
                      sampleScriptText={script}
                      channelName={user.name.replace(/\s+/g, '_')}
                      activeVideoUrl={firstVideoSceneUrl}
                      subjectBadge={selectedSubjectBadge}
                    />

                    {/* Compact Lesson Spec Sheet & Primary Render Action */}
                    <div className="pt-3 border-t border-[#E5DEC9] space-y-3">
                      <dl className="grid grid-cols-2 gap-1.5 text-[11px] bg-[#FAF8F3] p-3 rounded-lg border border-[#E5DEC9]">
                        <div>
                          <dt className="text-[#5C6B85] font-medium">내레이션 성우</dt>
                          <dd className="font-extrabold text-[#14213D] truncate">{activeVoiceName}</dd>
                        </div>
                        <div>
                          <dt className="text-[#5C6B85] font-medium">자막 서체</dt>
                          <dd className="font-extrabold text-[#1E40AF] truncate">{activeFontName}</dd>
                        </div>
                        <div>
                          <dt className="text-[#5C6B85] font-medium">칠판 자막</dt>
                          <dd className="font-extrabold text-[#78350F] truncate">{activeSubtitleName}</dd>
                        </div>
                        <div>
                          <dt className="text-[#5C6B85] font-medium">상단 배너</dt>
                          <dd className="font-extrabold text-[#14213D] truncate">{activeTitleStyleName}</dd>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-[#E5DEC9] flex items-center justify-between">
                          <span className="text-[#5C6B85] font-medium">시각 화풍 · 해상도</span>
                          <span className="font-extrabold text-[#14213D] tabular-nums">
                            {activeTemplateName} · 1080×1920
                          </span>
                        </div>
                      </dl>

                      {!user?.isAdmin && (
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] text-xs tabular-nums">
                          <span className="flex items-center gap-1.5 font-bold text-[#3D4B66]">
                            <Coins className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>보유 {tokens.toLocaleString()} P (편당 100P)</span>
                          </span>
                          {tokens < 100 && (
                            <button
                              type="button"
                              onClick={() => setIsTokenRechargeModalOpen(true)}
                              className="px-2 py-0.5 rounded bg-[#F59E0B] text-[#14213D] font-extrabold text-[11px]"
                            >
                              포인트 충전
                            </button>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!user?.isAdmin && tokens < 100) {
                            alert(
                              `⚠️ [포인트 부족 안내]\n\n` +
                              `포인트를 모두 소진하셨거나 보유 포인트가 100P 미만(${tokens.toLocaleString()} P)으로 쇼츠를 제작할 수 없습니다.\n\n` +
                              `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
                              `• 현재 보유 포인트: ${tokens.toLocaleString()} P\n\n` +
                              `구매하신 곳(판매자)에 문의하여 토큰을 충전해주세요.`
                            );
                            setIsTokenRechargeModalOpen(true);
                            return;
                          }
                          handleStartRender();
                        }}
                        disabled={isRendering || (!prompt.trim() && !script.trim())}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-extrabold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                          !user?.isAdmin && tokens < 100
                            ? 'bg-[#B45309] hover:bg-[#92400E] text-white'
                            : 'bg-[#1E40AF] hover:bg-[#1E3A8A] text-white'
                        }`}
                      >
                        {isRendering ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>9:16 수업 쇼츠 합성 중...</span>
                          </>
                        ) : !user?.isAdmin && tokens < 100 ? (
                          <>
                            <Coins className="w-4 h-4" />
                            <span>포인트 부족 ({tokens.toLocaleString()}P / 100P 필요)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                            <span>9:16 수업 쇼츠 비디오 렌더링 시작</span>
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-[#5C6B85] text-center leading-snug">
                        버튼을 누르면 성우 음성·장면 삽화·ASS 자막을 1080×1920 MP4로 자동 합성합니다.
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {/* Video-to-Shorts Analysis Studio Tab */}
            {currentTab === 'video-to-shorts' && (
              <VideoToShortsPage
                onNavigate={setCurrentTab}
                onProjectCreated={() => {
                  window.electronAPI.getProjects().then(setProjects).catch(console.error);
                  void window.electronAPI.refreshLicense?.();
                }}
              />
            )}

            {/* Auto-Pilot Scheduler Tab */}
            {currentTab === 'autopilot' && (
              <AutoPilotPage
                settings={settings}
                onNavigateToProjects={() => setCurrentTab('projects')}
                onNavigateToPublish={() => setCurrentTab('publish')}
              />
            )}

            {/* AI Settings Tab */}
            {currentTab === 'ai-settings' && (
              <AISettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onSelectOutputDirectory={handleSelectOutputDirectory}
                onNavigateToPublish={() => setCurrentTab('publish')}
              />
            )}

            {/* Projects Management Tab */}
            {currentTab === 'projects' && (
              <ProjectManagementPage
                projects={projects}
                onSelectProject={(p) => {
                  setCurrentProject(p);
                  setIsVideoModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
                onShowInFolder={handleShowInFolder}
                onOpenVideoFile={handleOpenVideoFile}
                onNavigateToCreate={() => setCurrentTab('create')}
              />
            )}

            {/* Templates & Presets Management Hub Tab */}
            {currentTab === 'templates' && (
              <PresetsManagementPage
                onApplyPresetAndNavigate={(preset) => {
                  handleApplyPreset(preset);
                  setCurrentTab('create');
                }}
                onNavigate={setCurrentTab}
                currentVoiceId={voiceId}
                onChangeVoiceId={setVoiceId}
                currentTemplateId={templateId}
                onChangeTemplateId={setTemplateId}
                currentImageEngine={settings.imageEngine}
              />
            )}

            {/* Publish / YouTube Tab */}
            {currentTab === 'publish' && (
              <PublishPage settings={settings} onSaveSettings={handleSaveSettings} />
            )}

            {/* Help Tab */}
            {currentTab === 'help' && <HelpGuidePage onNavigate={setCurrentTab} />}
          </Suspense>
        </main>
      </div>

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        {isVideoModalOpen && (
          <VideoPlayerModal
            isOpen={isVideoModalOpen}
            project={currentProject}
            onClose={() => setIsVideoModalOpen(false)}
            onShowInFolder={handleShowInFolder}
            onOpenVideoFile={handleOpenVideoFile}
          />
        )}

        {isHistoryOpen && (
          <ProjectHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            projects={projects}
            onSelectProject={(p) => {
              setCurrentProject(p);
              setIsVideoModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onShowInFolder={handleShowInFolder}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onSelectOutputDirectory={handleSelectOutputDirectory}
            onNavigateToPublish={() => setCurrentTab('publish')}
          />
        )}

        {isUpdateModalOpen && (
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            isUpdating={isUpdating}
            updateStatus={updateStatus}
            updateResult={updateResult}
            updateInfo={updateInfo}
            onStartUpdate={handleStartUpdate}
          />
        )}

        {isBatchModalOpen && (
          <BatchGeneratorModal
            isOpen={isBatchModalOpen}
            onClose={() => setIsBatchModalOpen(false)}
            onBatchDone={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        {isLongToShortsModalOpen && (
          <LongToShortsModal
            isOpen={isLongToShortsModalOpen}
            onClose={() => setIsLongToShortsModalOpen(false)}
            onClipExtracted={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        {isCalendarModalOpen && (
          <PublishCalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
            projects={projects}
            onScheduleUpdated={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        <TokenRechargeModal
          isOpen={isTokenRechargeModalOpen}
          onClose={() => setIsTokenRechargeModalOpen(false)}
          status={licenseStatus}
          isAdmin={user.isAdmin}
          onActivated={(s) => {
            applyLicenseStatus(s);
            setUser((u) => (u ? { ...u, licenseKey: s.keyHint } : u));
          }}
        />
      </Suspense>

      {!isToastDismissed && (
        <UpdateNotificationToast
          updateInfo={updateInfo}
          onOpenUpdate={() => {
            setIsUpdateModalOpen(true);
            setIsToastDismissed(true);
          }}
          onDismiss={() => setIsToastDismissed(true)}
        />
      )}
    </div>
  );
}
