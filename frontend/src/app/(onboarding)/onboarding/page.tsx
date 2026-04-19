'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import WelcomeStep from '@/app/components/onboarding/WelcomeStep';
import ConsentStep from '@/app/components/onboarding/ConsentStep';
import TrustedAdultStep from '@/app/components/onboarding/TrustedAdultStep';
import { classNames } from '../../../lib/utils';
=======
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import WelcomeStep from '@/app/components/onboarding/WelcomeStep';
import ConsentStep from '@/app/components/onboarding/ConsentStep';
import TrustedAdultStep from '@/app/components/onboarding/TrustedAdultStep';
import { classNames } from '@/lib/utils';
>>>>>>> 558dc07 (changed pathing)

const STEPS = ['Welcome', 'Privacy', 'Trusted Adults'];

export default function OnboardingPage() {
  const { user, token, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/login');
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    if (user?.onboarding_complete) {
      router.replace('/journal');
    }
  }, [user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-whisper-50 via-warm-50 to-teal-50">
        <div className="w-8 h-8 border-2 border-whisper-200 border-t-whisper-500 rounded-full animate-spin" />
      </div>
    );
  }

  const handleComplete = async (
    adults: { name: string; email: string; relation: string }[]
  ) => {
    setSaving(true);
    try {
      // Record consent
      await api.post('/api/onboarding/consent', {
        consent_type: 'data_collection',
        consented: true,
      });
      // Add each trusted adult
      for (const adult of adults) {
        await api.post('/api/onboarding/trusted-adults', adult);
      }
      // Mark onboarding complete
      await api.post('/api/onboarding/complete', {});
      await refreshUser();
      router.push('/journal');
    } catch {
      // Error handled by api wrapper
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-whisper-50 via-warm-50 to-teal-50">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={classNames(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                i <= step
                  ? 'bg-whisper-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              )}
            >
              {i < step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={classNames(
                'hidden sm:block text-xs',
                i <= step ? 'text-whisper-600 font-medium' : 'text-gray-400'
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={classNames(
                  'w-8 h-0.5 rounded',
                  i < step ? 'bg-whisper-400' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg animate-fade-in" key={step}>
        {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
        {step === 1 && (
          <ConsentStep onNext={() => setStep(2)} onBack={() => setStep(0)} />
        )}
        {step === 2 && (
          <TrustedAdultStep
            onComplete={handleComplete}
            onBack={() => setStep(1)}
            loading={saving}
          />
        )}
      </div>
    </div>
  );
}
