'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import TeenOverviewCard from '@/app/components/dashboard/TeenOverviewCard';
import RiskTrendChart from '@/app/components/dashboard/RiskTrendChart';
import AlertList from '@/app/components/dashboard/AlertList';
import Button from '@/app/components/ui/Button';

export default function DashboardPage() {
  const {
    teens,
    riskTrend,
    alerts,
    loading,
    fetchTeens,
    fetchRiskTrend,
    fetchAlerts,
    markAlertRead,
  } = useDashboard();

  const [selectedTeen, setSelectedTeen] = useState<number | null>(null);

  useEffect(() => {
    fetchTeens();
    fetchAlerts();
  }, [fetchTeens, fetchAlerts]);

  const handleSelectTeen = (teenId: number) => {
    setSelectedTeen(teenId);
    fetchRiskTrend(teenId);
  };

  const selectedTeenData = teens.find((t) => t.teen_id === selectedTeen);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Monitor the well-being of your linked teens. You&apos;ll see
          summarized insights -- never journal content.
        </p>
      </div>

      {/* Alerts */}
      <AlertList alerts={alerts} onMarkRead={markAlertRead} />

      {/* Teen list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Linked Teens
        </h2>
        {loading && teens.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        )}
        {!loading && teens.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">
              No teens linked yet. They&apos;ll appear here once they add you as
              a trusted adult.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teens.map((teen) => (
            <TeenOverviewCard
              key={teen.teen_id}
              teen={teen}
              onClick={() => handleSelectTeen(teen.teen_id)}
            />
          ))}
        </div>
      </div>

      {/* Selected teen detail */}
      {selectedTeen && selectedTeenData && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedTeenData.username}&apos;s Trend
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTeen(null)}
            >
              Close
            </Button>
          </div>
          <RiskTrendChart data={riskTrend} />
        </div>
      )}
    </div>
  );
}
