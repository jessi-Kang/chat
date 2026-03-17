import type { AICharacter, Emotion, ChatMessage } from '../types';

const fallbackResponses: Record<Emotion, string[]> = {
  neutral: ['그렇구나.', '음, 알겠어.', '그래그래.'],
  happy: ['ㅎㅎ 그렇지~!', '좋다좋다!', '재밌다!'],
  sad: ['그렇구나...', '마음이 아프네.', '괜찮아질 거야.'],
  angry: ['흥!', '그건 좀 아닌데...', '짜증나네.'],
  surprised: ['헐?!', '진짜?!', '대박!'],
  love: ['너 때문에 행복해.', '같이 있어서 좋아.', '너란 사람...'],
  shy: ['아... 그, 그래.', '뭐... 그런 거지.', '...고마워.'],
  excited: ['와아!! 대박!!', '미쳤다!! 너무 좋아!!', '레츠고오!!'],
};

function analyzeEmotion(text: string, character: AICharacter): { emotion: Emotion; responses: string[] } {
  const lowerText = text.toLowerCase();
  for (const pattern of character.responsePatterns) {
    if (pattern.keywords.some((kw) => lowerText.includes(kw))) {
      return { emotion: pattern.emotion, responses: pattern.responses };
    }
  }
  return {
    emotion: character.baseEmotion,
    responses: fallbackResponses[character.baseEmotion],
  };
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateResponse(
  userMessage: string,
  character: AICharacter,
  _history: ChatMessage[]
): Promise<{ text: string; emotion: Emotion }> {
  return new Promise((resolve) => {
    const { emotion, responses } = analyzeEmotion(userMessage, character);
    const text = pickRandom(responses);
    const delay = 600 + Math.random() * 1000;
    setTimeout(() => resolve({ text, emotion }), delay);
  });
}
