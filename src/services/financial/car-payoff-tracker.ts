import { supabase } from '@/integrations/supabase/client';
import type { CarPayoffWeek } from '@/lib/types';
import { getHouseholdId, getWeeklyBudgetId } from '../household';
import {
  CAR_PAYOFF_APR,
  CAR_PAYOFF_CURRENT_DEBT,
  CAR_PAYOFF_MONTHLY_PAYMENT,
  DEFAULT_CAR_PAYOFF_TARGET,
} from './constants';
import { getCurrentMonthKey, parseCarPayoffNotes, stringifyCarPayoffNotes } from './car-payoff-notes';
import { ensureWeeklyBudgets } from './weekly-budgets';
import type { CarPayoffRowWithWeek, CarPayoffTrackerUpdate, WeeklyBudgetRow } from './types';

export async function ensureCarPayoff(householdId: string, weeklyBudgets: WeeklyBudgetRow[]) {
  const { data, error } = await supabase
    .from('car_payoff_tracker')
    .select('*, weekly_budgets(week_number)')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = data as CarPayoffRowWithWeek[];
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
        target_amount: DEFAULT_CAR_PAYOFF_TARGET,
        collected_amount: DEFAULT_CAR_PAYOFF_TARGET,
        notes: stringifyCarPayoffNotes({
          saved: false,
          monthlyPaymentPaid: budget.week_number === 1 ? false : undefined,
          accumulatedSavings: budget.week_number === 1 ? 0 : undefined,
          appliedPaymentsToDate: budget.week_number === 1 ? 0 : undefined,
          debtBaselineAmount: budget.week_number === 1 ? CAR_PAYOFF_CURRENT_DEBT : undefined,
        }),
      }));

    const { error: insertError } = await supabase
      .from('car_payoff_tracker')
      .insert(payload);

    if (insertError) {
      throw insertError;
    }

    return ensureCarPayoff(householdId, weeklyBudgets);
  }

  const rowsToNormalize = rows.filter(
    (row) =>
      Number(row.target_amount ?? 0) !== DEFAULT_CAR_PAYOFF_TARGET ||
      Number(row.collected_amount ?? 0) !== DEFAULT_CAR_PAYOFF_TARGET,
  );

  if (rowsToNormalize.length > 0) {
    await Promise.all(
      rowsToNormalize.map(async (row) => {
        const { error: updateError } = await supabase
          .from('car_payoff_tracker')
          .update({
            target_amount: DEFAULT_CAR_PAYOFF_TARGET,
            collected_amount: DEFAULT_CAR_PAYOFF_TARGET,
          })
          .eq('id', row.id);

        if (updateError) {
          throw updateError;
        }
      }),
    );

    return ensureCarPayoff(householdId, weeklyBudgets);
  }

  return rows;
}

export async function ensureMonthlyPlannerReset(householdIdOverride?: string) {
  const householdId = householdIdOverride ?? await getHouseholdId();
  const weeklyBudgets = await ensureWeeklyBudgets(householdId);
  const carPayoffRows = await ensureCarPayoff(householdId, weeklyBudgets);
  const currentMonthKey = getCurrentMonthKey();

  const firstWeekBudget = weeklyBudgets.find((budget) => budget.week_number === 1);
  const firstWeekRow = carPayoffRows.find(
    (row) => row.weekly_budget_id === firstWeekBudget?.id || row.weekly_budgets?.week_number === 1,
  );
  const firstWeekNotes = parseCarPayoffNotes(firstWeekRow?.notes ?? null);
  const debtBaselineAmount = firstWeekNotes.debtBaselineAmount ?? 0;

  if (debtBaselineAmount !== CAR_PAYOFF_CURRENT_DEBT) {
    await Promise.all(
      carPayoffRows.map(async (row) => {
        const weekNumber =
          row.weekly_budgets?.week_number ??
          weeklyBudgets.find((budget) => budget.id === row.weekly_budget_id)?.week_number ??
          1;
        const currentNotes = parseCarPayoffNotes(row.notes);
        const nextNotes = {
          ...currentNotes,
          saved: false,
          monthlyPaymentPaid: weekNumber === 1 ? false : currentNotes.monthlyPaymentPaid,
          appliedPaymentsToDate: weekNumber === 1 ? 0 : currentNotes.appliedPaymentsToDate,
          debtBaselineAmount: weekNumber === 1 ? CAR_PAYOFF_CURRENT_DEBT : currentNotes.debtBaselineAmount,
          lastMonthlyReset: weekNumber === 1 ? currentMonthKey : currentNotes.lastMonthlyReset,
        };

        const { error } = await supabase
          .from('car_payoff_tracker')
          .update({ collected_amount: DEFAULT_CAR_PAYOFF_TARGET, notes: stringifyCarPayoffNotes(nextNotes) })
          .eq('id', row.id);

        if (error) {
          throw error;
        }
      }),
    );

    return;
  }

  if (firstWeekNotes.lastMonthlyReset === currentMonthKey) {
    return;
  }

  const monthlyRate = CAR_PAYOFF_APR / 100 / 12;
  const principalFromMonthlyPayment = firstWeekNotes.monthlyPaymentPaid
    ? Math.max(0, CAR_PAYOFF_MONTHLY_PAYMENT - (CAR_PAYOFF_CURRENT_DEBT * monthlyRate))
    : 0;
  const paidWeeklyThisMonth = carPayoffRows.reduce((sum, row) => {
    const notes = parseCarPayoffNotes(row.notes);
    return sum + (notes.saved ? Number(row.collected_amount ?? 0) : 0);
  }, 0);
  const nextAppliedPaymentsToDate =
    (firstWeekNotes.appliedPaymentsToDate ?? 0) + paidWeeklyThisMonth + principalFromMonthlyPayment;

  const { error: expensesError } = await supabase
    .from('weekly_expenses')
    .update({ status: 'Pending' })
    .eq('household_id', householdId)
    .neq('status', 'Pending');

  if (expensesError) {
    throw expensesError;
  }

  await Promise.all(
    carPayoffRows.map(async (row) => {
      const weekNumber =
        row.weekly_budgets?.week_number ??
        weeklyBudgets.find((budget) => budget.id === row.weekly_budget_id)?.week_number ??
        1;
      const currentNotes = parseCarPayoffNotes(row.notes);

      const nextNotes = {
        ...currentNotes,
        saved: false,
        monthlyPaymentPaid: weekNumber === 1 ? false : currentNotes.monthlyPaymentPaid,
        accumulatedSavings: currentNotes.accumulatedSavings,
        appliedPaymentsToDate: weekNumber === 1 ? nextAppliedPaymentsToDate : currentNotes.appliedPaymentsToDate,
        debtBaselineAmount: weekNumber === 1 ? CAR_PAYOFF_CURRENT_DEBT : currentNotes.debtBaselineAmount,
        lastMonthlyReset: weekNumber === 1 ? currentMonthKey : currentNotes.lastMonthlyReset,
      };

      const { error } = await supabase
        .from('car_payoff_tracker')
        .update({ collected_amount: DEFAULT_CAR_PAYOFF_TARGET, notes: stringifyCarPayoffNotes(nextNotes) })
        .eq('id', row.id);

      if (error) {
        throw error;
      }
    }),
  );
}

export async function updateCarPayoffWeek(weekNumber: number, updates: Partial<CarPayoffWeek>) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(weekNumber);

  const { data: currentRow, error: fetchError } = await supabase
    .from('car_payoff_tracker')
    .select('*')
    .eq('household_id', householdId)
    .eq('weekly_budget_id', weeklyBudgetId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const currentNotes = parseCarPayoffNotes(currentRow.notes);
  const nextNotes = {
    ...currentNotes,
    saved: updates.saved ?? currentNotes.saved,
    monthlyPaymentPaid: updates.monthlyPaymentPaid ?? currentNotes.monthlyPaymentPaid,
    accumulatedSavings: updates.week === 1 ? currentNotes.accumulatedSavings : currentNotes.accumulatedSavings,
  };

  const payload: CarPayoffTrackerUpdate = {};
  if (updates.target !== undefined) payload.target_amount = updates.target;
  if (updates.collected !== undefined) payload.collected_amount = updates.collected;
  if (updates.saved !== undefined || updates.monthlyPaymentPaid !== undefined) {
    payload.notes = stringifyCarPayoffNotes(nextNotes);
  }

  const { error } = await supabase
    .from('car_payoff_tracker')
    .update(payload)
    .eq('id', currentRow.id);

  if (error) {
    throw error;
  }
}

export async function updateAccumulatedCarSavings(amount: number) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(1);

  const { data: currentRow, error: fetchError } = await supabase
    .from('car_payoff_tracker')
    .select('*')
    .eq('household_id', householdId)
    .eq('weekly_budget_id', weeklyBudgetId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const currentNotes = parseCarPayoffNotes(currentRow.notes);
  const { error } = await supabase
    .from('car_payoff_tracker')
    .update({
      notes: stringifyCarPayoffNotes({
        ...currentNotes,
        accumulatedSavings: amount,
      }),
    })
    .eq('id', currentRow.id);

  if (error) {
    throw error;
  }
}
