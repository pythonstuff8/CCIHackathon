'use client';

import { useState } from 'react';

export default function CrisisBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-center relative">
      <p className="text-xs text-red-700">
        <span className="font-semibold">If you&apos;re in crisis:</span>{' '}
        <a href="tel:988" className="underline font-medium hover:text-red-900">
          Call 988
        </a>{' '}
        <span className="text-red-400 mx-1">|</span>{' '}
        <span className="font-medium">Text HOME to 741741</span>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 p-1"
        aria-label="Dismiss crisis banner"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
