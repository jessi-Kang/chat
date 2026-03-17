import { useState, CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCharacterById, saveCharacter, getCharacters } from '../data/characters';
import type { AICharacter, Emotion, ResponsePattern } from '../types';

const EMOTIONS: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'love', 'shy', 'excited'];
const EMOTION_LABELS: Record<Emotion, string> = {
  neutral: '평온',
  happy: '기쁨',
  sad: '슬픔',
  angry: '화남',
  surprised: '놀람',
  love: '설렘',
  shy: '수줍음',
  excited: '신남',
};

const GRADIENT_PRESETS = [
  { label: '핑크', value: 'linear-gradient(135deg, #FFE4E8 0%, #FFF0F3 50%, #FFE8EC 100%)' },
  { label: '블루', value: 'linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 50%, #E5ECFF 100%)' },
  { label: '레드', value: 'linear-gradient(135deg, #FFE5E5 0%, #FFF2F2 50%, #FFE8E8 100%)' },
  { label: '퍼플', value: 'linear-gradient(135deg, #F3E8FF 0%, #FBF5FF 50%, #F0E4FF 100%)' },
  { label: '그린', value: 'linear-gradient(135deg, #E5FFF3 0%, #F0FFF8 50%, #E8FFEF 100%)' },
  { label: '옐로', value: 'linear-gradient(135deg, #FFF8E0 0%, #FFFDF0 50%, #FFF6D6 100%)' },
  { label: '오렌지', value: 'linear-gradient(135deg, #FFE8D6 0%, #FFF2EB 50%, #FFEADC 100%)' },
  { label: '시안', value: 'linear-gradient(135deg, #E0F7FA 0%, #F0FBFC 50%, #E5F9FC 100%)' },
];

function createEmptyCharacter(): AICharacter {
  return {
    id: '',
    name: '',
    personality: '',
    traits: [],
    greeting: '',
    baseEmotion: 'neutral',
    color: '#5B7FFF',
    bgGradient: GRADIENT_PRESETS[1].value,
    expressions: {
      neutral: '😐',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      love: '🥰',
      shy: '😳',
      excited: '🤩',
    },
    responsePatterns: [],
  };
}

export default function AdminCharacterFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== 'new';

  const [char, setChar] = useState<AICharacter>(() => {
    if (isEdit) {
      const existing = getCharacterById(id!);
      return existing ? { ...existing } : createEmptyCharacter();
    }
    return createEmptyCharacter();
  });

  const [traitInput, setTraitInput] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<string>('basic');

  const update = <K extends keyof AICharacter>(key: K, value: AICharacter[K]) => {
    setChar((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!char.id.trim()) return setError('ID를 입력해주세요');
    if (!char.name.trim()) return setError('이름을 입력해주세요');
    if (!char.personality.trim()) return setError('성격 설명을 입력해주세요');
    if (!char.greeting.trim()) return setError('인사말을 입력해주세요');

    if (!isEdit) {
      const existing = getCharacters();
      if (existing.some((c) => c.id === char.id.trim())) {
        return setError('이미 존재하는 ID입니다');
      }
    }

    saveCharacter({ ...char, id: char.id.trim() });
    navigate('/admin');
  };

  const addTrait = () => {
    if (traitInput.trim() && char.traits.length < 5) {
      update('traits', [...char.traits, traitInput.trim()]);
      setTraitInput('');
    }
  };

  const removeTrait = (idx: number) => {
    update('traits', char.traits.filter((_, i) => i !== idx));
  };

  const updateExpression = (emotion: Emotion, value: string) => {
    update('expressions', { ...char.expressions, [emotion]: value });
  };

  const addPattern = () => {
    update('responsePatterns', [
      ...char.responsePatterns,
      { keywords: [''], emotion: 'neutral' as Emotion, responses: [''] },
    ]);
  };

  const removePattern = (idx: number) => {
    update('responsePatterns', char.responsePatterns.filter((_, i) => i !== idx));
  };

  const updatePattern = (idx: number, patch: Partial<ResponsePattern>) => {
    const patterns = [...char.responsePatterns];
    patterns[idx] = { ...patterns[idx], ...patch };
    update('responsePatterns', patterns);
  };

  const sections = [
    { key: 'basic', label: '기본 정보' },
    { key: 'style', label: '스타일' },
    { key: 'expressions', label: '표정' },
    { key: 'traits', label: '성격' },
    { key: 'patterns', label: '응답 패턴' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>
          ← 목록으로
        </button>
      </div>

      <h1 style={styles.title}>{isEdit ? '캐릭터 편집' : '새 캐릭터'}</h1>

      {/* Preview card */}
      <div style={{ ...styles.preview, borderColor: char.color + '40' }}>
        <div style={{ ...styles.previewGlow, background: char.color + '15' }} />
        <span style={styles.previewEmoji}>{char.expressions[char.baseEmotion]}</span>
        <div style={styles.previewName}>{char.name || '이름'}</div>
        <div style={styles.previewPersonality}>{char.personality || '성격 설명'}</div>
      </div>

      {/* Section tabs */}
      <div style={styles.tabs}>
        {sections.map((s) => (
          <button
            key={s.key}
            style={{
              ...styles.tab,
              ...(activeSection === s.key ? { background: '#5B7FFF', color: '#fff' } : {}),
            }}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Basic info section */}
      {activeSection === 'basic' && (
        <div style={styles.section}>
          <label style={styles.label}>ID (영문, 수정 불가)</label>
          <input
            style={{ ...styles.input, opacity: isEdit ? 0.6 : 1 }}
            value={char.id}
            onChange={(e) => update('id', e.target.value.replace(/[^a-z0-9-_]/g, ''))}
            placeholder="예: my-character"
            disabled={isEdit}
          />

          <label style={styles.label}>이름</label>
          <input
            style={styles.input}
            value={char.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="캐릭터 이름"
            maxLength={20}
          />

          <label style={styles.label}>성격 설명</label>
          <input
            style={styles.input}
            value={char.personality}
            onChange={(e) => update('personality', e.target.value)}
            placeholder="한 줄로 캐릭터를 설명해주세요"
            maxLength={50}
          />

          <label style={styles.label}>기본 감정</label>
          <div style={styles.emotionGrid}>
            {EMOTIONS.map((em) => (
              <button
                key={em}
                style={{
                  ...styles.emotionBtn,
                  ...(char.baseEmotion === em ? { background: '#5B7FFF', color: '#fff' } : {}),
                }}
                onClick={() => update('baseEmotion', em)}
              >
                {EMOTION_LABELS[em]}
              </button>
            ))}
          </div>

          <label style={styles.label}>인사말</label>
          <textarea
            style={styles.textarea}
            value={char.greeting}
            onChange={(e) => update('greeting', e.target.value)}
            placeholder="캐릭터가 처음 하는 인사말"
            rows={3}
          />
        </div>
      )}

      {/* Style section */}
      {activeSection === 'style' && (
        <div style={styles.section}>
          <label style={styles.label}>테마 색상</label>
          <div style={styles.colorRow}>
            <input
              type="color"
              value={char.color}
              onChange={(e) => update('color', e.target.value)}
              style={styles.colorPicker}
            />
            <input
              style={{ ...styles.input, flex: 1 }}
              value={char.color}
              onChange={(e) => update('color', e.target.value)}
              placeholder="#FF9AA2"
            />
          </div>

          <label style={styles.label}>배경 그라데이션</label>
          <div style={styles.gradientGrid}>
            {GRADIENT_PRESETS.map((g) => (
              <div
                key={g.label}
                style={{
                  ...styles.gradientItem,
                  background: g.value,
                  border: char.bgGradient === g.value ? '3px solid #5B7FFF' : '3px solid transparent',
                }}
                onClick={() => update('bgGradient', g.value)}
              >
                <span style={styles.gradientLabel}>{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expressions section */}
      {activeSection === 'expressions' && (
        <div style={styles.section}>
          <p style={styles.hint}>각 감정에 맞는 이모지를 입력하세요</p>
          <div style={styles.expressionList}>
            {EMOTIONS.map((em) => (
              <div key={em} style={styles.expressionRow}>
                <span style={styles.expressionLabel}>{EMOTION_LABELS[em]}</span>
                <input
                  style={styles.expressionInput}
                  value={char.expressions[em]}
                  onChange={(e) => updateExpression(em, e.target.value)}
                  maxLength={4}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traits section */}
      {activeSection === 'traits' && (
        <div style={styles.section}>
          <div style={styles.traitInputRow}>
            <input
              style={{ ...styles.input, flex: 1 }}
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTrait()}
              placeholder="성격 특성 추가 (최대 5개)"
              maxLength={10}
            />
            <button style={styles.smallBtn} onClick={addTrait} disabled={char.traits.length >= 5}>
              추가
            </button>
          </div>
          <div style={styles.traitList}>
            {char.traits.map((t, i) => (
              <div key={i} style={{ ...styles.traitTag, background: char.color + '20', color: char.color }}>
                {t}
                <button style={styles.traitRemove} onClick={() => removeTrait(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response patterns section */}
      {activeSection === 'patterns' && (
        <div style={styles.section}>
          <p style={styles.hint}>키워드를 감지하면 해당 감정과 응답으로 반응합니다</p>

          {char.responsePatterns.map((pattern, pi) => (
            <div key={pi} style={styles.patternCard}>
              <div style={styles.patternHeader}>
                <span style={styles.patternTitle}>패턴 #{pi + 1}</span>
                <button style={styles.removePatternBtn} onClick={() => removePattern(pi)}>
                  삭제
                </button>
              </div>

              <label style={styles.smallLabel}>감정</label>
              <select
                style={styles.select}
                value={pattern.emotion}
                onChange={(e) => updatePattern(pi, { emotion: e.target.value as Emotion })}
              >
                {EMOTIONS.map((em) => (
                  <option key={em} value={em}>
                    {EMOTION_LABELS[em]}
                  </option>
                ))}
              </select>

              <label style={styles.smallLabel}>키워드 (쉼표로 구분)</label>
              <input
                style={styles.input}
                value={pattern.keywords.join(', ')}
                onChange={(e) =>
                  updatePattern(pi, {
                    keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                  })
                }
                placeholder="안녕, 하이, 반가워"
              />

              <label style={styles.smallLabel}>응답 (줄바꿈으로 구분)</label>
              <textarea
                style={styles.textarea}
                value={pattern.responses.join('\n')}
                onChange={(e) =>
                  updatePattern(pi, {
                    responses: e.target.value.split('\n').filter(Boolean),
                  })
                }
                placeholder={"응답 1\n응답 2\n응답 3"}
                rows={4}
              />
            </div>
          ))}

          <button style={styles.addPatternBtn} onClick={addPattern}>
            + 응답 패턴 추가
          </button>
        </div>
      )}

      {/* Save / Cancel */}
      <div style={styles.bottomActions}>
        <button style={styles.cancelBtn} onClick={() => navigate('/admin')}>
          취소
        </button>
        <button style={styles.saveBtn} onClick={handleSave}>
          저장하기
        </button>
      </div>
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
    fontSize: 22,
    fontWeight: 700,
    color: '#1A1A2E',
    margin: '0 0 16px',
  },
  preview: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px',
    textAlign: 'center',
    border: '2px solid',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  previewGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 60,
    borderRadius: '50%',
    filter: 'blur(20px)',
  },
  previewEmoji: { fontSize: 40, position: 'relative' },
  previewName: { fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginTop: 6, position: 'relative' },
  previewPersonality: { fontSize: 12, color: '#8B95A5', marginTop: 2, position: 'relative' },
  tabs: {
    display: 'flex',
    gap: 6,
    marginBottom: 16,
    overflowX: 'auto',
    flexWrap: 'nowrap',
  },
  tab: {
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    color: '#8B95A5',
    background: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  error: {
    background: '#FDEAEA',
    color: '#E85D5D',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
    fontWeight: 500,
  },
  section: {
    background: '#fff',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#1A1A2E',
    marginBottom: 6,
    marginTop: 14,
  },
  smallLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    marginBottom: 4,
    marginTop: 10,
  },
  hint: {
    fontSize: 12,
    color: '#8B95A5',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1.5px solid #E8ECF1',
    borderRadius: 10,
    outline: 'none',
    background: '#FAFBFF',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1.5px solid #E8ECF1',
    borderRadius: 10,
    outline: 'none',
    background: '#FAFBFF',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1.5px solid #E8ECF1',
    borderRadius: 10,
    outline: 'none',
    background: '#FAFBFF',
    boxSizing: 'border-box' as const,
  },
  emotionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
  },
  emotionBtn: {
    padding: '8px 4px',
    borderRadius: 10,
    border: '1.5px solid #E8ECF1',
    fontSize: 12,
    fontWeight: 500,
    color: '#555',
    background: '#FAFBFF',
    cursor: 'pointer',
  },
  colorRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  colorPicker: {
    width: 44,
    height: 44,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    padding: 0,
  },
  gradientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
  },
  gradientItem: {
    height: 50,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  gradientLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#555',
  },
  expressionList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  expressionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#FAFBFF',
    borderRadius: 10,
    padding: '8px 12px',
  },
  expressionLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    width: 42,
    flexShrink: 0,
  },
  expressionInput: {
    flex: 1,
    padding: '6px 8px',
    fontSize: 20,
    border: '1px solid #E8ECF1',
    borderRadius: 8,
    outline: 'none',
    textAlign: 'center',
    background: '#fff',
  },
  traitInputRow: {
    display: 'flex',
    gap: 8,
  },
  smallBtn: {
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    background: '#5B7FFF',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  traitList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  traitTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 500,
  },
  traitRemove: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    color: 'inherit',
    padding: '0 0 0 4px',
    lineHeight: 1,
  },
  patternCard: {
    background: '#FAFBFF',
    border: '1.5px solid #E8ECF1',
    borderRadius: 14,
    padding: '14px',
    marginBottom: 12,
  },
  patternHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1A1A2E',
  },
  removePatternBtn: {
    padding: '4px 10px',
    fontSize: 11,
    color: '#E85D5D',
    background: '#FDEAEA',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
  },
  addPatternBtn: {
    width: '100%',
    padding: '12px',
    fontSize: 14,
    fontWeight: 600,
    color: '#5B7FFF',
    background: '#EEF2FF',
    border: '1.5px dashed #5B7FFF',
    borderRadius: 12,
    cursor: 'pointer',
  },
  bottomActions: {
    display: 'flex',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#8B95A5',
    background: '#fff',
    border: '1.5px solid #E8ECF1',
    borderRadius: 14,
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 2,
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #5B7FFF 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
  },
};
