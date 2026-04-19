'use client';

import { useState } from 'react';
import { PHQ9_QUESTIONS, PHQ9_OPTIONS } from '../../lib/constants';
import Button from '../ui/Button';
import { classNames } from '../../lib/utils';

interface PHQ9FormProps {
  onSubmit: (answers: number[]) => Promise<void>;
  loading?: boolean;
}

export default function PHQ9Form({ onSubmit, loading }: PHQ9FormProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(PHQ9_QUESTIONS.length).fill(null)
  );
  const [currentQ, setCurrentQ] = useState(0);

  const setAnswer = (index: number, value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const allAnswered = answers.every((a) => a !== null);
  const progress = answers.filter((a) => a !== null).length;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    await onSubmit(answers as number[]);
    setAnswers(new Array(PHQ9_QUESTIONS.length).fill(null));
    setCurrentQ(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Mental Health Check-in
        </h2>
        <p className="text-sm text-gray-500">
          Over the last 2 weeks, how often have you been bothered by the following?
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}/{PHQ9_QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-whisper-400 to-whisper-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress / PHQ9_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step-through question */}
      <div className="mb-6 animate-fade-in" key={currentQ}>
        <p className="text-sm font-medium text-gray-800 mb-4">
          <span className="text-whisper-500 font-semibold mr-2">
            {currentQ + 1}.
          </span>
          {PHQ9_QUESTIONS[currentQ]}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PHQ9_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setAnswer(currentQ, opt.value);
                if (currentQ < PHQ9_QUESTIONS.length - 1) {
                  setTimeout(() => setCurrentQ(currentQ + 1), 200);
                }
              }}
              className={classNames(
                'text-left px-4 py-3 rounded-xl border text-sm transition-all',
                answers[currentQ] === opt.value
                  ? 'border-whisper-400 bg-whisper-50 text-whisper-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question navigation dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {PHQ9_QUESTIONS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentQ(i)}
            className={classNames(
              'w-2.5 h-2.5 rounded-full transition-all',
              i === currentQ
                ? 'bg-whisper-500 scale-125'
                : answers[i] !== null
                  ? 'bg-whisper-300'
                  : 'bg-gray-200'
            )}
            aria-label={`Question ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation + Submit */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
        >
          Previous
        </Button>
        {currentQ < PHQ9_QUESTIONS.length - 1 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentQ(currentQ + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            loading={loading}
          >
            Submit Check-in
          </Button>
        )}
      </div>
    </div>
  );
}
