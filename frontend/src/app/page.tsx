'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      video.play().then(() => setVideoReady(true)).catch(() => {});
    };

    video.addEventListener('canplay', onCanPlay);
    // If already ready
    if (video.readyState >= 3) {
      video.play().then(() => setVideoReady(true)).catch(() => {});
    }

    return () => video.removeEventListener('canplay', onCanPlay);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Video Background — covers full viewport */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover [transition:opacity_1.5s_ease-in-out]"
          style={{ opacity: videoReady ? 0.4 : 0 }}
          muted
          playsInline
          loop
          preload="auto"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <Link href="/" className="text-3xl tracking-tight font-display text-white">
            Whisper
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-white/90 transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/resources" className="text-sm text-white/50 transition-colors hover:text-white">
              Resources
            </Link>
            <Link href="/login" className="text-sm text-white/50 transition-colors hover:text-white">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-6 py-2.5 text-sm bg-white text-black hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          </div>
          <Link
            href="/signup"
            className="md:hidden rounded-full px-5 py-2 text-sm bg-white text-black"
          >
            Start
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[85vh]">
        <h1
          className="text-5xl sm:text-7xl md:text-[5.5rem] max-w-5xl font-normal font-display animate-fade-rise text-white"
          style={{ lineHeight: 0.95, letterSpacing: '-2px' }}
        >
          Beyond silence,{' '}
          <em className="text-white/60">we listen.</em>
          <br />
          Beyond fear,{' '}
          <em className="text-white/60">we connect.</em>
        </h1>

        <p className="text-base sm:text-lg max-w-2xl mt-10 leading-relaxed text-white/60 animate-fade-rise-delay">
          A safe companion for teens to journal freely, understand their emotions,
          and know that support is always within reach. Private by design.
          Warm by nature.
        </p>

        <Link
          href="/signup"
          className="rounded-full px-14 py-5 text-base bg-white text-black hover:scale-105 transition-transform mt-12 animate-fade-rise-delay-2 font-medium"
        >
          Begin Your Journey
        </Link>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-display text-center mb-4 text-black">
            How Whisper supports you
          </h2>
          <p className="text-center text-gray-500 max-w-xl mx-auto mb-16">
            Designed with care, built for trust. Three pillars of support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-whisper-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-whisper-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-black mb-3">Private Journal</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Write freely about your day, your feelings, whatever is on your mind.
                Your words stay yours alone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-black mb-3">Mood Check-ins</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Quick check-ins help you understand your patterns and recognize when
                you might need extra support.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-warm-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-black mb-3">Always Supported</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Crisis resources at your fingertips, plus a network of trusted adults
                who care about your well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="relative z-10 py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-whisper-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-black mb-4">
            Your privacy is sacred
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Journal entries are never shared with anyone. Trusted adults only receive
            summarized wellbeing insights — never your actual words. You control
            your story.
          </p>
        </div>
      </section>

      {/* Role CTA Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-black mb-12">
            Find your path
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/signup?role=teen"
              className="group rounded-3xl border-2 border-gray-100 p-10 hover:border-whisper-300 hover:shadow-lg transition-all text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4">
                <svg className="w-10 h-10 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-black mb-2">I&apos;m a Teen</h3>
              <p className="text-sm text-gray-500">
                Start journaling, track your mood, and access support
              </p>
            </Link>

            <Link
              href="/signup?role=parent"
              className="group rounded-3xl border-2 border-gray-100 p-10 hover:border-teal-300 hover:shadow-lg transition-all text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-black mb-2">I&apos;m a Parent / Counselor</h3>
              <p className="text-sm text-gray-500">
                Stay informed about your teen&apos;s wellbeing with privacy-safe insights
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl text-black mb-4">Whisper</p>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Whisper is not a substitute for professional help. If you are in danger,
            please call 911 or contact the 988 Suicide &amp; Crisis Lifeline.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
            <Link href="/resources" className="hover:text-black transition-colors">Resources</Link>
            <Link href="/login" className="hover:text-black transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-black transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
