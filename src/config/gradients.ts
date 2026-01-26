import { GradientConfig } from '../types';

export const EXPENSE_GRADIENTS: GradientConfig[] = [
  { id: 'exp1', colors: ['#4295B0', '#2d5a6d'] },
  { id: 'exp2', colors: ['#60a5fa', '#2563eb'] },
  { id: 'exp3', colors: ['#a7d0dd', '#7bb2c6'] },
  { id: 'exp4', colors: ['#cbe4ec', '#a7d0dd'] },
  { id: 'exp5', colors: ['#3b82f6', '#1d4ed8'] },
  { id: 'exp6', colors: ['#93c5fd', '#3b82f6'] },
];

export const INCOME_GRADIENTS: GradientConfig[] = [
  { id: 'inc1', colors: ['#10b981', '#065f46'] },
  { id: 'inc2', colors: ['#34d399', '#059669'] },
  { id: 'inc3', colors: ['#fbbf24', '#d97706'] },
  { id: 'inc4', colors: ['#f59e0b', '#b45309'] },
  { id: 'inc5', colors: ['#059669', '#064e3b'] },
  { id: 'inc6', colors: ['#6ee7b7', '#10b981'] },
];

export const ALL_GRADIENTS = [...EXPENSE_GRADIENTS, ...INCOME_GRADIENTS];
