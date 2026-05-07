import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';

type CardUtilizationPanelProps = {
  utilization: number;
  utilizationColor: string;
  maxFor30: number;
  creditLimit: number;
};

export function CardUtilizationPanel({ utilization, utilizationColor, maxFor30, creditLimit }: CardUtilizationPanelProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Credit Utilization</span>
        <span className={cn('text-xs font-semibold', utilizationColor)}>
          {utilization < 30 ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
          {utilization < 30 ? 'Good' : utilization < 50 ? 'Warning' : 'High'}
        </span>
      </div>
      <Progress value={Math.min(utilization, 100)} className="h-3" />
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>$0</span>
        <span className="text-success">30% ({formatUSD(maxFor30)})</span>
        <span>{formatUSD(creditLimit)}</span>
      </div>
    </div>
  );
}
