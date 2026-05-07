import { useEffect, useState } from 'react';
import { Check, Pencil, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';

export function IncomeBudgetSettings({
  weeklyIncome,
  onUpdateWeeklyIncome,
}: {
  weeklyIncome: number;
  onUpdateWeeklyIncome: (amount: number) => Promise<unknown>;
}) {
  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState(weeklyIncome);
  const monthlyEstimate = weeklyIncome * 4;

  useEffect(() => {
    setIncomeValue(weeklyIncome);
  }, [weeklyIncome]);

  const saveIncome = () => {
    if (incomeValue <= 0) return;
    onUpdateWeeklyIncome(incomeValue)
      .then(() => {
        setEditingIncome(false);
        toast.success('Weekly income updated');
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Unable to update weekly income');
      });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Income & Budget</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Weekly Income</span>
          {editingIncome ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">$</span>
              <Input type="number" value={incomeValue} onChange={(event) => setIncomeValue(+event.target.value)} className="h-8 w-28 bg-secondary/50 text-sm text-right" min={0} />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveIncome}>
                <Check className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingIncome(false)}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatUSD(weeklyIncome)}</span>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingIncome(true)}>
                <Pencil className="w-3 h-3 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Monthly Estimate (4 weeks)</span>
          <span className="font-semibold">{formatUSD(monthlyEstimate)}</span>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Biweekly Paycheck</span>
          <span className="font-semibold text-muted-foreground">{formatUSD(weeklyIncome * 2)}</span>
        </div>
      </div>
    </div>
  );
}
