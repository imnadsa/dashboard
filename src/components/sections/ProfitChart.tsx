import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SummaryData } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface ProfitChartProps {
  data: SummaryData[];
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
  isDark: boolean;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data, selectedMonth, onMonthSelect, isDark }) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h3 className={`text-[9px] sm:text-[11px] font-semibold flex items-center gap-2 uppercase tracking-[0.2em] ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <TrendingUp className="w-4 h-4 text-brand" />
          Динамика прибыли
        </h3>
      </div>

      <div className="h-[200px] sm:h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDark ? '#334155' : '#f1f5f9'} 
            />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontWeight: 500, fill: isDark ? '#475569' : '#94a3b8' }} 
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                padding: '12px 16px',
              }}
              itemStyle={{
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontWeight: '600',
                fontSize: '13px',
              }}
              labelStyle={{
                color: isDark ? '#94a3b8' : '#475569',
                marginBottom: '4px',
                fontSize: '11px',
              }}
              formatter={(v: number) => [formatCurrency(v), 'Прибыль']}
            />
            <Bar
              dataKey="delta"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onClick={(data) => onMonthSelect(data.month)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.month === selectedMonth
                      ? '#10b981'
                      : isDark
                        ? '#475569'
                        : '#e2e8f0'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ProfitChart;
