'use client';

interface RiskTrendPoint {
  date: string;
  risk_score: number;
  risk_level: string;
}

interface RiskTrendChartProps {
  data: RiskTrendPoint[];
}

function getBarColor(level: string): string {
  switch (level) {
    case 'low':
      return 'bg-green-400';
    case 'moderate':
      return 'bg-amber-400';
    case 'high':
      return 'bg-orange-400';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-300';
  }
}

export default function RiskTrendChart({ data }: RiskTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-sm text-gray-400">
        No risk data available yet
      </div>
    );
  }

  const maxScore = Math.max(...data.map((d) => d.risk_score), 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Risk Trend</h3>
      <div className="flex items-end gap-1.5 h-40">
        {data.slice(-14).map((point, i) => {
          const height = Math.max((point.risk_score / maxScore) * 100, 4);
          const date = new Date(point.date);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-[10px] text-gray-400">
                {Math.round(point.risk_score)}
              </span>
              <div
                className={`w-full rounded-t-md ${getBarColor(point.risk_level)} transition-all`}
                style={{ height: `${height}%` }}
                title={`${point.risk_level}: ${point.risk_score}`}
              />
              <span className="text-[9px] text-gray-400">
                {date.getMonth() + 1}/{date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
