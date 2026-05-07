import type { Transaction, WeeklyExpense } from '@/lib/types';

export type HistoryRecord = Transaction & {
  _type: 'tx' | 'expense';
};

export type TransactionFilters = {
  week: string;
  paidBy: string;
  category: string;
  currency: string;
  search: string;
  sortDesc: boolean;
};

export function buildHistoryRecords(transactions: Transaction[], weeklyExpenses: WeeklyExpense[]): HistoryRecord[] {
  return [
    ...transactions.map((transaction) => ({ ...transaction, _type: 'tx' as const })),
    ...weeklyExpenses.map((expense) => ({
      id: expense.id,
      date: expense.date,
      amount: expense.amount,
      currency: expense.currency,
      merchant: expense.concept,
      category: expense.category,
      card_id: undefined,
      week_number: expense.week_number,
      paid_by: expense.paid_by,
      notes: expense.notes || '',
      _type: 'expense' as const,
    })),
  ];
}

export function getTransactionCategories(records: HistoryRecord[]) {
  return [...new Set(records.map((record) => record.category))].sort();
}

export function filterHistoryRecords(records: HistoryRecord[], filters: TransactionFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return records
    .filter((record) => {
      if (filters.week !== 'all' && record.week_number !== Number(filters.week)) return false;
      if (filters.paidBy !== 'all' && record.paid_by !== filters.paidBy) return false;
      if (filters.category !== 'all' && record.category !== filters.category) return false;
      if (filters.currency !== 'all' && record.currency !== filters.currency) return false;
      if (normalizedSearch && !record.merchant.toLowerCase().includes(normalizedSearch)) return false;
      return true;
    })
    .sort((a, b) => (filters.sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
}
