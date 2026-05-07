type AuthVisualPanelProps = {
  authPhoto: string;
};

export function AuthVisualPanel({ authPhoto }: AuthVisualPanelProps) {
  return (
    <div className="relative min-h-[240px] overflow-hidden lg:min-h-[640px]">
      <img
        src={authPhoto}
        alt="Foto de pareja en exterior"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-slate-950/50 to-amber-700/40" />
      <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Finanzas Hogar
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tu hogar, tus cuentas, todo en orden.
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
            Revisa presupuesto, tarjetas, metas y movimientos desde cualquier dispositivo.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-white/85">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="uppercase tracking-[0.16em] text-white/60">Dashboard</p>
              <p className="mt-1 font-semibold">Resumen rapido</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="uppercase tracking-[0.16em] text-white/60">Tarjetas</p>
              <p className="mt-1 font-semibold">Control total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
