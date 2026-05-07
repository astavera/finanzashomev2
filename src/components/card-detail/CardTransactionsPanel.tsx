import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/currency';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';

type CardTransactionsPanelProps = {
  transactions: Transaction[];
  onAddPurchase: () => void;
  onDelete: (transactionId: string) => void;
};

export function CardTransactionsPanel({ transactions, onAddPurchase, onDelete }: CardTransactionsPanelProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold">Card Transactions</h3>
        <Button size="sm" className="gap-1 text-xs" onClick={onAddPurchase}>
          <Plus className="w-3.5 h-3.5" /> Add Purchase
        </Button>
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-4">No transactions yet for this card.</p>
      ) : (
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-3 bg-secondary/20 rounded-xl p-3 group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{transaction.merchant}</p>
                <p className="text-[10px] text-muted-foreground">
                  {transaction.date} - {transaction.category} - W{transaction.week_number}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatUSD(transaction.amount)}</span>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full',
                  transaction.paid_by === 'Sebas' ? 'bg-info/20 text-info' : 'bg-accent/20 text-accent',
                )}
              >
                {transaction.paid_by}
              </span>
              <button
                onClick={() => onDelete(transaction.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${transaction.merchant}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
