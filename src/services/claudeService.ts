import type { AICharacter, Emotion, ChatMessage, ChatEvent } from '../types';

const PROXY_URL = '/api/chat';

const EMOTION_LIST = 'neutral, happy, sad, angry, surprised, love, shy, excited';

function buildSystemPrompt(character: AICharacter, history: ChatMessage[]): string {
  const p = character.profile;

  let prompt = `당신은 "${character.name}"이라는 캐릭터입니다.\n\n`;

  // Basic info
  prompt += `## 기본 정보\n`;
  prompt += `- 성격: ${character.personality}\n`;
  prompt += `- 성격 특성: ${character.traits.join(', ')}\n`;
  prompt += `- 기본 감정: ${character.baseEmotion}\n`;
  if (p?.age) prompt += `- 나이: ${p.age}\n`;
  if (p?.gender) prompt += `- 성별: ${p.gender}\n`;
  if (p?.occupation) prompt += `- 직업/역할: ${p.occupation}\n`;
  prompt += `\n`;

  // Speech style
  if (p?.speechStyle) {
    prompt += `## 말투\n${p.speechStyle}\n\n`;
  }

  // Background
  if (p?.background) {
    prompt += `## 배경 스토리\n${p.background}\n\n`;
  }

  // Likes/dislikes
  if (p?.likes || p?.dislikes) {
    prompt += `## 취향\n`;
    if (p?.likes) prompt += `- 좋아하는 것: ${p.likes}\n`;
    if (p?.dislikes) prompt += `- 싫어하는 것: ${p.dislikes}\n`;
    prompt += `\n`;
  }

  // Custom prompt
  if (p?.customPrompt) {
    prompt += `## 추가 지시사항\n${p.customPrompt}\n\n`;
  }

  // Secret stories
  const secrets = character.secretStories?.filter((s) => !s.revealed) || [];
  if (secrets.length > 0) {
    prompt += `## 시크릿 스토리 (숨겨진 설정)\n`;
    prompt += `아래 비밀들은 사용자가 조건을 충족하면 자연스럽게 드러내세요. 직접적으로 말하지 말고 힌트를 줄 수 있습니다.\n`;
    for (const s of secrets) {
      prompt += `- [${s.title}] ${s.content} (공개 조건: ${s.revealCondition})\n`;
    }
    prompt += `\n`;
  }

  // Active events
  const events = checkActiveEvents(character, history);
  if (events.length > 0) {
    prompt += `## 현재 발동된 이벤트\n`;
    prompt += `아래 이벤트가 발동되었습니다. 다음 응답에 자연스럽게 반영하세요.\n`;
    for (const ev of events) {
      prompt += `- [${ev.name}] ${ev.action}\n`;
    }
    prompt += `\n`;
  }

  // Rules
  prompt += `## 규칙
- 반드시 한국어로 대화하세요.
- 캐릭터의 성격과 말투를 일관되게 유지하세요.
- 1~3문장 이내로 짧게 답변하세요.
- 대화 맥락에 맞는 자연스러운 감정을 표현하세요.
- 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

응답 형식:
{"text": "캐릭터의 대사", "emotion": "감정"}

가능한 감정: ${EMOTION_LIST}`;

  return prompt;
}

function checkActiveEvents(character: AICharacter, history: ChatMessage[]): ChatEvent[] {
  const events = character.chatEvents || [];
  const active: ChatEvent[] = [];
  const msgCount = history.length;

  for (const ev of events) {
    if (ev.oneShot && ev.triggered) continue;

    let shouldTrigger = false;

    switch (ev.triggerType) {
      case 'message_count': {
        const count = parseInt(ev.triggerValue, 10);
        if (!isNaN(count) && msgCount >= count) shouldTrigger = true;
        break;
      }
      case 'keyword': {
        const keywords = ev.triggerValue.split(',').map((k) => k.trim().toLowerCase());
        const recentMsgs = history.slice(-3);
        shouldTrigger = recentMsgs.some(
          (m) => m.sender === 'user' && keywords.some((kw) => m.text.toLowerCase().includes(kw)),
        );
        break;
      }
      case 'emotion_count': {
        const [targetEmotion, countStr] = ev.triggerValue.split(':');
        const count = parseInt(countStr, 10);
        if (targetEmotion && !isNaN(count)) {
          const emotionMsgs = history.filter((m) => m.emotion === targetEmotion);
          if (emotionMsgs.length >= count) shouldTrigger = true;
        }
        break;
      }
      case 'time_elapsed': {
        const minutes = parseInt(ev.triggerValue, 10);
        if (!isNaN(minutes) && history.length > 0) {
          const firstMsg = history[0];
          const elapsed = (Date.now() - firstMsg.timestamp) / 60000;
          if (elapsed >= minutes) shouldTrigger = true;
        }
        break;
      }
    }

    if (shouldTrigger) {
      active.push(ev);
    }
  }

  return active;
}

function buildMessages(history: ChatMessage[], character: AICharacter) {
  const recent = history.slice(-20);
  return recent
    .filter((m) => m.text !== character.greeting || m.sender !== 'character')
    .map((m) => ({
      role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: m.sender === 'user'
        ? m.text
        : JSON.stringify({ text: m.text, emotion: m.emotion || character.baseEmotion }),
    }));
}

export async function generateClaudeResponse(
  userMessage: string,
  character: AICharacter,
  history: ChatMessage[],
): Promise<{ text: string; emotion: Emotion }> {
  const messages = [
    ...buildMessages(history, character),
    { role: 'user' as const, content: userMessage },
  ];

  const body = {
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 256,
    system: buildSystemPrompt(character, history),
    messages,
  };

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.content?.[0]?.text || '';

    const parsed = JSON.parse(content);
    const emotion = validateEmotion(parsed.emotion);

    return {
      text: parsed.text || '...',
      emotion,
    };
  } catch (err) {
    console.error('Claude API error:', err);

    // Show API error in chat for debugging (remove in production)
    try {
      const testRes = await fetch(PROXY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const testData = await testRes.text();
      console.error('API test response:', testRes.status, testData);
    } catch (testErr) {
      console.error('API endpoint unreachable:', testErr);
    }

    return {
      text: `[API 오류] ${err instanceof Error ? err.message : String(err)} — mock 응답을 대신 사용하려면 새로고침하세요.`,
      emotion: 'neutral' as Emotion,
    };
  }
}

function validateEmotion(emotion: string): Emotion {
  const valid: Emotion[] = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'love', 'shy', 'excited'];
  return valid.includes(emotion as Emotion) ? (emotion as Emotion) : 'neutral';
}
