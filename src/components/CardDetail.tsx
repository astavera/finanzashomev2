import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  CardDetailVisual,
  CardMetricGrid,
  CardTransactionsPanel,
  CardUtilizationPanel,
  CustomPaymentDialog,
  PaymentPlanner,
  PurchaseDialog,
  StatementPredictor,
  buildCardDetailMetrics,
  buildCardMetricItems,
  type PurchaseFormPayload,
} from '@/components/card-detail';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { formatUSD } from '@/lib/currency';
import type { CreditCard } from '@/lib/types';
import { updateCreditCard } from '@/services/credit-cards';
import { createTransaction, deleteTransaction, listTransactions } from '@/services/transactions';

type CardDetailProps = {
  card: CreditCard;
  onBack: () => void;
};

export default function CardDetail({ card, onBack }: CardDetailProps) {
  const queryClient = useQueryClient();
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: listTransactions,
  });

  const metrics = buildCardDetailMetrics(card, transactions);

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    ]);
  };

  const paymentMutation = useMutation({
    mutationFn: (amount: number) =>
      updateCreditCard(card.id, { current_balance: Math.max(0, card.current_balance - amount) }),
    onSuccess: async (_updatedCard, amount) => {
      await invalidateFinanceQueries();
      toast.success(`Payment of ${formatUSD(amount)} recorded`);
      setShowPayment(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to record payment');
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: PurchaseFormPayload) => {
      await createTransaction({
        date: new Date().toISOString().slice(0, 10),
        amount: data.amount,
        currency: 'USD',
        merchant: data.merchant,
        category: data.category,
        card_id: card.id,
        week_number: data.week,
        paid_by: data.paid_by,
        notes: data.notes || undefined,
      });

      await updateCreditCard(card.id, { current_balance: card.current_balance + data.amount });
    },
    onSuccess: async () => {
      await invalidateFinanceQueries();
      toast.success('Purchase recorded');
      setShowAddPurchase(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to record purchase');
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await invalidateFinanceQueries();
      toast.success('Transaction deleted');
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to delete transaction');
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cards
      </button>

      <CardDetailVisual card={card} utilization={metrics.utilization} utilizationColor={metrics.utilizationColor} />

      <CardMetricGrid
        metrics={buildCardMetricItems({
          balance: card.current_balance,
          available: metrics.available,
          utilization: metrics.utilization,
          utilizationColor: metrics.utilizationColor,
          daysUntilClosing: metrics.daysUntilClosing,
          daysUntilDue: metrics.daysUntilDue,
          cycleSpending: metrics.cycleSpending,
          minimumPayment: metrics.minimumPayment,
          creditLimit: card.credit_limit,
        })}
      />

      <CardUtilizationPanel
        utilization={metrics.utilization}
        utilizationColor={metrics.utilizationColor}
        maxFor30={metrics.maxFor30}
        creditLimit={card.credit_limit}
      />

      <StatementPredictor
        estimatedStatement={metrics.estimatedStatement}
        canStillSpend={metrics.canStillSpend}
        recommendedPayment={Math.max(0, card.current_balance - metrics.maxFor30)}
      />

      <PaymentPlanner
        balance={card.current_balance}
        dueDate={card.due_date}
        minimumPayment={metrics.minimumPayment}
        onPayment={(amount) => paymentMutation.mutate(amount)}
        onCustomPayment={() => setShowPayment(true)}
      />

      <CardTransactionsPanel
        transactions={metrics.cardTransactions}
        onAddPurchase={() => setShowAddPurchase(true)}
        onDelete={setDeleteId}
      />

      <PurchaseDialog
        open={showAddPurchase}
        onOpenChange={setShowAddPurchase}
        onSave={(data) => purchaseMutation.mutate(data)}
        cardName={card.card_name}
        saving={purchaseMutation.isPending}
      />

      <CustomPaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        onPayment={(amount) => paymentMutation.mutate(amount)}
        saving={paymentMutation.isPending}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Transaction"
        description="Remove this transaction?"
        onConfirm={() => {
          if (deleteId) deleteTransactionMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
