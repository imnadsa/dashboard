import React, { useState, useMemo, useEffect } from 'react';
import Header from './layout/Header';
import SvgGradients from './ui/SvgGradients';
import {
  BalancesSection,
  StatsSection,
  AveragesSection,
  ProfitChart,
  ExpenseAnalysis,
  IncomeAnalysis,
  DailyRevenueChart,
} from './sections';
import { useDashboardData } from '../hooks/useDashboardData';

interface DashboardProps {
  clientName: string;
  csvUrl: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clientName, csvUrl, onLogout }) => {
  const { data, isLoading, lastUpdated } = useDashboardData(csvUrl);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  // Set initial month and year when data loads
  useEffect(() => {
    if (data.monthly.length > 0 && !selectedMonth) {
      // Получаем текущий месяц и год
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const monthNames = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
      ];
      const currentMonthName = monthNames[currentDate.getMonth()];
      
      // Устанавливаем текущий год
      setSelectedYear(currentYear);
      
      // Проверяем, есть ли текущий месяц в данных для текущего года
      const currentMonthExists = data.monthly.some(
        d => d.month === currentMonthName && d.year === currentYear
      );
      
      // Если текущий месяц есть в данных для текущего года, выбираем его
      if (currentMonthExists) {
        setSelectedMonth(currentMonthName);
      } else {
        // Иначе выбираем последний доступный месяц для текущего года
        const currentYearData = data.monthly.filter(d => d.year === currentYear);
        if (currentYearData.length > 0) {
          setSelectedMonth(currentYearData[currentYearData.length - 1].month);
        } else {
          // Если нет данных для текущего года, берём последний месяц из всех данных
          setSelectedMonth(data.monthly[data.monthly.length - 1].month);
          setSelectedYear(data.monthly[data.monthly.length - 1].year);
        }
      }
    }
  }, [data.monthly, selectedMonth]);

  // Apply theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Computed values - filter by selected year
  const months = useMemo(() => {
    const filtered = data.monthly.filter(d => d.year === selectedYear);
    return filtered.map(d => d.month);
  }, [data.monthly, selectedYear]);

  // Preserve month when switching years
  useEffect(() => {
    if (months.length > 0 && selectedMonth) {
      // Проверяем, есть ли выбранный месяц в новом году
      if (!months.includes(selectedMonth)) {
        // Если нет - выбираем первый доступный
        setSelectedMonth(months[0]);
      }
    }
  }, [selectedYear, months, selectedMonth]);

  const currentStats = useMemo(() => {
    return data.monthly.find(d => d.month === selectedMonth && d.year === selectedYear) || null;
  }, [data.monthly, selectedMonth, selectedYear]);

  const currentDailyAvg = useMemo(() => {
    const key = `${selectedYear}-${selectedMonth}`;
    return data.dailyAverages[key] || { revenue: 0, expense: 0, profit: 0 };
  }, [data.dailyAverages, selectedMonth, selectedYear]);

  const currentExpenses = useMemo(() => {
    const key = `${selectedYear}-${selectedMonth}`;
    return data.detailedExpenses[key] || [];
  }, [data.detailedExpenses, selectedMonth, selectedYear]);

  const currentIncome = useMemo(() => {
    const key = `${selectedYear}-${selectedMonth}`;
    return data.detailedIncome[key] || [];
  }, [data.detailedIncome, selectedMonth, selectedYear]);

  const currentDailyIncome = useMemo(() => {
    const key = `${selectedYear}-${selectedMonth}`;
    return data.dailyIncome[key] || [];
  }, [data.dailyIncome, selectedMonth, selectedYear]);

  if (isLoading && data.monthly.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Загрузка данных...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <SvgGradients />

      <Header
        clientName={clientName}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        months={months}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        lastUpdated={lastUpdated}
        onLogout={onLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Balances */}
        <BalancesSection balances={data.balances} isDark={isDark} />

        {/* Stats */}
        <StatsSection
          income={currentStats?.income || 0}
          expense={currentStats?.expense || 0}
          profit={currentStats?.delta || 0}
          isDark={isDark}
        />

        {/* Daily Averages */}
        <AveragesSection averages={currentDailyAvg} isDark={isDark} />

        {/* Profit Chart */}
        <ProfitChart
          data={data.monthly.filter(d => d.year === selectedYear)}
          selectedMonth={selectedMonth}
          onMonthSelect={setSelectedMonth}
          isDark={isDark}
        />

        {/* Expense & Income Analysis */}
        <div className="space-y-8 sm:space-y-12">
          <ExpenseAnalysis
            data={currentExpenses}
            selectedMonth={selectedMonth}
            isDark={isDark}
          />
          <IncomeAnalysis
            data={currentIncome}
            selectedMonth={selectedMonth}
            isDark={isDark}
          />
        </div>

        {/* Daily Revenue Chart */}
        <DailyRevenueChart
          data={currentDailyIncome}
          selectedMonth={selectedMonth}
          isDark={isDark}
        />
      </main>
    </div>
  );
};

export default Dashboard;
