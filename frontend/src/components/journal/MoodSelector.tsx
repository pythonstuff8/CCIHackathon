'use client';

import { MOOD_EMOJIS } from '../../lib/constants';
import { classNames } from '../../lib/utils';

interface MoodSelectorProps {
  value: number | null;
  onChange: (mood: number) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1">How are you feeling?</span>
      {Object.entries(MOOD_EMOJIS).map(([key, { emoji, label }]) => {
        const mood = Number(key);
        const selected = value === mood;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={classNames(
              'w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all',
              selected
                ? 'bg-whisper-100 ring-2 ring-whisper-400 scale-110'
                : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
            )}
            aria-label={label}
            title={label}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}
