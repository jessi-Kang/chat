export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'love' | 'shy' | 'excited';

export interface AICharacter {
  id: string;
  name: string;
  personality: string;
  traits: string[];
  greeting: string;
  expressions: Record<Emotion, string>;
  baseEmotion: Emotion;
  color: string;
  bgGradient: string;
  responsePatterns: ResponsePattern[];
  imageExpressions?: Partial<Record<Emotion, string>>;
  useImageMode?: boolean;
}

export interface ResponsePattern {
  keywords: string[];
  emotion: Emotion;
  responses: string[];
}

export interface UserPersona {
  name: string;
  avatar: string;
  traits: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'character';
  text: string;
  emotion?: Emotion;
  timestamp: number;
}

export interface ChatSession {
  characterId: string;
  messages: ChatMessage[];
  currentEmotion: Emotion;
}

export type ChatMode = 'chat' | 'visual-novel';

export interface EmotionTheme {
  primary: string;
  background: string;
  gradient: string;
  accent: string;
}
