import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CarPayoffWeek } from '@/lib/types';
import {
  CarPayoffAiAdvice,
  CarPayoffHeader,
  CarPayoffMetricGrid,
  CarPayoffSavingsSummary,
  DebtReductionPanel,
  MonthlyPaymentToggle,
  WeeklyExtraSavingsGrid,
} from './car-payoff';
import { APR, MONTHLY_PAYMENT, buildCarPayoffMetrics, monthsUntilPayoff } from './car-payoff-utils';

interface Props {
  carPayoff: CarPayoffWeek[];
  onUpdate: (week: number, updates: Partial<CarPayoffWeek>) => void;
  accumulatedSavings: number;
  appliedPaymentsToDate: number;
  onAccumulatedChange: (v: number) => void;
}

export function CarPayoffPlan({
  carPayoff,
  onUpdate,
  accumulatedSavings,
  appliedPaymentsToDate,
  onAccumulatedChange,
}: Props) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const metrics = buildCarPayoffMetrics(carPayoff, accumulatedSavings, appliedPaymentsToDate);

  const askAI = async () => {
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const { data, error } = await supabase.functions.invoke('car-payoff-advice', {
        body: {
          currentDebt: metrics.currentDebtToday,
          apr: APR,
          monthlyPayment: MONTHLY_PAYMENT,
          totalSaved: metrics.availableToPay,
          monthsUntilPayoff: monthsUntilPayoff(),
        },
      });

      if (error) throw error;
      setAiAdvice(data.advice);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error getting advice';
      setAiAdvice(`Error: ${message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <CarPayoffHeader />
      <CarPayoffMetricGrid
        baseDebtToday={metrics.baseDebtToday}
        currentDebtToday={metrics.currentDebtToday}
        monthlyInterest={metrics.monthlyInterest}
        totalAppliedPayments={metrics.totalAppliedPayments}
        projectedDebt={metrics.projectedDebt}
      />
      <MonthlyPaymentToggle
        monthlyPaid={metrics.monthlyPaid}
        onToggle={() => {
          const current = carPayoff[0]?.monthlyPaymentPaid ?? false;
          onUpdate(1, { monthlyPaymentPaid: !current });
        }}
      />
      <WeeklyExtraSavingsGrid carPayoff={carPayoff} onUpdate={onUpdate} />
      <CarPayoffSavingsSummary
        accumulatedSavings={accumulatedSavings}
        paidWeeklyExtra={metrics.paidWeeklyExtra}
        pendingWeeklyExtra={metrics.pendingWeeklyExtra}
        totalYearlySaved={metrics.totalYearlySaved}
        availableToPay={metrics.availableToPay}
        debtAfterLumpPayment={metrics.debtAfterLumpPayment}
        onAccumulatedChange={onAccumulatedChange}
      />
      <DebtReductionPanel
        principalFromPayment={metrics.principalFromPayment}
        monthlyPaid={metrics.monthlyPaid}
        appliedPaymentsToDate={metrics.appliedPaymentsToDate}
        paidWeeklyExtra={metrics.paidWeeklyExtra}
        totalAppliedPayments={metrics.totalAppliedPayments}
      />
      <CarPayoffAiAdvice
        aiAdvice={aiAdvice}
        aiLoading={aiLoading}
        totalYearlySaved={metrics.availableToPay}
        onAskAI={askAI}
      />
    </div>
  );
}
