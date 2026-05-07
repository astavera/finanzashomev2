import { BankBalanceTracker } from '@/components/weekly-planner/BankBalanceTracker';
import { CarPayoffPlan } from '@/components/weekly-planner/CarPayoffPlan';
import { MonthlySummary } from '@/components/weekly-planner/MonthlySummary';
import { useWeeklyPlannerData } from '@/hooks/use-weekly-planner-data';
import { toast } from 'sonner';
import { useFinancialConfig } from '@/hooks/use-financial-config';

export default function WeeklyPlanner() {
  const weeklyPlannerData = useWeeklyPlannerData();
  const financialConfig = useFinancialConfig();
  const { weeklyExpenses } = weeklyPlannerData;
  const config = financialConfig.data;
  const extraIncomes = config?.extraIncomes ?? { 1: 0, 2: 0, 3: 0, 4: 0 };
  const bankBalances = config?.bankBalances ?? [];
  const carPayoff = config?.carPayoff ?? [];
  const accumulatedCarSavings = config?.accumulatedCarSavings ?? 0;
  const appliedCarPaymentsToDate = config?.appliedCarPaymentsToDate ?? 0;
  const monthlyAllocations = config?.monthlyAllocations ?? [];
  const exchangeRate = config?.exchangeRate ?? {
    provider_name: 'Remitly',
    rate_cop_per_usd: 4000,
    last_updated: new Date().toISOString().slice(0, 10),
    source: 'manual' as const,
  };
  const weeklyIncome = config?.weeklyIncome ?? 1536;

  const weeks = [1, 2, 3, 4];

  const totalRemaining = weeks.reduce((sum, w) => {
    const weekExpenses = weeklyExpenses.filter((e) => e.week_number === w);
    const total = weekExpenses.reduce((s, e) => s + e.amount, 0);
    return sum + (weeklyIncome + (extraIncomes[w] || 0) - total);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Weekly Planner</h1>
        <p className="text-muted-foreground text-sm">Plan your household budget week by week</p>
      </div>

      {weeklyPlannerData.isLoading && (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Loading weekly expenses...
        </div>
      )}

      {weeklyPlannerData.error && (
        <div className="glass-card p-8 text-center text-destructive">
          {weeklyPlannerData.error instanceof Error ? weeklyPlannerData.error.message : 'Unable to load weekly expenses'}
        </div>
      )}

      {financialConfig.error && (
        <div className="glass-card p-8 text-center text-destructive">
          {financialConfig.error instanceof Error ? financialConfig.error.message : 'Unable to load financial settings'}
        </div>
      )}

      <BankBalanceTracker bankBalances={bankBalances} onUpdate={(week, updates) => {
        financialConfig.updateBankBalance(week, updates).catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to update bank balance');
        });
      }} />
      <CarPayoffPlan
        carPayoff={carPayoff}
        onUpdate={(week, updates) => {
          financialConfig.updateCarPayoff(week, updates).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to update car payoff');
          });
        }}
        accumulatedSavings={accumulatedCarSavings}
        appliedPaymentsToDate={appliedCarPaymentsToDate}
        onAccumulatedChange={(value) => {
          financialConfig.updateAccumulatedSavings(value).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to update accumulated savings');
          });
        }}
      />
      <MonthlySummary
        totalRemaining={totalRemaining}
        allocations={monthlyAllocations}
        onUpdateAllocation={(index, updates) => {
          financialConfig.updateAllocation(index, updates).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to update allocation');
          });
        }}
        onAddAllocation={(allocation) => {
          financialConfig.addAllocation(allocation).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to add allocation');
          });
        }}
        onDeleteAllocation={(index) => {
          financialConfig.deleteAllocation(index).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to delete allocation');
          });
        }}
        exchangeRate={exchangeRate}
        weeklyExpenses={weeklyExpenses}
      />
    </div>
  );
}
