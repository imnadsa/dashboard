import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseCategory, GradientConfig } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface PieWithListProps {
  data: ExpenseCategory[];
  gradients: GradientConfig[];
  isDark: boolean;
}

const PieWithList: React.FC<PieWithListProps> = ({ data, gradients, isDark }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.amount, 0), [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Нет данных за этот период
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Pie Chart */}
      <div className="h-[280px] sm:h-[320px] lg:h-[360px] relative flex items-center justify-center">
        {/* Glow effect */}
        <div className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-brand/10' : 'bg-slate-500/5'
        } ${activeIndex !== null ? 'opacity-100' : 'opacity-40'}`} />

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="85%"
              paddingAngle={3}
              dataKey="amount"
              nameKey="name"
              stroke="none"
              cornerRadius={6}
              animationBegin={0}
              animationDuration={800}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#${gradients[index % gradients.length].id})`}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                  className="cursor-pointer outline-none transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip
              offset={25}
              contentStyle={{
                borderRadius: '14px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                padding: '10px 14px',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
              }}
              itemStyle={{
                fontSize: '13px',
                fontWeight: '700',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
              formatter={(v: number) => formatCurrency(v)}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center">
          <p className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.25em] mb-1 transition-colors ${
            activeIndex !== null ? 'text-brand' : isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Итого
          </p>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight leading-tight transition-transform duration-300 ${
            activeIndex !== null ? 'scale-105' : ''
          } ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
        {data.map((item, idx) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;
          const grad = gradients[idx % gradients.length];
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-slate-700/50 border-brand/50 shadow-lg translate-x-1'
                    : 'bg-white border-brand/30 shadow-md translate-x-1'
                  : isDark
                    ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    : 'bg-white/50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-inner flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{ background: `linear-gradient(135deg, ${grad.colors[0]}, ${grad.colors[1]})` }}
                  >
                    <span className="text-[9px] sm:text-[10px] text-white font-extrabold">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] sm:text-[13px] font-bold transition-colors truncate ${
                      isActive ? 'text-brand' : isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {item.name}
                    </p>
                    <p className={`text-[8px] sm:text-[9px] font-medium uppercase mt-0.5 tracking-wider ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Категория
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className={`text-[12px] sm:text-[14px] font-bold whitespace-nowrap transition-colors ${
                    isActive ? 'text-brand' : isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieWithList;
