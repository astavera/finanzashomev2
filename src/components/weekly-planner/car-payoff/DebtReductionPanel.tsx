import { formatUSD } from '@/lib/currency';

type DebtReductionPanelProps = {
  principalFromPayment: number;
  monthlyPaid: boolean;
  appliedPaymentsToDate: number;
  paidWeeklyExtra: number;
  totalAppliedPayments: number;
};

export function DebtReductionPanel({
  principalFromPayment,
  monthlyPaid,
  appliedPaymentsToDate,
  paidWeeklyExtra,
  totalAppliedPayments,
}: DebtReductionPanelProps) {
  return (
    <div className="bg-secondary/20 rounded-xl p-4 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Reduccion aplicada a la deuda</p>
          <p className="font-display font-bold text-lg text-positive">{formatUSD(totalAppliedPayments)}</p>
          <p className="text-[10px] text-muted-foreground">
            Anteriores: {formatUSD(appliedPaymentsToDate)} | Semanas actuales: {formatUSD(paidWeeklyExtra)} |
            Pago mensual: {monthlyPaid ? formatUSD(principalFromPayment) : 'pendiente'}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{totalAppliedPayments > 0 ? 'Actualizado hoy' : 'Sin abonos aplicados'}</span>
      </div>
    </div>
  );
}
