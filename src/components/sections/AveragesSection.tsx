import React from 'react';
import { TrendingUp, ArrowDownRight, Target, LucideIcon } from 'lucide-react';
import { AverageStats } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface AveragesSectionProps {
  averages: AverageStats;
  isDark: boolean;
}

interface AverageCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'brand' | 'rose' | 'emerald';
  isDark: boolean;
}

const AverageCard: React.FC<AverageCardProps> = ({ label, value, icon: Icon, color, isDark }) => {
  const iconBg = {
    brand: 'bg-brand',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-2.5 rounded-xl text-white shadow-lg ${iconBg[color]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
        <h4 className={`text-[12px] sm:text-[13px] font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {label}
        </h4>
      </div>

      <div>
        <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Среднее за день
        </p>
        <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
};

const AveragesSection: React.FC<AveragesSectionProps> = ({ averages, isDark }) => {
  return (
    <section className="space-y-6">
      <h2 className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] flex items-center gap-3 ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        Эффективность в день (в среднем)
        <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <AverageCard
          label="Выручка в день"
          value={averages.revenue}
          icon={TrendingUp}
          color="brand"
          isDark={isDark}
        />
        <AverageCard
          label="Расходы в день"
          value={averages.expense}
          icon={ArrowDownRight}
          color="rose"
          isDark={isDark}
        />
        <AverageCard
          label="Прибыль в день"
          value={averages.profit}
          icon={Target}
          color="emerald"
          isDark={isDark}
        />
      </div>
    </section>
  );
};

export default AveragesSection;
