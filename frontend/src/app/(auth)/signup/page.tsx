'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import type { UserRole } from '../../../lib/types';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import { classNames } from '../../../lib/utils';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'teen', label: 'Teen', desc: 'I want to journal and track my mood' },
  { value: 'parent', label: 'Parent', desc: "I want to support my child's well-being" },
  { value: 'counselor', label: 'Counselor', desc: 'I support multiple teens professionally' },
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, user } = useAuth();

  const defaultRole = (searchParams.get('role') as UserRole) || 'teen';

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'teen' ? '/onboarding' : '/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, username, password, role);
      router.push(role === 'teen' ? '/onboarding' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding="lg">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-sm text-gray-500 mb-6">
        Join Whisper and find your safe space
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            I am a...
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={classNames(
                  'p-3 rounded-xl border text-center transition-all',
                  role === r.value
                    ? 'border-whisper-400 bg-whisper-50 text-whisper-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="text-[10px] mt-0.5 leading-tight">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Username"
          placeholder="Pick a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Choose a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-whisper-600 font-medium hover:text-whisper-700"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <Card padding="lg">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-whisper-200 border-t-whisper-500 rounded-full animate-spin" />
          </div>
        </Card>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
