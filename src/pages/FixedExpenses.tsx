import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FixedExpensesManager } from '@/components/weekly-planner/FixedExpensesManager';
import { WeekCard } from '@/components/weekly-planner/WeekCard';
import { useFinancialConfig } from '@/hooks/use-financial-config';
import { useWeeklyPlannerData } from '@/hooks/use-weekly-planner-data';
import {
  formatMonthLabel,
  getFridayForWeekOfMonth,
  isSameMonth,
  shiftMonth,
} from '@/lib/date-ranges';
import { formatUSD } from '@/lib/currency';
import { toast } from 'sonner';

export default function FixedExpenses() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const weeklyPlannerData = useWeeklyPlannerData(selectedMonth);
  const financialConfig = useFinancialConfig();
  const { fixedExpenses, weeklyExpenses } = weeklyPlannerData;
  const config = financialConfig.data;
  const extraIncomes = config?.extraIncomes ?? { 1: 0, 2: 0, 3: 0, 4: 0 };
  const weeklyIncome = config?.weeklyIncome ?? 1536;
  const weeks = [1, 2, 3, 4];
  const paidTotal = weeklyExpenses
    .filter((expense) => expense.status === 'Paid')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = weeklyExpenses
    .filter((expense) => expense.status !== 'Paid')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthTotal = paidTotal + pendingTotal;
  const viewingCurrentMonth = isSameMonth(selectedMonth);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {viewingCurrentMonth ? 'Mes activo' : 'Historial mensual'}
          </p>
          <h1 className="font-display text-3xl font-bold capitalize tracking-tight">
            {formatMonthLabel(selectedMonth)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {viewingCurrentMonth
              ? 'Gastos fijos organizados por viernes de pago.'
              : 'Vista guardada de lo pagado y pendiente en ese mes.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/60 bg-background/70 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth((month) => shiftMonth(month, -1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/60 bg-background/70 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth(new Date())}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Today
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/60 bg-background/70 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMonth((month) => shiftMonth(month, 1))}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="font-semibold">{formatUSD(monthTotal)}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pending</p>
            <p className="font-semibold">{formatUSD(pendingTotal)}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Paid</p>
            <p className="font-semibold">{formatUSD(paidTotal)}</p>
          </div>
        </div>
      </div>

      {weeklyPlannerData.error && (
        <div className="glass-card p-8 text-center text-destructive">
          {weeklyPlannerData.error instanceof Error ? weeklyPlannerData.error.message : 'Unable to load fixed expenses'}
        </div>
      )}

      {financialConfig.error && (
        <div className="glass-card p-8 text-center text-destructive">
          {financialConfig.error instanceof Error ? financialConfig.error.message : 'Unable to load financial settings'}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {weeks.map((week) => (
          <WeekCard
            key={week}
            week={week}
            weeklyIncome={weeklyIncome}
            expenses={weeklyExpenses.filter((expense) => expense.week_number === week)}
            extraIncome={extraIncomes[week] || 0}
            dueDate={getFridayForWeekOfMonth(week, selectedMonth)}
            onExtraIncomeChange={(value) => {
              financialConfig.updateExtraIncome(week, value).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'Unable to update extra income');
              });
            }}
            onStatusChange={(id, status) => {
              weeklyPlannerData.updateExpense(id, { status }).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'Unable to update expense');
              });
            }}
            onUpdateExpense={(id, updates) => {
              weeklyPlannerData.updateExpense(id, updates).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'Unable to update expense');
              });
            }}
            onDeleteExpense={(id) => {
              weeklyPlannerData.deleteExpense(id).catch((error) => {
                toast.error(error instanceof Error ? error.message : 'Unable to delete expense');
              });
            }}
          />
        ))}
      </div>

      <FixedExpensesManager
        fixedExpenses={fixedExpenses}
        onAdd={(expense) => {
          weeklyPlannerData.addFixedExpense(expense).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to add fixed expense');
          });
        }}
        onUpdate={(id, updates) => {
          weeklyPlannerData.updateFixedExpense(id, updates).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to update fixed expense');
          });
        }}
        onDelete={(id) => {
          weeklyPlannerData.deleteFixedExpense(id).catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to delete fixed expense');
          });
        }}
      />
    </div>
  );
}
