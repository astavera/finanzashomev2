import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatUSD } from '@/lib/currency';
import type { WeeklyTotal } from './dashboard-metrics';

export function WeeklyCashFlowChart({
  weeklyTotals,
  totalRemaining,
  weeklyIncome,
}: {
  weeklyTotals: WeeklyTotal[];
  totalRemaining: number;
  weeklyIncome: number;
}) {
  return (
    <section className="dashboard-surface p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Weekly Cash Flow</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Compara gasto frente al saldo que queda por semana.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Neto del mes</p>
          <p className="font-display text-lg font-bold">{formatUSD(totalRemaining)}</p>
        </div>
      </div>
      <div className="h-[260px] w-full rounded-2xl bg-background/35 p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTotals} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <XAxis dataKey="week" stroke="hsl(215,15%,52%)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(215,15%,52%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 12,
                fontSize: 12,
                color: 'hsl(var(--popover-foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Bar dataKey="expenses" fill="hsl(0,72%,51%)" radius={[6, 6, 0, 0]} name="Expenses" />
            <Bar dataKey="remaining" fill="hsl(160,84%,39%)" radius={[6, 6, 0, 0]} name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-background/70 px-3 py-1">Rojo: gastos</span>
        <span className="rounded-full bg-background/70 px-3 py-1">Verde: disponible</span>
        <span className="rounded-full bg-background/70 px-3 py-1">Ingreso: {formatUSD(weeklyIncome)}/semana</span>
        <span className="rounded-full bg-background/70 px-3 py-1">Incluye extras configurados</span>
      </div>
    </section>
  );
}
