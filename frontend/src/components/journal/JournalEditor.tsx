'use client';

import { useState } from 'react';
import MoodSelector from './MoodSelector';
import Button from '../ui/Button';

interface JournalEditorProps {
  onSubmit: (content: string, mood: number) => Promise<void>;
  loading?: boolean;
}

export default function JournalEditor({ onSubmit, loading }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || !mood) return;
    await onSubmit(content.trim(), mood);
    setContent('');
    setMood(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How are you feeling today? Write freely -- this is your safe space..."
        className="w-full h-36 resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-whisper-400 focus:ring-2 focus:ring-whisper-100"
        aria-label="Journal entry"
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <MoodSelector value={mood} onChange={setMood} />
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || !mood}
          loading={loading}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}
