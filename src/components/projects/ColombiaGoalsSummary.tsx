import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { copToUsd, formatCOP, formatUSD } from '@/lib/currency';
import { getProgressPercent } from './projects-utils';

type ColombiaGoalsSummaryProps = {
  totalTarget: number;
  totalSaved: number;
  exchangeRate: number;
};

export function ColombiaGoalsSummary({ totalTarget, totalSaved, exchangeRate }: ColombiaGoalsSummaryProps) {
  const progress = getProgressPercent(totalSaved, totalTarget);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold">Colombia Goals Summary</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent ml-2">
          Rate: {exchangeRate.toLocaleString()} COP/USD
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Total Target</p>
          <p className="font-display font-bold">{formatCOP(totalTarget)}</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Total Saved</p>
          <p className="font-display font-bold text-positive">{formatCOP(totalSaved)}</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">USD Saved</p>
          <p className="font-display font-bold">{formatUSD(copToUsd(totalSaved, exchangeRate))}</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Progress</p>
          <p className="font-display font-bold">{progress.toFixed(1)}%</p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
