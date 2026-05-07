import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { getCardImage, getCardSurface } from '@/lib/card-appearance';
import type { CreditCard } from '@/lib/types';

export function WalletCardStack({
  cards,
  selectedCardId,
  onSelectCard,
}: {
  cards: CreditCard[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
}) {
  return (
    <div className="relative pb-4 pt-1">
      {cards.map((card, index) => {
        const isSelected = selectedCardId === card.id;
        const available = Math.max(0, card.credit_limit - card.current_balance);
        const img = getCardImage(card);
        const surface = getCardSurface(card);

        return (
          <button
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className={cn(
              'relative block w-full text-left transition-all duration-500',
              index > 0 && '-mt-28 md:-mt-32',
              isSelected ? 'z-30 translate-x-3 md:translate-x-6' : 'z-10 hover:translate-x-2',
            )}
            style={{ zIndex: isSelected ? 50 : cards.length - index }}
          >
            <div
              className={cn(
                'relative h-56 overflow-hidden rounded-[32px] border p-6 shadow-[0_28px_65px_-28px_rgba(15,23,42,0.85)]',
                isSelected ? 'border-white/40 ring-1 ring-slate-300/30' : 'border-white/15',
              )}
              style={{
                background: img
                  ? 'linear-gradient(135deg, rgba(15,23,42,0.35), rgba(15,23,42,0.7))'
                  : surface.background,
              }}
            >
              {img && (
                <>
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/35 to-black/80" />
                </>
              )}
              <div className="absolute -right-8 top-4 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_35%,rgba(255,255,255,0.02)_60%,rgba(0,0,0,0.15))]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="font-display text-2xl font-bold tracking-tight"
                      style={{ color: img ? 'white' : surface.accent }}
                    >
                      {card.card_name}
                    </p>
                    <p
                      className="mt-1 text-xs uppercase tracking-[0.22em]"
                      style={{ color: img ? 'rgba(255,255,255,0.68)' : surface.subAccent }}
                    >
                      {card.issuer} - {card.network}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur',
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/25 text-white/88',
                    )}
                  >
                    {isSelected ? 'Lista para comprar' : 'Seleccionar'}
                  </div>
                </div>

                <div>
                  <p
                    className="font-mono text-lg tracking-[0.28em]"
                    style={{ color: img ? 'rgba(255,255,255,0.95)' : surface.accent }}
                  >
                    **** **** **** {card.last4}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 backdrop-blur">
                      <span style={{ color: img ? 'rgba(255,255,255,0.62)' : surface.subAccent }}>Balance</span>
                      <p className="mt-1 font-semibold" style={{ color: img ? 'white' : surface.accent }}>
                        {formatUSD(card.current_balance)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 backdrop-blur">
                      <span style={{ color: img ? 'rgba(255,255,255,0.62)' : surface.subAccent }}>Disponible</span>
                      <p className="mt-1 font-semibold" style={{ color: img ? 'white' : surface.accent }}>
                        {formatUSD(available)}
                      </p>
                    </div>
                  </div>
                  {!img && (
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: surface.subAccent }}>
                      {surface.label}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
