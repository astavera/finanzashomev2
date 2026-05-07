import { cn } from '@/lib/utils';

export function CardInfoBlock({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'warning' | 'negative';
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 font-display text-xl font-bold tracking-tight',
          tone === 'positive' && 'text-positive',
          tone === 'warning' && 'text-warning',
          tone === 'negative' && 'text-negative',
        )}
      >
        {value}
      </p>
    </div>
  );
}
