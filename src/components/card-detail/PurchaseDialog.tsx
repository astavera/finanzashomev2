import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS } from '@/lib/types';

export type PurchaseFormPayload = {
  merchant: string;
  amount: number;
  category: string;
  week: number;
  paid_by: string;
  notes: string;
};

type PurchaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PurchaseFormPayload) => void;
  cardName: string;
  saving?: boolean;
};

export function PurchaseDialog({ open, onOpenChange, onSave, cardName, saving = false }: PurchaseDialogProps) {
  const [form, setForm] = useState({ merchant: '', amount: '', category: 'Other', week: '1', paid_by: 'Sebas', notes: '' });

  const handleSave = () => {
    if (!form.merchant || !form.amount) return;

    onSave({
      merchant: form.merchant,
      amount: Number(form.amount),
      category: form.category,
      week: Number(form.week),
      paid_by: form.paid_by,
      notes: form.notes,
    });
    setForm({ merchant: '', amount: '', category: 'Other', week: '1', paid_by: 'Sebas', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add Purchase - {cardName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Merchant</Label>
              <Input value={form.merchant} onChange={(event) => setForm({ ...form, merchant: event.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <Input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Week</Label>
              <select value={form.week} onChange={(event) => setForm({ ...form, week: event.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="3">Week 3</option>
                <option value="4">Week 4</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Who Paid</Label>
              <select value={form.paid_by} onChange={(event) => setForm({ ...form, paid_by: event.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {PAID_BY_OPTIONS.map((person) => <option key={person} value={person}>{person}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Input value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="bg-secondary/30 mt-1" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving...' : 'Record Purchase'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
