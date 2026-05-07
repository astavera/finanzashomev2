import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS } from '@/lib/types';
import type { CreditCard } from '@/lib/types';
import type { WalletPurchaseForm } from './WalletPurchasePanel';

type WalletPurchaseFormPanelProps = {
  selectedCard: CreditCard;
  form: WalletPurchaseForm;
  onFormChange: (updates: Partial<WalletPurchaseForm>) => void;
  onSubmit: () => void;
  onClear: () => void;
  saving: boolean;
};

export function WalletPurchaseFormPanel({
  selectedCard,
  form,
  onFormChange,
  onSubmit,
  onClear,
  saving,
}: WalletPurchaseFormPanelProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-white dark:text-slate-950">
            <Sparkles className="h-3.5 w-3.5" />
            Quick Charge
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">Nueva compra</h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
            Captura la compra con un flujo rapido, limpio y separado del planner.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/80 bg-white/80 px-4 py-3 text-left shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 xl:min-w-[220px] xl:text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tarjeta activa</p>
          <p className="mt-1 font-medium text-slate-950 dark:text-white">{selectedCard.card_name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">**** {selectedCard.last4}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Comercio
          </Label>
          <Input
            value={form.merchant}
            onChange={(event) => onFormChange({ merchant: event.target.value })}
            className="mt-2 h-14 rounded-[22px] border border-slate-900/70 bg-slate-950 px-4 text-[15px] text-white shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
            placeholder="Ej. Apple, Costco, Shell"
          />
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/5">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Monto
          </Label>
          <Input
            type="number"
            value={form.amount}
            onChange={(event) => onFormChange({ amount: event.target.value })}
            className="mt-2 h-14 rounded-[20px] border border-slate-900/70 bg-slate-950 px-4 text-base text-white shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
            placeholder="0.00"
            min={0}
            step="0.01"
          />
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/5">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Fecha
          </Label>
          <Input
            type="date"
            value={form.date}
            onChange={(event) => onFormChange({ date: event.target.value })}
            className="mt-2 h-14 rounded-[20px] border border-slate-900/70 bg-slate-950 px-4 text-base text-white shadow-none focus-visible:ring-slate-400"
          />
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/5">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Categoria
          </Label>
          <select
            value={form.category}
            onChange={(event) => onFormChange({ category: event.target.value })}
            className="mt-2 h-14 w-full rounded-[20px] border border-slate-900/70 bg-slate-950 px-4 text-sm text-white shadow-none outline-none focus:ring-2 focus:ring-slate-400"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/5">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Quien pago
          </Label>
          <select
            value={form.paid_by}
            onChange={(event) => onFormChange({ paid_by: event.target.value })}
            className="mt-2 h-14 w-full rounded-[20px] border border-slate-900/70 bg-slate-950 px-4 text-sm text-white shadow-none outline-none focus:ring-2 focus:ring-slate-400"
          >
            {PAID_BY_OPTIONS.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/5">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Notas
          </Label>
          <Input
            value={form.notes}
            onChange={(event) => onFormChange({ notes: event.target.value })}
            className="mt-2 h-14 rounded-[20px] border border-slate-900/70 bg-slate-950 px-4 text-base text-white shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          className="h-12 rounded-2xl !bg-slate-950 px-5 !text-white hover:!bg-slate-900 dark:!bg-slate-100 dark:!text-slate-950 dark:hover:!bg-white"
          disabled={saving}
          onClick={onSubmit}
        >
          <Plus className="mr-2 h-4 w-4" />
          {saving ? 'Guardando...' : 'Registrar compra'}
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          onClick={onClear}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
}
