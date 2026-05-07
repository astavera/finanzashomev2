import { ColombiaGoalsSection } from '@/components/dashboard/ColombiaGoalsSection';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { DashboardHomeMenu } from '@/components/dashboard/DashboardHomeMenu';
import { DashboardMetricGrid } from '@/components/dashboard/DashboardMetricGrid';
import { QuickWalletLink } from '@/components/dashboard/QuickWalletLink';
import { SpendingCategoryChart } from '@/components/dashboard/SpendingCategoryChart';
import { WeeklyCashFlowChart } from '@/components/dashboard/WeeklyCashFlowChart';
import {
  DEFAULT_EXCHANGE_RATE,
  buildDashboardMetrics,
} from '@/components/dashboard/dashboard-metrics';
import {
  useCreditCardsQuery,
  useProjectsQuery,
  useWeeklyExpensesQuery,
} from '@/hooks/use-financial-data';
import { useFinancialConfig } from '@/hooks/use-financial-config';

export default function Dashboard() {
  const financialConfig = useFinancialConfig();
  const { data: weeklyExpenses = [], isLoading: expensesLoading, error: expensesError } = useWeeklyExpensesQuery();
  const { data: creditCards = [], isLoading: cardsLoading, error: cardsError } = useCreditCardsQuery();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjectsQuery();

  const extraIncomes = financialConfig.data?.extraIncomes ?? { 1: 0, 2: 0, 3: 0, 4: 0 };
  const exchangeRate = financialConfig.data?.exchangeRate ?? DEFAULT_EXCHANGE_RATE;
  const weeklyIncome = financialConfig.data?.weeklyIncome ?? 1536;

  const metrics = buildDashboardMetrics({
    weeklyExpenses,
    creditCards,
    projects,
    weeklyIncome,
    extraIncomes,
    exchangeRate,
  });

  const isLoading = expensesLoading || cardsLoading || projectsLoading || financialConfig.isLoading;
  const error = expensesError ?? cardsError ?? projectsError ?? financialConfig.error;

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
      <DashboardHero
        savingsRate={metrics.savingsRate}
        topCategory={metrics.topCategory}
        copProgress={metrics.copProgress}
        monthlyEstimate={metrics.monthlyEstimate}
        totalExpenses={metrics.totalExpenses}
        totalRemaining={metrics.totalRemaining}
        exchangeRate={exchangeRate}
      />

      <DashboardHomeMenu />

      {isLoading && (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Cargando dashboard...
        </div>
      )}

      {error && (
        <div className="glass-card p-8 text-center text-destructive">
          {error instanceof Error ? error.message : 'No se pudo cargar el dashboard'}
        </div>
      )}

      {!error && (
        <>
          <DashboardMetricGrid
            weeklyIncome={weeklyIncome}
            monthlyEstimate={metrics.monthlyEstimate}
            totalExpenses={metrics.totalExpenses}
            totalRemaining={metrics.totalRemaining}
            totalCardBalance={metrics.totalCardBalance}
            creditCardCount={creditCards.length}
            weeklyExpenseCount={weeklyExpenses.length}
            exchangeRate={exchangeRate}
          />

          <QuickWalletLink />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <WeeklyCashFlowChart
              weeklyTotals={metrics.weeklyTotals}
              totalRemaining={metrics.totalRemaining}
              weeklyIncome={weeklyIncome}
            />

            <SpendingCategoryChart
              categoryData={metrics.categoryData}
              topCategory={metrics.topCategory}
            />
          </div>

          <ColombiaGoalsSection
            copProjects={metrics.copProjects}
            totalCopTarget={metrics.totalCopTarget}
            totalCopSaved={metrics.totalCopSaved}
            totalCopSavedUsd={metrics.totalCopSavedUsd}
            copProgress={metrics.copProgress}
            exchangeRate={exchangeRate}
          />
        </>
      )}
    </div>
  );
}
