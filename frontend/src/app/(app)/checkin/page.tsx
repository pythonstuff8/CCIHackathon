'use client';

import { useEffect, useState } from 'react';
import { useCheckin } from '../../../hooks/useCheckin';
import PHQ9Form from '../../../components/checkin/PHQ9Form';
import PHQ9Results from '../../../components/checkin/PHQ9Results';
import type { PHQ9Response } from '../../../lib/types';

export default function CheckinPage() {
  const { history, loading, fetchHistory, submitCheckin } = useCheckin();
  const [submitting, setSubmitting] = useState(false);
  const [latestResult, setLatestResult] = useState<PHQ9Response | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (answers: number[]) => {
    setSubmitting(true);
    const result = await submitCheckin(answers);
    setSubmitting(false);
    if (result) {
      setLatestResult(result);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Mental Health Check-in
        </h1>
        <p className="text-sm text-gray-500">
          A quick check-in helps you track how you&apos;re doing over time.
        </p>
      </div>

      <PHQ9Form onSubmit={handleSubmit} loading={submitting} />

      {latestResult && (
        <div className="animate-slide-up">
          <PHQ9Results result={latestResult} />
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Previous Check-ins
          </h2>
          <div className="space-y-3">
            {history
              .filter((h) => h.id !== latestResult?.id)
              .map((item) => (
                <PHQ9Results key={item.id} result={item} />
              ))}
          </div>
        </div>
      )}

      {!loading && history.length === 0 && !latestResult && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Complete your first check-in above to start tracking.
        </div>
      )}
    </div>
  );
}
