'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useJournal } from '../../../../hooks/useJournal';
import type { JournalEntry } from '../../../../lib/types';
import { formatDate, getMoodEmoji, getMoodLabel } from '../../../../lib/utils';
=======
import { useJournal } from '@/hooks/useJournal';
import type { JournalEntry } from '@/lib/types';
import { formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils';
>>>>>>> 558dc07 (changed pathing)
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchEntry, deleteEntry } = useJournal();
  const id = Number(params.id);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    let isActive = true;

    fetchEntry(id).then((nextEntry) => {
      if (!isActive) return;
      setEntry(nextEntry);
      setLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [id, fetchEntry]);

  const handleDelete = async () => {
    if (!entry) return;
    if (!confirm('Are you sure you want to delete this entry?')) return;
    await deleteEntry(entry.id);
    router.push('/journal');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-whisper-200 border-t-whisper-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Entry not found</p>
        <Button variant="ghost" onClick={() => router.push('/journal')} className="mt-4">
          Back to Journal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/journal')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Journal
      </button>

      <Card padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getMoodEmoji(entry.mood_before)}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">
              {getMoodLabel(entry.mood_before)}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-400">
              {formatDate(entry.created_at)}
            </span>
          </div>
          {entry.analysis && (
            <Badge level={entry.analysis.risk_level} />
          )}
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>
      </Card>

      {entry.analysis && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Wellness Insights
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Supportive Message
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {entry.analysis.supportive_message}
              </p>
            </div>
            {entry.analysis.detected_themes.length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Themes Detected
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {entry.analysis.detected_themes.map((theme) => (
                    <span
                      key={theme}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Risk Score
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {entry.analysis.risk_score} / 10
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Delete Entry
        </Button>
      </div>
    </div>
  );
}
