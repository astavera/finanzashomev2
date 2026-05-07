import { useQuery } from '@tanstack/react-query';
import { listCreditCards } from '@/services/credit-cards';
import { listProjects, listProjectYearlyCollections } from '@/services/projects';
import { listTransactions } from '@/services/transactions';
import { listWeeklyExpenses } from '@/services/weekly-expenses';

export function useCreditCardsQuery() {
  return useQuery({
    queryKey: ['credit-cards'],
    queryFn: listCreditCards,
  });
}

export function useWeeklyExpensesQuery() {
  return useQuery({
    queryKey: ['weekly-expenses'],
    queryFn: () => listWeeklyExpenses(),
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: listProjects,
  });
}

export function useProjectYearlyCollectionsQuery(year = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['project-yearly-collections', year],
    queryFn: () => listProjectYearlyCollections(year),
  });
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: listTransactions,
  });
}
