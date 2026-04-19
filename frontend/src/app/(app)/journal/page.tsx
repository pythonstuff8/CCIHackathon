'use client';

import { useEffect, useState } from 'react';
import { useJournal } from '../../../hooks/useJournal';
import JournalEditor from '@/app/components/journal/JournalEditor';
import JournalCard from '@/app/components/journal/JournalCard';
import NudgeOverlay from '@/app/components/journal/NudgeOverlay';
import type { RiskLevel } from '../../../lib/types';

export default function JournalPage() {
  const { entries, loading, fetchEntries, createEntry } = useJournal();
  const [submitting, setSubmitting] = useState(false);
  const [nudge, setNudge] = useState<{
    visible: boolean;
    riskLevel: RiskLevel;
    message: string;
  }>({ visible: false, riskLevel: 'low', message: '' });

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (content: string, mood: number) => {
    setSubmitting(true);
    const entry = await createEntry(content, mood);
    setSubmitting(false);

    if (entry?.analysis) {
      const level = entry.analysis.risk_level;
      if (level === 'moderate' || level === 'high' || level === 'critical') {
        setNudge({
          visible: true,
          riskLevel: level,
          message: entry.analysis.supportive_message,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Journal</h1>
        <p className="text-sm text-gray-500">
          A private space to express yourself. Write about anything.
        </p>
      </div>

      <JournalEditor onSubmit={handleSubmit} loading={submitting} />

      <div className="space-y-3">
        {loading && entries.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Loading your entries...
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-whisper-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-whisper-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">
              No entries yet. Start writing to begin your journal.
            </p>
          </div>
        )}

        {entries.map((entry) => (
          <JournalCard key={entry.id} entry={entry} />
        ))}
      </div>

      <NudgeOverlay
        visible={nudge.visible}
        riskLevel={nudge.riskLevel}
        message={nudge.message}
        onClose={() => setNudge((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
