import type { CSSProperties } from 'react';
import type { AICharacter, Emotion } from '../types';

interface Props {
  character: AICharacter;
  emotion: Emotion;
  size: number;
  style?: CSSProperties;
}

export default function CharacterAvatar({ character, emotion, size, style }: Props) {
  const imageUrl = character.useImageMode ? character.imageExpressions?.[emotion] : undefined;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${character.name} - ${emotion}`}
        style={{
          width: size,
          height: size,
          borderRadius: size > 60 ? 20 : size / 2,
          objectFit: 'cover',
          ...style,
        }}
      />
    );
  }

  return (
    <span style={{ fontSize: size, lineHeight: 1, ...style }}>
      {character.expressions[emotion]}
    </span>
  );
}
