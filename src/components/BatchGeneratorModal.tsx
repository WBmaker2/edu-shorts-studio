import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, Layers, Square, CheckCircle2, AlertCircle, FileText, Sparkles, RefreshCw, Music, Mic, Palette } from 'lucide-react';
import { VOICES } from './VoiceSelector';
import { TEMPLATES } from './TemplateSelector';
import { BGM_TRACKS } from '../constants/bgm';
import type { BatchJobConfig } from '../types';

interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchDone?: () => void;
}

export const BatchGeneratorModal: React.FC<BatchGeneratorModalProps> = ({
  isOpen,
  onClose,
  onBatchDone,
}) => {
  const [inputText, setInputText] = useState(
    `[1차시] 원자와 분자의 차이: 레고 블록 비유로 1분 구분하기\n[2차시] 식물의 광합성과 호흡: 밤에는 왜 산소를 소비할까?\n[3차시] 고조선 8조법 3가지 조항으로 읽는 고대 사회 모습\n[4차시] 기회비용 vs 매몰비용: 영화표 사례로 합리적 선택 이해\n[5차시] 에빙하우스 망각곡선을 이기는 10분·1일·1주 복습 전략`
  );
  const [defaultVoiceId, setDefaultVoiceId] = useState('ko-KR-SunHiNeural');
  const [defaultTemplateId, setDefaultTemplateId] = useState('basic');
  const [defaultBgmMood, setDefaultBgmMood] = useState('auto');
  const [enableSfx, setEnableSfx] = useState(true);
  const [loopMode, setLoopMode] = useState(false);
  const [maxParallel, setMaxParallel] = useState<'auto' | 1 | 2 | 3>('auto');
  const [activeItems, setActiveItems] = useState<Record<number, { topic: string; progress: number; message: string }>>({});

  const [isRunning, setIsRunning] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');
  const [subProgress, setSubProgress] = useState(0);
  const [subMessage, setSubMessage] = useState('');
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [failedItems, setFailedItems] = useState<Array<{ itemIndex: number; topic: string; error: string }>>([]);

  useEffect(() => {
    if (!window.electronAPI) return;

    const cleanupProgress = window.electronAPI.onBatchProgress((data: any) => {
      if (data.status === 'rendering') {
        setCurrentTopic(data.currentTopic || '');
        setCurrentProgress(data.progress || 0);
        setActiveItems((prev) => ({
          ...prev,
          [data.itemIndex]: { topic: data.currentTopic || '', progress: prev[data.itemIndex]?.progress ?? 0, message: data.message || '' },
        }));
        setBatchLogs((prev) => [`⏳ [진행 중] ${data.currentTopic}`, ...prev.slice(0, 30)]);
      } else if (data.status === 'item_done') {
        // 병렬 렌더링에서는 완료 순서가 항목 순서와 다르므로 완료 건수를 서버가 센 값으로 사용한다.
        setCompletedCount(data.completedCount ?? 0);
        setCurrentProgress(data.progress || 0);
        setActiveItems((prev) => {
          const next = { ...prev };
          delete next[data.itemIndex];
          return next;
        });
        setBatchLogs((prev) => [`✅ [완료] ${data.currentTopic}`, ...prev.slice(0, 30)]);
      } else if (data.status === 'item_error') {
        setCurrentProgress(data.progress || 0);
        setActiveItems((prev) => {
          const next = { ...prev };
          delete next[data.itemIndex];
          return next;
        });
        setBatchLogs((prev) => [`❌ [오류] ${data.currentTopic}: ${data.error}`, ...prev.slice(0, 30)]);
      }
    });

    const cleanupSub = window.electronAPI.onBatchItemSubprogress?.((data: any) => {
      setSubProgress(data.subProgress || 0);
      setSubMessage(data.subMessage || '');
      setActiveItems((prev) =>
        prev[data.itemIndex]
          ? { ...prev, [data.itemIndex]: { ...prev[data.itemIndex], progress: data.subProgress || 0, message: data.subMessage || '' } }
          : prev
      );
    });

    const cleanupCompleted = window.electronAPI.onBatchCompleted((data: any) => {
      setIsRunning(false);
      setIsFinished(true);
      setActiveItems({});
      setCurrentProgress(100);
      if (data.failedList && Array.isArray(data.failedList)) {
        setFailedItems(data.failedList);
      }
      setBatchLogs((prev) => [
        `🎉 [대량 양산 완료] 총 ${data.total}개 중 ${data.completed}개 성공, ${data.failed}개 실패`,
        ...prev,
      ]);
      if (onBatchDone) onBatchDone();
    });

    return () => {
      cleanupProgress?.();
      cleanupSub?.();
      cleanupCompleted?.();
    };
  }, [onBatchDone]);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const topics = inputText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const handleStartBatch = async () => {
    if (topics.length === 0) {
      alert('최소 1개 이상의 주제를 입력해주세요.');
      return;
    }

    // Check token balance for non-admin creators
    try {
      const authStr = localStorage.getItem('kshorts_auth');
      let isAdmin = false;
      if (authStr) {
        const parsed = JSON.parse(authStr);
        isAdmin = Boolean(parsed.isAdmin);
      }
      const tokenStr = localStorage.getItem('kshorts_tokens');
      const currentTokens = tokenStr ? parseInt(tokenStr, 10) : 0;
      if (!isAdmin && currentTokens < 100) {
        alert(
          `⚠️ [포인트 부족 안내]\n\n` +
          `포인트를 모두 소진하셨거나 잔여 포인트가 100P 미만(${currentTokens.toLocaleString()} P)으로 쇼츠를 제작할 수 없습니다.\n\n` +
          `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
          `• 현재 보유 포인트: ${currentTokens.toLocaleString()} P\n\n` +
          `사이드바의 [+충전] 버튼 또는 관리자에게 문의하여 포인트를 충전해주세요.`
        );
        return;
      }
      const requiredTokens = topics.length * 100;
      if (!isAdmin && currentTokens < requiredTokens) {
        if (!confirm(
          `⚠️ [포인트 잔여량 확인]\n\n` +
          `쇼츠 ${topics.length}편 제작에는 ${requiredTokens.toLocaleString()} P가 필요하지만, 현재 보유 포인트는 ${currentTokens.toLocaleString()} P입니다.\n` +
          `(보유 포인트로 최대 ${Math.floor(currentTokens / 100)}편까지 제작 가능)\n\n` +
          `보유한 포인트 한도 내에서 제작을 계속 진행하시겠습니까?`
        )) {
          return;
        }
      }
    } catch {}

    setIsRunning(true);
    setIsFinished(false);
    setTotalCount(topics.length);
    setCompletedCount(0);
    setCurrentProgress(0);
    setActiveItems({});
    setBatchLogs([`🚀 총 ${topics.length}개의 쇼츠 대량 양산 파이프라인 시작`]);

    const items = topics.map((t, idx) => ({
      id: `batch_${Date.now()}_${idx + 1}`,
      topic: t,
      voiceId: defaultVoiceId,
      templateId: defaultTemplateId,
      bgmMood: defaultBgmMood,
    }));

    const config: BatchJobConfig = {
      items,
      defaultVoiceId,
      defaultTemplateId,
      defaultBgmMood,
      enableSfx,
      sfxVolume: 0.35,
      maxParallel,
      loopMode,
    };

    const res = await window.electronAPI.startBatchJob(config);
    if (!res.success) {
      setIsRunning(false);
      alert(res.error || '대량 작업 시작 실패');
    }
  };

  const handleCancel = async () => {
    if (confirm('진행 중인 대량 양산 작업을 취소하시겠습니까? 이미 렌더링 중인 항목까지만 마무리하고 중단됩니다.')) {
      await window.electronAPI.cancelBatchJob();
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14213D]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDF8] rounded-2xl shadow-2xl border border-[#CFC6AE] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5DEC9] flex items-center justify-between bg-[#FAF8F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#14213D]">
                  단원 차시별 수업 쇼츠 일괄 제작
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]">
                  커리큘럼 일괄 렌더링
                </span>
              </div>
              <p className="text-xs text-[#5C6B85] font-medium">
                이번 주 차시별 단원 주제를 줄마다 입력하면 동일한 교안 설정으로 한 번에 렌더링합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-2 text-[#5C6B85] hover:text-[#14213D] rounded-lg hover:bg-[#F2EFE6] transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FFFDF8]">
          {/* Status Overlay if running */}
          {isRunning || isFinished ? (
            <div className="space-y-4 bg-[#FAF8F3] border border-[#E5DEC9] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <div className="w-4 h-4 border-2 border-[#BFDBFE] border-t-[#1E40AF] rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                  )}
                  <span className="text-sm font-extrabold text-[#14213D]">
                    {isRunning ? '차시별 수업 쇼츠 일괄 제작 중...' : '수업 쇼츠 일괄 제작 완료'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#3D4B66] tabular-nums">
                  {completedCount} / {totalCount} 완료 ({currentProgress}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E5DEC9] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#1E40AF] h-full rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              {/* Active Items (parallel workers) */}
              {isRunning && (
                <div className="space-y-2">
                  {Object.keys(activeItems).length === 0 ? (
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="truncate max-w-sm">🎯 현재 작업: {currentTopic || '준비 중...'}</span>
                        <span>{subProgress}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{subMessage || '대본 및 영상 합성 중...'}</p>
                    </div>
                  ) : (
                    Object.entries(activeItems).map(([idx, item]) => (
                      <div key={idx} className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span className="truncate max-w-sm">🎯 #{idx} {item.topic}</span>
                          <span>{item.progress}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">{item.message || '대본 및 영상 합성 중...'}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Live Logs */}
              <div className="bg-slate-900 rounded-xl p-3.5 text-[11px] font-mono text-slate-200 max-h-40 overflow-y-auto space-y-1 border border-slate-800">
                {batchLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>

              {/* Failed Items Box with Retry */}
              {isFinished && failedItems.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>일부 항목 렌더링 실패 ({failedItems.length}건)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const retryText = failedItems.map((f) => f.topic).join('\n');
                        setInputText(retryText);
                        setFailedItems([]);
                        setIsFinished(false);
                        setCurrentProgress(0);
                        setCompletedCount(0);
                        setBatchLogs([]);
                      }}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>실패한 {failedItems.length}개 항목만 즉시 재시도</span>
                    </button>
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] text-rose-800 font-medium">
                    {failedItems.map((f, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="shrink-0 font-bold">•</span>
                        <span className="truncate flex-1 font-semibold">{f.topic}</span>
                        <span className="shrink-0 text-[10px] text-rose-500">({f.error})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Topics Textarea Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#14213D] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1E40AF]" />
                    <span>생성할 단원 차시별 수업 주제 목록 (한 줄에 1개씩 입력)</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-[#1E40AF] bg-[#EFF6FF] px-2.5 py-0.5 rounded border border-[#BFDBFE] tabular-nums">
                    총 {topics.length}개 차시 감지됨
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="예:&#10;[1차시] 원자와 분자의 차이&#10;[2차시] 식물의 광합성과 호흡 원리"
                  className="w-full px-4 py-3 rounded-lg border border-[#CFC6AE] bg-[#FAF8F3] focus:bg-white focus:border-[#1E40AF] outline-none text-xs leading-relaxed font-sans text-[#14213D] transition-colors resize-none"
                />
              </div>

              {/* Shared Batch Presets Config */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-extrabold text-[#14213D]">일괄 적용할 교안 공통 설정</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Voice */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5C6B85] flex items-center gap-1">
                      <Mic className="w-3 h-3 text-[#1E40AF]" />
                      <span>교사 성우 보이스</span>
                    </label>
                    <select
                      value={defaultVoiceId}
                      onChange={(e) => setDefaultVoiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CFC6AE] text-xs font-bold text-[#14213D] bg-[#FAF8F3] focus:outline-none focus:border-[#1E40AF]"
                    >
                      {VOICES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.tag})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5C6B85] flex items-center gap-1">
                      <Palette className="w-3 h-3 text-[#B45309]" />
                      <span>교안 비주얼 템플릿</span>
                    </label>
                    <select
                      value={defaultTemplateId}
                      onChange={(e) => setDefaultTemplateId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CFC6AE] text-xs font-bold text-[#14213D] bg-[#FAF8F3] focus:outline-none focus:border-[#1E40AF]"
                    >
                      {TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BGM */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#5C6B85] flex items-center gap-1">
                      <Music className="w-3 h-3 text-[#15803D]" />
                      <span>수업 배경음악</span>
                    </label>
                    <select
                      value={defaultBgmMood}
                      onChange={(e) => setDefaultBgmMood(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CFC6AE] text-xs font-bold text-[#14213D] bg-[#FAF8F3] focus:outline-none focus:border-[#1E40AF]"
                    >
                      {BGM_TRACKS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SFX Toggle in Batch */}
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5DEC9] bg-[#FAF8F3] cursor-pointer hover:bg-[#F2EFE6] transition-colors">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#14213D] block">수업 강조 효과음(SFX) 전 항목 자동 믹싱</span>
                    <span className="text-[10px] text-[#5C6B85]">단계 전환(Whoosh)·핵심 단어(Pop)·정답 차임(Ding) 자동 삽입</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableSfx}
                  onChange={(e) => setEnableSfx(e.target.checked)}
                  className="w-4 h-4 accent-[#1E40AF] cursor-pointer"
                />
              </label>

              {/* Infinite loop script */}
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5DEC9] bg-[#FAF8F3] cursor-pointer hover:bg-[#F2EFE6] transition-colors">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#14213D] block">복습 순환(무한 루프) 대본 모드</span>
                    <span className="text-[10px] text-[#5C6B85]">마지막 요약 문장이 도입 질문으로 자연스럽게 이어집니다</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={loopMode}
                  onChange={(e) => setLoopMode(e.target.checked)}
                  className="w-4 h-4 accent-[#1E40AF] cursor-pointer"
                />
              </label>

              {/* Parallel workers */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5DEC9] bg-[#FAF8F3]">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#14213D] block">동시 렌더링 수</span>
                    <span className="text-[10px] text-[#5C6B85]">자동: PC의 CPU·메모리 상태에 맞춰 1~3개 병렬 처리</span>
                  </div>
                </div>
                <select
                  value={String(maxParallel)}
                  onChange={(e) => setMaxParallel(e.target.value === 'auto' ? 'auto' : (Number(e.target.value) as 1 | 2 | 3))}
                  className="text-xs font-bold border border-[#CFC6AE] rounded-lg px-2 py-1 bg-white text-[#14213D]"
                >
                  <option value="auto">자동 (권장)</option>
                  <option value="1">1개 (순차)</option>
                  <option value="2">2개</option>
                  <option value="3">3개</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5DEC9] bg-[#FAF8F3] flex items-center justify-between">
          <div className="text-[11px] text-[#5C6B85] font-medium">
            {isRunning ? 'PC 상태에 맞춰 안전하게 렌더링하고 있습니다.' : '완성된 수업 영상은 수업 자료 보관함에 즉시 저장됩니다.'}
          </div>

          <div className="flex items-center gap-2.5">
            {isRunning ? (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>일괄 작업 취소</span>
              </button>
            ) : isFinished ? (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold transition-colors"
              >
                확인 및 닫기
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-[#CFC6AE] text-[#3D4B66] text-xs font-bold hover:bg-[#F2EFE6] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleStartBatch}
                  disabled={topics.length === 0}
                  className="px-5 py-2 rounded-lg bg-[#14213D] hover:bg-[#1C2E52] text-white text-xs font-extrabold transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                  <span>{topics.length}개 차시 일괄 제작 시작</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
