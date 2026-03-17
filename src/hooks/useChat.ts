import { useState, useCallback, useEffect } from 'react';
import type { AICharacter, ChatMessage } from '../types';
import { useChatContext } from '../context/ChatContext';
import { generateResponse } from '../data/mockResponses';

export function useChat(character: AICharacter) {
  const { getSession, addMessage, initSession } = useChatContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const session = getSession(character.id);
    if (!session) {
      initSession(character.id, {
        id: `greeting-${character.id}`,
        sender: 'character',
        text: character.greeting,
        emotion: character.baseEmotion,
        timestamp: Date.now(),
      });
    }
  }, [character, getSession, initSession]);

  const session = getSession(character.id);
  const messages = session?.messages || [];
  const currentEmotion = session?.currentEmotion || character.baseEmotion;

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: Date.now(),
      };
      addMessage(character.id, userMsg);
      setIsTyping(true);

      const { text: responseText, emotion } = await generateResponse(text, character, messages);

      const charMsg: ChatMessage = {
        id: `char-${Date.now()}`,
        sender: 'character',
        text: responseText,
        emotion,
        timestamp: Date.now(),
      };
      addMessage(character.id, charMsg);
      setIsTyping(false);
    },
    [character, messages, addMessage]
  );

  return { messages, currentEmotion, isTyping, sendMessage };
}
