import type { RiskLevel } from '../../../../frontend/src/lib/types';
import { getRiskColor } from '../../../../frontend/src/lib/utils';
import { classNames } from '../../../../frontend/src/lib/utils';

interface BadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export default function Badge({ level, size = 'md' }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center font-semibold rounded-full border capitalize',
        getRiskColor(level),
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      )}
    >
      {level}
    </span>
  );
}
