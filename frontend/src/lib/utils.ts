import type { RiskLevel } from './types';
import { MOOD_EMOJIS, RISK_COLORS } from './constants';

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getRiskColor(level: RiskLevel): string {
  return RISK_COLORS[level] || RISK_COLORS.low;
}

export function getMoodEmoji(mood: number): string {
  return MOOD_EMOJIS[mood]?.emoji || '\uD83D\uDE10';
}

export function getMoodLabel(mood: number): string {
  return MOOD_EMOJIS[mood]?.label || 'Okay';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '...';
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
