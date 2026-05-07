import { supabase } from '@/integrations/supabase/client';
import type { CreditCard } from '@/lib/types';
import { mapCreditCard } from './mappers';

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  const userId = data.user?.id;

  if (!userId) {
    throw new Error('No authenticated user found.');
  }

  return userId;
}

export async function listCreditCards() {
  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data
    .filter((row) => ('is_active' in row ? row.is_active !== false : true))
    .map(mapCreditCard);
}

export async function createCreditCard(card: Partial<CreditCard> & { card_name: string }) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('credit_cards')
    .insert(({
      user_id: userId,
      card_name: card.card_name,
      issuer: card.issuer ?? null,
      network: card.network || null,
      last4: card.last4 ?? '',
      credit_limit: card.credit_limit ?? 0,
      current_balance: card.current_balance ?? 0,
      closing_date: card.closing_date ?? 1,
      due_date: card.due_date ?? 15,
      color_from: card.color_from ?? '#2a2a4a',
      color_to: card.color_to ?? '#4a4a6a',
      image_url: card.image_url ?? null,
    }) as never)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapCreditCard(data);
}

export async function updateCreditCard(id: string, updates: Partial<CreditCard>) {
  const { data, error } = await supabase
    .from('credit_cards')
    .update(({
      card_name: updates.card_name,
      issuer: updates.issuer,
      network: updates.network,
      last4: updates.last4,
      credit_limit: updates.credit_limit,
      current_balance: updates.current_balance,
      closing_date: updates.closing_date,
      due_date: updates.due_date,
      color_from: updates.color_from,
      color_to: updates.color_to,
      image_url: updates.image_url,
    }) as never)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapCreditCard(data);
}

export async function deleteCreditCard(id: string) {
  const { error } = await supabase
    .from('credit_cards')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
