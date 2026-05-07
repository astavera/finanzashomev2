import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CustomPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: (amount: number) => void;
  saving: boolean;
};

export function CustomPaymentDialog({ open, onOpenChange, onPayment, saving }: CustomPaymentDialogProps) {
  const [customPayment, setCustomPayment] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Custom Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <Input
              type="number"
              value={customPayment}
              onChange={(event) => setCustomPayment(event.target.value)}
              className="bg-secondary/30 mt-1"
              placeholder="0.00"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={saving}
              onClick={() => {
                const amount = Number(customPayment);
                if (amount > 0) {
                  onPayment(amount);
                  setCustomPayment('');
                }
              }}
            >
              {saving ? 'Saving...' : 'Record Payment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
