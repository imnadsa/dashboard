import React, { useRef } from 'react';
import { Wallet, Banknote, CreditCard, LucideIcon } from 'lucide-react';
import Lottie from 'lottie-react'; // Убрали импорт типа LottieRefApi
import { Balances } from '../../types';

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
  
  // Используем <any>, чтобы TypeScript не ругался на версию библиотеки
  const lottieRef = useRef<any>(null);

  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()} 
      className={`relative group p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1 cursor-default ${
        isPrimary
          ? 'bg-gradient-to-br from-[#4295B0] via-[#3a819b] to-[#2d5a6d] text-white shadow-lg'
          : isDark
            ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-md'
            : 'bg-white border border-slate-100 shadow-sm'
      }`}
    >
      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
          lottieData ? 'bg-transparent' : 'bg-slate-900/60 rounded-2xl text-brand'
        }`}>
          {lottieData ? (
            <Lottie 
              lottieRef={lottieRef}
              animationData={lottieData} 
              loop={true} 
              autoplay={false}
              className="w-24 h-24 sm:w-32 sm:h-32 scale-[1.3] pointer-events-none" 
            />
          ) : (
            Icon && <Icon size={28} strokeWidth={1.5} />
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 ${
            isPrimary ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-2xl sm:text-4xl font-black tracking-tighter tabular-nums ${
              isPrimary ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {formattedValue}
            </h3>
            <span className={`text-lg sm:text-2xl font-light opacity-50 ${
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
    <section className={`relative px-6 py-8 sm:p-10 rounded-[2.2rem] sm:rounded-[3rem] border transition-all duration-500 ${
      isDark 
        ? 'bg-slate-900/50 border-slate-800/50 backdrop-blur-2xl shadow-xl' 
        : 'bg-slate-50/50 border-slate-200/60 shadow-sm'
    }`}>
      <div className="space-y-2 mb-10 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="flex h-2.5 w-2.5">
            <span className="animate-[pulse_4s_ease-in-out_infinite] inline-flex h-full w-full rounded-full bg-emerald-500/80"></span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Остатки на счетах
          </h2>
        </div>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-[280px] sm:max-w-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Информация в реальном времени о состоянии ваших счетов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
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
