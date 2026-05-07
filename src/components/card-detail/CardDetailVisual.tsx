import type { CreditCard } from '@/lib/types';
import { cn } from '@/lib/utils';

type CardDetailVisualProps = {
  card: CreditCard;
  utilization: number;
  utilizationColor: string;
};

export function CardDetailVisual({ card, utilization, utilizationColor }: CardDetailVisualProps) {
  return (
    <div className="dashboard-surface p-4 md:p-5">
      <div
        className="relative rounded-[24px] p-8 h-56 flex flex-col justify-between overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${card.color_from}, ${card.color_to})` }}
      >
        {card.image_url && (
          <>
            <img src={card.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-2xl font-display font-bold drop-shadow-lg">{card.card_name}</p>
            <p className="text-sm opacity-80 drop-shadow">{card.issuer} - {card.network}</p>
          </div>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur', utilizationColor)}>
            {utilization.toFixed(0)}% utilization
          </span>
        </div>
        <p className="relative font-mono text-xl tracking-[0.25em] drop-shadow-lg">**** **** **** {card.last4}</p>
      </div>
    </div>
  );
}
