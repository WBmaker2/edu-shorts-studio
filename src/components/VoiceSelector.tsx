import React from 'react';
import { Mic, Check, Gauge } from 'lucide-react';
import type { VoiceOption } from '../types';

export const VOICES: VoiceOption[] = [
  {
    id: 'ko-KR-SunHiNeural',
    name: '선희 (여성)',
    gender: 'female',
    tag: '표준 개념 강의 · 아나운서',
    description: '또렷한 발음과 안정적인 호흡으로 교과 핵심 개념 및 요약 설명에 가장 적합합니다',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-InJoonNeural',
    name: '인준 (남성)',
    gender: 'male',
    tag: '차분한 탐구 · 다큐 해설',
    description: '신뢰감 있는 남성 내레이션으로 과학 원리, 역사 배경, 논리적 설명에 어울립니다',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-JiMinNeural',
    name: '지민 (여성)',
    gender: 'female',
    tag: '생기 있는 수업 도입 · 퀴즈',
    description: '밝고 경쾌한 에너지로 학생들의 주의를 깨우는 1분 도입 질문 및 퀴즈에 좋습니다',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-GookMinNeural',
    name: '국민 (남성)',
    gender: 'male',
    tag: '친근한 문답 · 사례 설명',
    description: '자연스러운 구어체 억양으로 실생활 비유와 학생 눈높이 사례 풀이에 적합합니다',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-BongJinNeural',
    name: '봉진 (남성)',
    gender: 'male',
    tag: '중후한 역사 · 심화 다큐',
    description: '깊이 있는 중저음으로 역사적 전환점이나 심화 탐구 주제의 몰입감을 높입니다',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-SeoHyeonNeural',
    name: '서현 (여성)',
    gender: 'female',
    tag: '차분한 복습 · 문학 낭독',
    description: '부드럽고 편안한 톤으로 거꾸로 수업 예습·복습 노트나 국어·문학 지문 해설에 적합합니다',
    provider: 'edge-tts',
  },
  {
    id: 'elevenlabs_21m00Tcm4TlvDq8ikWAM',
    name: '레이첼 Rachel (여성)',
    gender: 'female',
    tag: 'ElevenLabs 다국어 · 영어',
    description: '실제 원어민 강사 같은 자연스러운 호흡과 억양을 제공하는 프리미엄 보이스',
    provider: 'elevenlabs',
  },
  {
    id: 'elevenlabs_pNInz6obpgDQGcFmaJgB',
    name: '아담 Adam (남성)',
    gender: 'male',
    tag: 'ElevenLabs 다국어 · 다큐',
    description: '깊은 울림과 전달력을 갖춘 글로벌 교육 콘텐츠용 프리미엄 남성 보이스',
    provider: 'elevenlabs',
  },
];

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  voiceSpeed?: number;
  onChangeVoiceSpeed?: (speed: number) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  voiceSpeed = 1.1,
  onChangeVoiceSpeed,
}) => {
  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
              수업 내레이션 성우 및 발화 템포
            </h2>
            <p className="text-xs text-[#5C6B85] font-medium">
              교과 분위기와 학습자 연령에 맞는 한국어 Neural TTS 성우와 설명 속도를 지정합니다
            </p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-bold self-start sm:self-auto">
          기본 6종 무료 내장
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {VOICES.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice.id)}
              className={`relative cursor-pointer rounded-lg p-3.5 border transition-colors flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#14213D]'
                  : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] hover:border-[#CFC6AE]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-extrabold text-xs text-[#14213D]">{voice.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#1E40AF] border-[#1E40AF] text-white'
                        : 'border-[#CFC6AE] bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <span
                  className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    voice.provider === 'elevenlabs'
                      ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]'
                      : 'bg-[#FFFDF8] text-[#1E40AF] border border-[#BFDBFE]'
                  }`}
                >
                  {voice.tag}
                </span>

                <p className="text-[11px] text-[#3D4B66] leading-snug font-medium pt-0.5">
                  {voice.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {onChangeVoiceSpeed && (
        <div className="pt-3 border-t border-[#E5DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#B45309]" />
            <div>
              <span className="text-xs font-extrabold text-[#14213D]">교사 발화 배속 (수업 전달 속도)</span>
              <p className="text-[11px] text-[#5C6B85]">
                초등·기초 개념은 1.0x 정속, 중·고등 핵심 요약은 1.1x 추천 템포가 가장 명료합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { val: 1.0, label: '1.0x 정속 (기초)' },
              { val: 1.1, label: '1.1x 추천' },
              { val: 1.2, label: '1.2x 빠른 요약' },
              { val: 1.3, label: '1.3x 속독 복습' },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => onChangeVoiceSpeed(s.val)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors tabular-nums ${
                  (voiceSpeed ?? 1.1) === s.val
                    ? 'bg-[#14213D] text-[#FDE68A]'
                    : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#CFC6AE]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
