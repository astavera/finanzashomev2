import type { BankBalanceWeek } from '@/lib/types';

export function getBankBalanceTotals(bankBalances: BankBalanceWeek[]) {
  const totalRealIncome = bankBalances.reduce((sum, balance) => sum + balance.real_income, 0);
  const totalBudget = bankBalances.reduce((sum, balance) => sum + balance.budget, 0);
  const totalExpenses = bankBalances.reduce((sum, balance) => sum + balance.expenses, 0);
  const totalDifference = totalRealIncome - totalExpenses;

  return {
    totalRealIncome,
    totalBudget,
    totalExpenses,
    totalDifference,
  };
}

export type BankBalanceTotals = ReturnType<typeof getBankBalanceTotals>;
