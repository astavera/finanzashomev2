import { CreditCard as CreditCardIcon, PiggyBank, ShieldCheck, Wallet } from 'lucide-react';
import { formatUSD } from '@/lib/currency';
import type { CreditCard } from '@/lib/types';
import { CreditCardSummaryCard } from './CreditCardSummaryCard';
import { getCreditCardTotals } from './credit-card-utils';

type CreditCardsSummaryGridProps = {
  creditCards: CreditCard[];
};

export function CreditCardsSummaryGrid({ creditCards }: CreditCardsSummaryGridProps) {
  const totals = getCreditCardTotals(creditCards);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CreditCardSummaryCard
        label="Active Cards"
        value={String(creditCards.length)}
        helper="Tracked in this household"
        icon={<CreditCardIcon className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Total Balance"
        value={formatUSD(totals.totalBalance)}
        helper="Outstanding across all cards"
        icon={<Wallet className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Available Credit"
        value={formatUSD(totals.totalAvailable)}
        helper="Remaining before limits"
        icon={<PiggyBank className="h-4 w-4" />}
      />
      <CreditCardSummaryCard
        label="Utilization"
        value={`${totals.overallUtilization.toFixed(1)}%`}
        helper="Portfolio-wide usage"
        icon={<ShieldCheck className="h-4 w-4" />}
        tone={totals.overallUtilization < 30 ? 'positive' : totals.overallUtilization < 50 ? 'warning' : 'negative'}
      />
    </section>
  );
}
