import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMonthKey } from '@/lib/date-ranges';
import type { FixedWeeklyExpense, WeeklyExpense } from '@/lib/types';
import {
  createFixedWeeklyExpense,
  createWeeklyExpense,
  deleteFixedWeeklyExpense,
  deleteWeeklyExpense,
  duplicateWeeklyExpense,
  listFixedWeeklyExpenses,
  listWeeklyExpenses,
  updateFixedWeeklyExpense,
  updateWeeklyExpense,
} from '@/services/weekly-expenses';

export function useWeeklyPlannerData(monthDate = new Date()) {
  const queryClient = useQueryClient();
  const monthKey = getMonthKey(monthDate);

  const weeklyExpensesQuery = useQuery({
    queryKey: ['weekly-expenses', monthKey],
    queryFn: () => listWeeklyExpenses(monthDate),
  });

  const fixedExpensesQuery = useQuery({
    queryKey: ['fixed-weekly-expenses'],
    queryFn: listFixedWeeklyExpenses,
  });

  const invalidateWeeklyExpenseQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['weekly-expenses'] }),
      queryClient.invalidateQueries({ queryKey: ['fixed-weekly-expenses'] }),
      queryClient.invalidateQueries({ queryKey: ['project-yearly-collections'] }),
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
    ]);
  };

  const addExpenseMutation = useMutation({
    mutationFn: createWeeklyExpense,
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WeeklyExpense> }) =>
      updateWeeklyExpense(id, updates),
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteWeeklyExpense,
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const duplicateExpenseMutation = useMutation({
    mutationFn: duplicateWeeklyExpense,
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const addFixedExpenseMutation = useMutation({
    mutationFn: createFixedWeeklyExpense,
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const updateFixedExpenseMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FixedWeeklyExpense> }) =>
      updateFixedWeeklyExpense(id, updates),
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  const deleteFixedExpenseMutation = useMutation({
    mutationFn: deleteFixedWeeklyExpense,
    onSuccess: invalidateWeeklyExpenseQueries,
  });

  return {
    weeklyExpenses: weeklyExpensesQuery.data ?? [],
    fixedExpenses: fixedExpensesQuery.data ?? [],
    isLoading: weeklyExpensesQuery.isLoading || fixedExpensesQuery.isLoading,
    error: weeklyExpensesQuery.error ?? fixedExpensesQuery.error,
    addExpense: (expense: Omit<WeeklyExpense, 'id'>) => addExpenseMutation.mutateAsync(expense),
    updateExpense: (id: string, updates: Partial<WeeklyExpense>) =>
      updateExpenseMutation.mutateAsync({ id, updates }),
    deleteExpense: (id: string) => deleteExpenseMutation.mutateAsync(id),
    duplicateExpense: (expense: WeeklyExpense) => duplicateExpenseMutation.mutateAsync(expense),
    addFixedExpense: (expense: Omit<FixedWeeklyExpense, 'id'>) =>
      addFixedExpenseMutation.mutateAsync(expense),
    updateFixedExpense: (id: string, updates: Partial<FixedWeeklyExpense>) =>
      updateFixedExpenseMutation.mutateAsync({ id, updates }),
    deleteFixedExpense: (id: string) => deleteFixedExpenseMutation.mutateAsync(id),
  };
}
