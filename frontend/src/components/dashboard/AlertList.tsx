'use client';

import type { Alert } from '../../lib/types';
import Badge from '../ui/Badge';
import { timeAgo } from '../../lib/utils';
import { classNames } from '../../lib/utils';
import Button from '../ui/Button';

interface AlertListProps {
  alerts: Alert[];
  onMarkRead: (id: number) => void;
}

export default function AlertList({ alerts, onMarkRead }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-sm text-gray-400">
        No alerts
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
      <div className="px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">Alerts</h3>
      </div>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={classNames(
            'px-6 py-4 flex items-start gap-4',
            !alert.is_read && 'bg-whisper-50/30'
          )}
        >
          <div
            className={classNames(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
              alert.risk_level === 'critical'
                ? 'bg-red-100 text-red-600'
                : alert.risk_level === 'high'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-amber-100 text-amber-600'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge level={alert.risk_level} size="sm" />
              <span className="text-xs text-gray-400">{timeAgo(alert.created_at)}</span>
              {!alert.is_read && (
                <span className="w-2 h-2 bg-whisper-500 rounded-full" />
              )}
            </div>
            <p className="text-sm text-gray-600">{alert.summary}</p>
          </div>
          {!alert.is_read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(alert.id)}
            >
              Mark read
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
