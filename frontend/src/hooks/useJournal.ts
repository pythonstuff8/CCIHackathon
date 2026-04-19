'use client';

import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { JournalEntry } from '../lib/types';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<JournalEntry[]>('/api/journal/');
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEntry = useCallback(async (id: number): Promise<JournalEntry | null> => {
    setLoading(true);
    setError(null);
    try {
      return await api.get<JournalEntry>(`/api/journal/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entry');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = useCallback(
    async (content: string, mood_before: number): Promise<JournalEntry | null> => {
      setLoading(true);
      setError(null);
      try {
        const entry = await api.post<JournalEntry>('/api/journal/', {
          content,
          mood_before,
        });
        setEntries((prev) => [entry, ...prev]);
        return entry;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create entry');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: number) => {
    setError(null);
    try {
      await api.delete(`/api/journal/${id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  }, []);

  return { entries, loading, error, fetchEntries, fetchEntry, createEntry, deleteEntry };
}
