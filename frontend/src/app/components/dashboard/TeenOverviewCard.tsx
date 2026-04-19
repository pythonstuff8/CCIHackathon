'use client';

import type { TeenOverview } from '../../../../frontend/src/lib/types';
import Badge from '../ui/Badge';
import { timeAgo } from '../../../../frontend/src/lib/utils';

interface TeenOverviewCardProps {
  teen: TeenOverview;
  onClick: () => void;
}

export default function TeenOverviewCard({ teen, onClick }: TeenOverviewCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-whisper-200 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-whisper-100 flex items-center justify-center text-whisper-600 font-semibold text-sm">
            {teen.username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {teen.username}
            </h3>
            <p className="text-xs text-gray-400">
              {teen.last_checkin
                ? `Last check-in ${timeAgo(teen.last_checkin)}`
                : 'No check-ins yet'}
            </p>
          </div>
        </div>
        <Badge level={teen.latest_risk_level} size="sm" />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Score: {teen.latest_risk_score}
        </div>
        {teen.alert_count > 0 && (
          <div className="flex items-center gap-1 text-red-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {teen.alert_count} alert{teen.alert_count > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </button>
  );
}
