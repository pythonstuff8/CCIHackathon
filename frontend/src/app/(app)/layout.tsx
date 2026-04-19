'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useAuth } from '../../hooks/useAuth';
=======
import { useAuth } from '@/hooks/useAuth';
>>>>>>> 558dc07 (changed pathing)
import Navbar from '@/app/components/layout/Navbar';
import Sidebar from '@/app/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (user && !user.onboarding_complete && user.role === 'teen') {
      router.replace('/onboarding');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-whisper-200 border-t-whisper-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
