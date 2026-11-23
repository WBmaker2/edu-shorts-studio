import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Clock,
  Image as ImageIcon,
  RefreshCw,
  Film,
  Video,
  Search,
  FolderOpen,
  X,
  Wand2,
  Check,
} from 'lucide-react';
import type { ScriptScene, StockVideoItem } from '../types';

interface SceneTimelineEditorProps {
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
  title: string;
  onSyncFromScript: () => void;
}

const STOCK_CATEGORY_CHIPS = [
  { label: '교실 · 독서 · 학습', query: 'book reading study' },
  { label: '과학 · 우주 · 천체', query: 'space galaxy stars' },
  { label: '자연 · 해양 · 생태', query: 'ocean waves beach nature' },
  { label: '생태 · 산림 · 식물', query: 'forest trees nature sunlight' },
  { label: '도시 · 건축 · 사회', query: 'city skyscrapers architecture' },
  { label: '컴퓨터 · 정보 · 연구', query: 'business desk computer laptop' },
  { label: '체육 · 건강 · 인체', query: 'running fitness health' },
  { label: '기술 · 빛 · 에너지', query: 'neon night cyberpunk' },
];

const PEDAGOGICAL_STAGES = [
  { label: '도입 질문', style: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]' },
  { label: '핵심 개념', style: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
  { label: '원리 · 사례', style: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
  { label: '확인 · 비교', style: 'bg-[#F2EFE6] text-[#14213D] border-[#CFC6AE]' },
  { label: '요약 정리', style: 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]' },
];

function getPedagogicalStage(idx: number, total: number) {
  if (idx === 0) return PEDAGOGICAL_STAGES[0];
  if (idx === total - 1 && total > 2) return PEDAGOGICAL_STAGES[4];
  if (idx === 1) return PEDAGOGICAL_STAGES[1];
  if (idx === 2) return PEDAGOGICAL_STAGES[2];
  return PEDAGOGICAL_STAGES[3];
}

function formatTimecode(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const SceneTimelineEditor: React.FC<SceneTimelineEditorProps> = ({
  scenes,
  onChangeScenes,
  title,
  onSyncFromScript,
}) => {
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);

  // Stock Video Search State
  const [isStockSearchOpen, setIsStockSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockVideos, setStockVideos] = useState<StockVideoItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [isAutoMatchingAll, setIsAutoMatchingAll] = useState<boolean>(false);

  const activeScene = scenes[activeSceneIdx];

  const handleUpdateText = (idx: number, newText: string) => {
    const next = [...scenes];
    if (next[idx]) {
      next[idx] = {
        ...next[idx],
        text: newText,
        estimatedDuration: Math.max(3, Math.round(newText.length / 5.5)),
      };
      onChangeScenes(next);
    }
  };

  const handleUpdateVisual = (idx: number, newVisual: string) => {
    const next = [...scenes];
    if (next[idx]) {
      next[idx] = {
        ...next[idx],
        visualPrompt: newVisual,
      };
      onChangeScenes(next);
    }
  };

  const handleAddScene = () => {
    const newId = scenes.length;
    const newScene: ScriptScene = {
      id: newId,
      text: '새로운 수업 단계 설명을 입력하세요.',
      visualPrompt: `${title} 관련 교육용 시각 자료 장면`,
      isThumbnail: false,
      estimatedDuration: 5,
      mediaType: 'image',
    };
    onChangeScenes([...scenes, newScene]);
    setActiveSceneIdx(newId);
  };

  const handleAddPedagogicalScene = (kind: 'quiz' | 'summary') => {
    const newId = scenes.length;
    const topicLabel = (title || '오늘의 핵심 개념').trim();
    const newScene: ScriptScene =
      kind === 'quiz'
        ? {
            id: newId,
            text: `확인 퀴즈입니다! "${topicLabel}"의 핵심 원리, 방금 배운 기준에 맞으면 O, 틀리면 X를 떠올려 보세요! 정답은 영상 댓글로 확인합시다.`,
            visualPrompt: `Bright classroom chalkboard O X formative quiz card for ${topicLabel}, clean study design`,
            isThumbnail: false,
            estimatedDuration: 8,
            mediaType: 'image',
          }
        : {
            id: newId,
            text: `오늘 수업 "${topicLabel}" 3줄 핵심 정리! 첫째 정의, 둘째 작동 원리, 셋째 헷갈리기 쉬운 구분 포인트를 꼭 노트에 기록해 두세요.`,
            visualPrompt: `Minimalist study notebook 3-point key summary checklist visual for ${topicLabel}, ivory paper clean style`,
            isThumbnail: false,
            estimatedDuration: 8,
            mediaType: 'image',
          };
    onChangeScenes([...scenes, newScene]);
    setActiveSceneIdx(newId);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) return;
    const next = scenes.filter((_, i) => i !== idx).map((s, i) => ({ ...s, id: i }));
    onChangeScenes(next);
    setActiveSceneIdx(Math.max(0, idx - 1));
  };

  const handleAssignVideoToActiveScene = (video: { url: string; previewUrl?: string; source?: 'pexels' | 'pixabay' | 'preset' | 'local' }) => {
    const next = [...scenes];
    if (next[activeSceneIdx]) {
      next[activeSceneIdx] = {
        ...next[activeSceneIdx],
        mediaType: 'video',
        videoUrl: video.url,
        mediaPreviewUrl: video.previewUrl,
        videoSource: video.source || 'preset',
      };
      onChangeScenes(next);
      setIsStockSearchOpen(false);
    }
  };

  const handleRemoveVideoFromActiveScene = () => {
    const next = [...scenes];
    if (next[activeSceneIdx]) {
      next[activeSceneIdx] = {
        ...next[activeSceneIdx],
        mediaType: 'image',
        videoUrl: undefined,
        mediaPreviewUrl: undefined,
        videoSource: undefined,
      };
      onChangeScenes(next);
    }
  };

  const handleSelectLocalVideo = async () => {
    if (!window.electronAPI?.selectLocalVideo) return;
    try {
      const selectedPath = await window.electronAPI.selectLocalVideo();
      if (selectedPath) {
        handleAssignVideoToActiveScene({
          url: selectedPath,
          previewUrl: undefined,
          source: 'local',
        });
      }
    } catch (err) {
      console.error('Failed to select local video:', err);
    }
  };

  const handleSearchStock = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim() || activeScene?.text || title;
    setIsSearching(true);
    try {
      if (window.electronAPI?.searchStockVideos) {
        const res = await window.electronAPI.searchStockVideos({ query: q });
        if (res.success && Array.isArray(res.videos)) {
          setStockVideos(res.videos);
        }
      }
    } catch (err) {
      console.error('Stock video search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenStockSearch = () => {
    setIsStockSearchOpen(true);
    const initialQuery = activeScene?.visualPrompt || activeScene?.text?.slice(0, 30) || title;
    setSearchQuery(initialQuery);
    handleSearchStock(initialQuery);
  };

  const handleAutoMatchAllVideos = async () => {
    if (!window.electronAPI?.searchStockVideos) return;
    setIsAutoMatchingAll(true);
    try {
      const updated = [...scenes];
      for (let i = 0; i < updated.length; i++) {
        const sc = updated[i];
        const query = sc.visualPrompt || sc.text || title;
        const res = await window.electronAPI.searchStockVideos({ query });
        if (res.success && res.videos && res.videos.length > 0) {
          const video = res.videos[i % res.videos.length];
          updated[i] = {
            ...sc,
            mediaType: 'video',
            videoUrl: video.url,
            mediaPreviewUrl: video.previewUrl,
            videoSource: ((video as any).engine as any) || 'preset',
          };
        }
      }
      onChangeScenes(updated);
    } catch (err) {
      console.error('Auto-match all videos error:', err);
    } finally {
      setIsAutoMatchingAll(false);
    }
  };

  const totalChars = scenes.reduce((acc, s) => acc + (s.text?.length || 0), 0);
  const totalEstimatedDuration = scenes.reduce((acc, s) => acc + (s.estimatedDuration || 4), 0);
  const maxSceneDuration = Math.max(10, ...scenes.map((s) => s.estimatedDuration || 4));
  const videoSceneCount = scenes.filter((s) => s.mediaType === 'video').length;

  // Compute cumulative timecodes per scene
  let runningSec = 0;
  const sceneTimecodes = scenes.map((s) => {
    const dur = s.estimatedDuration || 4;
    const start = runningSec;
    const end = runningSec + dur;
    runningSec = end;
    return { start, end, dur };
  });

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FAF8F3] p-3 rounded-lg border border-[#E5DEC9]">
        <div className="flex items-center gap-3 text-xs text-[#3D4B66] font-semibold flex-wrap tabular-nums">
          <span className="font-extrabold text-[#14213D]">
            총 {scenes.length}단계 장면
          </span>
          <span className="text-[#CFC6AE]">|</span>
          <span>{totalChars}자</span>
          <span className="text-[#CFC6AE]">|</span>
          <span className="flex items-center gap-1 text-[#1E40AF] font-extrabold">
            <Clock className="w-3.5 h-3.5" />
            <span>총 {formatTimecode(totalEstimatedDuration)} ({totalEstimatedDuration}초)</span>
          </span>
          {videoSceneCount > 0 && (
            <>
              <span className="text-[#CFC6AE]">|</span>
              <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] text-[10px] font-extrabold flex items-center gap-1">
                <Video className="w-3 h-3" />
                실사 비디오 {videoSceneCount}장면
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleAutoMatchAllVideos}
            disabled={isAutoMatchingAll || scenes.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-colors disabled:opacity-50"
            title="모든 장면의 대본 문장에 맞추어 무료 실사 비디오를 자동으로 일괄 매칭합니다"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAutoMatchingAll ? '비디오 매칭 중...' : '전 장면 무료 비디오 매칭'}</span>
          </button>
          <button
            type="button"
            onClick={onSyncFromScript}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#FFFDF8] hover:bg-[#F2EFE6] text-[#14213D] border border-[#CFC6AE] text-xs font-bold transition-colors"
            title="대본 텍스트를 분석하여 장면을 다시 분할합니다"
          >
            <RefreshCw className="w-3 h-3 text-[#3D4B66]" />
            <span>대본에서 재분할</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddPedagogicalScene('quiz')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border border-[#FCD34D] text-xs font-bold transition-colors"
            title="수업 마무리용 O·X 형성평가 확인 퀴즈 장면을 끝에 추가합니다"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>확인 퀴즈 장면</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddPedagogicalScene('summary')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] border border-[#86EFAC] text-xs font-bold transition-colors"
            title="오늘 수업 3줄 핵심 정리 장면을 끝에 추가합니다"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>핵심 요약 장면</span>
          </button>
          <button
            type="button"
            onClick={handleAddScene}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>장면 추가</span>
          </button>
        </div>
      </div>

      {/* Signature Move: Pedagogical Cue-Sheet & Duration-Proportional Timeline Rows */}
      {scenes.length > 0 && (
        <div className="border border-[#E5DEC9] rounded-lg overflow-hidden divide-y divide-[#E5DEC9] bg-[#FFFDF8]">
          {scenes.map((scene, idx) => {
            const isSelected = activeSceneIdx === idx;
            const isVideo = scene.mediaType === 'video';
            const stage = getPedagogicalStage(idx, scenes.length);
            const tc = sceneTimecodes[idx] || { start: 0, end: 4, dur: 4 };
            const barPercent = Math.min(100, Math.max(18, Math.round((tc.dur / maxSceneDuration) * 100)));

            return (
              <div
                key={scene.id}
                onClick={() => setActiveSceneIdx(idx)}
                className={`px-3.5 py-2.5 cursor-pointer transition-colors grid grid-cols-1 md:grid-cols-[88px_90px_1fr_130px] items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#EFF6FF] text-[#14213D]'
                    : 'hover:bg-[#FAF8F3]'
                }`}
              >
                {/* Cumulative Tabular Timecode */}
                <span className="text-xs font-extrabold text-[#3D4B66] tabular-nums">
                  {formatTimecode(tc.start)}–{formatTimecode(tc.end)}
                </span>

                {/* Pedagogical Stage Pill */}
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded border text-center truncate ${stage.style}`}
                >
                  {stage.label}
                </span>

                {/* Narration Line */}
                <p className="text-xs font-semibold text-[#14213D] truncate">
                  {scene.text || '(빈 장면 — 클릭하여 대사를 입력하세요)'}
                </p>

                {/* Duration-Proportional Bar & Media Type Indicator */}
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-16 h-2 bg-[#E5DEC9] rounded-full overflow-hidden shrink-0" title={`예상 발화 길이 ${tc.dur}초`}>
                    <div
                      className={`h-full rounded-full ${isSelected ? 'bg-[#1E40AF]' : 'bg-[#B45309]'}`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#3D4B66] tabular-nums w-7 text-right">
                    {tc.dur}s
                  </span>
                  {isVideo ? (
                    <span className="p-1 rounded bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC]" title="실사 비디오 적용됨">
                      <Video className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="p-1 rounded bg-[#FAF8F3] text-[#1E40AF] border border-[#BFDBFE]" title="AI 삽화 적용됨">
                      <ImageIcon className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Scene Detail Inspector */}
      {activeScene && (
        <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#CFC6AE] space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DEC9] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#14213D] text-white text-xs font-extrabold tabular-nums">
                장면 {activeSceneIdx + 1} · {getPedagogicalStage(activeSceneIdx, scenes.length).label}
              </span>
              <span className="text-xs text-[#3D4B66] font-bold tabular-nums">
                발화 예상 시간: 약 {activeScene.estimatedDuration || 4}초 ({activeScene.text?.length || 0}자)
              </span>
            </div>

            {scenes.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteScene(activeSceneIdx)}
                className="flex items-center gap-1 text-xs text-[#B91C1C] hover:bg-[#FEE2E2] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>이 장면 삭제</span>
              </button>
            )}
          </div>

          {/* Scene Narration Text */}
          <div className="space-y-1">
            <label htmlFor="active-scene-narration" className="text-xs font-extrabold text-[#14213D] block">
              교사 내레이션 문장 (자막과 음성으로 동시 합성)
            </label>
            <textarea
              id="active-scene-narration"
              rows={2}
              value={activeScene.text}
              onChange={(e) => handleUpdateText(activeSceneIdx, e.target.value)}
              placeholder="이 수업 단계에서 성우가 설명할 문장을 입력하세요."
              className="w-full bg-[#FFFDF8] border border-[#CFC6AE] rounded-lg px-3.5 py-2 text-xs text-[#14213D] placeholder-[#5C6B85] focus:outline-none focus:border-[#1E40AF] font-semibold transition-colors"
            />
          </div>

          {/* Visual Media Selection: Image vs Video Tabs */}
          <div className="space-y-2 pt-2 border-t border-[#E5DEC9]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#14213D]">장면 시각 자료</span>
                <span className="text-[11px] text-[#1E40AF] font-bold">
                  {activeScene.mediaType === 'video' ? '무료 실사 비디오 적용 중' : 'AI 교육 삽화 자동 생성'}
                </span>
              </div>

              <div className="flex items-center p-1 bg-[#E5DEC9] rounded-lg">
                <button
                  type="button"
                  onClick={handleRemoveVideoFromActiveScene}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeScene.mediaType !== 'video'
                      ? 'bg-[#FFFDF8] text-[#14213D]'
                      : 'text-[#3D4B66] hover:text-[#14213D]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>AI 삽화</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenStockSearch}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeScene.mediaType === 'video'
                      ? 'bg-[#15803D] text-white'
                      : 'text-[#3D4B66] hover:text-[#14213D]'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>무료 비디오 · 내 영상</span>
                </button>
              </div>
            </div>

            {activeScene.mediaType === 'video' && activeScene.videoUrl ? (
              <div className="p-3 rounded-lg bg-[#DCFCE7]/50 border border-[#86EFAC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-16 rounded bg-[#14213D] overflow-hidden relative shrink-0 border border-[#15803D]">
                    {activeScene.videoUrl.startsWith('http') ? (
                      <video
                        src={activeScene.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white">
                        <Video className="w-4 h-4 text-[#86EFAC]" />
                        <span className="text-[9px] mt-0.5 font-bold">PC 영상</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#15803D] text-white">
                        {activeScene.videoSource === 'local' ? '내 PC 수업 영상' : '무료 스톡 비디오'}
                      </span>
                      <span className="text-xs font-bold text-[#14532D] truncate">
                        9:16 세로 클립 연결 완료
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3D4B66] font-medium truncate max-w-md">
                      {activeScene.videoUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenStockSearch}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#FFFDF8] hover:bg-[#FAF8F3] border border-[#15803D] text-[#14532D] text-xs font-bold transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    <span>영상 교체</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveVideoFromActiveScene}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#FFFDF8] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-xs font-bold transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>제거</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={activeScene.visualPrompt || ''}
                  onChange={(e) => handleUpdateVisual(activeSceneIdx, e.target.value)}
                  placeholder="시각 자료 묘사 (비워두면 대본 문맥에 맞춰 교육용 삽화를 자동 생성합니다)"
                  className="w-full bg-[#FFFDF8] border border-[#CFC6AE] rounded-lg px-3.5 py-2 text-xs text-[#14213D] placeholder-[#5C6B85] focus:outline-none focus:border-[#1E40AF] font-medium transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-[#5C6B85]">
                  <span>선택한 화풍 템플릿과 대본 키워드를 기반으로 자동 생성됩니다.</span>
                  <button
                    type="button"
                    onClick={handleOpenStockSearch}
                    className="text-[#1E40AF] hover:underline font-bold flex items-center gap-1"
                  >
                    <Video className="w-3 h-3" />
                    <span>무료 비디오 또는 내 실험·수업 영상 넣기 →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Video Search Drawer */}
      {isStockSearchOpen && (
        <div className="p-4 rounded-xl bg-[#14213D] text-[#E8EEF7] border border-[#293E6D] space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#293E6D]">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#FBBF24]" />
              <h4 className="text-xs font-extrabold text-white">
                장면 {activeSceneIdx + 1} 시각 자료 비디오 검색 및 내 PC 영상 등록
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsStockSearchOpen(false)}
              className="p-1 rounded text-[#9FB2D4] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && (e as any).keyCode !== 229) {
                    handleSearchStock();
                  }
                }}
                placeholder="교과 시각 키워드 입력 (예: 우주, 자연, 독서, 실험, 건축)..."
                className="w-full bg-[#1C2E52] border border-[#2F4A80] rounded-lg pl-9 pr-20 py-2 text-xs text-white placeholder-[#9FB2D4] focus:outline-none focus:border-[#FBBF24]"
              />
              <Search className="w-4 h-4 text-[#9FB2D4] absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => handleSearchStock()}
                disabled={isSearching}
                className="absolute right-1.5 top-1.5 px-3 py-1 rounded bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[11px] font-bold disabled:opacity-50"
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSelectLocalVideo}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#14213D] text-xs font-extrabold shrink-0 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>내 PC 무료 영상 선택</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STOCK_CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.query);
                  handleSearchStock(chip.query);
                }}
                className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#1C2E52] hover:bg-[#253B69] text-[#E8EEF7] border border-[#2F4A80] whitespace-nowrap transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {stockVideos.map((vid) => {
              const isHovered = hoveredVideoId === vid.id;
              return (
                <div
                  key={vid.id}
                  onMouseEnter={() => setHoveredVideoId(vid.id)}
                  onMouseLeave={() => setHoveredVideoId(null)}
                  onClick={() =>
                    handleAssignVideoToActiveScene({
                      url: vid.url,
                      previewUrl: vid.previewUrl,
                      source: (vid.engine as any) || 'preset',
                    })
                  }
                  className="group relative cursor-pointer rounded-lg overflow-hidden aspect-[9/16] bg-black border border-[#2F4A80] hover:border-[#FBBF24] flex flex-col justify-end p-2"
                >
                  {isHovered ? (
                    <video
                      src={vid.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={vid.previewUrl || 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300'}
                      alt={vid.title || 'Stock video'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-black/70 text-white tabular-nums inline-block">
                      {vid.duration ? `${vid.duration}s` : '9:16 HD'}
                    </span>
                    <p className="text-[10px] font-bold text-white line-clamp-1">
                      {vid.title || '교육용 배경 클립'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
