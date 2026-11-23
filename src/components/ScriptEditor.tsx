import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, Film, Globe, MessageSquare, BookOpen } from 'lucide-react';
import type { ScriptScene } from '../types';
import { SceneTimelineEditor } from './SceneTimelineEditor';
import { MultilingualModal } from './MultilingualModal';
import { PinnedCommentModal } from './PinnedCommentModal';

interface ScriptEditorProps {
  script: string;
  setScript: (v: string) => void;
  title?: string;
  onChangeTitle?: (t: string) => void;
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
  onChangeVoiceId?: (v: string) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  setScript,
  title = '',
  onChangeTitle,
  scenes,
  onChangeScenes,
  onChangeVoiceId,
}) => {
  const [editorMode, setEditorMode] = useState<'script' | 'timeline'>('timeline');
  const [isMultilingualModalOpen, setIsMultilingualModalOpen] = useState(false);
  const [isPinnedCommentModalOpen, setIsPinnedCommentModalOpen] = useState(false);

  const charCount = script.trim().length;
  const estimatedSeconds = Math.max(10, Math.round(charCount / 5.5));

  const handleSyncScenesFromScript = async () => {
    if (!script.trim()) return;
    if (window.electronAPI?.splitScriptScenes) {
      try {
        const generatedScenes = await window.electronAPI.splitScriptScenes({
          script,
          title,
        });
        if (generatedScenes && generatedScenes.length > 0) {
          onChangeScenes(generatedScenes);
          return;
        }
      } catch (err) {
        console.warn('Split scenes failed:', err);
      }
    }
    // Local fallback scene splitter by sentences/paragraphs
    const lines = script
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length > 0) {
      const localScenes: ScriptScene[] = lines.slice(0, 8).map((text, idx) => ({
        id: idx,
        text,
        visualPrompt: `${title} - ${text}`,
        isThumbnail: idx === 0,
        estimatedDuration: Math.max(4, Math.round(text.length / 5.5)),
        mediaType: 'image',
      }));
      onChangeScenes(localScenes);
    }
  };

  const handleScenesChange = (updatedScenes: ScriptScene[]) => {
    onChangeScenes(updatedScenes);
    const newFullScript = updatedScenes.map((s) => s.text).filter(Boolean).join('\n\n');
    if (newFullScript && newFullScript !== script) {
      setScript(newFullScript);
    }
  };

  const applySamplePedagogicalScript = (mode: 'concept' | 'quiz') => {
    const topicLabel = title.trim() || '원자와 분자의 차이';
    const sample =
      mode === 'concept'
        ? `${topicLabel}, 1분 만에 핵심만 구분해 볼까요?\n\n첫째, 더 이상 쪼개지지 않는 물질의 기본 입자를 원자라고 부릅니다.\n\n둘째, 원자들이 결합해 물질 고유의 성질을 나타내는 가장 작은 단위가 바로 분자입니다.\n\n레고 블록 한 조각은 원자, 블록을 조립해 만든 완성품은 분자라고 기억하면 절대 헷갈리지 않습니다!`
        : `잠깐! ${topicLabel}, 아직도 헷갈리고 계신가요?\n\n많은 학생들이 시험에서 가장 자주 놓치는 핵심 함정이 바로 여기에 있습니다.\n\n원리만 알면 간단합니다. 기본 단위의 정의와 실제 적용 사례를 딱 두 단계로 비교해 보세요.\n\n오늘 배운 핵심 키워드 한 줄, 지금 댓글이나 노트에 직접 적어보며 복습을 마무리해 봅시다!`;
    setScript(sample);
    const lines = sample.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    onChangeScenes(
      lines.map((text, idx) => ({
        id: idx,
        text,
        visualPrompt: `${topicLabel} 교육용 시각 자료 장면 ${idx + 1}`,
        isThumbnail: idx === 0,
        estimatedDuration: Math.max(5, Math.round(text.length / 5.5)),
        mediaType: 'image',
      }))
    );
  };

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
              수업 대본 검수 및 단계별 타임라인
            </h2>
            <p className="text-xs text-[#5C6B85] font-medium">
              수업 도입 → 개념 정의 → 비교·예시 → 핵심 정리 순으로 장면별 대사와 시각 자료를 조율합니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsMultilingualModalOpen(true)}
            disabled={!script.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#EFF6FF] text-[#14213D] hover:text-[#1E40AF] text-xs font-bold border border-[#CFC6AE] transition-colors disabled:opacity-40"
            title="한국어 수업 대본을 영어·일본어·스페인어로 번역합니다"
          >
            <Globe className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>다국어 교안 번역</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPinnedCommentModalOpen(true)}
            disabled={!script.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#FEF3C7] text-[#14213D] hover:text-[#78350F] text-xs font-bold border border-[#CFC6AE] transition-colors disabled:opacity-40"
            title="학생 참여를 유도하는 확인 퀴즈 고정 댓글을 생성합니다"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#B45309]" />
            <span>확인 퀴즈 · 고정 댓글</span>
          </button>

          <div className="flex items-center p-1 bg-[#F2EFE6] rounded-lg border border-[#CFC6AE] text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => {
                if (scenes.length === 0 && script.trim()) {
                  handleSyncScenesFromScript();
                }
                setEditorMode('timeline');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors tabular-nums ${
                editorMode === 'timeline'
                  ? 'bg-[#14213D] text-white'
                  : 'text-[#3D4B66] hover:text-[#14213D]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>단계별 타임라인 {scenes.length > 0 && `(${scenes.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                editorMode === 'script'
                  ? 'bg-[#14213D] text-white'
                  : 'text-[#3D4B66] hover:text-[#14213D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>대본 전문 편집</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Pedagogical Draft Starter when empty */}
      {!script.trim() && scenes.length === 0 && (
        <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-[#3D4B66] font-medium">
            <BookOpen className="w-4 h-4 text-[#1E40AF] shrink-0" />
            <span>상단 [AI 수업 대본 생성]을 누르거나, 표준 4단계 교안 틀로 즉시 시작할 수 있습니다.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => applySamplePedagogicalScript('concept')}
              className="px-3 py-1.5 rounded-md bg-[#FFFDF8] hover:bg-[#EFF6FF] border border-[#CFC6AE] hover:border-[#1E40AF] text-[#14213D] font-bold text-xs transition-colors"
            >
              개념 설명 4단계 틀 넣기
            </button>
            <button
              type="button"
              onClick={() => applySamplePedagogicalScript('quiz')}
              className="px-3 py-1.5 rounded-md bg-[#FFFDF8] hover:bg-[#FEF3C7] border border-[#CFC6AE] hover:border-[#B45309] text-[#14213D] font-bold text-xs transition-colors"
            >
              도입 퀴즈 4단계 틀 넣기
            </button>
          </div>
        </div>
      )}

      {editorMode === 'script' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#3D4B66] font-semibold px-1 tabular-nums">
            <span>
              글자 수: <strong className="font-extrabold text-[#14213D]">{charCount}</strong>자 (한 줄이 한 장면으로 분할됩니다)
            </span>
            <span className="flex items-center gap-1 bg-[#EFF6FF] px-2.5 py-1 rounded text-[11px] text-[#1E40AF] border border-[#BFDBFE] font-bold">
              <Clock className="w-3 h-3" />
              예상 수업 분량 약 {estimatedSeconds}초
            </span>
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="수업 대본이 여기에 표시됩니다. 문단(줄바꿈)마다 하나의 9:16 수업 장면으로 구성됩니다."
            rows={6}
            className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-4 py-3 text-sm text-[#14213D] placeholder-[#5C6B85] focus:outline-none focus:border-[#1E40AF] focus:bg-white leading-relaxed font-medium transition-colors"
          />

          <div className="flex items-center justify-between text-[11px] text-[#5C6B85] pt-0.5">
            <span className="font-medium">
              첫 문장에 학생들의 일상 속 의문이나 핵심 질문을 배치하면 수업 몰입도가 높아집니다.
            </span>
            <div className="flex items-center gap-3">
              {script.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSyncScenesFromScript();
                    setEditorMode('timeline');
                  }}
                  className="text-xs font-extrabold text-[#1E40AF] hover:underline"
                >
                  장면 타임라인으로 반영 →
                </button>
              )}
              {charCount >= 40 && (
                <span className="flex items-center gap-1 text-[#15803D] font-bold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 교안 준비 완료
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <SceneTimelineEditor
          scenes={scenes}
          onChangeScenes={handleScenesChange}
          title={title}
          onSyncFromScript={handleSyncScenesFromScript}
        />
      )}

      <MultilingualModal
        isOpen={isMultilingualModalOpen}
        onClose={() => setIsMultilingualModalOpen(false)}
        koreanTitle={title}
        koreanScript={script}
        onApplyScriptToEditor={(newTitle, newScript, newVoiceId) => {
          setScript(newScript);
          if (onChangeTitle && newTitle) onChangeTitle(newTitle);
          if (onChangeVoiceId && newVoiceId) onChangeVoiceId(newVoiceId);
        }}
      />

      <PinnedCommentModal
        isOpen={isPinnedCommentModalOpen}
        onClose={() => setIsPinnedCommentModalOpen(false)}
        topic={title}
        script={script}
      />
    </section>
  );
};
