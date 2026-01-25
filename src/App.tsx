import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, Line, ComposedChart
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Landmark, TrendingUp,
  Wallet, Banknote, CreditCard,
  PieChart as PieIcon, Coins, Moon, Sun, Activity,
  LucideIcon, Target, ChevronDown
} from 'lucide-react';
import { parseSummaryCSV, formatCurrency, SummaryData, Balances, DailyIncome, AverageStats } from './utils';
import { ExpenseCategory } from './types';
import PasswordProtection from './PasswordProtection';

const CSV_URL = import.meta.env.VITE_CSV_URL;
const DASHBOARD_NAME = import.meta.env.VITE_DASHBOARD_NAME;
const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD;

const EXPENSE_GRADIENTS = [
  { id: 'exp1', colors: ['#4295B0', '#2d5a6d'] },
  { id: 'exp2', colors: ['#60a5fa', '#2563eb'] },
  { id: 'exp3', colors: ['#a7d0dd', '#7bb2c6'] },
  { id: 'exp4', colors: ['#cbe4ec', '#a7d0dd'] },
  { id: 'exp5', colors: ['#3b82f6', '#1d4ed8'] },
  { id: 'exp6', colors: ['#93c5fd', '#3b82f6'] },
];

const INCOME_GRADIENTS = [
  { id: 'inc1', colors: ['#10b981', '#065f46'] },
  { id: 'inc2', colors: ['#34d399', '#059669'] },
  { id: 'inc3', colors: ['#fbbf24', '#d97706'] },
  { id: 'inc4', colors: ['#f59e0b', '#b45309'] },
  { id: 'inc5', colors: ['#059669', '#064e3b'] },
  { id: 'inc6', colors: ['#6ee7b7', '#10b981'] },
];

const PieWithList = ({ data, gradients, isDark }: { data: ExpenseCategory[], gradients: any[], isDark: boolean }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.amount, 0), [data]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="h-[300px] sm:h-[350px] lg:h-[400px] relative flex items-center justify-center">
        <div className={`absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl transition-opacity duration-500 ${isDark ? 'bg-brand/10' : 'bg-slate-500/5'} ${activeIndex !== null ? 'opacity-100' : 'opacity-40'}`}></div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={4}
                dataKey="amount"
                nameKey="name"
                stroke="none"
                cornerRadius={8}
                animationBegin={0}
                animationDuration={800}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#${gradients[index % gradients.length].id})`}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                    className="cursor-pointer outline-none"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                offset={25}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '8px 12px',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                }}
                itemStyle={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: isDark ? '#f1f5f9' : '#0f172a'
                }}
                formatter={(v: any) => formatCurrency(v)}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-slate-300 italic">Нет данных</div>
        )}
        <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center max-w-[50%]">
          <p className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.25em] mb-1 transition-colors ${activeIndex !== null ? 'text-brand' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Итого</p>
          <p className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight leading-tight transition-transform duration-300 ${activeIndex !== null ? 'scale-110' : ''} ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
        {data.map((item, idx) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;
          const grad = gradients[idx % gradients.length];
          const isActive = activeIndex === idx;

          return (
            <div 
              key={idx} 
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`group relative p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] border transition-all duration-300 cursor-pointer ${
                isActive 
                  ? isDark 
                    ? 'bg-slate-700/50 border-brand shadow-lg ring-1 ring-brand/30 translate-x-1' 
                    : 'bg-white border-brand shadow-md ring-1 ring-brand/10 translate-x-1'
                  : isDark 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div 
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl shadow-inner flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'scale-105 shadow-lg' : ''}`} 
                    style={{ background: `linear-gradient(135deg, ${grad.colors[0]}, ${grad.colors[1]})` }}
                  >
                    <span className="text-[9px] sm:text-[10px] text-white font-extrabold leading-none">{Math.round(percentage)}%</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] sm:text-[13px] font-bold transition-colors truncate ${isActive ? 'text-brand' : isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.name}</p>
                    <p className={`text-[8px] sm:text-[9px] font-medium uppercase mt-0.5 tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Категория</p>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className={`text-[12px] sm:text-sm font-bold whitespace-nowrap transition-colors ${isActive ? 'text-brand' : isDark ? 'text-slate-100' : 'text-slate-900'}`}>{formatCurrency(item.amount)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BalanceCard = ({ label, value, icon: Icon, isPrimary, isDark }: { label: string, value: number, icon: LucideIcon, isPrimary?: boolean, isDark: boolean }) => (
  <div className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all hover:-translate-y-1 ${
    isPrimary 
      ? 'bg-brand border-brand-600 text-white shadow-xl shadow-brand/20' 
      : isDark 
        ? 'bg-slate-800 border-slate-700 text-slate-100 shadow-sm' 
        : 'bg-white border-slate-100 text-slate-900 shadow-sm'
  }`}>
    <div className="flex justify-between items-start mb-4 sm:mb-6">
      <div className={`p-2 rounded-xl ${isPrimary ? 'bg-white/10' : isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
        <Icon size={16} strokeWidth={2} />
      </div>
    </div>
    <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 ${isPrimary ? 'text-brand-50/80' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
    <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isPrimary ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-800'}`}>{formatCurrency(value)}</h3>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, highlight, isDark }: { label: string, value: number, icon: LucideIcon, color?: string, highlight?: boolean, isDark: boolean }) => {
  const isEmerald = color === 'emerald';
  const isRose = color === 'rose';

  const containerClasses = highlight 
    ? `p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all hover:shadow-xl ring-2 sm:ring-4 ${
        isEmerald 
          ? isDark ? 'bg-emerald-950/20 border-emerald-900 ring-emerald-500/10' : 'bg-emerald-50/50 border-emerald-200 ring-emerald-500/5 shadow-emerald-100/30' 
          : isDark ? 'bg-slate-800 border-slate-700 ring-brand/10' : 'bg-white border-slate-100 ring-brand/5'
      }`
    : `p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border shadow-sm transition-all hover:shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`;

  const iconClasses = isEmerald ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' :
                    isRose ? 'bg-rose-400 text-white shadow-sm shadow-rose-400/20' :
                    'bg-brand-50 text-brand-500';

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className={`p-2 rounded-xl transition-transform hover:scale-110 ${iconClasses}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
      <p className={`text-[9px] font-semibold uppercase tracking-[0.25em] mb-1 sm:mb-2 ${isEmerald ? isDark ? 'text-emerald-500/80' : 'text-emerald-700/80' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </p>
      <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${value < 0 ? 'text-rose-500' : isEmerald ? isDark ? 'text-emerald-400' : 'text-emerald-950' : isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        {formatCurrency(value)}
      </h3>
    </div>
  );
};

const AverageEfficiencyCard = ({ label, monthVal, icon: Icon, color, isDark }: { label: string, monthVal: number, icon: LucideIcon, color: string, isDark: boolean }) => {
  const isEmerald = color === 'emerald';
  const isRose = color === 'rose';
  
  const iconBg = isEmerald ? 'bg-emerald-500' : isRose ? 'bg-rose-400' : 'bg-brand';

  return (
    <div className={`p-6 sm:p-8 rounded-[2rem] border shadow-sm transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-2.5 rounded-xl text-white shadow-sm ${iconBg}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <h4 className={`text-[13px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</h4>
      </div>
      
      <div className="space-y-1">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Среднее за день</p>
        <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{formatCurrency(monthVal)}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<SummaryData[]>([]);
  const [balances, setBalances] = useState<Balances>({ totalFunds: 0, cash: 0, bankAccount: 0 });
  const [detailedExpenses, setDetailedExpenses] = useState<Record<string, ExpenseCategory[]>>({});
  const [detailedIncome, setDetailedIncome] = useState<Record<string, ExpenseCategory[]>>({});
  const [dailyIncome, setDailyIncome] = useState<Record<string, DailyIncome[]>>({});
  const [dailyAverages, setDailyAverages] = useState<Record<string, AverageStats>>({});
  const [yearlyAverages, setYearlyAverages] = useState<AverageStats>({ revenue: 0, expense: 0, profit: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); // ✅ Новое состояние для времени
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
      if (response.ok) {
        const text = await response.text();
        const data = parseSummaryCSV(text);
        
        setBalances(data.balances);
        setDetailedExpenses(data.detailedExpenses);
        setDetailedIncome(data.detailedIncome);
        setDailyIncome(data.dailyIncome);
        setDailyAverages(data.dailyAverages);
        setYearlyAverages(data.yearlyAverages);
        
        // ✅ Обновляем время успешного обновления
        setLastUpdated(new Date());

        if (data.monthly.length > 0) {
          setMonthlyData(data.monthly);
          setSelectedMonth(prev => {
            if (prev && data.monthly.find(d => d.month === prev)) return prev;
            return data.monthly[data.monthly.length - 1].month;
          });
        }
      }
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 300000); // 5 минут
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0b0f19';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FBFBFE';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const currentStats = useMemo(() => {
    return monthlyData.find(d => d.month === selectedMonth) || null;
  }, [monthlyData, selectedMonth]);

  const currentDailyAvg = useMemo(() => {
    return dailyAverages[selectedMonth] || { revenue: 0, expense: 0, profit: 0 };
  }, [dailyAverages, selectedMonth]);

  const currentExpenseBreakdown = useMemo(() => {
    return (detailedExpenses[selectedMonth] || []).sort((a, b) => b.amount - a.amount);
  }, [detailedExpenses, selectedMonth]);

  const currentIncomeBreakdown = useMemo(() => {
    return (detailedIncome[selectedMonth] || []).sort((a, b) => b.amount - a.amount);
  }, [detailedIncome, selectedMonth]);

  const currentDailyDataWithTrend = useMemo(() => {
    const rawData = dailyIncome[selectedMonth] || [];
    if (rawData.length === 0) return [];
    
    let lastDayWithData = -1;
    for(let i = rawData.length - 1; i >= 0; i--) {
      if (rawData[i].amount > 0) {
        lastDayWithData = i;
        break;
      }
    }
    
    if (lastDayWithData === -1) return rawData.map(d => ({ ...d, trend: 0 }));

    const slice = rawData.slice(0, lastDayWithData + 1);
    const sn = slice.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < sn; i++) {
      const x = slice[i].day;
      const y = slice[i].amount;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    
    const denominator = (sn * sumX2 - sumX * sumX);
    if (denominator === 0) {
       return rawData.map(d => ({ ...d, trend: d.amount }));
    }

    const m = (sn * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / sn;
    
    return rawData.map(d => ({
      ...d,
      trend: Math.max(0, m * d.day + b)
    }));
  }, [dailyIncome, selectedMonth]);

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          {[...EXPENSE_GRADIENTS, ...INCOME_GRADIENTS].map(g => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g.colors[0]} />
              <stop offset="100%" stopColor={g.colors[1]} />
            </linearGradient>
          ))}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4295B0" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4295B0" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </svg>

      <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col">
              <h1 className={`text-[14px] sm:text-base font-extrabold tracking-tight uppercase leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{DASHBOARD_NAME}</h1>
              <p className={`text-[9px] sm:text-[11px] font-semibold mt-0.5 uppercase tracking-[0.25em] ${isDark ? 'text-brand-500/70' : 'text-brand/70'}`}>Дашборд</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all active:scale-95 ${isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`pl-3 pr-8 py-1.5 border hover:opacity-80 rounded-lg text-[11px] sm:text-[12px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand/10 cursor-pointer transition-all min-w-[110px] sm:min-w-[140px] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}
              >
                {monthlyData.map(d => (
                  <option key={d.month} value={d.month}>{d.month}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            {/* ✅ НОВЫЙ ИНДИКАТОР ВРЕМЕНИ (Вместо кнопки) */}
            {lastUpdated && (
               <div className="hidden sm:flex flex-col items-end ml-1">
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
                   Обновлено
                 </span>
                 <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                   {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
               </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <BalanceCard label="Всего средств" value={balances.totalFunds} icon={Wallet} isPrimary isDark={isDark} />
          <BalanceCard label="Наличные" value={balances.cash} icon={Banknote} isDark={isDark} />
          <BalanceCard label="Банковский счет" value={balances.bankAccount} icon={CreditCard} isDark={isDark} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <StatCard label="Выручка" value={currentStats?.income || 0} icon={ArrowUpRight} color="brand" isDark={isDark} />
          <StatCard label="Расходы" value={currentStats?.expense || 0} icon={ArrowDownRight} color="rose" isDark={isDark} />
          <StatCard label="Чистая прибыль" value={currentStats?.delta || 0} icon={Landmark} color="emerald" highlight isDark={isDark} />
        </section>

        <section className="space-y-6">
          <h2 className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Эффективность в день (в среднем)
            <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <AverageEfficiencyCard 
              label="Выручка в день" 
              monthVal={currentDailyAvg.revenue} 
              icon={TrendingUp} 
              color="brand" 
              isDark={isDark} 
            />
            <AverageEfficiencyCard 
              label="Расходы в день" 
              monthVal={currentDailyAvg.expense} 
              icon={ArrowDownRight} 
              color="rose" 
              isDark={isDark} 
            />
            <AverageEfficiencyCard 
              label="Прибыль в день" 
              monthVal={currentDailyAvg.profit} 
              icon={Target} 
              color="emerald" 
              isDark={isDark} 
            />
          </div>
        </section>

        <section className={`rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border shadow-sm transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className={`text-[9px] sm:text-[11px] font-semibold flex items-center gap-2 uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <TrendingUp className="w-3.5 h-3.5 text-brand" /> Динамика прибыли
            </h3>
          </div>
          <div className="h-[200px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* ✅ ИНТЕРАКТИВНОСТЬ И ЦВЕТА */}
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 500, fill: isDark ? '#475569' : '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}} 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  }} 
                  itemStyle={{
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}
                  labelStyle={{
                    color: isDark ? '#94a3b8' : '#475569',
                    marginBottom: '4px',
                    fontSize: '10px'
                  }}
                  formatter={(v: any) => [formatCurrency(v), '']} 
                />
                <Bar 
                  dataKey="delta" 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(data) => setSelectedMonth(data.month)}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.month === selectedMonth 
                          ? '#10b981' // Активный месяц (Зеленый)
                          : isDark 
                            ? '#475569' // ✅ ТЕМНАЯ ТЕМА: Светло-серо-синий (хорошо видно)
                            : '#E2E8F0' // Светлая тема: Светло-серый
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 sm:gap-12">
          <section className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-rose-950/20' : 'bg-rose-50'}`}><PieIcon size={18} className="text-rose-400" /></div>
                  Анализ расходов
                </h3>
                <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Структура затрат</p>
              </div>
              <div className={`self-start sm:self-center px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.1em] ${isDark ? 'bg-rose-400/10 text-rose-400' : 'bg-rose-400/5 text-rose-500'}`}>
                {selectedMonth}
              </div>
            </div>
            <PieWithList data={currentExpenseBreakdown} gradients={EXPENSE_GRADIENTS} isDark={isDark} />
          </section>

          <section className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}><Coins size={18} className="text-emerald-500" /></div>
                  Источники доходов
                </h3>
                <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Распределение прибыли</p>
              </div>
              <div className={`self-start sm:self-center px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.1em] ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {selectedMonth}
              </div>
            </div>
            <PieWithList data={currentIncomeBreakdown} gradients={INCOME_GRADIENTS} isDark={isDark} />
          </section>
        </div>

        <section className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border shadow-sm transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-brand/20' : 'bg-brand/5'}`}><Activity size={18} className="text-brand" /></div>
                Динамика выручки по дням
              </h3>
              <p className={`text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ежедневная активность за месяц</p>
            </div>
            <div className={`self-start sm:self-center px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.1em] ${isDark ? 'bg-brand/20 text-brand-500' : 'bg-brand/10 text-brand'}`}>
              {selectedMonth}
            </div>
          </div>
          
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentDailyDataWithTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4295B0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4295B0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 600, fill: isDark ? '#475569' : '#94a3b8'}}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: isDark ? '#475569' : '#94a3b8'}}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    padding: '12px'
                  }}
                  itemStyle={{
                    color: '#4295B0',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}
                  labelStyle={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '10px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  formatter={(v: any, name: string) => [formatCurrency(v), name === 'trend' ? 'Линия тренда' : 'Выручка']}
                  labelFormatter={(v) => `${v} число`}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4295B0" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={1500}
                  dot={{ r: 4, fill: '#4295B0', strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="amount"
                />
                <Line 
                  type="monotone" 
                  dataKey="trend" 
                  stroke="#4295B0" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  opacity={0.3} 
                  dot={false} 
                  activeDot={false} 
                  name="trend"
                  animationDuration={1500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

const ProtectedApp = () => {
  if (!DASHBOARD_PASSWORD) {
    return <App />;
  }
  return (
    <PasswordProtection correctPassword={DASHBOARD_PASSWORD}>
      <App />
    </PasswordProtection>
  );
};

export default ProtectedApp;
