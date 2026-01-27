import React, { useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Landmark, LucideIcon } from 'lucide-react';
import Lottie from 'lottie-react';

// Импорт анимаций (убедись, что файлы лежат в assets/lottie/)
import upAnimation from '../../assets/lottie/up.json';
import downAnimation from '../../assets/lottie/down.json';

interface StatsSectionProps {
  income: number;
  expense: number;
  profit: number;
  isDark: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  lottieData?: any;
  variant: 'brand' | 'rose' | 'emerald';
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, lottieData, variant, isDark }) => {
  const formattedValue = new Intl.NumberFormat('ru-RU').format(Math.abs(value));
  
  // Реф для управления анимацией с типом any для обхода ошибок TS
  const lottieRef = useRef<any>(null);

  const themes = {
    brand: {
      icon: 'bg-blue-500 text-white',
      border: isDark ? 'border-slate-700/50 hover:border-blue-500/50' : 'border-slate-100 hover:border-blue-200',
      glow: 'transparent', // Обязательно для TS
      valueText: isDark ? 'text-slate-100' : 'text-slate-900'
    },
    rose: {
      icon: 'bg-rose-500 text-white',
      border: isDark ? 'border-slate-700/50 hover:border-rose-500/50' : 'border-slate-100 hover:border-rose-200',
      glow: 'transparent', // Обязательно для TS
      valueText: isDark ? 'text-slate-100' : 'text-slate-900'
    },
    emerald: {
      icon: 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      border: isDark ? 'border-emerald-500/30' : 'border-emerald-100',
      glow: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.05)',
      valueText: isDark ? 'text-emerald-400' : 'text-emerald-600'
    }
  };

  const theme = themes[variant];

  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
      className={`relative group p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1 border backdrop-blur-md cursor-default ${
        isDark ? 'bg-slate-800/40' : 'bg-white shadow-sm hover:shadow-xl'
      } ${theme.border}`}
      style={{ 
        boxShadow: variant === 'emerald' ? `0 15px 45px -10px ${theme.glow}` : undefined 
      }}
    >
      {variant === 'emerald' && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        
        {/* Иконка или Lottie */}
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
          lottieData ? 'bg-transparent' : theme.icon + ' rounded-2xl shadow-lg'
        }`}>
          {lottieData ? (
            <Lottie 
              lottieRef={lottieRef}
              animationData={lottieData} 
              loop={true} 
              autoplay={false}
              className="w-24 h-24 sm:w-32 sm:h-32 scale-[1.5] pointer-events-none" 
            />
          ) : (
            Icon && <Icon size={28} strokeWidth={2.5} />
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] ${
            variant === 'emerald' 
              ? (isDark ? 'text-emerald-500/70' : 'text-emerald-600/70') 
              : (isDark ? 'text-slate-500' : 'text-slate-400')
          }`}>
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-2xl sm:text-4xl font-black tracking-tighter tabular-nums ${theme.valueText}`}>
              {value < 0 ? '-' : ''}{formattedValue}
            </h3>
            <span className={`text-lg sm:text-2xl font-light opacity-50 ${theme.valueText}`}>₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsSection: React.FC<StatsSectionProps> = ({ income, expense, profit, isDark }) => {
  return (
    <section className={`relative px-6 py-8 sm:p-10 rounded-[2.2rem] sm:rounded-[3rem] border transition-all duration-500 ${
      isDark 
        ? 'bg-slate-900/50 border-slate-800/50 backdrop-blur-2xl shadow-xl' 
        : 'bg-slate-50/50 border-slate-200/60 shadow-sm'
    }`}>
      
      <div className="space-y-2 mb-10 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="flex h-2.5 w-2.5">
            <span className="animate-[pulse_4s_ease-in-out_infinite] inline-flex h-full w-full rounded-full bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.4)]"></span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ежемесячные итоги
          </h2>
        </div>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Выручка, расходы и чистая прибыль за период
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        <StatCard
          label="Выручка"
          value={income}
          lottieData={upAnimation}
          variant="brand"
          isDark={isDark}
        />
        <StatCard
          label="Расходы"
          value={expense}
          lottieData={downAnimation}
          variant="rose"
          isDark={isDark}
        />
        <StatCard
          label="Чистая прибыль"
          value={profit}
          icon={Landmark}
          variant="emerald"
          isDark={isDark}
        />
      </div>
    </section>
  );
};

export default StatsSection;
