import React, { useEffect, useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, FolderOpen, Play, CheckCircle2, Upload, Sparkles, Download } from 'lucide-react';
import type { ShortsProject } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  project: ShortsProject | null;
  onClose: () => void;
  onShowInFolder: (path: string) => void;
  onOpenVideoFile: (path: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  project,
  onClose,
  onShowInFolder,
  onOpenVideoFile,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isCommentPosted, setIsCommentPosted] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setIsUploading(false);
    setIsUploaded(false);
    setIsCommentPosted(false);
    setYoutubeUrl(null);
    setUploadError(null);
  }, [project?.id, isOpen]);

  useEscapeKey(isOpen, onClose);

  if (!isOpen || !project || (!project.videoUrl && !project.videoPath)) return null;

  const rawPath = project.videoPath || '';
  const videoSrc = project.videoUrl || (rawPath ? `file://${rawPath.replace(/\\/g, '/')}` : '');

  const handleUploadToYouTube = async () => {
    if (!project || !project.videoPath) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.uploadToYoutube({
          videoPath: project.videoPath,
          title: project.title || project.prompt || '케이쇼츠 AI 비디오',
          description: project.script || project.prompt || '',
          tags: ['Shorts', '쇼츠', 'AI쇼츠', '꿀팁'],
          privacyStatus: 'public',
        });

        if (res.success && res.videoUrl) {
          setIsUploaded(true);
          setIsCommentPosted(Boolean(res.commentPosted));
          setYoutubeUrl(res.videoUrl);
        } else {
          setUploadError(res.error || '유튜브 업로드에 실패했습니다.');
        }
      }
    } catch (err: any) {
      setUploadError(err?.message || String(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-100 line-clamp-1">{project.title}</h3>
              <span className="text-xs text-gray-400">
                총 {project.durationSeconds || 55}초 · 9:16 세로 수업 쇼츠 렌더링 완료
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700 active:scale-95"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player 9:16 Aspect & YouTube Metadata Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch overflow-y-auto max-h-[520px] pr-1">
          {/* Left: 9:16 Video Player */}
          <div className="flex flex-col items-center justify-center bg-black/90 rounded-2xl p-3 border border-gray-800 shadow-inner">
            <div className="w-[240px] h-[420px] rounded-xl overflow-hidden bg-black shadow-2xl relative border border-gray-800/80">
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: YouTube Title, Description & Hashtags for Easy Copy */}
          <div className="flex flex-col gap-3 justify-between bg-gray-950/60 p-4 rounded-2xl border border-gray-800">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-3">
                <span className="text-xs font-black text-rose-400 flex items-center gap-1.5">
                  <span>📢 유튜브 업로드 메타데이터</span>
                </span>
                <span className="text-[10px] text-gray-400">클릭 시 자동 복사</span>
              </div>

              {/* 1-Click All-in-One Kit Button */}
              <button
                type="button"
                onClick={() => {
                  const title = project.title || project.prompt;
                  const desc = project.script || project.prompt;
                  const keywords = project.prompt.split(' ').filter((w) => w.length > 1).slice(0, 5);
                  const hashtags = '#Shorts #쇼츠 #AI쇼츠 #' + (keywords.join(' #') || '꿀팁') + ' #알고리즘 #추천';
                  const ytTags = ['Shorts', '쇼츠', 'AI쇼츠', '알고리즘', '추천', ...keywords].join(', ');
                  const fullKit = `[제목]\n${title}\n\n[설명란]\n${desc}\n\n${hashtags}\n\n[유튜브 스튜디오 검색 태그]\n${ytTags}`;
                  navigator.clipboard.writeText(fullKit);
                  alert('제목, 설명란, 해시태그, 검색 태그가 포함된 [올인원 업로드 키트]가 복사되었습니다!');
                }}
                className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>✨ 올인원 업로드 키트 1클릭 복사</span>
              </button>

              {/* Title Section */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-300">쇼츠 제목</span>
                  <button
                    onClick={() => {
                      const text = project.title || project.prompt;
                      navigator.clipboard.writeText(text);
                      alert('쇼츠 제목이 클립보드에 복사되었습니다!');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline"
                  >
                    제목 복사
                  </button>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-200 font-medium select-all">
                  {project.title || project.prompt}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-300">영상 설명 및 대본</span>
                  <button
                    onClick={() => {
                      const text = (project.script || project.prompt) + '\n\n#Shorts #쇼츠 #AI쇼츠 #' + (project.prompt.replace(/\s+/g, '') || '꿀팁');
                      navigator.clipboard.writeText(text);
                      alert('영상 설명이 클립보드에 복사되었습니다!');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline"
                  >
                    설명 전체 복사
                  </button>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-300 max-h-[110px] overflow-y-auto leading-relaxed select-all">
                  {project.script || project.prompt}
                </div>
              </div>

              {/* Hashtags Section */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-300">추천 해시태그</span>
                  <button
                    onClick={() => {
                      const tags = '#Shorts #쇼츠 #AI쇼츠 #' + (project.prompt.split(' ').slice(0, 3).join(' #') || '꿀팁') + ' #추천';
                      navigator.clipboard.writeText(tags);
                      alert('해시태그가 클립보드에 복사되었습니다!');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline"
                  >
                    해시태그 복사
                  </button>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 text-xs text-blue-400 font-mono select-all flex flex-wrap gap-1">
                  <span>#Shorts</span>
                  <span>#쇼츠</span>
                  <span>#AI쇼츠</span>
                  <span>#{project.prompt.replace(/\s+/g, '').slice(0, 10)}</span>
                  <span>#알고리즘</span>
                  <span>#추천</span>
                </div>
              </div>

              {/* YouTube Studio Tags Section (Comma-separated) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-300">유튜브 스튜디오 검색 태그</span>
                  <button
                    onClick={() => {
                      const keywords = project.prompt.split(' ').filter((w) => w.length > 1).slice(0, 5);
                      const ytTags = ['Shorts', '쇼츠', 'AI쇼츠', '알고리즘', '추천', ...keywords].join(', ');
                      navigator.clipboard.writeText(ytTags);
                      alert('유튜브 스튜디오용 검색 태그가 복사되었습니다!');
                    }}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    태그(쉼표) 복사
                  </button>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 text-[11px] text-emerald-400 font-mono select-all truncate">
                  Shorts, 쇼츠, AI쇼츠, 알고리즘, 추천, {project.prompt.slice(0, 15)}...
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-gray-400 bg-gray-900/50 p-2 rounded-lg border border-gray-800/80">
              💡 [올인원 키트 복사] 버튼을 누르면 제목, 본문, 해시태그, 검색태그가 모두 포함되어 바로 업로드할 수 있습니다!
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-xs text-gray-400 line-clamp-1 flex-1 font-mono">
            {project.videoPath || '브라우저 합성 9:16 수업 쇼츠'}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                download={
                  project.videoPath && (project.videoPath.endsWith('.mp4') || project.videoPath.endsWith('.webm'))
                    ? project.videoPath
                    : `${(project.title || 'edu_shorts').replace(/[^0-9A-Za-z\uAC00-\uD7A3_-]/g, '_')}.mp4`
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>영상 다운로드 ({project.videoPath?.endsWith('.webm') ? 'WebM' : 'MP4'})</span>
              </a>
            )}

            {typeof window !== 'undefined' && Boolean((window as any).electronAPI) && project.videoPath && (
              <>
                <button
                  type="button"
                  onClick={() => onShowInFolder(project.videoPath!)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 transition-all active:scale-95"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>폴더 열기</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenVideoFile(project.videoPath!)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>외부 재생</span>
                </button>

                <button
                  type="button"
                  onClick={handleUploadToYouTube}
                  disabled={isUploading || isUploaded}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/50 transition-all active:scale-95 disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>유튜브 업로드 중...</span>
                    </>
                  ) : isUploaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>업로드 완료!</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>유튜브 자동 업로드</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all active:scale-95"
            >
              닫기
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-950/50 border border-red-900/60 rounded-xl text-xs text-red-200 flex items-center justify-between">
            <span>⚠️ {uploadError}</span>
            <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {youtubeUrl && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
            <span className="truncate mr-2">
              🎉 유튜브 쇼츠 업로드 완료{isCommentPosted ? ' (첫 댓글 등록됨)' : ''}: <b className="text-white underline">{youtubeUrl}</b>
            </span>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0"
            >
              쇼츠 보러가기 ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

