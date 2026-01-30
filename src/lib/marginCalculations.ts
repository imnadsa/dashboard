import { ServiceExpenses, MarginCalculation, GradientSegment } from '../types/margin';

// Рассчитать общие расходы
export const calculateTotalExpenses = (expenses: ServiceExpenses): number => {
  const staticExpenses = 
    expenses.doctorSalary.rub + 
    expenses.materials.rub + 
    expenses.acquiring.rub;
  
  const customExpenses = expenses.custom.reduce((sum, item) => sum + item.rub, 0);
  
  return staticExpenses + customExpenses;
};

// Рассчитать процент от суммы
export const calculatePercent = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

// Рассчитать рубли из процента
export const calculateRubFromPercent = (percent: number, total: number): number => {
  return (percent / 100) * total;
};

// Основной расчёт маржи
export const calculateMargin = (
  currentPrice: number,
  expenses: ServiceExpenses,
  desiredMarginPercent?: number,
  newPrice?: number
): MarginCalculation => {
  const totalExpenses = calculateTotalExpenses(expenses);
  
  // Текущая маржа
  const currentProfit = currentPrice - totalExpenses;
  const currentMarginPercent = calculatePercent(currentProfit, currentPrice);
  
  // Рекомендуемая цена (если указана желаемая маржа)
  const recommendedPrice = desiredMarginPercent 
    ? totalExpenses / (1 - desiredMarginPercent / 100)
    : 0;
  
  // Новая маржа (если указана новая цена)
  const newProfit = newPrice ? newPrice - totalExpenses : 0;
  const newMarginPercent = newPrice ? calculatePercent(newProfit, newPrice) : 0;
  
  return {
    totalExpenses,
    currentProfit,
    currentMarginPercent,
    recommendedPrice,
    newProfit,
    newMarginPercent,
  };
};

// Получить цвет для маржи
export const getMarginColor = (marginPercent: number): string => {
  if (marginPercent >= 50) return '#10b981'; // green
  if (marginPercent >= 45) return '#fbbf24'; // yellow
  return '#ef4444'; // red
};

// Создать сегменты для градиента
export const createGradientSegments = (
  currentPrice: number,
  expenses: ServiceExpenses,
  marginPercent: number
): GradientSegment[] => {
  if (currentPrice === 0) return [];
  
  const segments: GradientSegment[] = [
    {
      label: 'ЗП врача',
      percent: calculatePercent(expenses.doctorSalary.rub, currentPrice),
      color: '#60a5fa', // blue
    },
    {
      label: 'Расходники',
      percent: calculatePercent(expenses.materials.rub, currentPrice),
      color: '#fbbf24', // yellow
    },
    {
      label: 'Эквайринг',
      percent: calculatePercent(expenses.acquiring.rub, currentPrice),
      color: '#fb923c', // orange
    },
  ];
  
  // Добавляем кастомные расходы
  expenses.custom.forEach((expense) => {
    segments.push({
      label: expense.name,
      percent: calculatePercent(expense.rub, currentPrice),
      color: '#a78bfa', // purple
    });
  });
  
  // Добавляем маржу
  segments.push({
    label: 'Маржа',
    percent: marginPercent,
    color: getMarginColor(marginPercent),
  });
  
  return segments;
};

// Форматировать число в валюту
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Форматировать процент
export const formatPercent = (percent: number): string => {
  return percent.toFixed(2);
};
