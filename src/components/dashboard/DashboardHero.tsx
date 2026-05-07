import { formatUSD } from '@/lib/currency';
import type { ExchangeRate } from '@/lib/types';
import type { CategoryTotal } from './dashboard-metrics';

export function DashboardHero({
  savingsRate,
  topCategory,
  copProgress,
  monthlyEstimate,
  totalExpenses,
  totalRemaining,
  exchangeRate,
}: {
  savingsRate: number;
  topCategory?: CategoryTotal;
  copProgress: number;
  monthlyEstimate: number;
  totalExpenses: number;
  totalRemaining: number;
  exchangeRate: ExchangeRate;
}) {
  return (
    <section className="dashboard-surface dashboard-grid relative overflow-hidden px-6 py-6 md:px-8 md:py-7">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.05]" />
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.9fr)] xl:items-end">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Panel financiero del hogar
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
            Flujo semanal, deuda de tarjetas y avance de metas en una sola vista.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <HeroStat label="Nivel de ahorro" value={`${savingsRate.toFixed(1)}%`} />
            <HeroStat label="Mayor gasto" value={topCategory ? topCategory.name : 'Sin datos'} />
            <HeroStat label="Metas COP" value={`${copProgress.toFixed(1)}%`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-start sm:grid-cols-4 xl:grid-cols-2">
          <HeroSummary label="Ingreso" value={formatUSD(monthlyEstimate)} />
          <HeroSummary label="Gastos" value={formatUSD(totalExpenses)} className="text-negative" />
          <HeroSummary label="Disponible" value={formatUSD(totalRemaining)} />
          <HeroSummary label="Tasa" value={exchangeRate.rate_cop_per_usd.toLocaleString()} />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function HeroSummary({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-xl font-bold ${className}`}>{value}</p>
    </div>
  );
}
