import { supabase } from '@/integrations/supabase/client';
import type { MonthlyAllocation } from '@/lib/types';
import { getHouseholdId } from '../household';
import type { MonthlyAllocationUpdate } from './types';

export async function ensureMonthlyAllocations(householdId: string) {
  const { data, error } = await supabase
    .from('monthly_allocations')
    .select('*')
    .eq('household_id', householdId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function addMonthlyAllocation(allocation: MonthlyAllocation) {
  const householdId = await getHouseholdId();
  const existing = await ensureMonthlyAllocations(householdId);

  const { error } = await supabase
    .from('monthly_allocations')
    .insert({
      household_id: householdId,
      allocation_name: allocation.label,
      amount: allocation.amount,
      currency: 'USD',
      sort_order: existing.length,
    });

  if (error) {
    throw error;
  }
}

export async function updateMonthlyAllocation(index: number, updates: Partial<MonthlyAllocation>) {
  const householdId = await getHouseholdId();
  const existing = await ensureMonthlyAllocations(householdId);
  const target = existing[index];

  if (!target) {
    throw new Error('Monthly allocation not found.');
  }

  const payload: MonthlyAllocationUpdate = {};
  if (updates.label !== undefined) payload.allocation_name = updates.label;
  if (updates.amount !== undefined) payload.amount = updates.amount;

  const { error } = await supabase
    .from('monthly_allocations')
    .update(payload)
    .eq('id', target.id);

  if (error) {
    throw error;
  }
}

export async function deleteMonthlyAllocation(index: number) {
  const householdId = await getHouseholdId();
  const existing = await ensureMonthlyAllocations(householdId);
  const target = existing[index];

  if (!target) {
    throw new Error('Monthly allocation not found.');
  }

  const { error } = await supabase
    .from('monthly_allocations')
    .delete()
    .eq('id', target.id);

  if (error) {
    throw error;
  }
}
