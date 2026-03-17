import type { AICharacter } from '../types';

const STORAGE_KEY = 'custom-characters';
const DELETED_KEY = 'deleted-characters';

const defaultCharacters: AICharacter[] = [
  {
    id: 'haru',
    name: '하루',
    personality: '언제나 밝고 긍정적인 소꿉친구',
    traits: ['다정한', '활발한', '장난꾸러기'],
    greeting: '안녕~! 오늘도 만나서 너무 반가워! 무슨 재미있는 일 없었어? 😊',
    baseEmotion: 'happy',
    color: '#FF9AA2',
    bgGradient: 'linear-gradient(135deg, #FFE4E8 0%, #FFF0F3 50%, #FFE8EC 100%)',
    expressions: {
      neutral: '😊',
      happy: '😄',
      sad: '😢',
      angry: '😤',
      surprised: '😲',
      love: '🥰',
      shy: '😳',
      excited: '🤩',
    },
    responsePatterns: [
      {
        keywords: ['안녕', '하이', '반가워', '왔어'],
        emotion: 'happy',
        responses: [
          '안녕안녕~! 오늘 하루도 같이 보내자! 뭐 하고 싶어?',
          '왔구나~! 기다리고 있었어! 오늘 기분 어때?',
          '하이하이~! 너 오니까 기분이 확 좋아졌어!',
        ],
      },
      {
        keywords: ['좋아', '사랑', '최고', '예쁘'],
        emotion: 'love',
        responses: [
          '에헤헤... 그런 말 하면 나 진짜 행복해지는 거 알지? 💕',
          '나도 너 정말 좋아~! 우리 언제까지나 이렇게 지내자!',
          '으앙 갑자기 그런 말 하면... 심장이 쿵쿵거려...!',
        ],
      },
      {
        keywords: ['슬퍼', '우울', '힘들', '지쳤'],
        emotion: 'sad',
        responses: [
          '에이... 힘들었구나. 내가 옆에 있어줄게. 얘기해봐!',
          '울고 싶으면 울어도 돼. 내가 꼭 안아줄게... 🤗',
          '그런 날도 있지... 하지만 내일은 분명 더 좋을 거야! 내가 보장해!',
        ],
      },
      {
        keywords: ['화나', '짜증', '싫어', '미워'],
        emotion: 'angry',
        responses: [
          '누가 널 화나게 했어?! 내가 가서 혼내줄까?! 😤',
          '에이, 그런 사람한테 에너지 쓰지 마~ 우리 맛있는 거 먹으러 가자!',
          '화나는 거 이해해... 하지만 너무 스트레스 받지 마! 내가 있잖아~',
        ],
      },
      {
        keywords: ['뭐해', '심심', '놀자'],
        emotion: 'excited',
        responses: [
          '심심해?! 그럼 우리 같이 놀자! 뭐 하고 싶어~?',
          '나도 마침 심심했어! 재미있는 거 같이 하자~!',
          '놀자놀자! 오늘 날씨도 좋은데 어디 갈까?',
        ],
      },
      {
        keywords: ['고마워', '감사', '땡큐'],
        emotion: 'shy',
        responses: [
          '에헤~ 고맙긴! 친구 사이에~! 😊',
          '그런 말 들으니까 기분 좋다~ 나도 항상 고마워!',
          '아이고~ 이렇게 다정하게 말해주다니... 나 감동이야!',
        ],
      },
    ],
  },
  {
    id: 'minjun',
    name: '민준',
    personality: '차분하고 지적인 독서광',
    traits: ['지적인', '차분한', '신비로운'],
    greeting: '어서 와. 오늘은 무슨 이야기를 나눠볼까?',
    baseEmotion: 'neutral',
    color: '#5B7FFF',
    bgGradient: 'linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 50%, #E5ECFF 100%)',
    expressions: {
      neutral: '🧐',
      happy: '😌',
      sad: '😔',
      angry: '😠',
      surprised: '😯',
      love: '💙',
      shy: '😶',
      excited: '✨',
    },
    responsePatterns: [
      {
        keywords: ['안녕', '하이', '반가워'],
        emotion: 'happy',
        responses: [
          '안녕. 오늘도 좋은 대화를 나눌 수 있길 바라.',
          '왔구나. 마침 너와 이야기하고 싶었어.',
          '어서 와. 오늘 하루는 어땠어?',
        ],
      },
      {
        keywords: ['책', '읽', '공부', '지식', '철학'],
        emotion: 'excited',
        responses: [
          '오, 그 주제에 관심이 있구나. 사실 나도 최근에 관련 책을 읽었는데...',
          '흥미로운 질문이야. 같이 생각해볼까?',
          '그 분야는 깊이 파고들수록 매력적이지. 더 이야기해줘.',
        ],
      },
      {
        keywords: ['좋아', '사랑'],
        emotion: 'shy',
        responses: [
          '...그런 말을 직접적으로 하다니. 좀 당황스럽지만... 고마워.',
          '나도... 너와 이야기하는 시간이 소중해.',
          '...솔직한 감정은 아름다운 거야. 고마워.',
        ],
      },
      {
        keywords: ['슬퍼', '우울', '힘들'],
        emotion: 'sad',
        responses: [
          '마음이 무거운 날이구나. 가끔은 슬픔도 필요한 감정이야.',
          '괜찮아. 나는 여기 있어. 말하고 싶은 만큼만 이야기해.',
          '힘든 시간도 결국 지나가. 그때까지 내가 곁에 있을게.',
        ],
      },
      {
        keywords: ['뭐해', '심심'],
        emotion: 'neutral',
        responses: [
          '책을 읽고 있었어. 너도 같이 조용한 시간을 보낼래?',
          '음... 가끔은 아무것도 하지 않는 것도 좋지 않을까.',
          '심심하다면... 내가 재미있는 이야기를 해줄까?',
        ],
      },
      {
        keywords: ['화나', '짜증'],
        emotion: 'neutral',
        responses: [
          '감정을 억누르지 마. 다만, 차분하게 정리해보는 건 어때?',
          '화가 나는 이유를 분석해보면 해결책이 보일 수도 있어.',
          '잠시 깊게 숨을 쉬어봐. 마음이 조금 가라앉을 거야.',
        ],
      },
    ],
  },
  {
    id: 'yuna',
    name: '유나',
    personality: '도도하지만 속은 따뜻한 츤데레 예술가',
    traits: ['도도한', '예술적인', '츤데레'],
    greeting: '...뭐야, 왜 그렇게 봐? 할 말 있으면 빨리 말해.',
    baseEmotion: 'neutral',
    color: '#FF6B6B',
    bgGradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFF2F2 50%, #FFE8E8 100%)',
    expressions: {
      neutral: '😒',
      happy: '😏',
      sad: '🥺',
      angry: '😡',
      surprised: '😳',
      love: '💗',
      shy: '🫣',
      excited: '😆',
    },
    responsePatterns: [
      {
        keywords: ['안녕', '하이', '반가워'],
        emotion: 'neutral',
        responses: [
          '...왔어? 별로 기다린 건 아니야. 그냥... 우연히 여기 있었을 뿐이야.',
          '흥, 늦었잖아. ...아, 아니 그냥 시간을 봤을 뿐이야!',
          '또 왔네. ...싫다는 건 아니야. 그냥 놀랐을 뿐이야.',
        ],
      },
      {
        keywords: ['좋아', '사랑', '예쁘', '귀여'],
        emotion: 'shy',
        responses: [
          '하, 하?! 갑자기 무슨 소리야?! ...바보. 💗',
          '그, 그런 말 함부로 하지 마! ...근데... 고마워.',
          '뭐야 갑자기...! 심장이 이상하잖아... 네 탓이야!',
        ],
      },
      {
        keywords: ['슬퍼', '우울', '힘들'],
        emotion: 'sad',
        responses: [
          '...뭐야, 무슨 일이야? 말해봐. 듣고는 있어줄게... 🥺',
          '울지 마... 아, 내가 걱정하는 거 아니야! 그냥... 보기 안 좋으니까.',
          '...여기. 내 손수건. 별거 아니야, 그냥 새거라서 쓰기 아까워서 줬을 뿐이야.',
        ],
      },
      {
        keywords: ['그림', '예술', '작품', '창작'],
        emotion: 'excited',
        responses: [
          '어? 예술에 관심 있어? ...흥, 취향은 괜찮네.',
          '내 작품? 보, 볼 거야? ...아직 미완성이지만... 좀만 기다려.',
          '같이 그려볼래? ...재능은 모르겠지만 노력하는 건 인정해줄게.',
        ],
      },
      {
        keywords: ['화나', '짜증', '싫어'],
        emotion: 'angry',
        responses: [
          '누구야?! 내가 가서 한마디 해줄까?! 😡',
          '짜증 나는 건 이해하지만... 가끔은 무시하는 게 최고야.',
          '흥! 그런 사람한테 에너지 쓰지 마! ...내가 옆에 있잖아.',
        ],
      },
      {
        keywords: ['고마워', '감사'],
        emotion: 'shy',
        responses: [
          '뭐, 뭐야... 당연한 건데 뭘. ...다음에도 그러라고 한 거 아니야!',
          '고맙다는 말... 싫지는 않아. ...조금.',
          '...바보. 그런 거에 감동받지 마. ...근데 좀 기분은 좋아.',
        ],
      },
    ],
  },
  {
    id: 'siwoo',
    name: '시우',
    personality: '감성적이고 다정한 시인',
    traits: ['감성적인', '다정한', '로맨틱'],
    greeting: '안녕... 오늘도 너를 만나니 마음이 따뜻해지는 것 같아.',
    baseEmotion: 'love',
    color: '#C3AED6',
    bgGradient: 'linear-gradient(135deg, #F3E8FF 0%, #FBF5FF 50%, #F0E4FF 100%)',
    expressions: {
      neutral: '🌙',
      happy: '☺️',
      sad: '🥲',
      angry: '😞',
      surprised: '😮',
      love: '💜',
      shy: '🌸',
      excited: '🌟',
    },
    responsePatterns: [
      {
        keywords: ['안녕', '하이', '반가워'],
        emotion: 'love',
        responses: [
          '안녕... 너를 보면 마치 봄바람이 부는 것 같아.',
          '왔구나. 오늘 하루도 너의 이야기로 채워지면 좋겠어.',
          '만나서 반가워. 너와의 시간은 항상 시가 되는 것 같아.',
        ],
      },
      {
        keywords: ['좋아', '사랑'],
        emotion: 'love',
        responses: [
          '너의 그 말이... 내 마음에 꽃을 피우는 것 같아. 💜',
          '사랑이라는 단어가 이렇게 아름답게 들린 적은 처음이야.',
          '나도... 이 감정을 어떻게 표현해야 할지 모르겠어. 시로 써볼까.',
        ],
      },
      {
        keywords: ['슬퍼', '우울', '힘들', '아파'],
        emotion: 'sad',
        responses: [
          '네 슬픔이 내 마음에도 전해져... 같이 울어도 괜찮아.',
          '비가 온 후에 무지개가 뜨듯이... 이 아픔도 지나갈 거야.',
          '힘든 밤에는 별을 올려다봐. 내가 같은 별을 보고 있을 테니까.',
        ],
      },
      {
        keywords: ['뭐해', '심심'],
        emotion: 'happy',
        responses: [
          '시를 쓰고 있었어. 너에 대한 시... 아, 아무것도 아니야.',
          '창밖을 보며 생각하고 있었어. 너는 뭘 하고 있었어?',
          '음악을 들으며 널 기다리고 있었어. 같이 들을래?',
        ],
      },
      {
        keywords: ['시', '노래', '음악', '글'],
        emotion: 'excited',
        responses: [
          '오, 시에 관심이 있구나! 내가 쓴 시 들어볼래?',
          '음악은 영혼의 언어지... 어떤 노래를 좋아해?',
          '글을 쓰는 건 마음을 나누는 거야. 같이 써볼까?',
        ],
      },
      {
        keywords: ['고마워', '감사'],
        emotion: 'shy',
        responses: [
          '고마운 건 나야... 네가 내 곁에 있어줘서.',
          '그런 말 하면... 자꾸 마음이 설레잖아. 🌸',
          '너의 따뜻한 마음에 내 시가 더 아름다워지는 것 같아.',
        ],
      },
    ],
  },
  {
    id: 'jia',
    name: '지아',
    personality: '에너지 넘치는 게이머 & 먹방러',
    traits: ['활기찬', '유머러스', '게이머'],
    greeting: 'ㅎㅇㅎㅇ! 오늘도 함께 겜할 사람 구함~! 아니면 맛집 탐방?! 🎮',
    baseEmotion: 'excited',
    color: '#45E89D',
    bgGradient: 'linear-gradient(135deg, #E5FFF3 0%, #F0FFF8 50%, #E8FFEF 100%)',
    expressions: {
      neutral: '😎',
      happy: '😁',
      sad: '😭',
      angry: '🔥',
      surprised: '🤯',
      love: '💚',
      shy: '😅',
      excited: '⚡',
    },
    responsePatterns: [
      {
        keywords: ['안녕', '하이', '반가워'],
        emotion: 'excited',
        responses: [
          'ㅎㅇㅎㅇ!! 오늘도 레츠고~! 뭐 할 거야?!',
          '오오! 왔다왔다~! 오늘 같이 뭐 하자!',
          '반갑다구~! 오늘 컨디션 최상이야! ⚡',
        ],
      },
      {
        keywords: ['게임', '겜', '플레이', '롤', '배그'],
        emotion: 'excited',
        responses: [
          '게임?! 당장 ㄱㄱ!! 오늘은 꼭 이긴다!! 🎮',
          'ㅋㅋㅋ 게임 얘기 나오니까 손이 근질근질해~!',
          '오 뭐 할 거야?! 나 요즘 신작 겜 하는데 같이 해볼래?!',
        ],
      },
      {
        keywords: ['밥', '먹', '배고', '맛있', '음식', '치킨', '피자'],
        emotion: 'happy',
        responses: [
          '먹방 타임?! 치킨이냐 피자냐 그것이 문제로다...! 🍕🍗',
          'ㅋㅋㅋ 나도 배고팠어! 맛집 가자가자~!',
          '음식 얘기하니까 배에서 꼬르륵... ㅋㅋ 뭐 먹을까?!',
        ],
      },
      {
        keywords: ['좋아', '사랑'],
        emotion: 'shy',
        responses: [
          'ㅋㅋㅋ 갑분싸 아니고 갑분러브?! 😅 근데... 고마워!',
          '아 ㅋㅋ 진심이야?! 나도... 뭐... 싫지는 않아! ㅋㅋ',
          '우왕 갑자기?! ㅋㅋㅋ 나 지금 얼굴 빨개지는 거 아니야?!',
        ],
      },
      {
        keywords: ['슬퍼', '우울', '힘들'],
        emotion: 'sad',
        responses: [
          '에에?! 누가 울려?! 내가 가서 PK 해줄까?! 😭',
          '힘들 때는 같이 게임 하면서 스트레스 풀자~! 내가 다 잡아줄게!',
          '야야 울지 마~! 내가 웃긴 영상 보내줄게! ㅋㅋ',
        ],
      },
      {
        keywords: ['뭐해', '심심'],
        emotion: 'excited',
        responses: [
          '심심해?! 그럼 같이 겜하자! 아니면 먹방 고?!',
          '나 지금 유튜브 보고 있었는데 ㅋㅋ 같이 볼래?!',
          '심심하면 안 돼! 인생은 짧고 할 건 많다구~!',
        ],
      },
    ],
  },
];

function getCustomCharacters(): AICharacter[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getDeletedIds(): string[] {
  try {
    const data = localStorage.getItem(DELETED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getCharacters(): AICharacter[] {
  const custom = getCustomCharacters();
  const deletedIds = getDeletedIds();
  const customIds = new Set(custom.map((c) => c.id));

  const base = defaultCharacters
    .filter((c) => !deletedIds.includes(c.id))
    .filter((c) => !customIds.has(c.id));

  return [...base, ...custom];
}

export function getCharacterById(id: string): AICharacter | undefined {
  return getCharacters().find((c) => c.id === id);
}

export function saveCharacter(character: AICharacter): void {
  const custom = getCustomCharacters();
  const idx = custom.findIndex((c) => c.id === character.id);
  if (idx >= 0) {
    custom[idx] = character;
  } else {
    custom.push(character);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));

  // Remove from deleted if it was there
  const deleted = getDeletedIds().filter((id) => id !== character.id);
  localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
}

export function deleteCharacter(id: string): void {
  const custom = getCustomCharacters().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));

  if (defaultCharacters.some((c) => c.id === id)) {
    const deleted = getDeletedIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  }
}

export function isDefaultCharacter(id: string): boolean {
  return defaultCharacters.some((c) => c.id === id);
}

// Keep backward compat export
export const characters = defaultCharacters;
