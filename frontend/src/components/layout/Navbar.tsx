'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href={user ? (user.role === 'teen' ? '/journal' : '/dashboard') : '/'} className="flex items-center gap-2">
            <svg className="w-6 h-6 text-whisper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c.53 0 1.04.21 1.41.59l.82.82c.78.78 2.05.78 2.83 0l.12-.12a2 2 0 013.41 1.41v.12a2 2 0 002 2h.12a2 2 0 011.41 3.41l-.12.12a2 2 0 000 2.83l.12.12a2 2 0 01-1.41 3.41h-.12a2 2 0 00-2 2v.12a2 2 0 01-3.41 1.41l-.12-.12a2 2 0 00-2.83 0l-.82.82A2 2 0 0112 21a2 2 0 01-1.41-.59l-.82-.82a2 2 0 00-2.83 0l-.12.12a2 2 0 01-3.41-1.41v-.12a2 2 0 00-2-2h-.12A2 2 0 01.88 12.77l.12-.12a2 2 0 000-2.83L.88 9.7a2 2 0 011.41-3.41h.12a2 2 0 002-2V4.17A2 2 0 017.82 2.76l.12.12a2 2 0 002.83 0l.82-.82A2 2 0 0112 3z" />
            </svg>
            <span className="text-lg font-bold bg-gradient-to-r from-whisper-600 to-whisper-800 bg-clip-text text-transparent">
              Whisper
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-500">
                Hi, {user.username}
              </span>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-8 h-8 rounded-full bg-whisper-100 text-whisper-600 flex items-center justify-center font-semibold text-sm hover:bg-whisper-200"
                >
                  {user.username[0].toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-whisper-600 hover:text-whisper-700"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
