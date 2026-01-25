
export interface Transaction {
  id: string;
  date: Date;
  budget: string;
  source: string;
  category: string;
  amount: number;
  note: string;
  user: string;
  createdAt: string;
  currency: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
}

export interface CategorySummary {
  name: string;
  total: number;
  percentage: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}

export interface DashboardStats {
  totalExpenses: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
}
