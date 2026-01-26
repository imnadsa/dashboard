import React from 'react';
import { Wallet, Banknote, CreditCard, LucideIcon } from 'lucide-react';
import { Balances } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BalancesSectionProps {
  balances: Balances;
  isDark: boolean;
}

interface BalanceCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  isPrimary?: boolean;
  isDark: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ label, value, icon: Icon, isPrimary, isDark }) => (
  <div
    className={`p-6 sm:p-8 rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1 ${
      isPrimary
        ? 'glass-card-accent'
        : 'glass-card'
    }`}
  >
    <div className="flex justify-between items-start mb-5">
      <div className={`p-2.5 rounded-xl ${
        isPrimary 
          ? 'bg-brand/20 text-brand' 
          : isDark 
            ? 'bg-slate-700/50 text-slate-400' 
            : 'bg-slate-100 text-slate-500'
      }`}>
        <Icon size={18} strokeWidth={2} />
      </div>
    </div>
    
    <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-1.5 ${
      isPrimary 
        ? 'text-brand/70' 
        : isDark 
          ? 'text-slate-500' 
          : 'text-slate-400'
    }`}>
      {label}
    </p>
    
    <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
      isPrimary 
        ? isDark ? 'text-brand-300' : 'text-brand-700'
        : isDark 
          ? 'text-slate-100' 
          : 'text-slate-800'
    }`}>
      {formatCurrency(value)}
    </h3>
  </div>
);

const BalancesSection: React.FC<BalancesSectionProps> = ({ balances, isDark }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <BalanceCard
        label="Всего средств"
        value={balances.totalFunds}
        icon={Wallet}
        isPrimary
        isDark={isDark}
      />
      <BalanceCard
        label="Наличные"
        value={balances.cash}
        icon={Banknote}
        isDark={isDark}
      />
      <BalanceCard
        label="Банковский счет"
        value={balances.bankAccount}
        icon={CreditCard}
        isDark={isDark}
      />
    </section>
  );
};

export default BalancesSection;
