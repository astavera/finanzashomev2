import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import {
  getCurrentMonthRange,
  getFridayForWeekOfMonth,
  getPreviousMonthRange,
  isCurrentOrFutureMonth,
  isSameMonth,
} from '@/lib/date-ranges';
import { namesMatch } from '@/lib/name-matching';
import type { FixedWeeklyExpense, WeeklyExpense } from '@/lib/types';
import { getHouseholdId, getWeeklyBudgetId } from './household';
import { ensureMonthlyPlannerReset } from './financial-config';
import { mapWeeklyExpense } from './mappers';

type WeeklyExpenseWithBudget = {
  id: string;
  amount: number;
  category: string | null;
  concept: string;
  created_at: string;
  currency: 'USD' | 'COP';
  expense_date: string | null;
  household_id: string;
  notes: string | null;
  paid_by: 'Sebas' | 'Sharon';
  source_id: string | null;
  source_type: string;
  status: 'Paid' | 'Pending' | 'Partial';
  updated_at: string;
  weekly_budget_id: string;
  weekly_budgets: { week_number: number } | null;
};

type WeeklyExpenseUpdate = Database['public']['Tables']['weekly_expenses']['Update'];

async function getCopRate(householdId: string) {
  const { data, error } = await supabase
    .from('household_settings')
    .select('active_rate_source, remitly_live_rate, remitly_manual_rate')
    .eq('household_id', householdId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data?.active_rate_source === 'live') {
    return data.remitly_live_rate ?? data.remitly_manual_rate ?? 4000;
  }

  return data?.remitly_manual_rate ?? data?.remitly_live_rate ?? 4000;
}

function getExpenseTemplateKey(row: WeeklyExpenseWithBudget | FixedWeeklyExpense) {
  return [
    'weekly_budgets' in row ? row.weekly_budgets?.week_number ?? 1 : row.week_number,
    row.concept.trim().toLowerCase(),
    row.amount,
    row.paid_by,
    row.category ?? 'Other',
  ].join('|');
}

function mapFixedWeeklyExpense(row: WeeklyExpenseWithBudget): FixedWeeklyExpense {
  return {
    id: row.id,
    week_number: row.weekly_budgets?.week_number ?? 1,
    concept: row.concept,
    amount: row.amount,
    currency: row.currency,
    paid_by: row.paid_by,
    category: row.category ?? 'Other',
    notes: row.notes ?? undefined,
  };
}

function shouldPromoteToFixedExpense(row: WeeklyExpenseWithBudget) {
  return row.source_type === 'manual' && !row.notes?.startsWith('Card:');
}

async function listFixedTemplateRows(householdId: string) {
  const { data, error } = await supabase
    .from('weekly_expenses')
    .select('*, weekly_budgets(week_number)')
    .eq('household_id', householdId)
    .eq('source_type', 'fixed_template')
    .order('concept', { ascending: true });

  if (error) {
    throw error;
  }

  return data as WeeklyExpenseWithBudget[];
}

async function bootstrapFixedTemplatesFromPreviousMonth(householdId: string) {
  const previousMonth = getPreviousMonthRange();

  const { data, error } = await supabase
    .from('weekly_expenses')
    .select('*, weekly_budgets(week_number)')
    .eq('household_id', householdId)
    .gte('expense_date', previousMonth.start)
    .lt('expense_date', previousMonth.next)
    .order('expense_date', { ascending: true });

  if (error) {
    throw error;
  }

  const previousRows = data as WeeklyExpenseWithBudget[];
  const seenTemplateKeys = new Set<string>();
  const fixedRows = previousRows.filter(shouldPromoteToFixedExpense).filter((row) => {
    const key = getExpenseTemplateKey(row);
    if (seenTemplateKeys.has(key)) return false;
    seenTemplateKeys.add(key);
    return true;
  });

  if (fixedRows.length === 0) {
    return;
  }

  const payload = fixedRows.map((row) => ({
    household_id: householdId,
    weekly_budget_id: row.weekly_budget_id,
    concept: row.concept,
    amount: row.amount,
    currency: row.currency,
    expense_date: null,
    paid_by: row.paid_by,
    status: 'Pending' as const,
    category: row.category,
    notes: row.notes,
    source_type: 'fixed_template',
  }));

  const { error: insertTemplateError } = await supabase
    .from('weekly_expenses')
    .insert(payload);

  if (insertTemplateError) {
    throw insertTemplateError;
  }
}

async function ensureFixedTemplates(householdId: string) {
  const templates = await listFixedTemplateRows(householdId);
  if (templates.length > 0) {
    return templates;
  }

  await bootstrapFixedTemplatesFromPreviousMonth(householdId);
  return listFixedTemplateRows(householdId);
}

async function ensureFixedExpensesForMonth(householdId: string, monthDate = new Date()) {
  const monthRange = getCurrentMonthRange(monthDate);
  const templates = await ensureFixedTemplates(householdId);

  if (templates.length === 0) {
    return;
  }

  const { data, error } = await supabase
    .from('weekly_expenses')
    .select('*, weekly_budgets(week_number)')
    .eq('household_id', householdId)
    .gte('expense_date', monthRange.start)
    .lt('expense_date', monthRange.next);

  if (error) {
    throw error;
  }

  const currentRows = data as WeeklyExpenseWithBudget[];
  const currentKeys = new Set(currentRows.map(getExpenseTemplateKey));
  const missingTemplates = templates.filter((template) => !currentKeys.has(getExpenseTemplateKey(template)));

  if (missingTemplates.length === 0) {
    return;
  }

  const payload = missingTemplates.map((template) => ({
    household_id: householdId,
    weekly_budget_id: template.weekly_budget_id,
    concept: template.concept,
    amount: template.amount,
    currency: template.currency,
    expense_date: getFridayForWeekOfMonth(template.weekly_budgets?.week_number ?? 1, monthDate),
    paid_by: template.paid_by,
    status: 'Pending' as const,
    category: template.category,
    notes: template.notes,
    source_type: 'fixed_instance',
    source_id: template.id,
  }));

  const { error: insertError } = await supabase
    .from('weekly_expenses')
    .insert(payload);

  if (insertError) {
    throw insertError;
  }
}

export async function listWeeklyExpenses(monthDate = new Date()) {
  const householdId = await getHouseholdId();
  if (isSameMonth(monthDate)) {
    await ensureMonthlyPlannerReset(householdId);
  }
  if (isCurrentOrFutureMonth(monthDate)) {
    await ensureFixedExpensesForMonth(householdId, monthDate);
  }
  const monthRange = getCurrentMonthRange(monthDate);

  const { data, error } = await supabase
    .from('weekly_expenses')
    .select('*, weekly_budgets(week_number)')
    .eq('household_id', householdId)
    .gte('expense_date', monthRange.start)
    .lt('expense_date', monthRange.next)
    .eq('source_type', 'fixed_instance')
    .order('expense_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as WeeklyExpenseWithBudget[]).map((row) =>
    mapWeeklyExpense(row, row.weekly_budgets?.week_number ?? 1),
  );
}

export async function listFixedWeeklyExpenses() {
  const householdId = await getHouseholdId();
  const templates = await ensureFixedTemplates(householdId);
  return templates.map(mapFixedWeeklyExpense);
}

export async function createFixedWeeklyExpense(expense: Omit<FixedWeeklyExpense, 'id'>) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(expense.week_number);

  const { data, error } = await supabase
    .from('weekly_expenses')
    .insert({
      household_id: householdId,
      weekly_budget_id: weeklyBudgetId,
      concept: expense.concept,
      amount: expense.amount,
      currency: expense.currency,
      expense_date: null,
      paid_by: expense.paid_by as 'Sebas' | 'Sharon',
      status: 'Pending',
      category: expense.category,
      notes: expense.notes ?? null,
      source_type: 'fixed_template',
    })
    .select('*, weekly_budgets(week_number)')
    .single();

  if (error) {
    throw error;
  }

  return mapFixedWeeklyExpense(data as WeeklyExpenseWithBudget);
}

export async function updateFixedWeeklyExpense(id: string, updates: Partial<FixedWeeklyExpense>) {
  const payload: WeeklyExpenseUpdate = {};

  if (updates.week_number !== undefined) {
    payload.weekly_budget_id = await getWeeklyBudgetId(updates.week_number);
  }
  if (updates.concept !== undefined) payload.concept = updates.concept;
  if (updates.amount !== undefined) payload.amount = updates.amount;
  if (updates.currency !== undefined) payload.currency = updates.currency;
  if (updates.paid_by !== undefined) payload.paid_by = updates.paid_by as 'Sebas' | 'Sharon';
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.notes !== undefined) payload.notes = updates.notes ?? null;

  const { data, error } = await supabase
    .from('weekly_expenses')
    .update(payload)
    .eq('id', id)
    .eq('source_type', 'fixed_template')
    .select('*, weekly_budgets(week_number)')
    .single();

  if (error) {
    throw error;
  }

  return mapFixedWeeklyExpense(data as WeeklyExpenseWithBudget);
}

export async function deleteFixedWeeklyExpense(id: string) {
  const { error } = await supabase
    .from('weekly_expenses')
    .delete()
    .or(`id.eq.${id},source_id.eq.${id}`);

  if (error) {
    throw error;
  }
}

export async function createWeeklyExpense(expense: Omit<WeeklyExpense, 'id'>) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(expense.week_number);

  const { data, error } = await supabase
    .from('weekly_expenses')
    .insert({
      household_id: householdId,
      weekly_budget_id: weeklyBudgetId,
      concept: expense.concept,
      amount: expense.amount,
      currency: expense.currency,
      expense_date: expense.date,
      paid_by: expense.paid_by as 'Sebas' | 'Sharon',
      status: expense.status,
      category: expense.category,
      notes: expense.notes ?? null,
      source_type: 'manual',
    })
    .select('*, weekly_budgets(week_number)')
    .single();

  if (error) {
    throw error;
  }

  const row = data as WeeklyExpenseWithBudget;
  return mapWeeklyExpense(row, row.weekly_budgets?.week_number ?? expense.week_number);
}

export async function updateWeeklyExpense(id: string, updates: Partial<WeeklyExpense>) {
  const { data: currentRow, error: currentError } = await supabase
    .from('weekly_expenses')
    .select('*, weekly_budgets(week_number)')
    .eq('id', id)
    .single();

  if (currentError) {
    throw currentError;
  }

  const payload: WeeklyExpenseUpdate = {};

  if (updates.week_number !== undefined) {
    payload.weekly_budget_id = await getWeeklyBudgetId(updates.week_number);
  }
  if (updates.concept !== undefined) payload.concept = updates.concept;
  if (updates.amount !== undefined) payload.amount = updates.amount;
  if (updates.currency !== undefined) payload.currency = updates.currency;
  if (updates.date !== undefined) payload.expense_date = updates.date;
  if (updates.paid_by !== undefined) payload.paid_by = updates.paid_by as 'Sebas' | 'Sharon';
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.notes !== undefined) payload.notes = updates.notes ?? null;

  const { data, error } = await supabase
    .from('weekly_expenses')
    .update(payload)
    .eq('id', id)
    .select('*, weekly_budgets(week_number)')
    .single();

  if (error) {
    throw error;
  }

  await syncMatchingProjectOnStatusChange(currentRow as WeeklyExpenseWithBudget, updates.status);

  const row = data as WeeklyExpenseWithBudget;
  return mapWeeklyExpense(row, row.weekly_budgets?.week_number ?? updates.week_number ?? 1);
}

async function syncMatchingProjectOnStatusChange(
  expense: WeeklyExpenseWithBudget,
  nextStatus?: WeeklyExpense['status'],
) {
  if (!nextStatus || expense.status === nextStatus) {
    return;
  }

  const delta =
    expense.status !== 'Paid' && nextStatus === 'Paid'
      ? expense.amount
      : expense.status === 'Paid' && nextStatus !== 'Paid'
        ? -expense.amount
        : 0;

  if (delta === 0) {
    return;
  }

  const householdId = await getHouseholdId();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, project_name, current_amount, currency')
    .eq('household_id', householdId)
    .eq('is_active', true);

  if (error) {
    throw error;
  }

  const matchingProject = projects.find((project) => namesMatch(project.project_name, expense.concept));

  if (!matchingProject) {
    return;
  }

  const copRate = matchingProject.currency === 'COP' ? await getCopRate(householdId) : 1;
  const projectDelta = delta * copRate;
  const nextAmount = Math.max(0, Number(matchingProject.current_amount ?? 0) + projectDelta);
  const { error: updateError } = await supabase
    .from('projects')
    .update({ current_amount: nextAmount })
    .eq('id', matchingProject.id);

  if (updateError) {
    throw updateError;
  }
}

export async function deleteWeeklyExpense(id: string) {
  const { error } = await supabase
    .from('weekly_expenses')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function duplicateWeeklyExpense(expense: WeeklyExpense) {
  return createWeeklyExpense({
    ...expense,
    status: 'Pending',
  });
}
