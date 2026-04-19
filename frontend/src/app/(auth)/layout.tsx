import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-whisper-50 via-warm-50 to-teal-50 min-h-screen">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8"
      >
        <svg className="w-7 h-7 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <span className="text-xl font-bold bg-gradient-to-r from-whisper-600 to-whisper-800 bg-clip-text text-transparent">
          Whisper
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
