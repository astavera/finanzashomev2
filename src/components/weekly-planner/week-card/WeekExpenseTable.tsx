import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaidByBadge } from '@/components/common/PaidByBadge';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { WeeklyExpense } from '@/lib/types';

type WeekExpenseTableProps = {
  expenses: WeeklyExpense[];
  totalExpenses: number;
  onStatusChange: (id: string, status: WeeklyExpense['status']) => void;
  onEdit: (expense: WeeklyExpense) => void;
  onDelete: (id: string) => void;
};

export function WeekExpenseTable({
  expenses,
  totalExpenses,
  onStatusChange,
  onEdit,
  onDelete,
}: WeekExpenseTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border/40 bg-secondary/20">
            <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">Concept</th>
            <th className="px-2.5 py-1.5 text-right font-medium text-muted-foreground">Amount</th>
            <th className="px-2.5 py-1.5 text-center font-medium text-muted-foreground">Who</th>
            <th className="px-2.5 py-1.5 text-center font-medium text-muted-foreground">Status</th>
            <th className="w-8 px-2 py-1.5"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="group border-b border-border/20 transition-colors hover:bg-secondary/10">
              <td className="px-2.5 py-1.5">
                <span className="font-medium">{expense.concept}</span>
                {expense.notes && <span className="text-muted-foreground ml-1 text-[9px]">({expense.notes})</span>}
              </td>
              <td className="px-2.5 py-1.5 text-right font-semibold">{formatUSD(expense.amount)}</td>
              <td className="px-2.5 py-1.5 text-center">
                <PaidByBadge name={expense.paid_by} />
              </td>
              <td className="px-2.5 py-1.5 text-center">
                <div className="inline-flex rounded-lg border border-border/60 bg-background p-0.5">
                  {(['Pending', 'Paid'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onStatusChange(expense.id, status)}
                      className={cn(
                        'h-6 rounded-md px-2 text-[9px] font-semibold transition-colors',
                        expense.status === status
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-2 py-1.5 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded p-1 opacity-60 transition-opacity hover:bg-secondary/50 group-hover:opacity-100">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Pencil className="w-3 h-3 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(expense.id, 'Partial')}>
                      Mark Partial
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(expense.id)} className="text-destructive">
                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border/50">
            <td className="px-2.5 py-1.5 font-semibold">Total</td>
            <td className="px-2.5 py-1.5 text-right font-bold">{formatUSD(totalExpenses)}</td>
            <td colSpan={3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
