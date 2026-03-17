import type { Emotion, EmotionTheme } from '../types';

export const emotionThemes: Record<Emotion, EmotionTheme> = {
  neutral: {
    primary: '#8B95A5',
    background: '#F5F7FA',
    gradient: 'linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 100%)',
    accent: '#A0AAB8',
  },
  happy: {
    primary: '#FFB347',
    background: '#FFF8E8',
    gradient: 'linear-gradient(135deg, #FFF8E8 0%, #FFE8B8 100%)',
    accent: '#FFD700',
  },
  sad: {
    primary: '#7BA7CC',
    background: '#EDF3F8',
    gradient: 'linear-gradient(135deg, #EDF3F8 0%, #D4E4F2 100%)',
    accent: '#5B8FB9',
  },
  angry: {
    primary: '#E85D5D',
    background: '#FDEAEA',
    gradient: 'linear-gradient(135deg, #FDEAEA 0%, #F5C6C6 100%)',
    accent: '#D94444',
  },
  surprised: {
    primary: '#B07FDB',
    background: '#F3EDFA',
    gradient: 'linear-gradient(135deg, #F3EDFA 0%, #E4D5F5 100%)',
    accent: '#9B59D6',
  },
  love: {
    primary: '#FF7EB3',
    background: '#FFF0F5',
    gradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E8 100%)',
    accent: '#FF5694',
  },
  shy: {
    primary: '#FFB5C5',
    background: '#FFF5F8',
    gradient: 'linear-gradient(135deg, #FFF5F8 0%, #FFE0E8 100%)',
    accent: '#FF8FAB',
  },
  excited: {
    primary: '#4CD964',
    background: '#EDFFF0',
    gradient: 'linear-gradient(135deg, #EDFFF0 0%, #C8F7D0 100%)',
    accent: '#34C759',
  },
};

export const emotionParticles: Record<Emotion, string> = {
  neutral: '·',
  happy: '✦',
  sad: '💧',
  angry: '💢',
  surprised: '⭐',
  love: '💕',
  shy: '🌸',
  excited: '⚡',
};
