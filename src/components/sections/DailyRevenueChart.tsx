import React, { useMemo } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { DailyIncome } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface DailyRevenueChartProps {
  data: DailyIncome[];
  selectedMonth: string;
  isDark: boolean;
}

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ data, selectedMonth, isDark }) => {
  // Calculate trend line
  const dataWithTrend = useMemo(() => {
    if (data.length === 0) return [];

    let lastDayWithData = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].amount > 0) {
        lastDayWithData = i;
        break;
      }
    }

    if (lastDayWithData === -1) return data.map(d => ({ ...d, trend: 0 }));

    const slice = data.slice(0, lastDayWithData + 1);
    const n = slice.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      const x = slice[i].day;
      const y = slice[i].amount;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return data.map(d => ({ ...d, trend: d.amount }));

    const m = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - m * sumX) / n;

    return data.map(d => ({
      ...d,
      trend: Math.max(0, m * d.day + b),
    }));
  }, [data]);

  return (
    <section className="glass-card rounded-[2rem] p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-brand/10' : 'bg-brand/5'}`}>
              <Activity size={20} className="text-brand" />
            </div>
            Динамика выручки по дням
          </h3>
          <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Ежедневная активность за месяц
          </p>
        </div>
        <div className={`self-start sm:self-center px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.15em] ${
          isDark ? 'bg-brand/10 text-brand' : 'bg-brand/5 text-brand-700'
        }`}>
          {selectedMonth}
        </div>
      </div>

      <div className="h-[280px] sm:h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataWithTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4295B0" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4295B0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#f1f5f9'}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: isDark ? '#475569' : '#94a3b8' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: isDark ? '#475569' : '#94a3b8' }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                padding: '12px 16px',
              }}
              itemStyle={{
                color: '#4295B0',
                fontWeight: '700',
                fontSize: '13px',
              }}
              labelStyle={{
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '11px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
              formatter={(v: number, name: string) => [
                formatCurrency(v),
                name === 'trend' ? 'Линия тренда' : 'Выручка',
              ]}
              labelFormatter={(v) => `${v} число`}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#4295B0"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorIncome)"
              animationDuration={1200}
              dot={{ r: 3.5, fill: '#4295B0', strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4295B0' }}
              name="amount"
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#4295B0"
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.25}
              dot={false}
              activeDot={false}
              name="trend"
              animationDuration={1200}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DailyRevenueChart;
