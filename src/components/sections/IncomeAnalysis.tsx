import React from 'react';
import { Coins } from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { INCOME_GRADIENTS } from '../../config/gradients';
import PieWithList from '../charts/PieWithList';

interface IncomeAnalysisProps {
  data: ExpenseCategory[];
  selectedMonth: string;
  isDark: boolean;
}

const IncomeAnalysis: React.FC<IncomeAnalysisProps> = ({ data, selectedMonth, isDark }) => {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <section className="glass-card rounded-[2rem] p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Coins size={20} className="text-emerald-500" />
            </div>
            Источники доходов
          </h3>
          <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Распределение прибыли
          </p>
        </div>
        <div className={`self-start sm:self-center px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.15em] ${
          isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {selectedMonth}
        </div>
      </div>

      <PieWithList data={sortedData} gradients={INCOME_GRADIENTS} isDark={isDark} />
    </section>
  );
};

export default IncomeAnalysis;
