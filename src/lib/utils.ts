import { DashboardData } from '../types';


const cleanNum = (val: string): number => {
  if (!val || val === '-' || val === '' || val === '0') return 0;
  const cleaned = val.replace(/р\./g, '').replace(/\s/g, '').replace(/[^0-9.,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const getCells = (line: string): string[] => {
  if (!line) return [];
  return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/"/g, '').trim());
};

const normalizeMonth = (monthStr: string): string => {
  if (!monthStr) return '';
  
  const monthMap: Record<string, string> = {
    'января': 'январь', 'февраля': 'февраль', 'марта': 'март',
    'апреля': 'апрель', 'мая': 'май', 'июня': 'июнь',
    'июля': 'июль', 'августа': 'август', 'сентября': 'сентябрь',
    'октября': 'октябрь', 'ноября': 'ноябрь', 'декабря': 'декабрь',
    'январь': 'январь', 'февраль': 'февраль', 'март': 'март',
    'апрель': 'апрель', 'май': 'май', 'июнь': 'июнь',
    'июль': 'июль', 'август': 'август', 'сентябрь': 'сентябрь',
    'октябрь': 'октябрь', 'ноябрь': 'ноябрь', 'декабрь': 'декабрь'
  };
  
  return monthMap[monthStr.trim().toLowerCase()] || '';
};

// ============================================
// CSV Parser
// ============================================

export const parseSummaryCSV = (csv: string): DashboardData => {
  const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const defaultData: DashboardData = {
    monthly: [],
    balances: { totalFunds: 0, cash: 0, bankAccount: 0 },
    detailedExpenses: {},
    detailedIncome: {},
    dailyIncome: {},
    dailyAverages: {},
    yearlyAverages: { revenue: 0, expense: 0, profit: 0 }
  };

  if (lines.length < 10) return defaultData;

  // Заголовки с месяцами
  const monthNames2025: string[] = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 
                                     'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

  // Строки 2-4: Выручка, Расходы, Прибыль
  const incomeRow = getCells(lines[1]);
  const expenseRow = getCells(lines[2]);
  const deltaRow = getCells(lines[3]);

  // 2025 год (колонки 1-12)
  for (let i = 1; i <= 12; i++) {
    defaultData.monthly.push({
      month: monthNames2025[i - 1],
      year: 2025,
      income: cleanNum(incomeRow[i]),
      expense: cleanNum(expenseRow[i]),
      delta: cleanNum(deltaRow[i]),
    });
  }

  // 2026 год (колонки 13-24)
  for (let i = 13; i <= 24; i++) {
    defaultData.monthly.push({
      month: monthNames2025[i - 13],
      year: 2026,
      income: cleanNum(incomeRow[i]),
      expense: cleanNum(expenseRow[i]),
      delta: cleanNum(deltaRow[i]),
    });
  }

  // Строки 7-15: Доходы по категориям
  for (let rowIdx = 6; rowIdx <= 14; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    if (!categoryName || categoryName.includes('доходы по категориям')) continue;
    
    // 2025 год (колонки 1-12)
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      const monthName = monthNames2025[colIdx - 1];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      const key = `2025-${monthName}`;
      if (!defaultData.detailedIncome[key]) {
        defaultData.detailedIncome[key] = [];
      }
      defaultData.detailedIncome[key].push({ name: categoryName, amount });
    }
    
    // 2026 год (колонки 13-24)
    for (let colIdx = 13; colIdx <= 24; colIdx++) {
      const monthName = monthNames2025[colIdx - 13];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      const key = `2026-${monthName}`;
      if (!defaultData.detailedIncome[key]) {
        defaultData.detailedIncome[key] = [];
      }
      defaultData.detailedIncome[key].push({ name: categoryName, amount });
    }
  }

  // Строки 18-43: Расходы по категориям
  for (let rowIdx = 17; rowIdx <= 42; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    if (!categoryName || categoryName.includes('расходы по категориям')) continue;
    
    // 2025 год (колонки 1-12)
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      const monthName = monthNames2025[colIdx - 1];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      const key = `2025-${monthName}`;
      if (!defaultData.detailedExpenses[key]) {
        defaultData.detailedExpenses[key] = [];
      }
      defaultData.detailedExpenses[key].push({ name: categoryName, amount });
    }
    
    // 2026 год (колонки 13-24)
    for (let colIdx = 13; colIdx <= 24; colIdx++) {
      const monthName = monthNames2025[colIdx - 13];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      const key = `2026-${monthName}`;
      if (!defaultData.detailedExpenses[key]) {
        defaultData.detailedExpenses[key] = [];
      }
      defaultData.detailedExpenses[key].push({ name: categoryName, amount });
    }
  }

  // Строки 46-48: Средние показатели
  if (lines.length >= 47) {
    const avgRevenueRow = getCells(lines[45]);
    const avgExpenseRow = getCells(lines[46]);
    const avgProfitRow = getCells(lines[47]);

    // 2025 год (колонки 1-12)
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      const monthName = monthNames2025[colIdx - 1];
      const key = `2025-${monthName}`;
      
      defaultData.dailyAverages[key] = {
        revenue: cleanNum(avgRevenueRow[colIdx]),
        expense: cleanNum(avgExpenseRow[colIdx]),
        profit: cleanNum(avgProfitRow[colIdx])
      };
    }
    
    // 2026 год (колонки 13-24)
    for (let colIdx = 13; colIdx <= 24; colIdx++) {
      const monthName = monthNames2025[colIdx - 13];
      const key = `2026-${monthName}`;
      
      defaultData.dailyAverages[key] = {
        revenue: cleanNum(avgRevenueRow[colIdx]),
        expense: cleanNum(avgExpenseRow[colIdx]),
        profit: cleanNum(avgProfitRow[colIdx])
      };
    }

    defaultData.yearlyAverages = {
      revenue: cleanNum(avgRevenueRow[25]),
      expense: cleanNum(avgExpenseRow[25]),
      profit: cleanNum(avgProfitRow[25])
    };
  }

  // Строки 51-53: Балансы
  if (lines.length >= 52) {
    const totalRow = getCells(lines[50]);
    const cashRow = getCells(lines[51]);
    const bankRow = getCells(lines[52]);

    defaultData.balances = {
      totalFunds: cleanNum(totalRow[1]),
      cash: cleanNum(cashRow[1]),
      bankAccount: cleanNum(bankRow[1])
    };
  }

  // Строки 61-91: Доход по дням
  if (lines.length >= 90) {
    const dailyHeaderRow = getCells(lines[59]);
    
    for (let dayIdx = 1; dayIdx <= 31; dayIdx++) {
      const lineIdx = 59 + dayIdx;
      if (!lines[lineIdx]) continue;
      
      const row = getCells(lines[lineIdx]);
      const dayNum = parseInt(row[0]);
      if (isNaN(dayNum)) continue;
      
      // 2025 год (колонки 1-12)
      for (let colIdx = 1; colIdx <= 12; colIdx++) {
        const monthName = monthNames2025[colIdx - 1];
        const amount = cleanNum(row[colIdx]);
        const key = `2025-${monthName}`;
        
        if (!defaultData.dailyIncome[key]) {
          defaultData.dailyIncome[key] = [];
        }
        defaultData.dailyIncome[key].push({ day: dayNum, amount });
      }
      
      // 2026 год (колонки 13-24)
      for (let colIdx = 13; colIdx <= 24; colIdx++) {
        const monthName = monthNames2025[colIdx - 13];
        const amount = cleanNum(row[colIdx]);
        const key = `2026-${monthName}`;
        
        if (!defaultData.dailyIncome[key]) {
          defaultData.dailyIncome[key] = [];
        }
        defaultData.dailyIncome[key].push({ day: dayNum, amount });
      }
    }
  }

  return defaultData;
};

// ============================================
// Formatters
// ============================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount);
};
