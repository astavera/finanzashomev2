import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import {
  buildHistoryRecords,
  filterHistoryRecords,
  getTransactionCategories,
  TransactionsFilters,
  TransactionsTable,
  type TransactionFilters,
} from '@/components/transactions';
import { useCreditCardsQuery, useTransactionsQuery, useWeeklyExpensesQuery } from '@/hooks/use-financial-data';
import { deleteTransaction } from '@/services/transactions';
import { deleteWeeklyExpense } from '@/services/weekly-expenses';

type DeleteTarget = {
  id: string;
  type: 'tx' | 'expense';
};

const defaultFilters: TransactionFilters = {
  week: 'all',
  paidBy: 'all',
  category: 'all',
  currency: 'all',
  search: '',
  sortDesc: true,
};

export default function TransactionsHistory() {
  const queryClient = useQueryClient();
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactionsQuery();
  const { data: weeklyExpenses = [], isLoading: expensesLoading, error: expensesError } = useWeeklyExpensesQuery();
  const { data: creditCards = [] } = useCreditCardsQuery();
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const historyRecords = useMemo(
    () => buildHistoryRecords(transactions, weeklyExpenses),
    [transactions, weeklyExpenses],
  );
  const categories = useMemo(() => getTransactionCategories(historyRecords), [historyRecords]);
  const filteredRecords = useMemo(() => filterHistoryRecords(historyRecords, filters), [historyRecords, filters]);

  const invalidateHistoryQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['weekly-expenses'] }),
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
    ]);
  };

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await invalidateHistoryQueries();
      toast.success('Transaction deleted');
      setDeleteTarget(null);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Unable to delete transaction');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteWeeklyExpense,
    onSuccess: async () => {
      await invalidateHistoryQueries();
      toast.success('Transaction deleted');
      setDeleteTarget(null);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Unable to delete expense');
    },
  });

  const isLoading = transactionsLoading || expensesLoading;
  const error = transactionsError ?? expensesError;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Complete household transaction history ({filteredRecords.length} records)
        </p>
      </div>

      {isLoading && <div className="glass-card p-8 text-center text-muted-foreground">Loading transactions...</div>}

      {error && (
        <div className="glass-card p-8 text-center text-destructive">
          {error instanceof Error ? error.message : 'Unable to load transactions'}
        </div>
      )}

      <TransactionsFilters
        categories={categories}
        filters={filters}
        onChange={(updates) => setFilters((currentFilters) => ({ ...currentFilters, ...updates }))}
      />

      {!error && (
        <TransactionsTable
          records={filteredRecords}
          creditCards={creditCards}
          onDelete={(record) => setDeleteTarget({ id: record.id, type: record._type })}
        />
      )}

      <DeleteConfirmation
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Transaction"
        description="Remove this transaction permanently?"
        onConfirm={() => {
          if (!deleteTarget) return;

          if (deleteTarget.type === 'tx') {
            deleteTransactionMutation.mutate(deleteTarget.id);
          } else {
            deleteExpenseMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </div>
  );
}
