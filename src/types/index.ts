export interface AuthResponse {
  success: boolean;
  client?: {
    name: string;
    csv_url: string;
  };
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  clientName: string | null;
  csvUrl: string | null;
  error: string | null;
}

export interface SummaryData {
  month: string;
  year: number;
  income: number;
  expense: number;
  delta: number;
}

export interface Balances {
  totalFunds: number;
  cash: number;
  bankAccount: number;
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

export interface ExpenseCategory {
  name: string;
  amount: number;
}

export interface DashboardData {
  monthly: SummaryData[];
  balances: Balances;
  detailedExpenses: Record<string, ExpenseCategory[]>;
  detailedIncome: Record<string, ExpenseCategory[]>;
  dailyIncome: Record<string, DailyIncome[]>;
  dailyAverages: Record<string, AverageStats>;
  yearlyAverages: AverageStats;
}

export interface GradientConfig {
  id: string;
  colors: [string, string];
}
