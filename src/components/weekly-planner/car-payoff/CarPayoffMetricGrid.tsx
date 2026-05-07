import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { APR } from '../car-payoff-utils';

type CarPayoffMetricGridProps = {
  baseDebtToday: number;
  currentDebtToday: number;
  monthlyInterest: number;
  totalAppliedPayments: number;
  projectedDebt: number;
};

export function CarPayoffMetricGrid({
  baseDebtToday,
  currentDebtToday,
  monthlyInterest,
  totalAppliedPayments,
  projectedDebt,
}: CarPayoffMetricGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div className="bg-secondary/30 rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">Deuda Hoy</p>
        <p className="font-display font-bold text-lg">{formatUSD(currentDebtToday)}</p>
        <p className="text-[10px] text-muted-foreground">despues de abonos</p>
      </div>
      <div className="bg-secondary/30 rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">APR</p>
        <p className="font-display font-bold text-lg">{APR}%</p>
        <p className="text-[10px] text-muted-foreground">Base: {formatUSD(baseDebtToday)} | interes: {formatUSD(monthlyInterest)}/mes</p>
      </div>
      <div className="bg-secondary/30 rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">Abonos Aplicados</p>
        <p className={cn('font-display font-bold text-lg', totalAppliedPayments > 0 ? 'text-positive' : 'text-muted-foreground')}>
          {totalAppliedPayments > 0 ? formatUSD(totalAppliedPayments) : '-'}
        </p>
        <p className="text-[10px] text-muted-foreground">anteriores + mes actual</p>
      </div>
      <div className={cn('rounded-xl p-3 text-center', projectedDebt < currentDebtToday ? 'bg-positive/10' : 'bg-secondary/30')}>
        <p className="text-xs text-muted-foreground">Deuda si Pagas Pendiente</p>
        <p className="font-display font-bold text-lg">{formatUSD(Math.max(projectedDebt, 0))}</p>
        <p className="text-[10px] text-muted-foreground">pendiente semanal</p>
      </div>
    </div>
  );
}
