import { useState, CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';

const avatarOptions = ['😊', '😎', '🤗', '🦊', '🐱', '🐰', '🌸', '⭐', '🎮', '🎨', '🎵', '🌙'];
const traitOptions = ['활발한', '내성적인', '다정한', '유머러스한', '진지한', '호기심 많은', '감성적인', '논리적인', '용감한', '신중한'];

export default function PersonaSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { persona, setPersona } = usePersona();

  const [name, setName] = useState(persona?.name || '');
  const [avatar, setAvatar] = useState(persona?.avatar || '😊');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(persona?.traits || []);

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : prev.length < 3 ? [...prev, trait] : prev
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    setPersona({ name: name.trim(), avatar, traits: selectedTraits });
    navigate(redirect);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
      </div>

      <h1 style={styles.title}>나의 프로필</h1>
      <p style={styles.subtitle}>캐릭터와 대화할 때 사용할 프로필을 만들어주세요</p>

      <div style={styles.section}>
        <label style={styles.label}>아바타</label>
        <div style={styles.avatarGrid}>
          {avatarOptions.map((a) => (
            <div
              key={a}
              style={{
                ...styles.avatarItem,
                ...(avatar === a ? styles.avatarSelected : {}),
              }}
              onClick={() => setAvatar(a)}
            >
              {a}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>이름</label>
        <input
          style={styles.input}
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>성격 (최대 3개)</label>
        <div style={styles.traitGrid}>
          {traitOptions.map((t) => (
            <div
              key={t}
              style={{
                ...styles.traitItem,
                ...(selectedTraits.includes(t) ? styles.traitSelected : {}),
              }}
              onClick={() => toggleTrait(t)}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.preview}>
        <span style={{ fontSize: 48 }}>{avatar}</span>
        <div style={styles.previewName}>{name || '이름을 입력하세요'}</div>
        <div style={styles.previewTraits}>
          {selectedTraits.length > 0 ? selectedTraits.join(' · ') : '성격을 선택하세요'}
        </div>
      </div>

      <button
        style={{
          ...styles.saveBtn,
          opacity: name.trim() ? 1 : 0.5,
        }}
        onClick={handleSave}
        disabled={!name.trim()}
      >
        저장하기
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FAFBFF 0%, #F0F2FF 100%)',
    padding: '16px 20px 40px',
    maxWidth: 500,
    margin: '0 auto',
  },
  topBar: {
    marginBottom: 8,
  },
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
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B95A5',
    margin: '0 0 28px',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#1A1A2E',
    marginBottom: 10,
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 10,
  },
  avatarItem: {
    fontSize: 28,
    textAlign: 'center',
    padding: '10px 0',
    borderRadius: 14,
    background: '#fff',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  avatarSelected: {
    border: '2px solid #5B7FFF',
    background: '#EEF2FF',
    transform: 'scale(1.1)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 15,
    border: '2px solid #E8ECF1',
    borderRadius: 14,
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  traitGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitItem: {
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    background: '#fff',
    border: '1.5px solid #E8ECF1',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#555',
    transition: 'all 0.2s',
  },
  traitSelected: {
    background: '#5B7FFF',
    color: '#fff',
    borderColor: '#5B7FFF',
  },
  preview: {
    textAlign: 'center',
    background: '#fff',
    borderRadius: 20,
    padding: '24px 20px',
    marginBottom: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  previewName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1A1A2E',
    marginTop: 8,
  },
  previewTraits: {
    fontSize: 13,
    color: '#8B95A5',
    marginTop: 4,
  },
  saveBtn: {
    width: '100%',
    padding: '16px',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #5B7FFF 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};
