import type { CreditCard, Transaction } from '@/lib/types';
import { formatUSD } from '@/lib/currency';

export function buildCardDetailMetrics(card: CreditCard, transactions: Transaction[]) {
  const cardTransactions = transactions.filter((transaction) => transaction.card_id === card.id);
  const utilization = card.credit_limit > 0 ? (card.current_balance / card.credit_limit) * 100 : 0;
  const utilizationColor = utilization < 30 ? 'text-success' : utilization < 50 ? 'text-warning' : 'text-danger';
  const available = card.credit_limit - card.current_balance;
  const maxFor30 = card.credit_limit * 0.3;
  const canStillSpend = Math.max(0, maxFor30 - card.current_balance);
  const today = new Date().getDate();
  const daysUntilClosing = card.closing_date >= today ? card.closing_date - today : 30 - today + card.closing_date;
  const daysUntilDue = card.due_date >= today ? card.due_date - today : 30 - today + card.due_date;
  const cycleSpending = cardTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const estimatedStatement = card.current_balance * 1.1;
  const minimumPayment = Math.max(25, card.current_balance * 0.02);

  return {
    cardTransactions,
    utilization,
    utilizationColor,
    available,
    maxFor30,
    canStillSpend,
    daysUntilClosing,
    daysUntilDue,
    cycleSpending,
    estimatedStatement,
    minimumPayment,
  };
}

export function buildCardMetricItems({
  balance,
  available,
  utilization,
  utilizationColor,
  daysUntilClosing,
  daysUntilDue,
  cycleSpending,
  minimumPayment,
  creditLimit,
}: {
  balance: number;
  available: number;
  utilization: number;
  utilizationColor: string;
  daysUntilClosing: number;
  daysUntilDue: number;
  cycleSpending: number;
  minimumPayment: number;
  creditLimit: number;
}) {
  return [
    { label: 'Balance', value: formatUSD(balance) },
    { label: 'Available', value: formatUSD(available), color: 'text-positive' },
    { label: 'Utilization', value: `${utilization.toFixed(1)}%`, color: utilizationColor },
    { label: 'Days to Close', value: String(daysUntilClosing) },
    { label: 'Days to Due', value: String(daysUntilDue) },
    { label: 'Cycle Spending', value: formatUSD(cycleSpending) },
    { label: 'Min Payment', value: formatUSD(minimumPayment) },
    { label: 'Limit', value: formatUSD(creditLimit) },
  ];
}
