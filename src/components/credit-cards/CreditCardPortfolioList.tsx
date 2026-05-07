import type { CreditCard } from '@/lib/types';
import { CreditCardPortfolioItem } from './CreditCardPortfolioItem';

type CreditCardPortfolioListProps = {
  creditCards: CreditCard[];
  onSelect: (cardId: string) => void;
  onEdit: (card: CreditCard) => void;
  onDelete: (cardId: string) => void;
};

export function CreditCardPortfolioList({ creditCards, onSelect, onEdit, onDelete }: CreditCardPortfolioListProps) {
  return (
    <div className="space-y-5">
      {creditCards.map((card) => (
        <CreditCardPortfolioItem
          key={card.id}
          card={card}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
