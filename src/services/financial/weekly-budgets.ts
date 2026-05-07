import { supabase } from '@/integrations/supabase/client';
import { getHouseholdId } from '../household';
import { DEFAULT_WEEKLY_INCOME, WEEKS } from './constants';
import type { WeeklyBudgetSeed, WeeklyBudgetUpdate } from './types';

export async function ensureWeeklyBudgets(householdId: string) {
  const { data, error } = await supabase
    .from('weekly_budgets')
    .select('*')
    .eq('household_id', householdId)
    .order('week_number', { ascending: true });

  if (error) {
    throw error;
  }

  const existing = new Map(data.map((row) => [row.week_number, row]));
  const missingSeeds: WeeklyBudgetSeed[] = WEEKS
    .filter((week) => !existing.has(week))
    .map((week) => ({
      week_number: week,
      income: DEFAULT_WEEKLY_INCOME,
      extra_income: 0,
    }));

  if (missingSeeds.length > 0) {
    const { error: insertError } = await supabase
      .from('weekly_budgets')
      .insert(
        missingSeeds.map((seed) => ({
          household_id: householdId,
          week_number: seed.week_number,
          week_label: `Week ${seed.week_number}`,
          income: seed.income,
          extra_income: seed.extra_income,
        })),
      );

    if (insertError) {
      throw insertError;
    }

    return ensureWeeklyBudgets(householdId);
  }

  return data;
}

export async function updateWeeklyIncome(amount: number) {
  const householdId = await getHouseholdId();
  const budgets = await ensureWeeklyBudgets(householdId);

  const payload: WeeklyBudgetUpdate = { income: amount };
  const { error } = await supabase
    .from('weekly_budgets')
    .update(payload)
    .eq('household_id', householdId);

  if (error) {
    throw error;
  }

  const { error: bankError } = await supabase
    .from('bank_balance_tracker')
    .update({ income: amount })
    .in('weekly_budget_id', budgets.map((budget) => budget.id));

  if (bankError) {
    throw bankError;
  }
}

export async function updateExtraIncome(weekNumber: number, amount: number) {
  const householdId = await getHouseholdId();
  const { error } = await supabase
    .from('weekly_budgets')
    .update({ extra_income: amount })
    .eq('household_id', householdId)
    .eq('week_number', weekNumber);

  if (error) {
    throw error;
  }
}
