import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types';
import { parseSummaryCSV } from '../lib/utils';

const DEFAULT_DATA: DashboardData = {
  monthly: [],
  balances: { totalFunds: 0, cash: 0, bankAccount: 0 },
  detailedExpenses: {},
  detailedIncome: {},
  dailyIncome: {},
  dailyAverages: {},
  yearlyAverages: { revenue: 0, expense: 0, profit: 0 }
};

export const useDashboardData = (csvUrl: string | null) => {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!csvUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${csvUrl}&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const text = await response.text();
      const parsed = parseSummaryCSV(text);
      
      setData(parsed);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  }, [csvUrl]);

  // Initial fetch and interval
  useEffect(() => {
    if (csvUrl) {
      fetchData();
      const interval = setInterval(fetchData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [csvUrl, fetchData]);

  return {
    data,
    isLoading,
    lastUpdated,
    error,
    refetch: fetchData,
  };
};
