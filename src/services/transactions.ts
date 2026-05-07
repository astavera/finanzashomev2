import { supabase } from '@/integrations/supabase/client';
import type { Transaction } from '@/lib/types';
import { getHouseholdId, getWeeklyBudgetId } from './household';
import { mapPurchaseToTransaction, mapTransactionView } from './mappers';

type CardPurchaseWithBudget = {
  id: string;
  amount: number;
  card_id: string;
  category: string | null;
  created_at: string;
  currency: 'USD' | 'COP';
  household_id: string;
  merchant: string;
  notes: string | null;
  paid_by: 'Sebas' | 'Sharon';
  purchase_date: string;
  reflected_in_weekly_expenses: boolean;
  reflected_weekly_expense_id: string | null;
  updated_at: string;
  weekly_budget_id: string | null;
  weekly_budgets: { week_number: number } | null;
};

export async function listTransactions() {
  const householdId = await getHouseholdId();

  const { data, error } = await supabase
    .from('transactions_view')
    .select('*')
    .eq('household_id', householdId)
    .order('transaction_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapTransactionView).filter((transaction) => transaction.id);
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>, options?: {
  reflectedWeeklyExpenseId?: string;
}) {
  const householdId = await getHouseholdId();
  const weeklyBudgetId = await getWeeklyBudgetId(transaction.week_number);

  const { data, error } = await supabase
    .from('card_purchases')
    .insert({
      household_id: householdId,
      card_id: transaction.card_id ?? '',
      merchant: transaction.merchant,
      amount: transaction.amount,
      currency: transaction.currency,
      category: transaction.category,
      paid_by: transaction.paid_by as 'Sebas' | 'Sharon',
      notes: transaction.notes ?? null,
      purchase_date: transaction.date,
      weekly_budget_id: weeklyBudgetId,
      reflected_in_weekly_expenses: Boolean(options?.reflectedWeeklyExpenseId),
      reflected_weekly_expense_id: options?.reflectedWeeklyExpenseId ?? null,
    })
    .select('*, weekly_budgets(week_number)')
    .single();

  if (error) {
    throw error;
  }

  const row = data as CardPurchaseWithBudget;
  return mapPurchaseToTransaction(row, row.weekly_budgets?.week_number ?? transaction.week_number);
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('card_purchases')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
