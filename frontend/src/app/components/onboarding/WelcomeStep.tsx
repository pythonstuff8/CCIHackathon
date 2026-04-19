'use client';

import Button from '../ui/Button';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-whisper-100 to-whisper-200 flex items-center justify-center">
        <svg className="w-10 h-10 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Welcome to Whisper
      </h1>
      <p className="text-gray-500 leading-relaxed mb-8">
        This is your safe space. Journal your thoughts, check in on how
        you&apos;re feeling, and know that support is always nearby. Everything
        here is designed with your well-being in mind.
      </p>
      <Button onClick={onNext} size="lg">
        Get Started
      </Button>
    </div>
  );
}
