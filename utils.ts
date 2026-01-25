import { ExpenseCategory } from './types';

export interface SummaryData {
  month: string;
  income: number;
  expense: number;
  delta: number;
}

export interface Balances {
  totalFunds: number;
  cash: number;
  bankAccount: number;
}

export interface ReviewData {
  platform: string;
  rating: number;
  count: number;
}

export interface DailyIncome {
  day: number;
  amount: number;
}

export interface AverageStats {
  revenue: number;
  expense: number;
  profit: number;
}

export interface DashboardData {
  monthly: SummaryData[];
  balances: Balances;
  reviews: ReviewData[];
  detailedExpenses: Record<string, ExpenseCategory[]>;
  detailedIncome: Record<string, ExpenseCategory[]>;
  dailyIncome: Record<string, DailyIncome[]>;
  dailyAverages: Record<string, AverageStats>;
  yearlyAverages: AverageStats;
}

const cleanNum = (val: string) => {
  if (!val || val === '-' || val === '' || val === '0') return 0;
  // Убираем "р.", пробелы, запятые меняем на точки
  const cleaned = val.replace(/р\./g, '').replace(/\s/g, '').replace(/[^0-9.,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const getCells = (line: string) => {
  if (!line) return [];
  return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/"/g, '').trim());
};

// Функция для извлечения названия месяца из даты
const getMonthName = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Пытаемся распарсить дату
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
  const months = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];
  
  return months[date.getMonth()];
};

export const parseSummaryCSV = (csv: string): DashboardData => {
  const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const defaultData: DashboardData = {
    monthly: [],
    balances: { totalFunds: 0, cash: 0, bankAccount: 0 },
    reviews: [],
    detailedExpenses: {},
    detailedIncome: {},
    dailyIncome: {},
    dailyAverages: {},
    yearlyAverages: { revenue: 0, expense: 0, profit: 0 }
  };

  if (lines.length < 10) return defaultData;

  // СТРОКА 1: Заголовки с датами месяцев (колонки B-M = индексы 1-12)
  const monthHeaders = getCells(lines[0]);
  const monthNames: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const monthName = getMonthName(monthHeaders[i]);
    if (monthName) {
      monthNames.push(monthName);
    }
  }

  // СТРОКА 2: Выручка (B2-M2)
  const incomeRow = getCells(lines[1]);
  
  // СТРОКА 3: Расходы (B3-M3)
  const expenseRow = getCells(lines[2]);
  
  // СТРОКА 4: Прибыль (B4-M4)
  const deltaRow = getCells(lines[3]);

  // Парсим месячные итоги (колонки B-M = индексы 1-12)
  for (let i = 0; i < monthNames.length && i < 12; i++) {
    const colIdx = i + 1; // колонка B=1, C=2, и т.д.
    defaultData.monthly.push({
      month: monthNames[i],
      income: cleanNum(incomeRow[colIdx]),
      expense: cleanNum(expenseRow[colIdx]),
      delta: cleanNum(deltaRow[colIdx]),
    });
  }

  // СТРОКИ 7-15: Доходы по категориям
  // Строка 6 - заголовок "доходы по категориям"
  for (let rowIdx = 6; rowIdx <= 14; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    // Пропускаем заголовки и пустые строки
    if (!categoryName || categoryName.includes('доходы по категориям') || categoryName.includes('тут должная')) continue;
    
    // Для каждого месяца (колонки B-M)
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

  // СТРОКИ 18-43: Расходы по категориям
  // Строка 17 - заголовок "расходы по категориям"
  for (let rowIdx = 17; rowIdx <= 42; rowIdx++) {
    if (!lines[rowIdx]) continue;
    const row = getCells(lines[rowIdx]);
    const categoryName = row[0];
    
    // Пропускаем заголовки и пустые строки
    if (!categoryName || categoryName.includes('расходы по категориям') || categoryName.includes('тут должная')) continue;
    
    // Для каждого месяца (колонки B-M)
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

  // СТРОКИ 46-48: Средние показатели в день
  // Строка 45 - заголовок "в среднем в день показатели"
  if (lines.length >= 47) {
    const avgRevenueRow = getCells(lines[45]); // Строка 46 = индекс 45
    const avgExpenseRow = getCells(lines[46]); // Строка 47 = индекс 46
    const avgProfitRow = getCells(lines[47]);  // Строка 48 = индекс 47

    // Для каждого месяца
    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      if (colIdx - 1 >= monthNames.length) break;
      const monthName = monthNames[colIdx - 1];
      
      defaultData.dailyAverages[monthName] = {
        revenue: cleanNum(avgRevenueRow[colIdx]),
        expense: cleanNum(avgExpenseRow[colIdx]),
        profit: cleanNum(avgProfitRow[colIdx])
      };
    }

    // Колонка N (индекс 13) - среднее по году
    defaultData.yearlyAverages = {
      revenue: cleanNum(avgRevenueRow[13]),
      expense: cleanNum(avgExpenseRow[13]),
      profit: cleanNum(avgProfitRow[13])
    };
  }

  // СТРОКИ 51-53: Балансы счетов
  // Строка 50 - заголовок "статус кошельков"
  if (lines.length >= 52) {
    const totalRow = getCells(lines[50]);      // Строка 51
    const cashRow = getCells(lines[51]);       // Строка 52
    const bankRow = getCells(lines[52]);       // Строка 53

    defaultData.balances = {
      totalFunds: cleanNum(totalRow[1]),
      cash: cleanNum(cashRow[1]),
      bankAccount: cleanNum(bankRow[1])
    };
  }

  // СТРОКИ 61-91: Доход по дням (1-31)
  // Строка 60 - заголовок "доход по датам каждый месяц"
  if (lines.length >= 90) {
    const dailyHeaderRow = getCells(lines[59]); // Строка 60
    
    // Извлекаем названия месяцев из заголовка (колонки B-M)
    const dailyMonthNames: string[] = [];
    for (let i = 1; i <= 12; i++) {
      const monthName = getMonthName(dailyHeaderRow[i]);
      if (monthName) {
        dailyMonthNames.push(monthName);
      }
    }
    
    // Парсим дни 1-31 (строки 61-91 = индексы 60-90)
    for (let dayIdx = 1; dayIdx <= 31; dayIdx++) {
      const lineIdx = 59 + dayIdx; // Строка 61 = индекс 60, и т.д.
      if (!lines[lineIdx]) continue;
      
      const row = getCells(lines[lineIdx]);
      const dayNum = parseInt(row[0]);
      if (isNaN(dayNum)) continue;
      
      // Для каждого месяца (колонки B-M)
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

  // ОТЗЫВОВ НЕТ - оставляем пустой массив
  defaultData.reviews = [];

  return defaultData;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount);
};
