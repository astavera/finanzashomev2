import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, WalletCards } from 'lucide-react';
import { toast } from 'sonner';
import { WalletCardStack } from '@/components/card-wallet/WalletCardStack';
import {
  WalletPurchasePanel,
  type WalletPurchaseForm,
} from '@/components/card-wallet/WalletPurchasePanel';
import { getCurrentWeekNumber } from '@/components/card-wallet/card-wallet-utils';
import { useCreditCardsQuery, useTransactionsQuery } from '@/hooks/use-financial-data';
import { createTransaction } from '@/services/transactions';
import { updateCreditCard } from '@/services/credit-cards';

function createEmptyForm(date: string): WalletPurchaseForm {
  return {
    merchant: '',
    amount: '',
    category: 'Other',
    date,
    paid_by: 'Sebas',
    notes: '',
  };
}

export default function CardWalletPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: creditCards = [], isLoading: cardsLoading, error: cardsError } = useCreditCardsQuery();
  const { data: transactions = [] } = useTransactionsQuery();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [form, setForm] = useState<WalletPurchaseForm>(() => createEmptyForm(today));

  const selectedCard = useMemo(
    () => creditCards.find((card) => card.id === selectedCardId) ?? null,
    [creditCards, selectedCardId],
  );

  const recentCardTransactions = useMemo(() => {
    if (!selectedCard) return [];
    return transactions.filter((transaction) => transaction.card_id === selectedCard.id).slice(0, 5);
  }, [selectedCard, transactions]);

  const resetForm = () => {
    setForm(createEmptyForm(today));
  };

  const createPurchaseMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCard) {
        throw new Error('Selecciona una tarjeta.');
      }

      const amount = Number(form.amount);
      if (!form.merchant.trim() || !amount || amount <= 0) {
        throw new Error('Completa comercio y monto.');
      }

      const transaction = await createTransaction({
        date: form.date,
        amount,
        currency: 'USD',
        merchant: form.merchant.trim(),
        category: form.category,
        card_id: selectedCard.id,
        week_number: getCurrentWeekNumber(form.date),
        paid_by: form.paid_by,
        notes: form.notes.trim() || undefined,
      });

      await updateCreditCard(selectedCard.id, {
        current_balance: selectedCard.current_balance + amount,
      });

      return transaction;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
      ]);
      toast.success('Compra registrada en gastos de tarjeta.');
      resetForm();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'No se pudo registrar la compra.');
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-[34px] border border-slate-200/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),rgba(241,245,249,0.82)_38%,rgba(226,232,240,0.68)_100%)] px-6 py-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9),rgba(15,23,42,0.92)_38%,rgba(2,6,23,0.98)_100%)] md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),transparent_34%)]" />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <WalletCards className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
              Wallet Flow
            </div>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-display font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Recordemos siempre, analicemos antes de comprar.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Siempre analicemos las compras que hacemos.
            </p>
          </div>
        </div>
      </section>

      {cardsLoading && (
        <div className="glass-card p-10 text-center text-muted-foreground">
          Cargando tarjetas...
        </div>
      )}

      {cardsError && (
        <div className="glass-card p-10 text-center text-destructive">
          {cardsError instanceof Error ? cardsError.message : 'No se pudieron cargar las tarjetas.'}
        </div>
      )}

      {!cardsLoading && !cardsError && creditCards.length > 0 && (
        <section className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,252,0.94))] p-5 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.92))] md:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.08fr)]">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-950 dark:text-white">Tus tarjetas</h2>
                <p className="text-sm text-muted-foreground">
                  Toca una tarjeta y se abrira el flujo de compra justo a la derecha.
                </p>
              </div>

              <WalletCardStack
                cards={creditCards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
              />
            </div>

            <div className="min-h-[420px]">
              {!selectedCard ? (
                <div className="flex h-full min-h-[420px] items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center dark:border-white/10 dark:bg-white/5">
                  <div className="max-w-sm">
                    <div className="mx-auto mb-4 inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-white dark:text-slate-950">
                      Wallet Flow
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">Selecciona una tarjeta</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Cuando elijas una tarjeta se abrira aqui el bloque de nueva compra junto con la actividad reciente.
                    </p>
                  </div>
                </div>
              ) : (
                <WalletPurchasePanel
                  selectedCard={selectedCard}
                  recentTransactions={recentCardTransactions}
                  form={form}
                  onFormChange={(updates) => setForm((current) => ({ ...current, ...updates }))}
                  onSubmit={() => createPurchaseMutation.mutate()}
                  onClear={resetForm}
                  saving={createPurchaseMutation.isPending}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
