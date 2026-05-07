import { supabase } from '@/integrations/supabase/client';

let cachedHouseholdId: string | null = null;

async function createDefaultHousehold() {
  const { data: household, error: householdError } = await supabase
    .from('households')
    .insert({
      name: 'My Household',
      primary_currency: 'USD',
      secondary_currency: 'COP',
    })
    .select('id')
    .single();

  if (householdError) {
    throw householdError;
  }

  const { error: settingsError } = await supabase
    .from('household_settings')
    .insert({
      household_id: household.id,
      active_rate_source: 'manual',
      remitly_manual_rate: 4000,
      rate_notes: 'Auto-created default household settings',
      rate_last_updated_at: new Date().toISOString(),
    });

  if (settingsError) {
    throw settingsError;
  }

  return household.id;
}

async function selectSingleHouseholdId(table: 'household_settings' | 'household_members' | 'households') {
  if (table === 'households') {
    const { data, error } = await supabase
      .from('households')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data?.id ?? null;
  }

  const { data, error } = await supabase
    .from(table)
    .select('household_id')
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data?.household_id ?? null;
}

export async function getHouseholdId() {
  if (cachedHouseholdId) {
    return cachedHouseholdId;
  }

  const householdId =
    await selectSingleHouseholdId('household_settings') ??
    await selectSingleHouseholdId('household_members') ??
    await selectSingleHouseholdId('households');

  const resolvedHouseholdId = householdId ?? await createDefaultHousehold();

  if (!resolvedHouseholdId) {
    throw new Error('No household found for the current session.');
  }

  cachedHouseholdId = resolvedHouseholdId;
  return resolvedHouseholdId;
}

export function clearHouseholdIdCache() {
  cachedHouseholdId = null;
}

export async function getWeeklyBudgetId(weekNumber: number) {
  const householdId = await getHouseholdId();

  const { data, error } = await supabase
    .from('weekly_budgets')
    .select('id')
    .eq('household_id', householdId)
    .eq('week_number', weekNumber)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data?.id) {
    return data.id;
  }

  const { data: inserted, error: insertError } = await supabase
    .from('weekly_budgets')
    .insert({
      household_id: householdId,
      week_number: weekNumber,
      week_label: `Week ${weekNumber}`,
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted.id;
}
