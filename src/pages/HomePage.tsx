import { useNavigate } from 'react-router-dom';
import { getCharacters } from '../data/characters';
import { usePersona } from '../context/PersonaContext';
import type { CSSProperties } from 'react';
import CharacterAvatar from '../components/CharacterAvatar';

export default function HomePage() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const characters = getCharacters();

  const handleCharacterClick = (id: string) => {
    if (!persona) {
      navigate(`/persona?redirect=/chat/${id}`);
    } else {
      navigate(`/chat/${id}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>대화 상대를 선택하세요</h1>
        <p style={styles.subtitle}>AI 캐릭터와 특별한 대화를 시작해보세요</p>
      </div>

      {persona && (
        <div style={styles.personaBanner} onClick={() => navigate('/persona')}>
          <span style={styles.personaAvatar}>{persona.avatar}</span>
          <div>
            <div style={styles.personaName}>{persona.name}</div>
            <div style={styles.personaTraits}>{persona.traits.join(' · ')}</div>
          </div>
          <span style={styles.editIcon}>✏️</span>
        </div>
      )}

      {!persona && (
        <div style={styles.setupBanner} onClick={() => navigate('/persona')}>
          <span style={{ fontSize: 24 }}>👤</span>
          <span style={styles.setupText}>먼저 내 프로필을 설정해주세요</span>
          <span style={styles.arrow}>→</span>
        </div>
      )}

      <div style={styles.grid}>
        {characters.map((char) => (
          <div
            key={char.id}
            style={{ ...styles.card, borderColor: char.color + '40' }}
            onClick={() => handleCharacterClick(char.id)}
          >
            <div style={{ ...styles.cardGlow, background: char.color + '15' }} />
            <div style={styles.expression}>
              <CharacterAvatar character={char} emotion={char.baseEmotion} size={48} />
            </div>
            <div style={styles.charName}>{char.name}</div>
            <div style={styles.charPersonality}>{char.personality}</div>
            <div style={styles.traitRow}>
              {char.traits.map((t) => (
                <span key={t} style={{ ...styles.trait, background: char.color + '20', color: char.color }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.adminLink} onClick={() => navigate('/admin')}>
        <span>관리자</span>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FAFBFF 0%, #F0F2FF 100%)',
    padding: '20px 16px 40px',
    maxWidth: 500,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1A1A2E',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B95A5',
    margin: 0,
  },
  personaBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#fff',
    borderRadius: 16,
    padding: '14px 16px',
    marginBottom: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  personaAvatar: {
    fontSize: 32,
  },
  personaName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1A1A2E',
  },
  personaTraits: {
    fontSize: 12,
    color: '#8B95A5',
    marginTop: 2,
  },
  editIcon: {
    marginLeft: 'auto',
    fontSize: 16,
  },
  setupBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 16,
    padding: '16px 20px',
    marginBottom: 20,
    cursor: 'pointer',
    color: '#fff',
  },
  setupText: {
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 14,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px 14px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 80,
    borderRadius: '50%',
    filter: 'blur(20px)',
  },
  expression: {
    fontSize: 48,
    marginBottom: 10,
    position: 'relative',
  },
  charName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1A1A2E',
    marginBottom: 4,
    position: 'relative',
  },
  charPersonality: {
    fontSize: 11,
    color: '#8B95A5',
    marginBottom: 10,
    lineHeight: 1.4,
    position: 'relative',
  },
  traitRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    position: 'relative',
  },
  trait: {
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 10,
    fontWeight: 500,
  },
  adminLink: {
    textAlign: 'center',
    marginTop: 24,
    padding: '12px',
    color: '#B0B8C4',
    fontSize: 13,
    cursor: 'pointer',
  },
};
