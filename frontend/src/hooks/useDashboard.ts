'use client';

import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { TeenOverview, Alert } from '../lib/types';

interface RiskTrendPoint {
  date: string;
  risk_score: number;
  risk_level: string;
}

export function useDashboard() {
  const [teens, setTeens] = useState<TeenOverview[]>([]);
  const [riskTrend, setRiskTrend] = useState<RiskTrendPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<TeenOverview[]>('/api/dashboard/teens');
      setTeens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teens');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRiskTrend = useCallback(async (teenId: number) => {
    setError(null);
    try {
      const data = await api.get<RiskTrendPoint[]>(
        `/api/dashboard/teen/${teenId}/risk-trend`
      );
      setRiskTrend(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load risk trend');
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    setError(null);
    try {
      const data = await api.get<Alert[]>('/api/alerts/');
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    }
  }, []);

  const markAlertRead = useCallback(async (alertId: number) => {
    try {
      await api.patch(`/api/alerts/${alertId}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update alert');
    }
  }, []);

  return {
    teens,
    riskTrend,
    alerts,
    loading,
    error,
    fetchTeens,
    fetchRiskTrend,
    fetchAlerts,
    markAlertRead,
  };
}
