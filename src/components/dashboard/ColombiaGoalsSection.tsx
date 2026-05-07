import { Globe, Target } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { ProgressRing } from '@/components/ProgressRing';
import { copToUsd, formatCOP, formatUSD } from '@/lib/currency';
import type { ExchangeRate, Project } from '@/lib/types';

export function ColombiaGoalsSection({
  copProjects,
  totalCopTarget,
  totalCopSaved,
  totalCopSavedUsd,
  copProgress,
  exchangeRate,
}: {
  copProjects: Project[];
  totalCopTarget: number;
  totalCopSaved: number;
  totalCopSavedUsd: number;
  copProgress: number;
  exchangeRate: ExchangeRate;
}) {
  return (
    <section className="dashboard-surface p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-accent/15 p-2.5 text-accent">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Colombia Financial Goals</h3>
            <p className="text-sm text-muted-foreground">
              Ahorro en COP y su equivalencia estimada en USD.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
          <Target className="h-4 w-4 text-accent" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Progreso</p>
            <p className="font-display text-lg font-bold">{copProgress.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Goal (COP)" value={formatCOP(totalCopTarget)} className="bg-background/60" />
        <MetricCard title="Total Saved (COP)" value={formatCOP(totalCopSaved)} className="bg-background/60" />
        <MetricCard title="Ahorrado (equiv. USD)" value={formatUSD(totalCopSavedUsd)} className="bg-background/60" />
        <MetricCard
          title="Tasa de cambio"
          value={`${exchangeRate.rate_cop_per_usd.toLocaleString()} COP/USD`}
          className="bg-background/60"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {copProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30"
          >
            <ProgressRing value={project.current_amount} max={project.target_amount} size={60} strokeWidth={5} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.project_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatCOP(project.current_amount)} / {formatCOP(project.target_amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                Aprox. {formatUSD(copToUsd(project.current_amount, exchangeRate.rate_cop_per_usd))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
