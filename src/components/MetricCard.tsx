import { cn } from '@/lib/utils';
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon, trend, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'glass-card group relative overflow-hidden p-5 animate-fade-in transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-xl hover:shadow-primary/5',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</span>
        {icon && (
          <div className="rounded-xl border border-border/60 bg-background/70 p-2 text-muted-foreground transition-colors group-hover:text-foreground">
            {icon}
          </div>
        )}
      </div>
      <div
        className={cn(
          'text-2xl font-display font-bold tracking-tight md:text-[1.75rem]',
          trend === 'up' && 'text-positive',
          trend === 'down' && 'text-negative',
        )}
      >
        {value}
      </div>
      {subtitle && <p className="mt-2 text-xs leading-5 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
