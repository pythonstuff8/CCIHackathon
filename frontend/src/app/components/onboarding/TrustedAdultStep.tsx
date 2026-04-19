'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TrustedAdult {
  name: string;
  email: string;
  relation: string;
}

interface TrustedAdultStepProps {
  onComplete: (adults: TrustedAdult[]) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function TrustedAdultStep({
  onComplete,
  onBack,
  loading,
}: TrustedAdultStepProps) {
  const [adults, setAdults] = useState<TrustedAdult[]>([
    { name: '', email: '', relation: '' },
  ]);
  const [error, setError] = useState('');

  const updateAdult = (index: number, field: keyof TrustedAdult, value: string) => {
    setAdults((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addAdult = () => {
    setAdults((prev) => [...prev, { name: '', email: '', relation: '' }]);
  };

  const removeAdult = (index: number) => {
    if (adults.length <= 1) return;
    setAdults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const valid = adults.filter(
      (a) => a.name.trim() && a.email.trim() && a.relation.trim()
    );
    if (valid.length === 0) {
      setError('Please add at least one trusted adult');
      return;
    }
    setError('');
    await onComplete(valid);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Add Trusted Adults
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        These people will receive summarized updates about your well-being
        (never your journal content). Add at least one.
      </p>

      <div className="space-y-4 mb-6">
        {adults.map((adult, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl p-4 space-y-3 relative"
          >
            {adults.length > 1 && (
              <button
                type="button"
                onClick={() => removeAdult(i)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400 p-1"
                aria-label="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <Input
              label="Name"
              placeholder="e.g., Mom, Dad, Coach Johnson"
              value={adult.name}
              onChange={(e) => updateAdult(i, 'name', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="their@email.com"
              value={adult.email}
              onChange={(e) => updateAdult(i, 'email', e.target.value)}
            />
            <Input
              label="Relationship"
              placeholder="e.g., Parent, Coach, Counselor"
              value={adult.relation}
              onChange={(e) => updateAdult(i, 'relation', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addAdult}
        className="w-full py-2 text-sm text-whisper-600 hover:text-whisper-700 hover:bg-whisper-50 rounded-xl border border-dashed border-whisper-300 mb-4"
      >
        + Add another trusted adult
      </button>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Finish Setup
        </Button>
      </div>
    </div>
  );
}
