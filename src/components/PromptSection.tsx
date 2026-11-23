import React, { useState } from 'react';
import { Wand2, BookOpen, RotateCw, Compass, TrendingUp, X, Repeat } from 'lucide-react';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (v: string) => void;
  onGenerateScript: () => void;
  isGeneratingScript: boolean;
  loopMode?: boolean;
  setLoopMode?: (v: boolean) => void;
}

interface TopicCategory {
  id: string;
  name: string;
  displayLabel: string;
  icon: string;
  topics: string[];
}

const CATEGORIZED_TOPICS: TopicCategory[] = [
  {
    id: 'science_inquiry',
    name: '🔬 과학 원리 & 자연 탐구',
    displayLabel: '과학 · 자연 탐구',
    icon: 'SCI',
    topics: [
      '원자와 분자는 무엇이 다를까? 레고 블록 비유로 1분 만에 이해하기',
      '식물은 어떻게 빛으로 영양분을 만들까? 광합성과 엽록체의 핵심 역할',
      '하늘은 낮에는 파랗고 노을이 질 때는 붉게 보이는 빛의 산란 원리',
      '비행기 날개 위아래의 기압 차이가 수백 톤 비행기를 띄우는 베르누이 법칙',
      '블랙홀 안으로 들어가면 시간과 공간에 일어나는 상대성이론 현상',
      '우주 비행사들이 무중력 우주선 안에서 빵 대신 또띠아를 먹는 과학적 이유',
      '지구상에서 가장 깊은 마리아나 해구 수압에서 심해 생물이 버티는 비결',
      '백신은 어떻게 우리 몸의 면역 기억 세포를 미리 훈련시킬까?',
      '물이 얼면 오히려 부피가 커지는 수소 결합의 특별한 성질',
      '지진파 P파와 S파의 속도 차이로 지구 내부 구조를 알아내는 방법',
    ],
  },
  {
    id: 'history_world',
    name: '📜 역사 & 세계 기이한 법률',
    displayLabel: '역사 · 세계 사회',
    icon: 'HIS',
    topics: [
      '고조선의 8조법으로 알아보는 청동기 시대 사회 모습 3가지',
      '한국 역사상 가장 위대한 과학자 장영실의 자격루 작동 원리',
      '훈민정음은 어떤 발음 기관의 모양을 본떠 만든 과학적 문자일까?',
      '신라가 삼국 중 가장 늦게 발전하고도 삼국 통일을 이룬 외교와 전략',
      '단 1발의 총성이 제1차 세계대전의 도화선이 된 사라예보 사건의 배경',
      '세계에서 가장 부유했던 말리 제국의 왕 만사 무사와 황금 교역로',
      '로마 황제가 바닷가 조개껍질을 줍게 한 사건에 숨겨진 원로원 견제 정치',
      '조선 왕실의 하루 일과와 경연 제도가 왕권과 신권의 균형을 잡은 원리',
      '스위스에서 밤 10시 이후 변기 물 내리면 벌금 무는 이유와 공동체 소음 규범',
      '싱가포르에서 껌 반입을 법으로 제한한 도시 환경 정책의 역사적 배경',
    ],
  },
  {
    id: 'mind_body',
    name: '🧠 뇌과학 & 심리/관계',
    displayLabel: '뇌과학 · 학습 심리',
    icon: 'PSY',
    topics: [
      '벼락치기보다 분산 학습이 장기 기억 해마에 남는 에빙하우스 망각곡선 원리',
      '왜 방에 들어오자마자 하려던 일을 깜빡할까? 뇌의 문간 효과(Doorway Effect)',
      '시험 직전 긴장될 때 뇌를 10초 만에 안정시키는 생리적 한숨 호흡법',
      '자기 전 부끄러웠던 기억이 선명하게 떠오르는 편도체와 감정 기억의 원리',
      '상대방의 공감을 이끌어내는 비폭력 대화와 미러링 뉴런의 작동 메커니즘',
      '인간이 로봇을 볼 때 묘한 이질감을 느끼는 불쾌한 골짜기(Uncanny Valley) 이론',
      '가위에 눌렸을 때 렘수면 상태에서 뇌와 근육의 각성 시차가 만드는 현상',
      '자존감과 자기효능감을 높여 학습 동기를 깨우는 작은 성공 습관의 뇌과학',
    ],
  },
  {
    id: 'money_biz',
    name: '💰 부자 & 천재 마케팅',
    displayLabel: '경제 · 사회 개념',
    icon: 'ECO',
    topics: [
      '기회비용과 매몰비용의 결정적 차이, 영화표 예시로 1분 완벽 정리',
      '메뉴판 가장 비싼 가격을 먼저 보여주면 선택이 달라지는 행동경제학 앵커링 효과',
      '마트 시식 코너를 지나치기 어려운 이유, 사회심리학 상호성의 법칙',
      '인플레이션과 금리 인상이 우리 일상 물가와 예금에 미치는 핵심 관계',
      '다이아몬드보다 물이 더 필수적인데 왜 다이아몬드가 비쌀까? 한계효용의 역설',
      '스타벅스가 컵에 손님 이름을 적으며 고객 경험을 브랜드화한 마케팅 사례',
      '애플이 아이폰 충전기를 빼버리고도 수익과 환경 지표를 바꾼 공급망 전략',
      '워런 버핏이 강조한 복리의 마법: 72법칙으로 원금이 2배 되는 시간 계산하기',
    ],
  },
  {
    id: 'life_tech',
    name: '💡 생활 & 스마트 치트키',
    displayLabel: '정보 · 디지털 리터러시',
    icon: 'ICT',
    topics: [
      '구글 학술 검색과 연산자 명령어로 신뢰할 수 있는 자료 10초 만에 찾는 법',
      '인공지능 LLM은 어떻게 다음 단어를 확률로 예측해 문장을 만들까?',
      '스마트폰 리튬이온 배터리 수명을 오래 유지하는 충전 사이클의 화학 원리',
      '강아지와 고양이가 꼬리와 귀 움직임으로 감정을 표현하는 동물행동학 신호',
      '자동차 사이드미러에 빗물이 맺히지 않게 하는 계면활성제와 표면장력 원리',
      '기상 직후 미온수 한 잔이 신진대사와 혈액 순환을 깨우는 생리학적 이유',
      '식이섬유부터 단백질, 탄수화물 순서로 먹으면 혈당 스파이크가 줄어드는 원리',
    ],
  },
  {
    id: 'shocking',
    name: '🤯 충격 반전 & 미스터리',
    displayLabel: '호기심 · 융합 탐구',
    icon: 'INQ',
    topics: [
      '지구상에서 가장 독특한 주파수로 노래하는 52헤르츠 고래의 해양생태 이야기',
      '수심 1만 미터 남태평양에서 포착된 거대 저주파 음파 블룹(Bloop)의 정체(빙하 붕괴음)',
      '이집트 대피라미드 내부 거대 빈 공간을 뮤온 입자 검출기로 찾아낸 현대 물리학',
      '센과 치히로의 행방불명 배경으로 읽는 근대 동아시아 도시 문화와 상징',
      '페이스북 연구용 AI 2대가 협상 실험 중 압축된 기호로 통신해 종료한 실험의 진실',
    ],
  },
];

const ALL_TOPIC_POOL = CATEGORIZED_TOPICS.flatMap((c) => c.topics);

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  setPrompt,
  onGenerateScript,
  isGeneratingScript,
  loopMode = false,
  setLoopMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shuffledDeck, setShuffledDeck] = useState<string[]>(() => {
    return [...ALL_TOPIC_POOL].sort(() => 0.5 - Math.random());
  });
  const [deckIndex, setDeckIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [trendingList, setTrendingList] = useState<{ topic: string; category: string; viewEstimate: string }[]>([]);

  const activePool = React.useMemo(() => {
    if (selectedCategory === 'all') return ALL_TOPIC_POOL;
    const cat = CATEGORIZED_TOPICS.find((c) => c.id === selectedCategory);
    return cat ? cat.topics : ALL_TOPIC_POOL;
  }, [selectedCategory]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setDeckIndex(0);
    const pool = catId === 'all'
      ? ALL_TOPIC_POOL
      : (CATEGORIZED_TOPICS.find((c) => c.id === catId)?.topics || ALL_TOPIC_POOL);
    setShuffledDeck([...pool].sort(() => 0.5 - Math.random()));
  };

  const handleToggleTrending = async () => {
    if (!showTrending && trendingList.length === 0) {
      if (window.electronAPI?.fetchTrendingKeywords) {
        try {
          const list = await window.electronAPI.fetchTrendingKeywords();
          setTrendingList(list);
        } catch {}
      }
    }
    setShowTrending((prev) => !prev);
  };

  const currentExamples = React.useMemo(() => {
    const count = 2;
    const pool = shuffledDeck.length > 0 ? shuffledDeck : activePool;
    const start = deckIndex % pool.length;
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(pool[(start + i) % pool.length]);
    }
    return result;
  }, [deckIndex, shuffledDeck, activePool]);

  const handleRefreshExamples = () => {
    setIsRotating(true);
    setDeckIndex((prev) => {
      const next = prev + 4;
      if (next >= shuffledDeck.length) {
        setShuffledDeck([...activePool].sort(() => 0.5 - Math.random()));
        return 0;
      }
      return next;
    });
    setTimeout(() => setIsRotating(false), 400);
  };

  // IME-safe Enter submit for Korean teachers typing in textarea
  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (event.nativeEvent.isComposing || (event as any).keyCode === 229) {
        return;
      }
      if (prompt.trim() && !isGeneratingScript) {
        onGenerateScript();
      }
    }
  };

  return (
    <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-extrabold text-[#14213D] tracking-tight">
            단원 학습 주제 및 성취 목표
          </h2>
          <span className="text-xs text-[#5C6B85] font-medium hidden lg:inline">
            교과별 탐구 주제를 고르거나 오늘 가르칠 핵심 개념을 입력하세요
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleTrending}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border border-[#FCD34D] text-[11px] font-extrabold transition-colors self-start sm:self-auto"
        >
          <Compass className="w-3 h-3 text-[#B45309]" />
          <span>{showTrending ? '추천 주제 접기' : '인기 탐구 키워드'}</span>
        </button>
      </div>

      {/* Curriculum Subject Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors tabular-nums ${
            selectedCategory === 'all'
              ? 'bg-[#14213D] text-white'
              : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
          }`}
        >
          전체 교과 ({ALL_TOPIC_POOL.length})
        </button>
        {CATEGORIZED_TOPICS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#1E40AF] text-white'
                : 'bg-[#FAF8F3] text-[#3D4B66] hover:bg-[#F2EFE6] border border-[#E5DEC9]'
            }`}
          >
            <span className="text-[10px] font-black opacity-75">{cat.icon}</span>
            <span>{cat.displayLabel}</span>
          </button>
        ))}
      </div>

      {/* Popular Inquiry Topics Drawer */}
      {showTrending && (
        <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#CFC6AE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#14213D]">
              <TrendingUp className="w-4 h-4 text-[#B45309]" />
              <span>학생 관심도가 높은 교양·탐구 주제</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTrending(false)}
              className="p-1 rounded text-[#5C6B85] hover:text-[#14213D]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {trendingList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setPrompt(item.topic);
                  setShowTrending(false);
                }}
                className="p-3 rounded-lg bg-[#FFFDF8] hover:bg-[#FEF3C7]/40 border border-[#E5DEC9] hover:border-[#B45309] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#78350F] font-extrabold">
                    {item.category}
                  </span>
                  <span className="text-[#B45309] font-extrabold tabular-nums">
                    관심도 {item.viewEstimate}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#14213D] leading-snug">
                  {item.topic}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="lesson-topic-input" className="text-xs font-extrabold text-[#14213D] flex items-center justify-between">
          <span>수업 주제 / 핵심 질문</span>
          <span className="text-[11px] font-medium text-[#5C6B85]">Ctrl+Enter로 즉시 교안 대본 생성</span>
        </label>
        <textarea
          id="lesson-topic-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder="예: 원자와 분자는 무엇이 다를까? 레고 블록 비유로 1분 만에 이해하기"
          rows={2}
          className="w-full bg-[#FAF8F3] border border-[#CFC6AE] rounded-lg px-3.5 py-2.5 text-sm text-[#14213D] placeholder-[#5C6B85] focus:outline-none focus:border-[#1E40AF] focus:bg-white transition-colors font-semibold"
        />
      </div>

      {/* Quick Curriculum Example Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 mr-1">
          <span className="text-[11px] text-[#3D4B66] font-extrabold">교과 예시 주제:</span>
          <button
            type="button"
            onClick={handleRefreshExamples}
            className="p-1 rounded text-[#5C6B85] hover:text-[#1E40AF] hover:bg-[#EFF6FF] transition-colors"
            title="다른 교과 예시 보기"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-[#1E40AF]' : ''}`} />
          </button>
        </div>
        {currentExamples.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPrompt(ex)}
            className="text-[11px] bg-[#FAF8F3] hover:bg-[#EFF6FF] hover:border-[#1E40AF] hover:text-[#1E40AF] text-[#14213D] px-2.5 py-1.5 rounded-md border border-[#E5DEC9] transition-colors text-left font-medium"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E5DEC9]">
        <label
          className="flex items-center gap-2 cursor-pointer"
          title="마지막 정리 문장이 첫 도입 질문으로 자연스럽게 이어져 복습 효과를 높입니다"
        >
          <input
            type="checkbox"
            checked={loopMode}
            onChange={(e) => setLoopMode?.(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <Repeat className="w-3.5 h-3.5 text-[#1E40AF]" />
          <span className="text-xs font-extrabold text-[#14213D]">복습 순환 (무한 루프 모드)</span>
          <span className="text-[11px] text-[#5C6B85] hidden md:inline">
            마지막 요약이 도입 질문으로 자연스럽게 연결되는 대본
          </span>
        </label>

        <button
          type="button"
          onClick={onGenerateScript}
          disabled={!prompt.trim() || isGeneratingScript}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-extrabold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingScript ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>단계별 수업 대본 설계 중...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI 수업 대본 생성</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
