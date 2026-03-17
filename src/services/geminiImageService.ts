import type { Emotion } from '../types';

export type ImageStyle = 'realistic' | 'anime' | 'cartoon' | 'watercolor';

export const IMAGE_STYLES: { key: ImageStyle; label: string; description: string; prompt: string }[] = [
  {
    key: 'realistic',
    label: '실사',
    description: '실제 사진처럼 사실적인 스타일',
    prompt: 'photorealistic portrait, high quality, detailed, professional photography',
  },
  {
    key: 'anime',
    label: '아니메',
    description: '일본 애니메이션 스타일',
    prompt: 'anime style portrait, cel shaded, vibrant colors, manga art style',
  },
  {
    key: 'cartoon',
    label: '만화',
    description: '귀여운 카툰 스타일',
    prompt: 'cartoon style character, cute, colorful, digital illustration',
  },
  {
    key: 'watercolor',
    label: '수채화',
    description: '부드러운 수채화 느낌',
    prompt: 'watercolor painting style portrait, soft colors, artistic, painterly',
  },
];

const EMOTION_PROMPTS: Record<Emotion, string> = {
  neutral: 'neutral calm expression',
  happy: 'happy smiling expression, joyful',
  sad: 'sad melancholic expression, teary eyes',
  angry: 'angry fierce expression, furrowed brows',
  surprised: 'surprised shocked expression, wide eyes',
  love: 'loving gentle expression, warm gaze, hearts',
  shy: 'shy blushing expression, looking away',
  excited: 'excited enthusiastic expression, bright eyes',
};

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function generateCharacterImage(
  characterPrompt: string,
  style: ImageStyle,
  emotion: Emotion,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  const styleConfig = IMAGE_STYLES.find((s) => s.key === style);
  const emotionPrompt = EMOTION_PROMPTS[emotion];

  const fullPrompt = `Generate a character portrait image. Style: ${styleConfig?.prompt || ''}. Character: ${characterPrompt}. Expression: ${emotionPrompt}. Single character, bust shot, clean background, high quality.`;

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `이미지 생성 실패: ${response.status} ${(errorData as { error?: { message?: string } })?.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error('API 응답에 이미지 데이터가 없습니다.');
  }

  const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);
  if (!imagePart?.inlineData) {
    throw new Error('생성된 이미지를 찾을 수 없습니다.');
  }

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}
