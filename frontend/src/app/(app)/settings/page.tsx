'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';

interface TrustedAdult {
  id?: number;
  name: string;
  email: string;
  relation: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [adults, setAdults] = useState<TrustedAdult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<TrustedAdult[]>('/api/settings/trusted-adults')
      .then(setAdults)
      .catch(() => {});
  }, []);

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
    setAdults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const valid = adults.filter(
        (a) => a.name.trim() && a.email.trim() && a.relation.trim()
      );
      await api.post('/api/settings/trusted-adults', { adults: valid });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handled by api wrapper
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Username</span>
            <span className="font-medium text-gray-900">{user?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-900 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </Card>

      {user?.role === 'teen' && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Trusted Adults
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            These people receive wellbeing summaries (never your journal content).
          </p>

          <div className="space-y-3 mb-4">
            {adults.map((adult, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 relative">
                {adults.length > 0 && (
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
                  value={adult.name}
                  onChange={(e) => updateAdult(i, 'name', e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={adult.email}
                  onChange={(e) => updateAdult(i, 'email', e.target.value)}
                />
                <Input
                  label="Relationship"
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
            + Add trusted adult
          </button>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
            {saved && (
              <span className="text-sm text-green-600 animate-fade-in">
                Saved
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
