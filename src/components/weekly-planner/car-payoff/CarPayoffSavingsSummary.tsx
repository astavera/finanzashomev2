import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatUSD } from '@/lib/currency';
import { CURRENT_DEBT, WEEKLY_EXTRA_TARGET } from '../car-payoff-utils';

type CarPayoffSavingsSummaryProps = {
  accumulatedSavings: number;
  paidWeeklyExtra: number;
  pendingWeeklyExtra: number;
  totalYearlySaved: number;
  availableToPay: number;
  debtAfterLumpPayment: number;
  onAccumulatedChange: (value: number) => void;
};

export function CarPayoffSavingsSummary({
  accumulatedSavings,
  paidWeeklyExtra,
  pendingWeeklyExtra,
  totalYearlySaved,
  availableToPay,
  debtAfterLumpPayment,
  onAccumulatedChange,
}: CarPayoffSavingsSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div className="bg-primary/10 rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Acumulado meses anteriores</p>
        <Input
          type="number"
          value={accumulatedSavings || ''}
          placeholder="0"
          className="h-8 text-center text-sm font-bold bg-secondary/30 border-border/30"
          onChange={(event) => onAccumulatedChange(Number(event.target.value))}
        />
      </div>
      <div className="bg-primary/10 rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground">Abonado este mes</p>
        <p className="font-display font-bold text-lg">{formatUSD(paidWeeklyExtra)}</p>
        <p className="text-[10px] text-muted-foreground">de {formatUSD(WEEKLY_EXTRA_TARGET * 4)}</p>
      </div>
      <div className="bg-accent/10 rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground">Pendiente semanal</p>
        <p className="font-display font-bold text-xl text-accent">{formatUSD(pendingWeeklyExtra)}</p>
        <Progress value={Math.min((totalYearlySaved / CURRENT_DEBT) * 100, 100)} className="mt-2 h-2" />
      </div>
      <div className="bg-positive/10 rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground">Si abonas disponible</p>
        <p className="font-display font-bold text-xl text-positive">{formatUSD(Math.max(debtAfterLumpPayment, 0))}</p>
        <p className="text-[10px] text-muted-foreground">usando {formatUSD(availableToPay)}</p>
      </div>
    </div>
  );
}
