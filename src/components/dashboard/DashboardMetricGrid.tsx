import { ArrowRightLeft, CreditCard, DollarSign, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { formatUSD } from '@/lib/currency';
import type { ExchangeRate } from '@/lib/types';

export function DashboardMetricGrid({
  weeklyIncome,
  monthlyEstimate,
  totalExpenses,
  totalRemaining,
  totalCardBalance,
  creditCardCount,
  weeklyExpenseCount,
  exchangeRate,
}: {
  weeklyIncome: number;
  monthlyEstimate: number;
  totalExpenses: number;
  totalRemaining: number;
  totalCardBalance: number;
  creditCardCount: number;
  weeklyExpenseCount: number;
  exchangeRate: ExchangeRate;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <MetricCard
        title="Ingreso semanal"
        value={formatUSD(weeklyIncome)}
        icon={<DollarSign className="h-4 w-4" />}
        subtitle="Ingreso base por semana"
      />
      <MetricCard
        title="Estimado mensual"
        value={formatUSD(monthlyEstimate)}
        icon={<Wallet className="h-4 w-4" />}
        subtitle="Proyeccion de 4 semanas"
      />
      <MetricCard
        title="Gastos totales"
        value={formatUSD(totalExpenses)}
        trend="down"
        icon={<TrendingUp className="h-4 w-4" />}
        subtitle={`${weeklyExpenseCount} movimientos registrados`}
      />
      <MetricCard
        title="Disponible"
        value={formatUSD(totalRemaining)}
        trend={totalRemaining >= 0 ? 'up' : 'down'}
        icon={<PiggyBank className="h-4 w-4" />}
        subtitle={totalRemaining >= 0 ? 'Saldo despues de gastos' : 'Por encima del plan mensual'}
      />
      <MetricCard
        title="Balances de tarjetas"
        value={formatUSD(totalCardBalance)}
        icon={<CreditCard className="h-4 w-4" />}
        subtitle={`${creditCardCount} tarjetas activas`}
      />
      <MetricCard
        title="Tasa Remitly"
        value={`$1 = ${exchangeRate.rate_cop_per_usd.toLocaleString()} COP`}
        icon={<ArrowRightLeft className="h-4 w-4" />}
        subtitle={`Actualizada ${exchangeRate.last_updated}`}
      />
    </div>
  );
}
