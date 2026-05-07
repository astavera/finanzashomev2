import { copToUsd } from '@/lib/currency';
import type { CreditCard, ExchangeRate, Project, WeeklyExpense } from '@/lib/types';

export const DASHBOARD_CHART_COLORS = [
  'hsl(160,84%,39%)',
  'hsl(217,91%,60%)',
  'hsl(38,92%,50%)',
  'hsl(280,65%,60%)',
  'hsl(0,72%,51%)',
  'hsl(190,80%,50%)',
];

export const DEFAULT_EXCHANGE_RATE: ExchangeRate = {
  provider_name: 'Remitly',
  rate_cop_per_usd: 4000,
  last_updated: new Date().toISOString().slice(0, 10),
  source: 'manual',
};

export type WeeklyTotal = {
  week: string;
  expenses: number;
  remaining: number;
  income: number;
};

export type CategoryTotal = {
  name: string;
  value: number;
};

export function buildWeeklyTotals({
  weeklyExpenses,
  weeklyIncome,
  extraIncomes,
}: {
  weeklyExpenses: WeeklyExpense[];
  weeklyIncome: number;
  extraIncomes: Record<number, number>;
}): WeeklyTotal[] {
  return [1, 2, 3, 4].map((weekNumber) => {
    const expenses = weeklyExpenses.filter((expense) => expense.week_number === weekNumber);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = weeklyIncome + (extraIncomes[weekNumber] || 0) - total;
    return { week: `W${weekNumber}`, expenses: total, remaining, income: weeklyIncome };
  });
}

export function buildCategoryData(weeklyExpenses: WeeklyExpense[]): CategoryTotal[] {
  const categoryMap: Record<string, number> = {};

  weeklyExpenses.forEach((expense) => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
  });

  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
}

export function buildDashboardMetrics({
  weeklyExpenses,
  creditCards,
  projects,
  weeklyIncome,
  extraIncomes,
  exchangeRate,
}: {
  weeklyExpenses: WeeklyExpense[];
  creditCards: CreditCard[];
  projects: Project[];
  weeklyIncome: number;
  extraIncomes: Record<number, number>;
  exchangeRate: ExchangeRate;
}) {
  const monthlyEstimate = weeklyIncome * 4;
  const weeklyTotals = buildWeeklyTotals({ weeklyExpenses, weeklyIncome, extraIncomes });
  const totalExpenses = weeklyTotals.reduce((sum, week) => sum + week.expenses, 0);
  const totalRemaining = weeklyTotals.reduce((sum, week) => sum + week.remaining, 0);
  const totalCardBalance = creditCards.reduce((sum, card) => sum + card.current_balance, 0);

  const copProjects = projects.filter((project) => project.currency === 'COP');
  const totalCopTarget = copProjects.reduce((sum, project) => sum + project.target_amount, 0);
  const totalCopSaved = copProjects.reduce((sum, project) => sum + project.current_amount, 0);
  const totalCopSavedUsd = copToUsd(totalCopSaved, exchangeRate.rate_cop_per_usd);
  const copProgress = totalCopTarget > 0 ? (totalCopSaved / totalCopTarget) * 100 : 0;
  const savingsRate = monthlyEstimate > 0 ? (totalRemaining / monthlyEstimate) * 100 : 0;

  const categoryData = buildCategoryData(weeklyExpenses);

  return {
    monthlyEstimate,
    weeklyTotals,
    totalExpenses,
    totalRemaining,
    totalCardBalance,
    copProjects,
    totalCopTarget,
    totalCopSaved,
    totalCopSavedUsd,
    copProgress,
    savingsRate,
    categoryData,
    topCategory: categoryData[0],
  };
}
