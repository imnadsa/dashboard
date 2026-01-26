import React from 'react';
import { ArrowUpRight, ArrowDownRight, Landmark, LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface StatsSectionProps {
  income: number;
  expense: number;
  profit: number;
  isDark: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'brand' | 'rose' | 'emerald';
  highlight?: boolean;
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, variant, highlight, isDark }) => {
  const iconColors = {
    brand: 'bg-brand text-white shadow-brand/30',
    rose: 'bg-rose-400 text-white shadow-rose-400/30',
    emerald: 'bg-emerald-500 text-white shadow-emerald-500/30',
  };

  const valueColors = {
    brand: isDark ? 'text-slate-100' : 'text-slate-900',
    rose: isDark ? 'text-slate-100' : 'text-slate-900',
    emerald: value >= 0 
      ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
      : 'text-rose-500',
  };

  return (
    <div className={`p-6 sm:p-8 rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1 ${
      highlight 
        ? variant === 'emerald'
          ? isDark 
            ? 'glass-card ring-2 ring-emerald-500/20' 
            : 'glass-card ring-2 ring-emerald-500/10'
          : 'glass-card'
        : 'glass-card'
    }`}>
      <div className="flex justify-between items-start mb-5">
        <div className={`p-2.5 rounded-xl shadow-lg ${iconColors[variant]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      
      <p className={`text-[9px] font-semibold uppercase tracking-[0.25em] mb-1.5 ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        {label}
      </p>
      
      <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${valueColors[variant]}`}>
        {formatCurrency(value)}
      </h3>
    </div>
  );
};

const StatsSection: React.FC<StatsSectionProps> = ({ income, expense, profit, isDark }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <StatCard
        label="Выручка"
        value={income}
        icon={ArrowUpRight}
        variant="brand"
        isDark={isDark}
      />
      <StatCard
        label="Расходы"
        value={expense}
        icon={ArrowDownRight}
        variant="rose"
        isDark={isDark}
      />
      <StatCard
        label="Чистая прибыль"
        value={profit}
        icon={Landmark}
        variant="emerald"
        highlight
        isDark={isDark}
      />
    </section>
  );
};

export default StatsSection;
