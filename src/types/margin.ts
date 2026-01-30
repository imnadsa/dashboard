// Типы для калькулятора маржи

export interface ExpenseItem {
  rub: number;
  percent: number;
}

export interface CustomExpense {
  id: string;
  name: string;
  rub: number;
  percent: number;
}

export interface ServiceExpenses {
  doctorSalary: ExpenseItem;
  materials: ExpenseItem;
  acquiring: ExpenseItem;
  custom: CustomExpense[];
}

export interface MarginService {
  id: string;
  name: string;
  currentPrice: number;
  expenses: ServiceExpenses;
  createdAt: number;
  updatedAt: number;
}

export interface MarginCalculation {
  totalExpenses: number;
  currentProfit: number;
  currentMarginPercent: number;
  recommendedPrice: number;
  newProfit: number;
  newMarginPercent: number;
}

export interface GradientSegment {
  label: string;
  percent: number;
  color: string;
}
