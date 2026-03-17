import { createContext, useContext, useCallback, ReactNode } from 'react';
import type { ChatMessage, ChatSession, Emotion } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ChatContextType {
  sessions: Record<string, ChatSession>;
  getSession: (characterId: string) => ChatSession | undefined;
  addMessage: (characterId: string, message: ChatMessage) => void;
  setEmotion: (characterId: string, emotion: Emotion) => void;
  initSession: (characterId: string, greeting: ChatMessage) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useLocalStorage<Record<string, ChatSession>>('chat-sessions', {});

  const getSession = useCallback(
    (characterId: string) => sessions[characterId],
    [sessions]
  );

  const initSession = useCallback(
    (characterId: string, greeting: ChatMessage) => {
      setSessions((prev: Record<string, ChatSession>) => {
        if (prev[characterId]) return prev;
        return {
          ...prev,
          [characterId]: {
            characterId,
            messages: [greeting],
            currentEmotion: greeting.emotion || 'neutral',
          },
        };
      });
    },
    [setSessions]
  );

  const addMessage = useCallback(
    (characterId: string, message: ChatMessage) => {
      setSessions((prev: Record<string, ChatSession>) => {
        const session = prev[characterId];
        if (!session) return prev;
        return {
          ...prev,
          [characterId]: {
            ...session,
            messages: [...session.messages, message],
            currentEmotion: message.emotion || session.currentEmotion,
          },
        };
      });
    },
    [setSessions]
  );

  const setEmotion = useCallback(
    (characterId: string, emotion: Emotion) => {
      setSessions((prev: Record<string, ChatSession>) => {
        const session = prev[characterId];
        if (!session) return prev;
        return { ...prev, [characterId]: { ...session, currentEmotion: emotion } };
      });
    },
    [setSessions]
  );

  return (
    <ChatContext.Provider value={{ sessions, getSession, addMessage, setEmotion, initSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
