import React from 'react';
import { Wallet, Banknote, CreditCard, Zap, LucideIcon } from 'lucide-react';
import { Balances } from '../../types';

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

const BalanceCard: React.FC<BalanceCardProps> = ({ label, value, icon: Icon, isPrimary, isDark }) => {
  const formattedValue = new Intl.NumberFormat('ru-RU').format(value);

  return (
    <div
      className={`relative group p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${
        isPrimary
          ? 'bg-gradient-to-br from-[#4295B0] via-[#3a819b] to-[#2d5a6d] text-white shadow-[0_20px_40px_rgba(66,149,176,0.3)]'
          : isDark
            ? 'bg-slate-800/40 border border-slate-700/50 hover:border-brand/50 backdrop-blur-md'
            : 'bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand/20'
      }`}
    >
      {/* Скрытый блик, который появляется при наведении */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 ${
        isPrimary ? 'bg-white/10' : 'bg-brand/5'
      }`} />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Иконка в стеклянном боксе */}
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-lg ${
          isPrimary 
            ? 'bg-white/20 backdrop-blur-md' 
            : isDark 
              ? 'bg-slate-900/60 text-brand' 
              : 'bg-brand/5 text-brand'
        }`}>
          <Icon size={26} strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 ${
            isPrimary ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-black tracking-tighter tabular-nums">
              {formattedValue}
            </h3>
            <span className="text-xl font-light opacity-50">₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalancesSection: React.FC<BalancesSectionProps> = ({ balances, isDark }) => {
  return (
    <section className={`relative p-1 sm:p-10 rounded-[3.5rem] border transition-all duration-500 ${
      isDark 
        ? 'bg-slate-900/50 border-slate-800/50 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]' 
        : 'bg-slate-50/50 border-slate-200/60 backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* Шапка блока с заголовком и описанием */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 px-6 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Пульсирующая точка "Live" */}
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Остатки на счетах
            </h2>
          </div>
          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Информация в реальном времени о состоянии ваших счетов
          </p>
        </div>

        {/* Бейдж Live Update */}
        <div className={`self-start md:self-center flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] ${
          isDark 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
        }`}>
          <Zap size={14} fill="currentColor" />
          Live status
        </div>
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
      </div>
    </section>
  );
};

export default BalancesSection;
