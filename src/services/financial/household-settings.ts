import { supabase } from '@/integrations/supabase/client';
import type { ExchangeRate } from '@/lib/types';
import { getHouseholdId } from '../household';
import { DEFAULT_EXCHANGE_RATE } from './constants';
import type { HouseholdSettingsRow, HouseholdSettingsUpdate } from './types';

export async function ensureHouseholdSettings(householdId: string) {
  const { data, error } = await supabase
    .from('household_settings')
    .select('*')
    .eq('household_id', householdId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }

  const { data: inserted, error: insertError } = await supabase
    .from('household_settings')
    .insert({
      household_id: householdId,
      remitly_manual_rate: DEFAULT_EXCHANGE_RATE,
      active_rate_source: 'manual',
      rate_last_updated_at: new Date().toISOString(),
      rate_notes: 'Manual input',
    })
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted;
}

export function mapExchangeRate(settings: HouseholdSettingsRow): ExchangeRate {
  const source = settings.active_rate_source ?? 'manual';
  const rate =
    source === 'live'
      ? settings.remitly_live_rate ?? settings.remitly_manual_rate ?? DEFAULT_EXCHANGE_RATE
      : settings.remitly_manual_rate ?? settings.remitly_live_rate ?? DEFAULT_EXCHANGE_RATE;

  return {
    provider_name: 'Remitly',
    rate_cop_per_usd: rate,
    last_updated: (settings.rate_last_updated_at ?? settings.updated_at).slice(0, 10),
    notes: settings.rate_notes ?? undefined,
    source,
  };
}

export async function updateExchangeRate(rate: {
  rate_cop_per_usd: number;
  notes?: string;
  source: 'live' | 'manual';
}) {
  const householdId = await getHouseholdId();
  await ensureHouseholdSettings(householdId);

  const payload: HouseholdSettingsUpdate = {
    active_rate_source: rate.source,
    rate_last_updated_at: new Date().toISOString(),
    rate_notes: rate.notes ?? null,
  };

  if (rate.source === 'live') {
    payload.remitly_live_rate = rate.rate_cop_per_usd;
  } else {
    payload.remitly_manual_rate = rate.rate_cop_per_usd;
  }

  const { error } = await supabase
    .from('household_settings')
    .update(payload)
    .eq('household_id', householdId);

  if (error) {
    throw error;
  }

  const { error: historyError } = await supabase
    .from('exchange_rate_history')
    .insert({
      household_id: householdId,
      provider_name: 'Remitly',
      rate_cop_per_usd: rate.rate_cop_per_usd,
      source: rate.source,
      notes: rate.notes ?? null,
      fetched_at: new Date().toISOString(),
    });

  if (historyError) {
    throw historyError;
  }
}
