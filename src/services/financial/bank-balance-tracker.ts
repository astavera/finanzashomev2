import { supabase } from '@/integrations/supabase/client';
import type { BankBalanceWeek } from '@/lib/types';
import { getHouseholdId, getWeeklyBudgetId } from '../household';
import type {
  BankBalanceRowWithWeek,
  BankBalanceTrackerUpdate,
  WeeklyBudgetRow,
  WeeklyBudgetUpdate,
} from './types';

export async function ensureBankBalances(householdId: string, weeklyBudgets: WeeklyBudgetRow[]) {
  const { data, error } = await supabase
    .from('bank_balance_tracker')
    .select('*, weekly_budgets(week_number, income)')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = data as BankBalanceRowWithWeek[];
  const existingByBudget = new Map(rows.map((row) => [row.weekly_budget_id, row]));
  const missingBudgetIds = weeklyBudgets
    .filter((budget) => !existingByBudget.has(budget.id))
    .map((budget) => budget.id);

  if (missingBudgetIds.length > 0) {
    const payload = weeklyBudgets
      .filter((budget) => missingBudgetIds.includes(budget.id))
      .map((budget) => ({
        household_id: householdId,
        weekly_budget_id: budget.id,
        income: budget.income,
        expenses: 0,
        starting_balance: 0,
        ending_balance: 0,
      }));

    const { error: insertError } = await supabase
      .from('bank_balance_tracker')
      .insert(payload);

    if (insertError) {
      throw insertError;
    }

    return ensureBankBalances(householdId, weeklyBudgets);
  }

  return rows;
}

export async function updateBankBalanceWeek(weekNumber: number, updates: Partial<BankBalanceWeek>) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(weekNumber);

  if (updates.budget !== undefined) {
    const budgetPayload: WeeklyBudgetUpdate = { income: updates.budget };
    const { error: budgetError } = await supabase
      .from('weekly_budgets')
      .update(budgetPayload)
      .eq('id', weeklyBudgetId);

    if (budgetError) {
      throw budgetError;
    }
  }

  const payload: BankBalanceTrackerUpdate = {};
  if (updates.real_income !== undefined) payload.income = updates.real_income;
  if (updates.expenses !== undefined) payload.expenses = updates.expenses;
  if (updates.real_income !== undefined && updates.expenses !== undefined) {
    payload.ending_balance = updates.real_income - updates.expenses;
  }

  const { error } = await supabase
    .from('bank_balance_tracker')
    .update(payload)
    .eq('household_id', householdId)
    .eq('weekly_budget_id', weeklyBudgetId);

  if (error) {
    throw error;
  }
}
