import React from 'react';
import { GradientSegment } from '../../types/margin';
import { formatPercent } from '../../lib/marginCalculations';

interface MarginGradientProps {
  segments: GradientSegment[];
  isDark: boolean;
}

const MarginGradient: React.FC<MarginGradientProps> = ({ segments, isDark }) => {
  if (segments.length === 0) {
    return (
      <div className={`h-16 rounded-2xl flex items-center justify-center border ${
        isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Заполните данные для расчёта
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Градиентная шкала */}
      <div className="h-12 rounded-2xl overflow-hidden flex shadow-lg">
        {segments.map((segment, index) => {
          const width = Math.max(segment.percent, 0.5); // Минимальная ширина для видимости
          return (
            <div
              key={index}
              className="relative group transition-all duration-300 hover:brightness-110"
              style={{
                width: `${width}%`,
                backgroundColor: segment.color,
              }}
            >
              {/* Tooltip при наведении */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl ${
                  isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
                }`}>
                  {segment.label}: {formatPercent(segment.percent)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Легенда под шкалой */}
      <div className="flex flex-wrap gap-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className={`text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {segment.label} ({formatPercent(segment.percent)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarginGradient;
