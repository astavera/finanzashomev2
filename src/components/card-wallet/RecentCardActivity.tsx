import { ChevronRight } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import type { CreditCard, Transaction } from '@/lib/types';

type RecentCardActivityProps = {
  selectedCard: CreditCard;
  recentTransactions: Transaction[];
};

export function RecentCardActivity({ selectedCard, recentTransactions }: RecentCardActivityProps) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))] p-6 text-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] dark:border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_26%)]" />
      <div className="relative">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold">Actividad reciente</h2>
          <p className="mt-1 text-sm text-white/65">Ultimas compras registradas para la tarjeta seleccionada.</p>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/70">
            Aun no hay compras registradas para {selectedCard.card_name}.
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{transaction.merchant}</p>
                    <p className="mt-1 text-xs text-white/55">
                      {transaction.date} - {transaction.category} - {transaction.paid_by}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/90">
                    {formatUSD(transaction.amount)}
                    <ChevronRight className="h-3.5 w-3.5 text-white/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
