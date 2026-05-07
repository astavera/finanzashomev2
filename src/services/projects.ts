import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { namesMatch } from '@/lib/name-matching';
import type { Project } from '@/lib/types';
import { getHouseholdId } from './household';
import { mapProject } from './mappers';

type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type PaidFixedExpenseRow = Pick<
  Database['public']['Tables']['weekly_expenses']['Row'],
  'amount' | 'concept' | 'expense_date'
>;

export type ProjectYearlyCollection = {
  yearlyCollected: number;
  paidCount: number;
  lastPaidDate?: string;
};

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

export async function listProjects() {
  const householdId = await getHouseholdId();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapProject);
}

export async function listProjectYearlyCollections(year = new Date().getFullYear()) {
  const householdId = await getHouseholdId();
  const startDate = `${year}-01-01`;
  const nextDate = `${year + 1}-01-01`;

  const [projectsResult, expensesResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('household_id', householdId)
      .eq('is_active', true),
    supabase
      .from('weekly_expenses')
      .select('amount, concept, expense_date')
      .eq('household_id', householdId)
      .eq('source_type', 'fixed_instance')
      .eq('status', 'Paid')
      .gte('expense_date', startDate)
      .lt('expense_date', nextDate)
      .order('expense_date', { ascending: true }),
  ]);

  if (projectsResult.error) {
    throw projectsResult.error;
  }
  if (expensesResult.error) {
    throw expensesResult.error;
  }

  const projects = projectsResult.data as ProjectRow[];
  const expenses = expensesResult.data as PaidFixedExpenseRow[];
  const copRate = await getCopRate(householdId);

  const yearlyCollections = projects.reduce<Record<string, ProjectYearlyCollection>>((result, project) => {
    result[project.id] = { yearlyCollected: 0, paidCount: 0 };
    return result;
  }, {});

  expenses.forEach((expense) => {
    const matchingProject = projects.find((project) => namesMatch(project.project_name, expense.concept));

    if (!matchingProject) {
      return;
    }

    const entry = yearlyCollections[matchingProject.id] ?? { yearlyCollected: 0, paidCount: 0 };
    const convertedAmount = Number(expense.amount ?? 0) * (matchingProject.currency === 'COP' ? copRate : 1);

    entry.yearlyCollected += convertedAmount;
    entry.paidCount += 1;
    if (expense.expense_date && (!entry.lastPaidDate || expense.expense_date > entry.lastPaidDate)) {
      entry.lastPaidDate = expense.expense_date;
    }

    yearlyCollections[matchingProject.id] = entry;
  });

  return yearlyCollections;
}

export async function createProject(project: Omit<Project, 'id'>) {
  const householdId = await getHouseholdId();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      household_id: householdId,
      project_name: project.project_name,
      target_amount: project.target_amount,
      current_amount: project.current_amount,
      currency: project.currency,
      group_type: project.currency,
      country_tag: project.country_tag ?? null,
      notes: project.notes ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapProject(data);
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const payload: ProjectUpdate = {};

  if (updates.project_name !== undefined) payload.project_name = updates.project_name;
  if (updates.target_amount !== undefined) payload.target_amount = updates.target_amount;
  if (updates.current_amount !== undefined) payload.current_amount = updates.current_amount;
  if (updates.currency !== undefined) {
    payload.currency = updates.currency;
    payload.group_type = updates.currency;
  }
  if (updates.country_tag !== undefined) payload.country_tag = updates.country_tag ?? null;
  if (updates.notes !== undefined) payload.notes = updates.notes ?? null;

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapProject(data);
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    throw error;
  }
}
