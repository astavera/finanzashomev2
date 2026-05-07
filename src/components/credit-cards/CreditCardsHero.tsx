import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CreditCardsHeroProps = {
  onAddCard: () => void;
};

export function CreditCardsHero({ onAddCard }: CreditCardsHeroProps) {
  return (
    <section className="dashboard-surface dashboard-grid relative overflow-hidden px-6 py-7 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-info/10 via-transparent to-primary/10" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-info" />
            Card portfolio
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">Credit Cards</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Controla balances, uso de credito y disponibilidad de todas tus tarjetas en una sola vista.
          </p>
        </div>

        <Button size="sm" className="gap-2 rounded-xl" onClick={onAddCard}>
          <Plus className="h-4 w-4" /> Add Card
        </Button>
      </div>
    </section>
  );
}
