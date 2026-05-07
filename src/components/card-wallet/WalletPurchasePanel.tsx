import type { CreditCard, Transaction } from '@/lib/types';
import { RecentCardActivity } from './RecentCardActivity';
import { WalletPurchaseFormPanel } from './WalletPurchaseFormPanel';

export type WalletPurchaseForm = {
  merchant: string;
  amount: string;
  category: string;
  date: string;
  paid_by: string;
  notes: string;
};

export function WalletPurchasePanel({
  selectedCard,
  recentTransactions,
  form,
  onFormChange,
  onSubmit,
  onClear,
  saving,
}: {
  selectedCard: CreditCard;
  recentTransactions: Transaction[];
  form: WalletPurchaseForm;
  onFormChange: (updates: Partial<WalletPurchaseForm>) => void;
  onSubmit: () => void;
  onClear: () => void;
  saving: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] shadow-[0_24px_60px_-32px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))]">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
      <div className="space-y-5 p-6">
        <WalletPurchaseFormPanel
          selectedCard={selectedCard}
          form={form}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          onClear={onClear}
          saving={saving}
        />
        <RecentCardActivity selectedCard={selectedCard} recentTransactions={recentTransactions} />
      </div>
    </div>
  );
}
