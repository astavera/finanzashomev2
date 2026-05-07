import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appNavItems } from '@/lib/navigation';

const dashboardMenuUrls = ['/planner', '/wallet', '/cards', '/transactions', '/projects', '/exchange'];

export function DashboardHomeMenu() {
  const items = appNavItems.filter((item) => dashboardMenuUrls.includes(item.url));

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.url}
          to={item.url}
          className="group flex min-h-[86px] items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-4 backdrop-blur-xl transition-all hover:border-primary/25 hover:bg-card"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/70 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{getMenuHint(item.url)}</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </Link>
      ))}
    </section>
  );
}

function getMenuHint(url: string) {
  if (url === '/planner') return 'Plan semanal';
  if (url === '/wallet') return 'Registrar compra rapido';
  if (url === '/cards') return 'Balances y limites';
  if (url === '/transactions') return 'Historial completo';
  if (url === '/projects') return 'Metas y ahorros';
  if (url === '/exchange') return 'COP/USD';
  return 'Abrir seccion';
}
