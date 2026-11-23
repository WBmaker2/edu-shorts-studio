export interface SfxTrack {
  id: string;
  name: string;
  description: string;
  filename: string;
  tag: string;
  icon: string;
}

export const SFX_TRACKS: SfxTrack[] = [
  {
    id: 'sfx_whoosh',
    name: '단계 전환 스윕 (Whoosh)',
    description: '도입·개념·예시·요약 등 수업 장면이 바뀔 때 부드러운 전환감 부여',
    filename: 'sfx_whoosh.mp3',
    tag: '단계 전환',
    icon: '→',
  },
  {
    id: 'sfx_pop',
    name: '핵심 단어 바운스 팝 (Pop)',
    description: '핵심 용어나 숫자 키워드 자막이 강조될 때 경쾌한 집중 효과',
    filename: 'sfx_pop.mp3',
    tag: '용어 강조',
    icon: '•',
  },
  {
    id: 'sfx_ding',
    name: '정답 · 포인트 차임 (Ding)',
    description: '퀴즈 정답 공개, 핵심 공식, 꼭 기억할 포인트를 짚을 때 시선 집중',
    filename: 'sfx_ding.mp3',
    tag: '정답/포인트',
    icon: '✓',
  },
  {
    id: 'sfx_boom',
    name: '도입 질문 강조 붐 (Boom)',
    description: '0초 수업 도입 질문 제시 및 중요 개념 강조 타이밍에 무게감 부여',
    filename: 'sfx_boom.mp3',
    tag: '도입 강조',
    icon: '!',
  },
  {
    id: 'sfx_glitch',
    name: '오개념 주의 알림 (Glitch)',
    description: '학생들이 자주 틀리는 오개념이나 주의사항을 짚을 때 명확한 환기',
    filename: 'sfx_glitch.mp3',
    tag: '오개념 주의',
    icon: '※',
  },
];
