import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacters, getCharacterById, saveCharacter } from '../data/characters';
import { generateCharacterImage, IMAGE_STYLES } from '../services/geminiImageService';
import type { AICharacter, Emotion } from '../types';
import type { ImageStyle } from '../services/geminiImageService';

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

export default function ImageGeneratorPage() {
  const navigate = useNavigate();
  const characters = getCharacters();

  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const [style, setStyle] = useState<ImageStyle>('anime');
  const [prompt, setPrompt] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(['neutral']);
  const [generating, setGenerating] = useState(false);
  const [currentGenEmotion, setCurrentGenEmotion] = useState<Emotion | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Partial<Record<Emotion, string>>>({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleEmotion = (em: Emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(em) ? prev.filter((e) => e !== em) : [...prev, em],
    );
  };

  const selectAllEmotions = () => {
    setSelectedEmotions(
      selectedEmotions.length === EMOTIONS.length ? ['neutral'] : [...EMOTIONS],
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('캐릭터 외형 설명을 입력해주세요.');
      return;
    }
    if (selectedEmotions.length === 0) {
      setError('최소 1개의 감정을 선택해주세요.');
      return;
    }

    setError('');
    setGenerating(true);
    setSaved(false);
    const results: Partial<Record<Emotion, string>> = { ...generatedImages };

    for (const emotion of selectedEmotions) {
      setCurrentGenEmotion(emotion);
      try {
        const imageUrl = await generateCharacterImage(prompt.trim(), style, emotion);
        results[emotion] = imageUrl;
        setGeneratedImages({ ...results });
      } catch (err) {
        setError(`${EMOTION_LABELS[emotion]} 생성 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      }
    }

    setGenerating(false);
    setCurrentGenEmotion(null);
  };

  const handleSave = () => {
    if (Object.keys(generatedImages).length === 0) return;

    const character = getCharacterById(selectedCharId);
    if (!character) return;

    const updated: AICharacter = {
      ...character,
      imageExpressions: { ...character.imageExpressions, ...generatedImages },
      useImageMode: true,
    };

    saveCharacter(updated);
    setSaved(true);
  };

  const handleRemoveImage = (emotion: Emotion) => {
    const updated = { ...generatedImages };
    delete updated[emotion];
    setGeneratedImages(updated);
  };

  const handleDisableImageMode = () => {
    const character = getCharacterById(selectedCharId);
    if (!character) return;
    saveCharacter({ ...character, useImageMode: false });
    setSaved(true);
  };

  const selectedChar = getCharacterById(selectedCharId);
  const hasExistingImages = selectedChar?.useImageMode && selectedChar?.imageExpressions;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>
          ← 관리자
        </button>
      </div>

      <h1 style={styles.title}>이미지 생성</h1>
      <p style={styles.subtitle}>AI로 캐릭터 이미지를 생성합니다</p>

      {/* Character selector */}
      <div style={styles.section}>
        <label style={styles.label}>캐릭터 선택</label>
        <select
          style={styles.select}
          value={selectedCharId}
          onChange={(e) => {
            setSelectedCharId(e.target.value);
            setGeneratedImages({});
            setSaved(false);
          }}
        >
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.expressions[c.baseEmotion]} {c.name}
            </option>
          ))}
        </select>

        {hasExistingImages && (
          <div style={styles.existingBadge}>
            이미지 모드 활성화됨
            <button style={styles.disableBtn} onClick={handleDisableImageMode}>
              이모지로 전환
            </button>
          </div>
        )}
      </div>

      {/* Style selector */}
      <div style={styles.section}>
        <label style={styles.label}>스타일</label>
        <div style={styles.styleGrid}>
          {IMAGE_STYLES.map((s) => (
            <div
              key={s.key}
              style={{
                ...styles.styleCard,
                border: style === s.key ? '2px solid #5B7FFF' : '2px solid #E8ECF1',
                background: style === s.key ? '#EEF2FF' : '#fff',
              }}
              onClick={() => setStyle(s.key)}
            >
              <div style={styles.styleLabel}>{s.label}</div>
              <div style={styles.styleDesc}>{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt input */}
      <div style={styles.section}>
        <label style={styles.label}>캐릭터 외형 설명</label>
        <textarea
          style={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 긴 검은 머리, 파란 눈, 흰 드레스를 입은 소녀"
          rows={3}
        />
      </div>

      {/* Emotion selector */}
      <div style={styles.section}>
        <div style={styles.emotionHeader}>
          <label style={styles.label}>생성할 감정</label>
          <button style={styles.selectAllBtn} onClick={selectAllEmotions}>
            {selectedEmotions.length === EMOTIONS.length ? '초기화' : '전체 선택'}
          </button>
        </div>
        <div style={styles.emotionGrid}>
          {EMOTIONS.map((em) => (
            <button
              key={em}
              style={{
                ...styles.emotionBtn,
                background: selectedEmotions.includes(em) ? '#5B7FFF' : '#FAFBFF',
                color: selectedEmotions.includes(em) ? '#fff' : '#555',
              }}
              onClick={() => toggleEmotion(em)}
            >
              {EMOTION_LABELS[em]}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Generate button */}
      <button
        style={{
          ...styles.generateBtn,
          opacity: generating ? 0.7 : 1,
        }}
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating
          ? `생성 중... (${EMOTION_LABELS[currentGenEmotion!] || ''})`
          : `이미지 생성 (${selectedEmotions.length}개)`}
      </button>

      {/* Results */}
      {Object.keys(generatedImages).length > 0 && (
        <div style={styles.section}>
          <label style={styles.label}>생성 결과</label>
          <div style={styles.resultGrid}>
            {EMOTIONS.filter((em) => generatedImages[em]).map((em) => (
              <div key={em} style={styles.resultCard}>
                <img
                  src={generatedImages[em]}
                  alt={EMOTION_LABELS[em]}
                  style={styles.resultImage}
                />
                <div style={styles.resultLabel}>{EMOTION_LABELS[em]}</div>
                <button
                  style={styles.removeImgBtn}
                  onClick={() => handleRemoveImage(em)}
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.saveBtn,
              opacity: saved ? 0.7 : 1,
            }}
            onClick={handleSave}
            disabled={saved}
          >
            {saved ? '저장 완료!' : `${selectedChar?.name}에 적용하기`}
          </button>
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
  section: {
    background: '#fff',
    borderRadius: 16,
    padding: '16px',
    marginBottom: 14,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#1A1A2E',
    marginBottom: 8,
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
  existingBadge: {
    marginTop: 8,
    padding: '8px 12px',
    background: '#E8FFE8',
    borderRadius: 8,
    fontSize: 12,
    color: '#2D8B2D',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disableBtn: {
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: '#8B95A5',
    background: '#F0F2F5',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  styleCard: {
    padding: '12px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  styleLabel: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  styleDesc: {
    fontSize: 11,
    color: '#8B95A5',
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
  emotionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectAllBtn: {
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: '#5B7FFF',
    background: '#EEF2FF',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
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
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  generateBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #5B7FFF 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'opacity 0.2s',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 14,
  },
  resultCard: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1.5px solid #E8ECF1',
  },
  resultImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block',
  },
  resultLabel: {
    textAlign: 'center',
    padding: '6px 0',
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    background: '#FAFBFF',
  },
  removeImgBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    border: 'none',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #34C759 0%, #30B050 100%)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};
