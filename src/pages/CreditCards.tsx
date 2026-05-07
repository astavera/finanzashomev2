import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CardDetail from '@/components/CardDetail';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import {
  CardFormDialog,
  CreditCardPortfolioList,
  CreditCardsHero,
  CreditCardsSummaryGrid,
} from '@/components/credit-cards';
import { getErrorMessage } from '@/lib/supabase-error';
import type { CreditCard } from '@/lib/types';
import { createCreditCard, deleteCreditCard, listCreditCards, updateCreditCard } from '@/services/credit-cards';

export default function CreditCards() {
  const queryClient = useQueryClient();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editCard, setEditCard] = useState<CreditCard | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: creditCards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: listCreditCards,
  });

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    ]);
  };

  const createCardMutation = useMutation({
    mutationFn: createCreditCard,
    onSuccess: async () => {
      await invalidateFinanceQueries();
      toast.success('Card added');
      setEditCard(null);
      setShowAdd(false);
    },
    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, 'Unable to create card'));
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreditCard> }) => updateCreditCard(id, updates),
    onSuccess: async () => {
      await invalidateFinanceQueries();
      toast.success('Card updated');
      setEditCard(null);
      setShowAdd(false);
    },
    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, 'Unable to update card'));
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCreditCard,
    onSuccess: async () => {
      await invalidateFinanceQueries();
      toast.success('Card deleted');
      setDeleteId(null);
      if (selectedCard === deleteId) {
        setSelectedCard(null);
      }
    },
    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, 'Unable to delete card'));
    },
  });

  useEffect(() => {
    if (selectedCard && !creditCards.some((card) => card.id === selectedCard)) {
      setSelectedCard(null);
    }
  }, [creditCards, selectedCard]);

  const handleAddCard = () => {
    setEditCard(null);
    setShowAdd(true);
  };

  const handleEditCard = (card: CreditCard) => {
    setEditCard(card);
    setShowAdd(true);
  };

  if (selectedCard) {
    const card = creditCards.find((currentCard) => currentCard.id === selectedCard);
    if (card) return <CardDetail card={card} onBack={() => setSelectedCard(null)} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <CreditCardsHero onAddCard={handleAddCard} />

      {!isLoading && !error && creditCards.length > 0 && <CreditCardsSummaryGrid creditCards={creditCards} />}

      {isLoading && (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <p className="mb-2 text-lg">Loading cards...</p>
        </div>
      )}

      {error && (
        <div className="glass-card p-12 text-center text-destructive">
          <p className="mb-2 text-lg">Unable to load cards</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      )}

      {!isLoading && !error && creditCards.length === 0 ? (
        <div className="dashboard-surface p-12 text-center text-muted-foreground">
          <p className="mb-2 text-lg font-display font-semibold text-foreground">No cards yet</p>
          <p className="text-sm">Add your first credit card to start tracking balances and spending.</p>
        </div>
      ) : !isLoading && !error ? (
        <CreditCardPortfolioList
          creditCards={creditCards}
          onSelect={setSelectedCard}
          onEdit={handleEditCard}
          onDelete={setDeleteId}
        />
      ) : null}

      <CardFormDialog
        open={showAdd}
        onOpenChange={(open) => {
          setShowAdd(open);
          if (!open) setEditCard(null);
        }}
        initialData={editCard}
        onSave={(card) => {
          if (editCard) {
            updateCardMutation.mutate({ id: editCard.id, updates: card });
          } else {
            createCardMutation.mutate(card);
          }
        }}
        saving={createCardMutation.isPending || updateCardMutation.isPending}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Credit Card"
        description="This will remove the card and all associated transactions."
        onConfirm={() => {
          if (deleteId) deleteCardMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
