import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/currency';
import { getOrdinal } from '@/components/credit-cards';

type PaymentPlannerProps = {
  balance: number;
  dueDate: number;
  minimumPayment: number;
  onPayment: (amount: number) => void;
  onCustomPayment: () => void;
};

export function PaymentPlanner({ balance, dueDate, minimumPayment, onPayment, onCustomPayment }: PaymentPlannerProps) {
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">Payment Planner</h3>
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-muted-foreground">
          Balance: <span className="font-bold text-foreground">{formatUSD(balance)}</span>
        </span>
        <span className="text-muted-foreground">
          Due: <span className="font-bold text-foreground">{getOrdinal(dueDate)}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="text-xs" onClick={() => onPayment(minimumPayment)}>
          Pay Minimum ({formatUSD(minimumPayment)})
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => onPayment(balance)}>
          Pay Full Balance
        </Button>
        <Button size="sm" variant="secondary" className="text-xs" onClick={onCustomPayment}>
          Pay Custom
        </Button>
      </div>
    </div>
  );
}
