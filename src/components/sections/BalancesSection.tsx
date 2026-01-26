import React from 'react';
import { Wallet, Banknote, CreditCard, LucideIcon } from 'lucide-react';
import Lottie from 'lottie-react';
import { Balances } from '../../types';

// Импорт анимаций
import firstAnimation from '../../assets/lottie/first.json';
import cashAnimation from '../../assets/lottie/cash.json';
import cardAnimation from '../../assets/lottie/card.json';

interface BalancesSectionProps {
  balances: Balances;
  isDark: boolean;
}

interface BalanceCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  lottieData?: any;
  isPrimary?: boolean;
  isDark: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ label, value, icon: Icon, lottieData, isPrimary, isDark }) => {
  const formattedValue = new Intl.NumberFormat('ru-RU').format(value);

  return (
    <div
      className={`relative group p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1 ${
        isPrimary
          ? 'bg-gradient-to-br from-[#4295B0] via-[#3a819b] to-[#2d5a6d] text-white shadow-lg'
          : isDark
            ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-md'
            : 'bg-white border border-slate-100 shadow-sm'
      }`}
    >
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        
        {/* Контейнер для иконки или Lottie */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-110 ${
          lottieData
            ? 'bg-transparent' // Прозрачный фон, если есть Lottie
            : isPrimary 
              ? 'bg-white/20 backdrop-blur-md shadow-lg' 
              : isDark 
                ? 'bg-slate-900/60 text-brand' 
                : 'bg-brand/5 text-brand'
        }`}>
          {lottieData ? (
            <Lottie 
              animationData={lottieData} 
              loop={true} 
              className="w-14 h-14 sm:w-16 sm:h-16 scale-110" 
            />
          ) : (
            Icon && <Icon size={24} className="sm:w-[26px] sm:h-[26px]" strokeWidth={1.5} />
          )}
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 ${
            isPrimary ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tighter tabular-nums ${
              isPrimary ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {formattedValue}
            </h3>
            <span className={`text-lg sm:text-xl font-light opacity-50 ${
              isPrimary ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalancesSection: React.FC<BalancesSectionProps> = ({ balances, isDark }) => {
  return (
    <section className={`relative px-6 py-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border transition-all duration-500 ${
      isDark 
        ? 'bg-slate-900/50 border-slate-800/50 backdrop-blur-2xl' 
        : 'bg-slate-50/50 border-slate-200/60'
    }`}>
      
      <div className="space-y-2 mb-8 sm:mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-2.5 w-2.5">
            <span className="animate-[pulse_3s_ease-in-out_infinite] inline-flex h-full w-full rounded-full bg-emerald-500/80"></span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Остатки на счетах
          </h2>
        </div>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-[280px] sm:max-w-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Информация в реальном времени о состоянии ваших счетов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        <BalanceCard
          label="Всего средств"
          value={balances.totalFunds}
          lottieData={firstAnimation}
          isPrimary
          isDark={isDark}
        />
        <BalanceCard
          label="Наличные"
          value={balances.cash}
          lottieData={cashAnimation}
          isDark={isDark}
        />
        <BalanceCard
          label="Банковский счет"
          value={balances.bankAccount}
          lottieData={cardAnimation}
          isDark={isDark}
        />
      </div>
    </section>
  );
};

export default BalancesSection;
