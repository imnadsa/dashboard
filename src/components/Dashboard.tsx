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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return true;
  });

  // Set initial month when data loads
  useEffect(() => {
    if (data.monthly.length > 0 && !selectedMonth) {
      setSelectedMonth(data.monthly[data.monthly.length - 1].month);
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

  // Computed values
  const currentStats = useMemo(() => {
    return data.monthly.find(d => d.month === selectedMonth) || null;
  }, [data.monthly, selectedMonth]);

  const currentDailyAvg = useMemo(() => {
    return data.dailyAverages[selectedMonth] || { revenue: 0, expense: 0, profit: 0 };
  }, [data.dailyAverages, selectedMonth]);

  const currentExpenses = useMemo(() => {
    return data.detailedExpenses[selectedMonth] || [];
  }, [data.detailedExpenses, selectedMonth]);

  const currentIncome = useMemo(() => {
    return data.detailedIncome[selectedMonth] || [];
  }, [data.detailedIncome, selectedMonth]);

  const currentDailyIncome = useMemo(() => {
    return data.dailyIncome[selectedMonth] || [];
  }, [data.dailyIncome, selectedMonth]);

  const months = useMemo(() => {
    return data.monthly.map(d => d.month);
  }, [data.monthly]);

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
        months={months}
        onMonthChange={setSelectedMonth}
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
          data={data.monthly}
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
