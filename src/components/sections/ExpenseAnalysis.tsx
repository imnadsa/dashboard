import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { EXPENSE_GRADIENTS } from '../../config/gradients';
import PieWithList from '../charts/PieWithList';

interface ExpenseAnalysisProps {
  data: ExpenseCategory[];
  selectedMonth: string;
  isDark: boolean;
}

const ExpenseAnalysis: React.FC<ExpenseAnalysisProps> = ({ data, selectedMonth, isDark }) => {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <section className="glass-card rounded-[2rem] p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
              <PieIcon size={20} className="text-rose-400" />
            </div>
            Анализ расходов
          </h3>
          <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Структура затрат
          </p>
        </div>
        <div className={`self-start sm:self-center px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.15em] ${
          isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-500'
        }`}>
          {selectedMonth}
        </div>
      </div>

      <PieWithList data={sortedData} gradients={EXPENSE_GRADIENTS} isDark={isDark} />
    </section>
  );
};

export default ExpenseAnalysis;
