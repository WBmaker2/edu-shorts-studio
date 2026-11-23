import React from 'react';
import { Type, Check, ShieldCheck } from 'lucide-react';
import type { FontOption } from '../types';

export const FONTS: FontOption[] = [
  {
    id: 'Pretendard',
    name: '프리탠다드 (Pretendard)',
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    tag: '교과서 표준 가독성 1위',
    description: '모바일과 교실 대형 화면 어디서나 획이 뭉치지 않고 가장 또렷하게 읽히는 표준 고딕',
    license: 'SIL Open Font License (학교·상업용 무료)',
  },
  {
    id: 'GmarketSansBold',
    name: 'G마켓 산스 볼드 (Gmarket Sans)',
    fontFamily: 'GmarketSansBold, sans-serif',
    tag: '수업 도입 · 핵심 질문 강조',
    description: '단단하고 시원한 자소 구조로 첫 3초 도입 질문과 단원 제목 강조에 적합합니다',
    license: 'OFL / 학교·상업용 무료',
  },
  {
    id: 'Black Han Sans',
    name: '블랙한스 (Black Han Sans)',
    fontFamily: '"Black Han Sans", sans-serif',
    tag: '공식 · 필수 어휘 각인',
    description: '굵직한 타이틀 서체로 시험 직전 필수 암기 키워드나 핵심 법칙을 강하게 각인시킵니다',
    license: 'SIL Open Font License (학교·상업용 무료)',
  },
  {
    id: 'Do Hyeon',
    name: '도현체 (Do Hyeon)',
    fontFamily: '"Do Hyeon", sans-serif',
    tag: '역사 · 스토리텔링 탐구',
    description: '친근하면서도 정돈된 인상으로 역사 이야기나 실생활 과학 원리 해설에 잘 어울립니다',
    license: 'SIL Open Font License (학교·상업용 무료)',
  },
  {
    id: 'Noto Sans KR',
    name: '노토 산스 블랙 (Noto Sans KR)',
    fontFamily: '"Noto Sans KR", sans-serif',
    tag: '다큐멘터리 · 정밀 학습지',
    description: '한글·영문·수식 기호 균형이 뛰어나 거꾸로 수업 복습 자료 및 다국어 교안에 적합합니다',
    license: 'SIL Open Font License (학교·상업용 무료)',
  },
];

interface FontSelectorProps {
  selectedFontId: string;
  onSelectFont: (id: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontId,
  onSelectFont,
}) => {
  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
              수업 자막 서체 (OFL 안심 라이선스)
            </h2>
            <p className="text-xs text-[#5C6B85] font-medium">
              학교 수업, 온라인 클래스, 유튜브 채널 배포에 저작권 제약이 없는 검증된 한글 서체입니다
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-bold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>교육·상업용 무료 라이선스</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FONTS.map((f) => {
          const isSelected = (selectedFontId || 'Pretendard').toLowerCase() === f.id.toLowerCase();
          return (
            <div
              key={f.id}
              onClick={() => onSelectFont(f.id)}
              className={`group relative cursor-pointer rounded-lg p-3.5 border transition-colors ${
                isSelected
                  ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#14213D]'
                  : 'bg-[#FAF8F3] hover:bg-[#FFFDF8] border-[#E5DEC9] text-[#3D4B66] hover:border-[#CFC6AE]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-extrabold text-xs text-[#14213D] truncate" style={{ fontFamily: f.fontFamily }}>
                  {f.name}
                </span>
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

              <div className="p-2.5 rounded bg-[#FFFDF8] border border-[#E5DEC9] my-2">
                <p className="text-xs font-bold text-[#14213D] truncate" style={{ fontFamily: f.fontFamily }}>
                  물질의 성질을 지닌 최소 단위, 분자!
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-[#E5DEC9] mt-1">
                <span className="font-extrabold text-[#1E40AF] bg-[#FFFDF8] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  {f.tag}
                </span>
                <span className="text-[#15803D] font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>OFL 무료</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
