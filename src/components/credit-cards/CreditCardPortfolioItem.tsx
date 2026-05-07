import { Pencil, Trash2 } from 'lucide-react';
import { CardInfoBlock } from '@/components/credit-cards/CardInfoBlock';
import { getCardImage } from '@/lib/card-appearance';
import { formatUSD } from '@/lib/currency';
import type { CreditCard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getOrdinal, getUtilization } from './credit-card-utils';

type CreditCardPortfolioItemProps = {
  card: CreditCard;
  onSelect: (cardId: string) => void;
  onEdit: (card: CreditCard) => void;
  onDelete: (cardId: string) => void;
};

export function CreditCardPortfolioItem({ card, onSelect, onEdit, onDelete }: CreditCardPortfolioItemProps) {
  const img = getCardImage(card);
  const utilization = getUtilization(card);
  const utilizationColor = utilization < 30 ? 'text-success' : utilization < 50 ? 'text-warning' : 'text-danger';
  const utilizationLabel = utilization < 30 ? 'Healthy' : utilization < 50 ? 'Watch' : 'High';
  const available = Math.max(0, card.credit_limit - card.current_balance);

  return (
    <div className="group relative">
      <button onClick={() => onSelect(card.id)} className="w-full text-left">
        <div className="dashboard-surface relative overflow-hidden p-4 md:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
            <div
              className="relative flex h-56 flex-col justify-between overflow-hidden rounded-[24px] p-6 text-white shadow-2xl shadow-black/10 transition-all duration-300 group-hover:scale-[1.01]"
              style={{ background: img ? undefined : `linear-gradient(135deg, ${card.color_from}, ${card.color_to})` }}
            >
              {img && (
                <>
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-display font-bold drop-shadow-lg md:text-xl">{card.card_name}</p>
                  <p className="text-xs opacity-85 drop-shadow">
                    {card.issuer} - {card.network}
                  </p>
                </div>
                <div className={cn('rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold backdrop-blur', utilizationColor)}>
                  {utilization.toFixed(0)}% used
                </div>
              </div>

              <div className="relative">
                <p className="mb-4 font-mono text-lg tracking-[0.22em] drop-shadow-lg">**** **** **** {card.last4}</p>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div>
                    <span className="opacity-65">Balance</span>
                    <p className="font-semibold drop-shadow">{formatUSD(card.current_balance)}</p>
                  </div>
                  <div>
                    <span className="opacity-65">Limit</span>
                    <p className="font-semibold drop-shadow">{formatUSD(card.credit_limit)}</p>
                  </div>
                  <div>
                    <span className="opacity-65">Closes</span>
                    <p className="font-semibold drop-shadow">{getOrdinal(card.closing_date)}</p>
                  </div>
                  <div>
                    <span className="opacity-65">Due</span>
                    <p className="font-semibold drop-shadow">{getOrdinal(card.due_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <CardInfoBlock label="Available Credit" value={formatUSD(available)} tone="positive" />
              <CardInfoBlock label="Current Balance" value={formatUSD(card.current_balance)} />
              <CardInfoBlock
                label="Utilization Status"
                value={utilizationLabel}
                tone={utilization < 30 ? 'positive' : utilization < 50 ? 'warning' : 'negative'}
              />
            </div>
          </div>
        </div>
      </button>

      <div className="absolute right-6 top-6 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit(card);
          }}
          className="rounded-xl border border-white/15 bg-black/45 p-2 text-white/85 backdrop-blur hover:bg-black/65 hover:text-white"
          aria-label={`Edit ${card.card_name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(card.id);
          }}
          className="rounded-xl border border-white/15 bg-black/45 p-2 text-white/85 backdrop-blur hover:bg-destructive hover:text-white"
          aria-label={`Delete ${card.card_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
