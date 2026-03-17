import { useState, useEffect, useRef, CSSProperties } from 'react';
import type { ChatMessage, AICharacter, Emotion } from '../../types';
import { emotionThemes, emotionParticles } from '../../utils/emotionColors';
import CharacterAvatar from '../CharacterAvatar';

interface Props {
  messages: ChatMessage[];
  character: AICharacter;
  currentEmotion: Emotion;
  isTyping: boolean;
  onSend: (text: string) => void;
}

const quickReplies: Record<string, string[]> = {
  default: ['안녕!', '뭐해?', '좋아해!', '고마워'],
  happy: ['나도 기뻐!', '같이 놀자!', '최고야!', 'ㅎㅎ'],
  sad: ['괜찮아?', '힘내!', '안아줄까?', '웃어봐'],
  angry: ['화 풀어', '미안해', '왜 그래?', '진정해'],
  love: ['나도 좋아', '설레어', '계속 봐줘', '고마워'],
  shy: ['귀여워', '왜 그래?', 'ㅎㅎ', '솔직해져봐'],
  surprised: ['진짜?!', '대박!', '어떻게?', '와!'],
  excited: ['나도!', '가자!', '신난다!', '대박!'],
};

export default function VisualNovelView({ messages, character, currentEmotion, isTyping, onSend }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const theme = emotionThemes[currentEmotion];
  const lastCharMessage = [...messages].reverse().find((m) => m.sender === 'character');
  const fullText = lastCharMessage?.text || character.greeting;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setIsRevealing(true);
    setDisplayedText('');
    let i = 0;
    const reveal = () => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(reveal, 30 + Math.random() * 20);
      } else {
        setIsRevealing(false);
      }
    };
    reveal();
    return () => clearTimeout(timerRef.current);
  }, [fullText]);

  const skipReveal = () => {
    if (isRevealing) {
      clearTimeout(timerRef.current);
      setDisplayedText(fullText);
      setIsRevealing(false);
    }
  };

  const replies = quickReplies[currentEmotion] || quickReplies.default;

  const bgGradients: Record<Emotion, string> = {
    neutral: 'linear-gradient(180deg, #2C3E50 0%, #4A6274 40%, #7B8FA1 100%)',
    happy: 'linear-gradient(180deg, #FF9A56 0%, #FFB88C 40%, #FFD4A8 100%)',
    sad: 'linear-gradient(180deg, #2C3E6B 0%, #4A6290 40%, #7B8FAA 100%)',
    angry: 'linear-gradient(180deg, #8B2252 0%, #B33A5E 40%, #D4546E 100%)',
    surprised: 'linear-gradient(180deg, #4A0E8F 0%, #7B3FBF 40%, #A86FDF 100%)',
    love: 'linear-gradient(180deg, #FF6B8A 0%, #FF8FA3 40%, #FFB3C1 100%)',
    shy: 'linear-gradient(180deg, #D4688E 0%, #E88FAD 40%, #F5B8CC 100%)',
    excited: 'linear-gradient(180deg, #1DB954 0%, #4AD97E 40%, #7DF0A8 100%)',
  };

  return (
    <div style={{ ...styles.container, background: bgGradients[currentEmotion] }} onClick={skipReveal}>
      {/* Floating particles */}
      <div style={styles.particles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.particle,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              fontSize: 12 + Math.random() * 14,
              opacity: 0.4 + Math.random() * 0.3,
            }}
          >
            {emotionParticles[currentEmotion]}
          </span>
        ))}
      </div>

      {/* Character portrait */}
      <div style={styles.portraitArea}>
        <div
          style={{
            ...styles.portrait,
            filter: isTyping ? 'brightness(0.8)' : 'brightness(1)',
          }}
        >
          <div style={styles.portraitEmoji}>
            <CharacterAvatar
              character={character}
              emotion={currentEmotion}
              size={character.useImageMode ? 200 : 80}
            />
          </div>
          <div style={{ ...styles.emotionGlow, background: theme.primary + '30' }} />
        </div>
      </div>

      {/* Dialogue box */}
      <div style={styles.dialogueArea}>
        <div style={{ ...styles.dialogueBox, borderColor: character.color + '60' }}>
          <div style={styles.nameTag}>
            <span style={{ ...styles.nameText, color: character.color }}>{character.name}</span>
            <span style={styles.emotionTag}>
              <CharacterAvatar character={character} emotion={currentEmotion} size={14} />
            </span>
          </div>
          <div style={styles.dialogueText}>
            {isTyping ? (
              <span style={styles.typingText}>...</span>
            ) : (
              <>
                {displayedText}
                {isRevealing && <span style={styles.cursor}>▌</span>}
              </>
            )}
          </div>
        </div>

        {/* Choice panel */}
        {!isTyping && !isRevealing && (
          <div style={styles.choicePanel}>
            {showInput ? (
              <div style={styles.customInputRow}>
                <input
                  style={styles.customInput}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInput.trim()) {
                      onSend(customInput.trim());
                      setCustomInput('');
                      setShowInput(false);
                    }
                  }}
                  placeholder="직접 입력..."
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  style={{ ...styles.customSendBtn, background: theme.primary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customInput.trim()) {
                      onSend(customInput.trim());
                      setCustomInput('');
                      setShowInput(false);
                    }
                  }}
                >
                  ▶
                </button>
              </div>
            ) : (
              <>
                <div style={styles.choiceGrid}>
                  {replies.map((r, i) => (
                    <button
                      key={i}
                      style={{
                        ...styles.choiceBtn,
                        borderColor: theme.primary + '60',
                        animationDelay: `${i * 0.08}s`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSend(r);
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  style={styles.freeInputBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInput(true);
                  }}
                >
                  ✏️ 직접 입력하기
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.8s',
    cursor: 'pointer',
    minHeight: 0,
  },
  particles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    bottom: -20,
    animation: 'floatUp 4s infinite ease-out',
  },
  portraitArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '35%',
  },
  portrait: {
    position: 'relative',
    transition: 'filter 0.3s, transform 0.3s',
  },
  portraitEmoji: {
    fontSize: 80,
    textShadow: '0 8px 24px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s',
    animation: 'breathe 3s infinite ease-in-out',
  },
  emotionGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 160,
    height: 160,
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: -1,
  },
  dialogueArea: {
    padding: '0 12px 16px',
    marginTop: 'auto',
    position: 'relative',
    zIndex: 2,
  },
  dialogueBox: {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    padding: '16px 20px 18px',
    border: '1.5px solid',
    minHeight: 80,
  },
  nameTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 15,
    fontWeight: 700,
  },
  emotionTag: {
    fontSize: 14,
  },
  dialogueText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#EAEAEA',
    minHeight: 24,
  },
  typingText: {
    color: '#aaa',
    animation: 'blink 1s infinite',
  },
  cursor: {
    color: '#FFD700',
    animation: 'blink 0.8s infinite',
    marginLeft: 2,
  },
  choicePanel: {
    marginTop: 12,
    animation: 'fadeInUp 0.3s ease-out',
  },
  choiceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginBottom: 8,
  },
  choiceBtn: {
    padding: '10px 14px',
    borderRadius: 14,
    border: '1.5px solid',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s',
    animation: 'fadeInUp 0.3s ease-out both',
  },
  freeInputBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    cursor: 'pointer',
  },
  customInputRow: {
    display: 'flex',
    gap: 8,
  },
  customInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 14,
    border: '1.5px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  customSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: 'none',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
  },
};
