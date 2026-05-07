import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { formatUSD } from '@/lib/currency';

type BankBalanceHeaderProps = {
  totalDifference: number;
};

export function BankBalanceHeader({ totalDifference }: BankBalanceHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
          <Wallet className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Bank Balance Weekly Tracker</h3>
          <p className="text-xs text-muted-foreground">Compara tu ingreso real vs presupuesto semanal</p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${totalDifference >= 0 ? 'bg-positive text-positive' : 'bg-negative text-negative'}`}>
        {totalDifference >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {formatUSD(totalDifference)}
      </div>
    </div>
  );
}
