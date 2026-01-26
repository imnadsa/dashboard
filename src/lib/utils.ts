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
  const monthHeaders = getCells(lines[0]);
  const monthNames: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const monthName = normalizeMonth(monthHeaders[i]);
    if (monthName) monthNames.push(monthName);
  }

  // Строки 2-4: Выручка, Расходы, Прибыль
  const incomeRow = getCells(lines[1]);
  const expenseRow = getCells(lines[2]);
  const deltaRow = getCells(lines[3]);

  for (let i = 0; i < monthNames.length && i < 12; i++) {
    const colIdx = i + 1;
    defaultData.monthly.push({
      month: monthNames[i],
      income: cleanNum(incomeRow[colIdx]),
      expense: cleanNum(expenseRow[colIdx]),
      delta: cleanNum(deltaRow[colIdx]),
    });
  }

  // Строки 7-15: Доходы по категориям
  for (let rowIdx = 6; rowIdx <= 14; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    if (!categoryName || categoryName.includes('доходы по категориям')) continue;
    
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      if (colIdx - 1 >= monthNames.length) break;
      const monthName = monthNames[colIdx - 1];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      if (!defaultData.detailedIncome[monthName]) {
        defaultData.detailedIncome[monthName] = [];
      }
      defaultData.detailedIncome[monthName].push({ name: categoryName, amount });
    }
  }

  // Строки 18-43: Расходы по категориям
  for (let rowIdx = 17; rowIdx <= 42; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    if (!categoryName || categoryName.includes('расходы по категориям')) continue;
    
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      if (colIdx - 1 >= monthNames.length) break;
      const monthName = monthNames[colIdx - 1];
      const amount = cleanNum(row[colIdx]);
      
      if (amount === 0) continue;
      
      if (!defaultData.detailedExpenses[monthName]) {
        defaultData.detailedExpenses[monthName] = [];
      }
      defaultData.detailedExpenses[monthName].push({ name: categoryName, amount });
    }
  }

  // Строки 46-48: Средние показатели
  if (lines.length >= 47) {
    const avgRevenueRow = getCells(lines[45]);
    const avgExpenseRow = getCells(lines[46]);
    const avgProfitRow = getCells(lines[47]);

    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      if (colIdx - 1 >= monthNames.length) break;
      const monthName = monthNames[colIdx - 1];
      
      defaultData.dailyAverages[monthName] = {
        revenue: cleanNum(avgRevenueRow[colIdx]),
        expense: cleanNum(avgExpenseRow[colIdx]),
        profit: cleanNum(avgProfitRow[colIdx])
      };
    }

    defaultData.yearlyAverages = {
      revenue: cleanNum(avgRevenueRow[13]),
      expense: cleanNum(avgExpenseRow[13]),
      profit: cleanNum(avgProfitRow[13])
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
    
    const dailyMonthNames: string[] = [];
    for (let i = 1; i <= 12; i++) {
      const monthName = normalizeMonth(dailyHeaderRow[i]);
      if (monthName) dailyMonthNames.push(monthName);
    }
    
    for (let dayIdx = 1; dayIdx <= 31; dayIdx++) {
      const lineIdx = 59 + dayIdx;
      if (!lines[lineIdx]) continue;
      
      const row = getCells(lines[lineIdx]);
      const dayNum = parseInt(row[0]);
      if (isNaN(dayNum)) continue;
      
      for (let colIdx = 1; colIdx <= 12; colIdx++) {
        if (colIdx - 1 >= dailyMonthNames.length) break;
        const monthName = dailyMonthNames[colIdx - 1];
        const amount = cleanNum(row[colIdx]);
        
        if (!defaultData.dailyIncome[monthName]) {
          defaultData.dailyIncome[monthName] = [];
        }
        defaultData.dailyIncome[monthName].push({ day: dayNum, amount });
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
