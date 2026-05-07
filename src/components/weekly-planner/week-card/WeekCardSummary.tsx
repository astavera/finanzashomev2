import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import { formatShortDate } from '@/lib/date-ranges';
import { cn } from '@/lib/utils';

type WeekCardSummaryProps = {
  week: number;
  weeklyIncome: number;
  extraIncome: number;
  totalExpenses: number;
  remaining: number;
  dueDate: string;
  paidCount: number;
  pendingCount: number;
  onExtraIncomeChange: (value: number) => void;
};

export function WeekCardSummary({
  week,
  weeklyIncome,
  extraIncome,
  totalExpenses,
  remaining,
  dueDate,
  paidCount,
  pendingCount,
  onExtraIncomeChange,
}: WeekCardSummaryProps) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-tight">Week {week}</h3>
          <p className="text-[11px] text-muted-foreground">Due {formatShortDate(dueDate)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md border border-border bg-background/70 px-2 py-1 text-[10px] font-semibold">
            {pendingCount} pending
          </span>
          <span className="rounded-md border border-border bg-background/70 px-2 py-1 text-[10px] text-muted-foreground">
            {paidCount} paid
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-1.5 text-xs">
        <div className="rounded-md border border-border/50 bg-background/50 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Income</p>
          <p className="font-semibold">{formatUSD(weeklyIncome)}</p>
        </div>
        <div className="rounded-md border border-border/50 bg-background/50 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Extra</p>
          <Input
            type="text"
            inputMode="decimal"
            value={extraIncome}
            onChange={(event) => onExtraIncomeChange(Number(event.target.value) || 0)}
            className="h-5 border-0 bg-transparent p-0 text-xs font-semibold shadow-none focus-visible:ring-0"
            placeholder="0"
          />
        </div>
        <div className="rounded-md border border-border/50 bg-background/50 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Expenses</p>
          <p className="font-semibold">{formatUSD(totalExpenses)}</p>
        </div>
        <div className="rounded-md border border-border/50 bg-background/50 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Left</p>
          <p
            className={cn(
              'font-semibold',
              remaining < 0 && 'text-destructive',
            )}
          >
            {remaining >= 0 ? '' : '-'}
            {formatUSD(Math.abs(remaining))}
          </p>
        </div>
      </div>
    </>
  );
}
