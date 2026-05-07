import type { BankBalanceWeek } from '@/lib/types';
import {
  BankBalanceHeader,
  BankBalanceSummaryCards,
  BankBalanceTable,
  getBankBalanceTotals,
} from './bank-balance';

interface Props {
  bankBalances: BankBalanceWeek[];
  onUpdate: (week: number, updates: Partial<BankBalanceWeek>) => void;
}

export function BankBalanceTracker({ bankBalances, onUpdate }: Props) {
  const totals = getBankBalanceTotals(bankBalances);

  const handleFieldChange = (balance: BankBalanceWeek, field: keyof BankBalanceWeek, value: number) => {
    const updated = { ...balance, [field]: value };
    updated.difference = updated.real_income - updated.expenses;
    onUpdate(balance.week, updated);
  };

  return (
    <div className="glass-card p-6">
      <BankBalanceHeader totalDifference={totals.totalDifference} />
      <BankBalanceSummaryCards totals={totals} />
      <BankBalanceTable bankBalances={bankBalances} totals={totals} onFieldChange={handleFieldChange} />
    </div>
  );
}
