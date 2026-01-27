import React, { useRef } from 'react';
import { Landmark, LucideIcon } from 'lucide-react';
import Lottie from 'lottie-react';

// Импорт анимаций
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
  const lottieRef = useRef<any>(null);

  const themes = {
    brand: { border: 'border-slate-700/50 hover:border-blue-500/50', glow: 'transparent', val: isDark ? 'text-slate-100' : 'text-slate-900' },
    rose: { border: 'border-slate-700/50 hover:border-rose-500/50', glow: 'transparent', val: isDark ? 'text-slate-100' : 'text-slate-900' },
    emerald: { border: 'border-emerald-500/30', glow: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.05)', val: isDark ? 'text-emerald-400' : 'text-emerald-600' }
  };

  const theme = themes[variant];

  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
      className={`relative group p-6 sm:p-8 rounded-[2.2rem] transition-all duration-500 hover:-translate-y-1 border backdrop-blur-md overflow-hidden flex flex-col h-[180px] sm:h-[220px] justify-between ${
        isDark ? 'bg-slate-800/40' : 'bg-white shadow-sm hover:shadow-xl'
      } ${theme.border}`}
      style={{ boxShadow: variant === 'emerald' ? `0 15px 45px -10px ${theme.glow}` : undefined }}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Контейнер для анимации с фиксированным местом */}
        <div className="h-20 w-full flex items-center justify-start">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {lottieData ? (
              <div className="absolute inset-0 flex items-center justify-center scale-[1.5] translate-y-[-5%]">
                <Lottie 
                  lottieRef={lottieRef}
                  animationData={lottieData} 
                  loop={true} 
                  autoplay={false}
                  className="w-full h-full pointer-events-none" 
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                {Icon && <Icon size={28} strokeWidth={2.5} />}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-2xl sm:text-4xl font-black tracking-tighter tabular-nums ${theme.val}`}>
              {value < 0 ? '-' : ''}{formattedValue}
            </h3>
            <span className={`text-lg opacity-50 ${theme.val}`}>₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsSection: React.FC<StatsSectionProps> = ({ income, expense, profit, isDark }) => {
  return (
    <section className={`relative p-6 sm:p-10 rounded-[2.5rem] border transition-all duration-500 ${
      isDark ? 'bg-slate-900/50 border-slate-800/50 backdrop-blur-2xl shadow-2xl' : 'bg-slate-50/50 border-slate-200/60 shadow-sm'
    }`}>
      
      <div className="space-y-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-2.5 w-2.5">
            <span className="animate-[pulse_4s_infinite] inline-flex h-full w-full rounded-full bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.4)]"></span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ежемесячные итоги
          </h2>
        </div>
        <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Выручка, расходы и чистая прибыль за период
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Выручка" value={income} lottieData={upAnimation} variant="brand" isDark={isDark} />
        <StatCard label="Расходы" value={expense} lottieData={downAnimation} variant="rose" isDark={isDark} />
        <StatCard label="Чистая прибыль" value={profit} icon={Landmark} variant="emerald" isDark={isDark} />
      </div>
    </section>
  );
};

export default StatsSection;
