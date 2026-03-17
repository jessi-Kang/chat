import { useState, useRef, useEffect, CSSProperties } from 'react';
import type { ChatMessage, AICharacter, Emotion } from '../../types';
import { emotionThemes } from '../../utils/emotionColors';
import CharacterAvatar from '../CharacterAvatar';

interface Props {
  messages: ChatMessage[];
  character: AICharacter;
  currentEmotion: Emotion;
  isTyping: boolean;
  onSend: (text: string) => void;
  userAvatar: string;
}

export default function ChatView({ messages, character, currentEmotion, isTyping, onSend, userAvatar }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const theme = emotionThemes[currentEmotion];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div style={{ ...styles.container, background: theme.gradient }}>
      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div key={msg.id} style={msg.sender === 'user' ? styles.userRow : styles.charRow}>
            {msg.sender === 'character' && (
              <div style={{ ...styles.avatar, background: character.useImageMode ? 'transparent' : character.color + '20' }}>
                <CharacterAvatar character={character} emotion={msg.emotion || character.baseEmotion} size={character.useImageMode ? 36 : 20} />
              </div>
            )}
            <div style={styles.bubbleCol}>
              {msg.sender === 'character' && (
                <span style={styles.senderName}>{character.name}</span>
              )}
              <div
                style={
                  msg.sender === 'user'
                    ? { ...styles.userBubble, background: theme.primary }
                    : { ...styles.charBubble, borderColor: character.color + '30' }
                }
              >
                {msg.text}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div style={{ ...styles.avatar, background: '#E8ECF1' }}>{userAvatar}</div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={styles.charRow}>
            <div style={{ ...styles.avatar, background: character.useImageMode ? 'transparent' : character.color + '20' }}>
              <CharacterAvatar character={character} emotion={currentEmotion} size={character.useImageMode ? 36 : 20} />
            </div>
            <div style={styles.bubbleCol}>
              <span style={styles.senderName}>{character.name}</span>
              <div style={{ ...styles.charBubble, borderColor: character.color + '30' }}>
                <span style={styles.typing}>
                  <span style={styles.dot1}>·</span>
                  <span style={styles.dot2}>·</span>
                  <span style={styles.dot3}>·</span>
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          style={styles.textInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
        />
        <button
          style={{ ...styles.sendBtn, background: theme.primary, opacity: input.trim() ? 1 : 0.5 }}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 60px)',
    transition: 'background 0.5s',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  charRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: '85%',
  },
  userRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  bubbleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  senderName: {
    fontSize: 11,
    color: '#8B95A5',
    fontWeight: 600,
    marginLeft: 4,
  },
  charBubble: {
    background: '#fff',
    borderRadius: '4px 18px 18px 18px',
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
    color: '#1A1A2E',
    border: '1px solid',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  userBubble: {
    color: '#fff',
    borderRadius: '18px 4px 18px 18px',
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
  },
  typing: {
    display: 'flex',
    gap: 3,
    fontSize: 20,
    fontWeight: 700,
    color: '#8B95A5',
  },
  dot1: { animation: 'bounce 1.2s infinite 0s' },
  dot2: { animation: 'bounce 1.2s infinite 0.2s' },
  dot3: { animation: 'bounce 1.2s infinite 0.4s' },
  inputBar: {
    display: 'flex',
    gap: 8,
    padding: '12px 12px 24px',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
  },
  textInput: {
    flex: 1,
    padding: '12px 16px',
    fontSize: 15,
    border: '1.5px solid #E8ECF1',
    borderRadius: 24,
    outline: 'none',
    background: '#fff',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    border: 'none',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
};
