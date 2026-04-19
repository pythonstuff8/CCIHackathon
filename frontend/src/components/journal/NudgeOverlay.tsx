'use client';

import type { RiskLevel } from '../../lib/types';
import { CRISIS_RESOURCES } from '../../lib/constants';
import Button from '../ui/Button';

interface NudgeOverlayProps {
  visible: boolean;
  riskLevel: RiskLevel;
  message: string;
  onClose: () => void;
}

export default function NudgeOverlay({
  visible,
  riskLevel,
  message,
  onClose,
}: NudgeOverlayProps) {
  if (!visible) return null;

  const showCrisis = riskLevel === 'high' || riskLevel === 'critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-whisper-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            We hear you
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        {showCrisis && (
          <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
            <p className="text-sm font-medium text-red-800 mb-3">
              You don&apos;t have to go through this alone. Reach out:
            </p>
            <div className="space-y-2">
              {CRISIS_RESOURCES.slice(0, 3).map((resource) => (
                <div
                  key={resource.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-red-700 font-medium">
                    {resource.name}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {resource.contact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button variant="primary" onClick={onClose}>
            Thanks, I understand
          </Button>
        </div>
      </div>
    </div>
  );
}
