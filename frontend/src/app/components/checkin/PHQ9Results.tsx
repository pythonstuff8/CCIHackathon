'use client';

import type { PHQ9Response } from '../../../../frontend/src/lib/types';
import { formatDate } from '../../../../frontend/src/lib/utils';
import { classNames } from '../../../../frontend/src/lib/utils';
import { CRISIS_RESOURCES } from '../../../../frontend/src/lib/constants';

interface PHQ9ResultsProps {
  result: PHQ9Response;
}

function getSeverityInfo(severity: string) {
  switch (severity.toLowerCase()) {
    case 'minimal':
    case 'none':
      return { color: 'text-green-600 bg-green-50 border-green-200', label: 'Minimal' };
    case 'mild':
      return { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Mild' };
    case 'moderate':
      return { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Moderate' };
    case 'moderately severe':
      return { color: 'text-orange-700 bg-orange-50 border-orange-300', label: 'Moderately Severe' };
    case 'severe':
      return { color: 'text-red-600 bg-red-50 border-red-200', label: 'Severe' };
    default:
      return { color: 'text-gray-600 bg-gray-50 border-gray-200', label: severity };
  }
}

export default function PHQ9Results({ result }: PHQ9ResultsProps) {
  const info = getSeverityInfo(result.severity);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Check-in Results
        </h3>
        <span className="text-xs text-gray-400">
          {formatDate(result.created_at)}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {result.total_score}
          </div>
          <div className="text-xs text-gray-400">out of 27</div>
        </div>
        <div
          className={classNames(
            'px-4 py-2 rounded-xl border text-sm font-semibold',
            info.color
          )}
        >
          {info.label}
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={classNames(
              'h-3 rounded-full transition-all',
              result.total_score <= 4
                ? 'bg-green-400'
                : result.total_score <= 9
                  ? 'bg-amber-400'
                  : result.total_score <= 14
                    ? 'bg-orange-400'
                    : result.total_score <= 19
                      ? 'bg-orange-500'
                      : 'bg-red-500'
            )}
            style={{ width: `${(result.total_score / 27) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
          <span>Minimal</span>
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      {result.question_9_flag && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm font-medium text-red-800 mb-2">
            We noticed your response to question 9. You matter, and support is
            available right now:
          </p>
          <div className="space-y-1.5">
            {CRISIS_RESOURCES.slice(0, 2).map((r) => (
              <div key={r.name} className="flex items-center justify-between text-sm">
                <span className="text-red-700">{r.name}</span>
                <span className="text-red-600 font-semibold">{r.contact}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
