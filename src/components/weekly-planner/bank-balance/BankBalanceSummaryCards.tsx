import { BarChart3, DollarSign, Receipt, TrendingDown, TrendingUp } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import type { BankBalanceTotals } from './bank-balance-utils';

type BankBalanceSummaryCardsProps = {
  totals: BankBalanceTotals;
};

export function BankBalanceSummaryCards({ totals }: BankBalanceSummaryCardsProps) {
  const items = [
    { label: 'Ingreso Real', value: totals.totalRealIncome, icon: DollarSign, color: 'text-primary' },
    { label: 'Presupuesto', value: totals.totalBudget, icon: BarChart3, color: 'text-info' },
    { label: 'Expenses', value: totals.totalExpenses, icon: Receipt, color: 'text-warning' },
    {
      label: 'Diferencia',
      value: totals.totalDifference,
      icon: totals.totalDifference >= 0 ? TrendingUp : TrendingDown,
      color: totals.totalDifference >= 0 ? 'text-positive' : 'text-negative',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {items.map((item) => (
        <div key={item.label} className="bg-secondary/30 rounded-xl p-3 text-center">
          <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
          <p className={`font-display font-bold text-sm ${item.label === 'Diferencia' ? item.color : ''}`}>
            {formatUSD(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
