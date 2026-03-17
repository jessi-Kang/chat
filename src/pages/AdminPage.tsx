import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, deleteCharacter } from '../data/characters';
import type { AICharacter } from '../types';
import CharacterAvatar from '../components/CharacterAvatar';

export default function AdminPage() {
  const navigate = useNavigate();
  const [chars, setChars] = useState<AICharacter[]>(() => getCharacters());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteCharacter(id);
    setChars(getCharacters());
    setConfirmDelete(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← 홈으로
        </button>
      </div>

      <h1 style={styles.title}>캐릭터 관리</h1>
      <p style={styles.subtitle}>캐릭터를 추가, 수정, 삭제할 수 있습니다</p>

      <button style={styles.addBtn} onClick={() => navigate('/admin/new')}>
        + 새 캐릭터 추가
      </button>

      <button style={styles.imageGenBtn} onClick={() => navigate('/image-generator')}>
        이미지 생성
      </button>

      <div style={styles.list}>
        {chars.map((char) => (
          <div key={char.id} style={styles.card}>
            <div style={{ ...styles.cardAvatar, background: char.useImageMode ? 'transparent' : char.color + '20' }}>
              <CharacterAvatar character={char} emotion={char.baseEmotion} size={char.useImageMode ? 48 : 26} />
            </div>
            <div style={styles.cardInfo}>
              <div style={styles.cardName}>{char.name}</div>
              <div style={styles.cardPersonality}>{char.personality}</div>
              <div style={styles.cardTraits}>
                {char.traits.map((t) => (
                  <span key={t} style={{ ...styles.trait, background: char.color + '20', color: char.color }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={styles.cardMeta}>
                응답 패턴 {char.responsePatterns.length}개 · {char.baseEmotion}
              </div>
            </div>
            <div style={styles.cardActions}>
              <button
                style={styles.editBtn}
                onClick={() => navigate(`/admin/${char.id}`)}
              >
                편집
              </button>
              {confirmDelete === char.id ? (
                <div style={styles.confirmRow}>
                  <button style={styles.confirmYes} onClick={() => handleDelete(char.id)}>
                    삭제
                  </button>
                  <button style={styles.confirmNo} onClick={() => setConfirmDelete(null)}>
                    취소
                  </button>
                </div>
              ) : (
                <button style={styles.deleteBtn} onClick={() => setConfirmDelete(char.id)}>
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {chars.length === 0 && (
        <div style={styles.empty}>
          <p>등록된 캐릭터가 없습니다.</p>
          <p>새 캐릭터를 추가해보세요!</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FAFBFF 0%, #F0F2FF 100%)',
    padding: '16px 16px 40px',
    maxWidth: 500,
    margin: '0 auto',
  },
  topBar: { marginBottom: 8 },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: 15,
    color: '#5B7FFF',
    cursor: 'pointer',
    padding: '8px 0',
    fontWeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1A1A2E',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B95A5',
    margin: '0 0 20px',
  },
  addBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #5B7FFF 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    marginBottom: 8,
  },
  imageGenBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#5B7FFF',
    background: '#EEF2FF',
    border: '1.5px solid #5B7FFF',
    borderRadius: 14,
    cursor: 'pointer',
    marginBottom: 20,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '14px 16px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1A1A2E',
  },
  cardPersonality: {
    fontSize: 12,
    color: '#8B95A5',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardTraits: {
    display: 'flex',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  trait: {
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 8,
    fontWeight: 500,
  },
  cardMeta: {
    fontSize: 10,
    color: '#B0B8C4',
    marginTop: 6,
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flexShrink: 0,
  },
  editBtn: {
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: '#5B7FFF',
    background: '#EEF2FF',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: '#E85D5D',
    background: '#FDEAEA',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  confirmRow: {
    display: 'flex',
    gap: 4,
  },
  confirmYes: {
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    background: '#E85D5D',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  confirmNo: {
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: '#8B95A5',
    background: '#F0F2F5',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#8B95A5',
    fontSize: 14,
  },
};
