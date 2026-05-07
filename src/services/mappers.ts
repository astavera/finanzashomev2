import type { Database } from '@/integrations/supabase/types';
import type { CreditCard, Project, Transaction, WeeklyExpense } from '@/lib/types';

type CreditCardRow = Database['public']['Tables']['credit_cards']['Row'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type WeeklyExpenseRow = Database['public']['Tables']['weekly_expenses']['Row'];
type CardPurchaseRow = Database['public']['Tables']['card_purchases']['Row'];
type TransactionViewRow = Database['public']['Views']['transactions_view']['Row'];

const FALLBACK_CARD_GRADIENTS = [
  ['#f5f5f7', '#e8e8ed'],
  ['#0a2351', '#1a4a8a'],
  ['#8B6914', '#D4A017'],
  ['#1a3a1a', '#2d5a2d'],
] as const;

function getFallbackGradient(id: string) {
  const seed = Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0);
  return FALLBACK_CARD_GRADIENTS[seed % FALLBACK_CARD_GRADIENTS.length];
}

export function mapCreditCard(row: CreditCardRow): CreditCard {
  const [fallbackFrom, fallbackTo] = getFallbackGradient(row.id);
  const runtimeRow = row as CreditCardRow & {
    closing_date?: number | null;
    due_date?: number | null;
    color_from?: string | null;
    color_to?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
  };

  return {
    id: row.id,
    card_name: row.card_name,
    issuer: row.issuer,
    network: row.network ?? '',
    last4: row.last4,
    credit_limit: row.credit_limit,
    current_balance: row.current_balance,
    closing_date: row.closing_day ?? runtimeRow.closing_date ?? 1,
    due_date: row.due_day ?? runtimeRow.due_date ?? 15,
    color_from: runtimeRow.color_from ?? fallbackFrom,
    color_to: runtimeRow.color_to ?? fallbackTo,
    image_url: runtimeRow.image_url ?? runtimeRow.imageUrl ?? undefined,
  };
}

export function mapWeeklyExpense(
  row: WeeklyExpenseRow,
  weekNumber: number,
): WeeklyExpense {
  return {
    id: row.id,
    week_number: weekNumber,
    concept: row.concept,
    amount: row.amount,
    currency: row.currency,
    date: row.expense_date ?? row.created_at.slice(0, 10),
    paid_by: row.paid_by,
    status: row.status,
    category: row.category ?? 'Other',
    notes: row.notes ?? undefined,
  };
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    project_name: row.project_name,
    target_amount: row.target_amount,
    current_amount: row.current_amount,
    currency: row.currency,
    country_tag: row.country_tag ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function mapPurchaseToTransaction(row: CardPurchaseRow, weekNumber: number | null): Transaction {
  return {
    id: row.id,
    date: row.purchase_date,
    amount: row.amount,
    currency: row.currency,
    merchant: row.merchant,
    category: row.category ?? 'Other',
    card_id: row.card_id,
    week_number: weekNumber ?? 1,
    paid_by: row.paid_by,
    notes: row.notes ?? undefined,
  };
}

export function mapTransactionView(row: TransactionViewRow): Transaction {
  return {
    id: row.transaction_id ?? '',
    date: row.transaction_date ?? row.created_at?.slice(0, 10) ?? '',
    amount: row.amount ?? 0,
    currency: (row.currency ?? 'USD') as Transaction['currency'],
    merchant: row.description ?? '',
    category: row.category ?? 'Other',
    card_id: row.card_id ?? undefined,
    week_number: row.week_number ?? 1,
    paid_by: row.paid_by ?? 'Sebas',
    notes: row.notes ?? undefined,
  };
}
