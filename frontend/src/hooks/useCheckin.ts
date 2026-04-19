'use client';

import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { PHQ9Response } from '../lib/types';

export function useCheckin() {
  const [history, setHistory] = useState<PHQ9Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<PHQ9Response[]>('/api/checkin/history');
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load check-in history');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCheckin = useCallback(
    async (answers: number[]): Promise<PHQ9Response | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.post<PHQ9Response>('/api/checkin/', { answers });
        setHistory((prev) => [result, ...prev]);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit check-in');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { history, loading, error, fetchHistory, submitCheckin };
}
