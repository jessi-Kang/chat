import { useState, CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCharacterById } from '../data/characters';
import { useChat } from '../hooks/useChat';
import { usePersona } from '../context/PersonaContext';
import type { AICharacter, ChatMode } from '../types';
import ChatView from '../components/chat/ChatView';
import VisualNovelView from '../components/visual-novel/VisualNovelView';
import CharacterAvatar from '../components/CharacterAvatar';

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { persona } = usePersona();
  const [mode, setMode] = useState<ChatMode>('chat');

  const character = getCharacterById(id || '');
  if (!character) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>캐릭터를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  return <ChatRoomContent character={character} mode={mode} setMode={setMode} navigate={navigate} persona={persona} />;
}

function ChatRoomContent({
  character,
  mode,
  setMode,
  navigate,
  persona,
}: {
  character: AICharacter;
  mode: ChatMode;
  setMode: (m: ChatMode) => void;
  navigate: ReturnType<typeof useNavigate>;
  persona: ReturnType<typeof usePersona>['persona'];
}) {
  const { messages, currentEmotion, isTyping, sendMessage } = useChat(character);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ ...styles.header, background: character.color + '12' }}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ←
        </button>
        <div style={styles.headerInfo}>
          <CharacterAvatar character={character} emotion={currentEmotion} size={28} style={{ transition: 'transform 0.3s' }} />
          <div>
            <div style={styles.headerName}>{character.name}</div>
            <div style={styles.headerEmotion}>{getEmotionLabel(currentEmotion)}</div>
          </div>
        </div>
        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeBtn,
              ...(mode === 'chat' ? { ...styles.modeBtnActive, background: character.color, color: '#fff' } : {}),
            }}
            onClick={() => setMode('chat')}
          >
            채팅
          </button>
          <button
            style={{
              ...styles.modeBtn,
              ...(mode === 'visual-novel'
                ? { ...styles.modeBtnActive, background: character.color, color: '#fff' }
                : {}),
            }}
            onClick={() => setMode('visual-novel')}
          >
            미연시
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'chat' ? (
        <ChatView
          messages={messages}
          character={character}
          currentEmotion={currentEmotion}
          isTyping={isTyping}
          onSend={sendMessage}
          userAvatar={persona?.avatar || '😊'}
        />
      ) : (
        <VisualNovelView
          messages={messages}
          character={character}
          currentEmotion={currentEmotion}
          isTyping={isTyping}
          onSend={sendMessage}
        />
      )}
    </div>
  );
}

function getEmotionLabel(emotion: string): string {
  const labels: Record<string, string> = {
    neutral: '평온',
    happy: '기쁨',
    sad: '슬픔',
    angry: '화남',
    surprised: '놀람',
    love: '설렘',
    shy: '수줍음',
    excited: '신남',
  };
  return labels[emotion] || '평온';
}

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: 500,
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    gap: 8,
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    height: 60,
    flexShrink: 0,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    padding: '4px 8px',
    color: '#1A1A2E',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerEmoji: {
    fontSize: 28,
    transition: 'transform 0.3s',
  },
  headerName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1A1A2E',
  },
  headerEmotion: {
    fontSize: 11,
    color: '#8B95A5',
    fontWeight: 500,
  },
  modeToggle: {
    display: 'flex',
    background: '#F0F2F5',
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  modeBtn: {
    padding: '6px 12px',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    color: '#8B95A5',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modeBtnActive: {
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
};
