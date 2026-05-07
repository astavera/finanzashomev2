import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function CreditCardSummaryCard({
  label,
  value,
  helper,
  icon,
  tone = 'default',
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: 'default' | 'positive' | 'warning' | 'negative';
}) {
  return (
    <div className="glass-card group relative overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-info/50 to-transparent" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <div className="rounded-xl border border-border/60 bg-background/70 p-2 text-muted-foreground transition-colors group-hover:text-foreground">
          {icon}
        </div>
      </div>
      <div
        className={cn(
          'font-display text-[1.75rem] font-bold tracking-tight',
          tone === 'positive' && 'text-positive',
          tone === 'warning' && 'text-warning',
          tone === 'negative' && 'text-negative',
        )}
      >
        {value}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
    </div>
  );
}
