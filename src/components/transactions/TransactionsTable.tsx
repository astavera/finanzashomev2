import { Trash2 } from 'lucide-react';
import { PaidByBadge } from '@/components/common/PaidByBadge';
import { formatCurrency } from '@/lib/currency';
import type { CreditCard } from '@/lib/types';
import type { HistoryRecord } from './transactions-history-utils';

type TransactionsTableProps = {
  records: HistoryRecord[];
  creditCards: CreditCard[];
  onDelete: (record: HistoryRecord) => void;
};

export function TransactionsTable({ records, creditCards, onDelete }: TransactionsTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/20">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Merchant</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Card</th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Week</th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Paid By</th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-16"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const card = creditCards.find((creditCard) => creditCard.id === record.card_id);

            return (
              <tr
                key={`${record._type}-${record.id}`}
                className="border-b border-border/20 hover:bg-secondary/10 transition-colors group"
              >
                <td className="py-2.5 px-4 text-muted-foreground text-xs">{record.date}</td>
                <td className="py-2.5 px-4 font-medium">{record.merchant}</td>
                <td className="py-2.5 px-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50">{record.category}</span>
                </td>
                <td className="py-2.5 px-4 text-right font-semibold">{formatCurrency(record.amount, record.currency)}</td>
                <td className="py-2.5 px-4 text-center text-xs text-muted-foreground">{card?.card_name || '-'}</td>
                <td className="py-2.5 px-4 text-center text-xs">W{record.week_number}</td>
                <td className="py-2.5 px-4 text-center">
                  <PaidByBadge name={record.paid_by} />
                </td>
                <td className="py-2.5 px-4 text-center">
                  <button
                    onClick={() => onDelete(record)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${record.merchant}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}

          {records.length === 0 && (
            <tr>
              <td colSpan={8} className="py-12 text-center text-muted-foreground">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
