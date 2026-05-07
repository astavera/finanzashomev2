import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatUSD } from '@/lib/currency';
import { DASHBOARD_CHART_COLORS, type CategoryTotal } from './dashboard-metrics';

export function SpendingCategoryChart({
  categoryData,
  topCategory,
}: {
  categoryData: CategoryTotal[];
  topCategory?: CategoryTotal;
}) {
  return (
    <section className="dashboard-surface p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Spending by Category</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribucion del gasto registrado este periodo.
          </p>
        </div>
        {topCategory && (
          <div className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mayor</p>
            <p className="font-display text-lg font-bold">{topCategory.name}</p>
          </div>
        )}
      </div>
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        {categoryData.length > 0 ? (
          <>
            <div className="mx-auto h-[220px] w-[220px] rounded-full bg-background/35 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 12,
                      color: 'hsl(var(--popover-foreground))',
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
              {categoryData.slice(0, 7).map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/60 px-3 py-2.5"
                >
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{category.name}</span>
                  <span className="font-semibold">{formatUSD(category.value)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-10 text-center text-sm text-muted-foreground">
            Aun no hay categorias con gasto. Agrega movimientos para llenar este grafico.
          </div>
        )}
      </div>
    </section>
  );
}
