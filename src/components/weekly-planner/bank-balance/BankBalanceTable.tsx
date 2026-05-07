import { TrendingDown, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import type { BankBalanceWeek } from '@/lib/types';
import type { BankBalanceTotals } from './bank-balance-utils';

type BankBalanceTableProps = {
  bankBalances: BankBalanceWeek[];
  totals: BankBalanceTotals;
  onFieldChange: (balance: BankBalanceWeek, field: keyof BankBalanceWeek, value: number) => void;
};

export function BankBalanceTable({ bankBalances, totals, onFieldChange }: BankBalanceTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/40">
            {['Semana', 'Ingreso Real', 'Presupuesto', 'Expenses', 'Diferencia'].map((header) => (
              <th key={header} className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider first:text-left first:pl-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bankBalances.map((balance) => {
            const diff = balance.real_income - balance.expenses;
            const pctOfBudget = balance.budget > 0 ? (balance.expenses / balance.budget) * 100 : 0;

            return (
              <tr key={balance.week} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{balance.week}</span>
                    <span className="font-medium text-xs text-muted-foreground">Semana {balance.week}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <Input
                    type="number"
                    value={balance.real_income}
                    className="w-28 h-8 text-right text-xs ml-auto bg-secondary/30 border-border/30 font-medium"
                    onChange={(event) => onFieldChange(balance, 'real_income', Number(event.target.value))}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <Input
                    type="number"
                    value={balance.budget}
                    className="w-28 h-8 text-right text-xs ml-auto bg-secondary/30 border-border/30 font-medium"
                    onChange={(event) => onFieldChange(balance, 'budget', Number(event.target.value))}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Input
                      type="number"
                      value={balance.expenses}
                      className="w-28 h-8 text-right text-xs bg-secondary/30 border-border/30 font-medium"
                      onChange={(event) => onFieldChange(balance, 'expenses', Number(event.target.value))}
                    />
                    {balance.budget > 0 && (
                      <div className="flex items-center gap-1.5 w-28">
                        <div className="flex-1 h-1 rounded-full bg-secondary/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pctOfBudget > 100 ? 'bg-destructive' : pctOfBudget > 80 ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${Math.min(pctOfBudget, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[9px] font-medium ${pctOfBudget > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {pctOfBudget.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {formatUSD(diff)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-secondary/40 border-t border-border/50 font-semibold">
            <td className="py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground">Total</td>
            <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totals.totalRealIncome)}</td>
            <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totals.totalBudget)}</td>
            <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totals.totalExpenses)}</td>
            <td className="py-3 px-4 text-right">
              <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${totals.totalDifference >= 0 ? 'text-positive' : 'text-negative'}`}>
                {totals.totalDifference >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatUSD(totals.totalDifference)}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
