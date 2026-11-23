import React, { useState, useRef } from 'react';
import { Music, Volume2, Sparkles, Check, Play, Square, HelpCircle, ShieldCheck, Bell } from 'lucide-react';
import { BGM_TRACKS } from '../constants/bgm';

interface BgmSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  bgmVolume: number;
  onChangeVolume: (volume: number) => void;
  enableBgm: boolean;
  onToggleBgm: (enabled: boolean) => void;
  enableHookIntro?: boolean;
  onToggleHookIntro?: (enabled: boolean) => void;
  enablePopupSubtitles?: boolean;
  onTogglePopupSubtitles?: (enabled: boolean) => void;
  enableSfx?: boolean;
  onToggleSfx?: (enabled: boolean) => void;
  sfxVolume?: number;
  onChangeSfxVolume?: (volume: number) => void;
  currentTopic?: string;
  syncHighlightSfx?: boolean;
  onToggleHighlightSfx?: (enabled: boolean) => void;
}

export const BgmSelector: React.FC<BgmSelectorProps> = ({
  selectedMood,
  onSelectMood,
  bgmVolume,
  onChangeVolume,
  enableBgm,
  onToggleBgm,
  enableHookIntro = true,
  onToggleHookIntro,
  enablePopupSubtitles = true,
  onTogglePopupSubtitles,
  enableSfx = true,
  onToggleSfx,
  sfxVolume = 0.35,
  onChangeSfxVolume,
  currentTopic = '',
  syncHighlightSfx = true,
  onToggleHighlightSfx,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = (e: React.MouseEvent, trackId: string, filename: string) => {
    e.stopPropagation();
    if (trackId === 'auto' || trackId === 'none') return;

    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioPath = filename.startsWith('sfx_') ? `./sfx/${filename}` : `./bgm/${filename}`;
    const audio = new Audio(audioPath);
    const vol = filename.startsWith('sfx_') ? sfxVolume * 1.5 : bgmVolume * 2;
    audio.volume = Math.min(1, Math.max(0.05, vol));
    audio.onended = () => setPlayingTrackId(null);
    audio.onerror = () => setPlayingTrackId(null);
    audio.play().catch(() => setPlayingTrackId(null));
    audioRef.current = audio;
    setPlayingTrackId(trackId);
  };

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#14213D]">
                수업 배경음(BGM) &amp; 성우 음성 자동 덕킹
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                자체 합성 로열티 프리 음원
              </span>
            </div>
            <p className="text-xs text-[#5C6B85] font-medium">
              교사 내레이션이 나올 때는 배경음 볼륨을 자동으로 낮춰(Ducking) 설명 전달력을 지킵니다.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 self-end sm:self-auto cursor-pointer">
          <span className="text-xs font-extrabold text-[#14213D]">배경음 사용</span>
          <input
            type="checkbox"
            checked={enableBgm}
            onChange={() => onToggleBgm(!enableBgm)}
            className="w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {enableBgm && (
        <div className="space-y-3.5">
          {/* Volume Control Bar */}
          <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#14213D] tabular-nums">
              <Volume2 className="w-4 h-4 text-[#1E40AF]" />
              <span>배경음 볼륨: {Math.round(bgmVolume * 100)}%</span>
              <span className="text-[11px] text-[#5C6B85] font-medium">(수업 영상은 15~22% 권장)</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-56 tabular-nums">
              <span className="text-[10px] text-[#5C6B85] font-bold">10%</span>
              <input
                type="range"
                min="0.10"
                max="0.45"
                step="0.02"
                value={bgmVolume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
              <span className="text-[10px] text-[#5C6B85] font-bold">45%</span>
            </div>
          </div>

          {/* BGM Mood Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {BGM_TRACKS.map((track) => {
              const isSelected = selectedMood === track.id || (track.id === 'auto' && !selectedMood);
              const isPlaying = playingTrackId === track.id;

              const detectedMood = track.id === 'auto' && currentTopic ? (() => {
                const text = currentTopic.toLowerCase();
                if (text.match(/공포|스릴러|미스터리|소름|괴담|심해|미제|충격|사건|벌금|탈옥|블랙홀|골짜기|비밀/)) {
                  return { label: '탐구 & 긴장감 (Suspense)', color: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]' };
                }
                if (text.match(/역사|동기부여|성공|위인|전쟁|왕실|명언|고조선|신라|로마|장영실|훈민정음/)) {
                  return { label: '역사 다큐 시네마틱 (Epic)', color: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]' };
                }
                if (text.match(/뇌과학|뇌|심리|원자|분자|광합성|과학|기술|물리|화학|기회비용|수학|정보|ai/)) {
                  return { label: '과학 · 개념 탐구 (Tech)', color: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' };
                }
                if (text.match(/건강|힐링|수면|명상|마음|복습|문학|독서|호흡법/)) {
                  return { label: '차분한 복습 로파이 (Lofi)', color: 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]' };
                }
                return { label: '밝은 수업 도입 (Upbeat)', color: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' };
              })() : null;

              return (
                <div
                  key={track.id}
                  onClick={() => onSelectMood(track.id)}
                  className={`relative p-3.5 rounded-lg border text-left transition-colors cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1E40AF] bg-[#EFF6FF]'
                      : 'border-[#E5DEC9] bg-[#FAF8F3] hover:bg-[#FFFDF8] hover:border-[#CFC6AE]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold text-xs text-[#14213D] leading-snug">
                        {track.name}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {track.id !== 'auto' && track.id !== 'none' && (
                          <button
                            type="button"
                            onClick={(e) => handlePreview(e, track.id, track.filename)}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              isPlaying
                                ? 'bg-[#1E40AF] text-white'
                                : 'bg-[#FFFDF8] text-[#3D4B66] border border-[#CFC6AE] hover:border-[#1E40AF] hover:text-[#1E40AF]'
                            }`}
                            title={isPlaying ? '정지' : '미리듣기'}
                          >
                            {isPlaying ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                          </button>
                        )}
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[#1E40AF] bg-[#1E40AF] text-white'
                              : 'border-[#CFC6AE] bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {detectedMood && (
                      <div className={`mt-1.5 px-2 py-0.5 rounded border text-[10px] font-extrabold inline-flex items-center gap-1 ${detectedMood.color}`}>
                        <span>자동 선곡 예정:</span>
                        <span>{detectedMood.label}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-[#3D4B66] mt-1 leading-snug font-medium">
                      {track.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pedagogical Retention Options (Intro Question Banner + Keyword Pop-up) */}
      <div className="pt-3 border-t border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onToggleHookIntro && (
          <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5DEC9] bg-[#FAF8F3] hover:bg-[#FFFDF8] cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#B45309] shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-[#14213D] block">첫 3초 수업 도입 질문 배너</span>
                <span className="text-[11px] text-[#5C6B85]">수업 시작 0~2.5초 동안 핵심 발문 카드를 표시합니다</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableHookIntro}
              onChange={(e) => onToggleHookIntro(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
          </label>
        )}

        {onTogglePopupSubtitles && (
          <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5DEC9] bg-[#FAF8F3] hover:bg-[#FFFDF8] cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-[#14213D] block">핵심 용어 팝업 강조 자막</span>
                <span className="text-[11px] text-[#5C6B85]">중요 개념어 등장 시 탄력 있는 자막 애니메이션을 적용합니다</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enablePopupSubtitles}
              onChange={(e) => onTogglePopupSubtitles(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
          </label>
        )}
      </div>

      {/* Classroom Audio Cue SFX */}
      <div className="pt-3 border-t border-[#E5DEC9] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B45309]" />
            <div>
              <h4 className="text-xs font-extrabold text-[#14213D]">
                수업 단계 전환 · 핵심 포인트 효과음(SFX)
              </h4>
              <p className="text-[11px] text-[#5C6B85]">
                장면 전환(Whoosh), 도입 발문(Boom), 키워드 등장(Pop), 핵심 요점(Ding) 효과음을 자동 배치합니다
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {enableSfx && onChangeSfxVolume && (
              <div className="flex items-center gap-1.5 bg-[#FAF8F3] px-2.5 py-1 rounded border border-[#E5DEC9] tabular-nums">
                <Volume2 className="w-3.5 h-3.5 text-[#5C6B85]" />
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => onChangeSfxVolume(parseFloat(e.target.value))}
                  className="w-16 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-[#14213D]">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
            )}

            {onToggleSfx && (
              <input
                type="checkbox"
                checked={enableSfx}
                onChange={() => onToggleSfx(!enableSfx)}
                className="w-4 h-4 cursor-pointer"
              />
            )}
          </div>
        </div>

        {enableSfx && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'sfx_whoosh', name: '단계 전환음', file: 'sfx_whoosh.mp3' },
              { id: 'sfx_boom', name: '도입 주목음', file: 'sfx_boom.mp3' },
              { id: 'sfx_pop', name: '자막 팝업음', file: 'sfx_pop.mp3' },
              { id: 'sfx_ding', name: '핵심 알림음', file: 'sfx_ding.mp3' },
              { id: 'sfx_glitch', name: '주의 환기음', file: 'sfx_glitch.mp3' },
            ].map((sfx) => (
              <button
                key={sfx.id}
                type="button"
                onClick={(e) => handlePreview(e, sfx.id, sfx.file)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11px] font-bold transition-colors ${
                  playingTrackId === sfx.id
                    ? 'bg-[#14213D] text-[#FDE68A] border-[#14213D]'
                    : 'bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] border-[#E5DEC9]'
                }`}
              >
                <span className="truncate">{sfx.name}</span>
                {playingTrackId === sfx.id ? (
                  <Square className="w-2.5 h-2.5 fill-current shrink-0" />
                ) : (
                  <Play className="w-2.5 h-2.5 text-[#5C6B85] shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        {enableSfx && onToggleHighlightSfx && (
          <div>
            <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#FCD34D] bg-[#FEF3C7]/45 hover:bg-[#FEF3C7]/70 cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                <div>
                  <span className="text-xs font-extrabold text-[#14213D] block">
                    자막 핵심 단어 & 숫자 효과음 자동 싱크
                  </span>
                  <span className="text-[11px] text-[#78350F]">
                    핵심 수치·개념어 발화 시 알림음(Ding/Pop)을 자막 하이라이트와 동기화합니다
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncHighlightSfx}
                onChange={(e) => onToggleHighlightSfx(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </section>
  );
};
