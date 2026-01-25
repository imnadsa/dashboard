
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
  detailedExpenses: Record<string, ExpenseCategory[]>; // Месяц -> Расходы
  detailedIncome: Record<string, ExpenseCategory[]>;   // Месяц -> Доходы
  dailyIncome: Record<string, DailyIncome[]>;          // Месяц -> Доходы по дням
  dailyAverages: Record<string, AverageStats>;         // Месяц -> Средние в день
  yearlyAverages: AverageStats;                        // Итоговые средние по году
}

const cleanNum = (val: string) => {
  if (!val || val === '-' || val === '' || val === '0') return 0;
  const cleaned = val.replace(/\s/g, '').replace(/[^0-9.,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const getCells = (line: string) => {
  if (!line) return [];
  return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/"/g, '').trim());
};

// Функция для нормализации названий месяцев (из "января" в "январь")
const normalizeMonth = (m: string) => {
  if (!m) return '';
  const map: Record<string, string> = {
    'января': 'январь', 'февраля': 'февраль', 'марта': 'март', 'апреля': 'апрель',
    'мая': 'май', 'июня': 'июнь', 'июля': 'июль', 'августа': 'август',
    'сентября': 'сентябрь', 'октября': 'октябрь', 'ноября': 'ноябрь', 'декабря': 'декабрь'
  };
  const low = m.toLowerCase();
  return map[low] || low;
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

  if (lines.length < 4) return defaultData;

  // 1. Базовая аналитика (Строки 1-4)
  const monthsRow = getCells(lines[0]);
  const incomeRow = getCells(lines[1]);
  const expenseRow = getCells(lines[2]);
  const deltaRow = getCells(lines[3]);

  // 2. Балансы (Строки 6-8)
  const totalRow = lines[5] ? getCells(lines[5]) : [];
  const cashRow = lines[6] ? getCells(lines[6]) : [];
  const bankRow = lines[7] ? getCells(lines[7]) : [];

  defaultData.balances = {
    totalFunds: totalRow[1] ? cleanNum(totalRow[1]) : 0,
    cash: cashRow[1] ? cleanNum(cashRow[1]) : 0,
    bankAccount: bankRow[1] ? cleanNum(bankRow[1]) : 0,
  };

  // Парсинг ежемесячных итогов
  for (let i = 1; i < monthsRow.length; i++) {
    const monthName = monthsRow[i];
    if (!monthName || monthName.toLowerCase().includes('итог') || monthName.toLowerCase().includes('средн')) continue;

    defaultData.monthly.push({
      month: monthName,
      income: cleanNum(incomeRow[i]),
      expense: cleanNum(expenseRow[i]),
      delta: cleanNum(deltaRow[i]),
    });
  }

  // 3. Детальные расходы (A15:N35)
  const detailMonthsRow = lines[14] ? getCells(lines[14]) : [];
  for (let i = 15; i <= 34; i++) {
    if (!lines[i]) continue;
    const row = getCells(lines[i]);
    const categoryName = row[0];
    if (!categoryName || categoryName === '-') continue;

    for (let colIdx = 2; colIdx <= 13; colIdx++) {
      const monthName = detailMonthsRow[colIdx];
      if (!monthName) continue;
      const amount = cleanNum(row[colIdx]);
      if (amount === 0) continue;

      if (!defaultData.detailedExpenses[monthName]) defaultData.detailedExpenses[monthName] = [];
      defaultData.detailedExpenses[monthName].push({ name: categoryName, amount: amount });
    }
  }

  // 4. Структура дохода (A38:N41)
  const incomeMonthsRow = lines[36] ? getCells(lines[36]) : [];
  for (let i = 37; i <= 40; i++) {
    if (!lines[i]) continue;
    const row = getCells(lines[i]);
    const categoryName = row[0];
    if (!categoryName || categoryName === '-') continue;

    for (let colIdx = 2; colIdx <= 13; colIdx++) {
      const monthName = incomeMonthsRow[colIdx];
      if (!monthName) continue;
      const amount = cleanNum(row[colIdx]);
      if (amount === 0) continue;

      if (!defaultData.detailedIncome[monthName]) defaultData.detailedIncome[monthName] = [];
      defaultData.detailedIncome[monthName].push({ name: categoryName, amount: amount });
    }
  }

  // 5. Доход по датам (Строка 48+)
  if (lines.length >= 48) {
    const dailyHeaders = getCells(lines[47]); // Заголовки месяцев для дней
    for (let i = 48; i <= 78; i++) { // Дни с 1 по 31 (строки 49-79)
      if (!lines[i]) continue;
      const row = getCells(lines[i]);
      const dayNum = parseInt(row[0]);
      if (isNaN(dayNum)) continue;

      for (let colIdx = 1; colIdx < dailyHeaders.length; colIdx++) {
        const rawMonth = dailyHeaders[colIdx];
        if (!rawMonth) continue;
        const normMonth = normalizeMonth(rawMonth);
        const amount = cleanNum(row[colIdx]);
        
        if (!defaultData.dailyIncome[normMonth]) defaultData.dailyIncome[normMonth] = [];
        defaultData.dailyIncome[normMonth].push({ day: dayNum, amount: amount });
      }
    }
  }

  // 6. СРЕДНИЕ ПОКАЗАТЕЛИ В ДЕНЬ (Строки 81-84)
  if (lines.length >= 84) {
    const avgHeaders = getCells(lines[80]); // Заголовки месяцев (января, февраля...)
    const revRow = getCells(lines[81]); // Выручка в день
    const expRow = getCells(lines[82]); // Расходы в день
    const prfRow = getCells(lines[83]); // Прибыль в день

    for (let colIdx = 1; colIdx <= 12; colIdx++) {
      const rawMonth = avgHeaders[colIdx];
      if (!rawMonth) continue;
      const normMonth = normalizeMonth(rawMonth);
      
      defaultData.dailyAverages[normMonth] = {
        revenue: cleanNum(revRow[colIdx]),
        expense: cleanNum(expRow[colIdx]),
        profit: cleanNum(prfRow[colIdx])
      };
    }

    // Колонка N (13-я) — среднее по году
    defaultData.yearlyAverages = {
      revenue: cleanNum(revRow[13]),
      expense: cleanNum(expRow[13]),
      profit: cleanNum(prfRow[13])
    };
  }

  // 7. Отзывы (строки 10-13)
  for (let i = 9; i <= 12; i++) {
    if (lines[i]) {
      const row = getCells(lines[i]);
      if (row[0] && row[0] !== '-') {
        defaultData.reviews.push({
          platform: row[0],
          rating: cleanNum(row[1]),
          count: cleanNum(row[2])
        });
      }
    }
  }

  return defaultData;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount);
};
