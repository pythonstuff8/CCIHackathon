'use client';

import { useState } from 'react';
import Button from '../ui/Button';

interface ConsentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ConsentStep({ onNext, onBack }: ConsentStepProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your Privacy Matters</h2>
      <p className="text-sm text-gray-500 mb-6">
        Before we begin, here&apos;s how we handle your information.
      </p>

      <div className="bg-whisper-50 rounded-xl p-5 space-y-4 mb-6 text-sm text-gray-700 leading-relaxed">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-whisper-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <div>
            <strong>Your journal is private.</strong> Only you can see what you
            write. Trusted adults receive summarized insights, never your actual
            words.
          </div>
        </div>
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-whisper-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <div>
            <strong>AI analysis helps, not judges.</strong> We use AI to detect
            when you might need extra support, not to evaluate you.
          </div>
        </div>
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-whisper-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <div>
            <strong>Safety first.</strong> If we detect serious risk, your
            trusted adults will be notified with a summary to help keep you safe.
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-whisper-600 focus:ring-whisper-400"
        />
        <span className="text-sm text-gray-600 group-hover:text-gray-800">
          I understand and consent to how my data will be used to support my
          well-being.
        </span>
      </label>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!agreed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
