import { useMemo, useState } from 'react';
import { Plus, Repeat2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS, type FixedWeeklyExpense } from '@/lib/types';

type FixedExpensesManagerProps = {
  fixedExpenses: FixedWeeklyExpense[];
  onAdd: (expense: Omit<FixedWeeklyExpense, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<FixedWeeklyExpense>) => void;
  onDelete: (id: string) => void;
};

const weeks = [1, 2, 3, 4];

export function FixedExpensesManager({
  fixedExpenses,
  onAdd,
  onUpdate,
  onDelete,
}: FixedExpensesManagerProps) {
  const [draft, setDraft] = useState({
    week_number: 1,
    concept: '',
    amount: '',
    paid_by: 'Sebas',
    category: 'Other',
  });

  const totalFixed = useMemo(
    () => fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [fixedExpenses],
  );

  const addExpense = () => {
    if (!draft.concept.trim() || !draft.amount) return;

    onAdd({
      week_number: draft.week_number,
      concept: draft.concept.trim(),
      amount: Number(draft.amount),
      currency: 'USD',
      paid_by: draft.paid_by,
      category: draft.category,
    });
    setDraft({ week_number: 1, concept: '', amount: '', paid_by: 'Sebas', category: 'Other' });
  };

  return (
    <section className="glass-card p-5">
      <div className="flex flex-col gap-3 border-b border-border/40 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Repeat2 className="h-4 w-4 text-primary" />
          <div>
            <h2 className="font-display text-lg font-bold">Gastos fijos</h2>
            <p className="text-xs text-muted-foreground">Total mensual: {formatUSD(totalFixed)}</p>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-[88px_1fr_112px_112px_120px_auto]">
          <select
            value={draft.week_number}
            onChange={(event) => setDraft({ ...draft, week_number: Number(event.target.value) })}
            className="h-9 rounded-lg border border-border bg-secondary/30 px-2 text-xs"
          >
            {weeks.map((week) => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
          <Input
            value={draft.concept}
            onChange={(event) => setDraft({ ...draft, concept: event.target.value })}
            className="h-9 bg-secondary/30 text-xs"
            placeholder="Concept"
          />
          <Input
            type="number"
            value={draft.amount}
            onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
            className="h-9 bg-secondary/30 text-xs"
            placeholder="Amount"
          />
          <select
            value={draft.paid_by}
            onChange={(event) => setDraft({ ...draft, paid_by: event.target.value })}
            className="h-9 rounded-lg border border-border bg-secondary/30 px-2 text-xs"
          >
            {PAID_BY_OPTIONS.map((person) => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
          <select
            value={draft.category}
            onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            className="h-9 rounded-lg border border-border bg-secondary/30 px-2 text-xs"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button type="button" size="sm" className="h-9 gap-1" onClick={addExpense}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {weeks.map((week) => {
          const weekExpenses = fixedExpenses.filter((expense) => expense.week_number === week);

          return (
            <div key={week} className="rounded-lg border border-border/50 bg-secondary/15 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Week {week}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatUSD(weekExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
                </span>
              </div>
              <div className="space-y-2">
                {weekExpenses.map((expense) => (
                  <div key={expense.id} className="grid grid-cols-[1fr_86px_28px] gap-2">
                    <Input
                      value={expense.concept}
                      onChange={(event) => onUpdate(expense.id, { concept: event.target.value })}
                      className="h-8 bg-background/60 text-xs"
                    />
                    <Input
                      type="number"
                      value={expense.amount}
                      onChange={(event) => onUpdate(expense.id, { amount: Number(event.target.value) })}
                      className="h-8 bg-background/60 text-xs"
                    />
                    <button
                      type="button"
                      className="flex h-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(expense.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {weekExpenses.length === 0 && (
                  <p className="py-2 text-xs text-muted-foreground">No fixed expenses</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
