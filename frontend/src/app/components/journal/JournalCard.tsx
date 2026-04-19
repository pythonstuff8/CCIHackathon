'use client';

import Link from 'next/link';
import type { JournalEntry } from '../../../../frontend/src/lib/types';
import { formatDate, getMoodEmoji, truncate } from '../../../../frontend/src/lib/utils';
import Badge from '../ui/Badge';

interface JournalCardProps {
  entry: JournalEntry;
}

export default function JournalCard({ entry }: JournalCardProps) {
  return (
    <Link
      href={`/journal/${entry.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-whisper-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" title={`Mood: ${entry.mood_before}`}>
              {getMoodEmoji(entry.mood_before)}
            </span>
            <span className="text-xs text-gray-400">{formatDate(entry.created_at)}</span>
            {entry.analysis && (
              <Badge level={entry.analysis.risk_level} size="sm" />
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {truncate(entry.content, 180)}
          </p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-whisper-400 mt-1 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
