import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  BankBalanceWeek,
  CarPayoffWeek,
  MonthlyAllocation,
} from '@/lib/types';
import {
  addMonthlyAllocation,
  deleteMonthlyAllocation,
  getFinancialSettings,
  updateAccumulatedCarSavings,
  updateBankBalanceWeek,
  updateCarPayoffWeek,
  updateExchangeRate,
  updateExtraIncome,
  updateMonthlyAllocation,
  updateWeeklyIncome,
} from '@/services/financial-config';

export function useFinancialConfig() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['financial-config'],
    queryFn: getFinancialSettings,
  });

  const invalidateConfig = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['financial-config'] }),
      queryClient.invalidateQueries({ queryKey: ['weekly-expenses'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
    ]);
  };

  const weeklyIncomeMutation = useMutation({
    mutationFn: updateWeeklyIncome,
    onSuccess: invalidateConfig,
  });

  const extraIncomeMutation = useMutation({
    mutationFn: ({ weekNumber, amount }: { weekNumber: number; amount: number }) =>
      updateExtraIncome(weekNumber, amount),
    onSuccess: invalidateConfig,
  });

  const exchangeRateMutation = useMutation({
    mutationFn: updateExchangeRate,
    onSuccess: invalidateConfig,
  });

  const addAllocationMutation = useMutation({
    mutationFn: addMonthlyAllocation,
    onSuccess: invalidateConfig,
  });

  const updateAllocationMutation = useMutation({
    mutationFn: ({ index, updates }: { index: number; updates: Partial<MonthlyAllocation> }) =>
      updateMonthlyAllocation(index, updates),
    onSuccess: invalidateConfig,
  });

  const deleteAllocationMutation = useMutation({
    mutationFn: deleteMonthlyAllocation,
    onSuccess: invalidateConfig,
  });

  const bankBalanceMutation = useMutation({
    mutationFn: ({ weekNumber, updates }: { weekNumber: number; updates: Partial<BankBalanceWeek> }) =>
      updateBankBalanceWeek(weekNumber, updates),
    onSuccess: invalidateConfig,
  });

  const carPayoffMutation = useMutation({
    mutationFn: ({ weekNumber, updates }: { weekNumber: number; updates: Partial<CarPayoffWeek> }) =>
      updateCarPayoffWeek(weekNumber, updates),
    onMutate: async ({ weekNumber, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['financial-config'] });
      const previousConfig = queryClient.getQueryData(['financial-config']);

      queryClient.setQueryData(['financial-config'], (current: typeof settingsQuery.data) => {
        if (!current) return current;

        return {
          ...current,
          carPayoff: current.carPayoff.map((week) => (
            week.week === weekNumber ? { ...week, ...updates } : week
          )),
        };
      });

      return { previousConfig };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousConfig) {
        queryClient.setQueryData(['financial-config'], context.previousConfig);
      }
    },
    onSuccess: invalidateConfig,
  });

  const accumulatedSavingsMutation = useMutation({
    mutationFn: updateAccumulatedCarSavings,
    onSuccess: invalidateConfig,
  });

  return {
    ...settingsQuery,
    updateWeeklyIncome: (amount: number) => weeklyIncomeMutation.mutateAsync(amount),
    updateExtraIncome: (weekNumber: number, amount: number) =>
      extraIncomeMutation.mutateAsync({ weekNumber, amount }),
    updateExchangeRate: exchangeRateMutation.mutateAsync,
    addAllocation: (allocation: MonthlyAllocation) => addAllocationMutation.mutateAsync(allocation),
    updateAllocation: (index: number, updates: Partial<MonthlyAllocation>) =>
      updateAllocationMutation.mutateAsync({ index, updates }),
    deleteAllocation: (index: number) => deleteAllocationMutation.mutateAsync(index),
    updateBankBalance: (weekNumber: number, updates: Partial<BankBalanceWeek>) =>
      bankBalanceMutation.mutateAsync({ weekNumber, updates }),
    updateCarPayoff: (weekNumber: number, updates: Partial<CarPayoffWeek>) =>
      carPayoffMutation.mutateAsync({ weekNumber, updates }),
    updateAccumulatedSavings: (amount: number) => accumulatedSavingsMutation.mutateAsync(amount),
  };
}
