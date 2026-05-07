import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickWalletLink() {
  return (
    <div className="dashboard-surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Acceso rapido</p>
        <h3 className="mt-1 font-display text-xl font-semibold">Registrar compra de tarjeta</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Entra directo al flujo wallet para guardar una compra sin pasar por el planner.
        </p>
      </div>
      <Link
        to="/wallet"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
      >
        Abrir wallet
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
