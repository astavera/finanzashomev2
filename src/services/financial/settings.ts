import type { BankBalanceWeek, CarPayoffWeek } from '@/lib/types';
import { getHouseholdId } from '../household';
import { DEFAULT_CAR_PAYOFF_TARGET, DEFAULT_WEEKLY_INCOME, WEEKS } from './constants';
import { parseCarPayoffNotes } from './car-payoff-notes';
import { ensureBankBalances } from './bank-balance-tracker';
import { ensureCarPayoff, ensureMonthlyPlannerReset } from './car-payoff-tracker';
import { ensureHouseholdSettings, mapExchangeRate } from './household-settings';
import { ensureMonthlyAllocations } from './monthly-allocations';
import { ensureWeeklyBudgets } from './weekly-budgets';
import type { FinancialSettings } from './types';

export async function getFinancialSettings(): Promise<FinancialSettings> {
  const householdId = await getHouseholdId();
  await ensureMonthlyPlannerReset(householdId);
  const weeklyBudgets = await ensureWeeklyBudgets(householdId);
  const [householdSettings, allocations, bankBalances, carPayoffRows] = await Promise.all([
    ensureHouseholdSettings(householdId),
    ensureMonthlyAllocations(householdId),
    ensureBankBalances(householdId, weeklyBudgets),
    ensureCarPayoff(householdId, weeklyBudgets),
  ]);

  const weeklyIncome = weeklyBudgets[0]?.income ?? DEFAULT_WEEKLY_INCOME;
  const extraIncomes = Object.fromEntries(
    weeklyBudgets.map((budget) => [budget.week_number, budget.extra_income]),
  ) as Record<number, number>;

  const mappedBankBalances: BankBalanceWeek[] = WEEKS.map((week) => {
    const row = bankBalances.find((item) => item.weekly_budgets?.week_number === week);
    const budget = weeklyBudgets.find((item) => item.week_number === week);

    return {
      week,
      real_income: row?.income ?? budget?.income ?? DEFAULT_WEEKLY_INCOME,
      budget: budget?.income ?? DEFAULT_WEEKLY_INCOME,
      expenses: row?.expenses ?? 0,
      difference: (row?.income ?? budget?.income ?? DEFAULT_WEEKLY_INCOME) - (row?.expenses ?? 0),
    };
  });

  const firstCarPayoffRow = carPayoffRows.find((item) => item.weekly_budgets?.week_number === 1);
  const firstCarPayoffNotes = parseCarPayoffNotes(firstCarPayoffRow?.notes ?? null);
  const mappedCarPayoff: CarPayoffWeek[] = WEEKS.map((week) => {
    const row = carPayoffRows.find((item) => item.weekly_budgets?.week_number === week);
    const notes = parseCarPayoffNotes(row?.notes ?? null);

    return {
      week,
      target: row?.target_amount ?? DEFAULT_CAR_PAYOFF_TARGET,
      collected: row?.collected_amount ?? 0,
      saved: notes.saved ?? false,
      monthlyPaymentPaid: week === 1 ? firstCarPayoffNotes.monthlyPaymentPaid ?? false : false,
    };
  });

  return {
    weeklyIncome,
    extraIncomes,
    exchangeRate: mapExchangeRate(householdSettings),
    monthlyAllocations: allocations.map((allocation) => ({
      label: allocation.allocation_name,
      amount: allocation.amount,
    })),
    bankBalances: mappedBankBalances,
    carPayoff: mappedCarPayoff,
    accumulatedCarSavings: firstCarPayoffNotes.accumulatedSavings ?? 0,
    appliedCarPaymentsToDate: firstCarPayoffNotes.appliedPaymentsToDate ?? 0,
  };
}

export async function listMonthlyAllocations() {
  const settings = await getFinancialSettings();
  return settings.monthlyAllocations;
}
