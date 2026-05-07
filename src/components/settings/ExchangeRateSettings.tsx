import { useEffect, useState } from 'react';
import { Calendar, Check, Globe, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ExchangeRate } from '@/lib/types';

export function ExchangeRateSettings({
  exchangeRate,
  onUpdateExchangeRate,
}: {
  exchangeRate: ExchangeRate;
  onUpdateExchangeRate: (rate: { rate_cop_per_usd: number; notes?: string; source: 'live' | 'manual' }) => Promise<unknown>;
}) {
  const [editingRate, setEditingRate] = useState(false);
  const [rateValue, setRateValue] = useState(exchangeRate.rate_cop_per_usd);
  const [rateNotes, setRateNotes] = useState(exchangeRate.notes || '');

  useEffect(() => {
    setRateValue(exchangeRate.rate_cop_per_usd);
    setRateNotes(exchangeRate.notes || '');
  }, [exchangeRate.last_updated, exchangeRate.notes, exchangeRate.rate_cop_per_usd]);

  const saveRate = () => {
    if (rateValue <= 0) return;
    onUpdateExchangeRate({ rate_cop_per_usd: rateValue, notes: rateNotes, source: 'manual' })
      .then(() => {
        setEditingRate(false);
        toast.success('Exchange rate updated');
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Unable to update exchange rate');
      });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" style={{ color: 'hsl(var(--accent))' }} />
          <h3 className="font-display font-semibold">Default Exchange Rate</h3>
        </div>
        {!editingRate && (
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setEditingRate(true)}>
            <Pencil className="w-3 h-3" /> Edit
          </Button>
        )}
      </div>
      {editingRate ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground w-20">1 USD =</Label>
            <Input type="number" value={rateValue} onChange={(event) => setRateValue(+event.target.value)} className="w-36 bg-secondary/30" min={0} />
            <span className="text-sm text-muted-foreground">COP</span>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground w-20">Notes</Label>
            <Input value={rateNotes} onChange={(event) => setRateNotes(event.target.value)} className="flex-1 bg-secondary/30" placeholder="e.g. Remitly standard rate" maxLength={100} />
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="gap-1.5" onClick={saveRate}>
              <Check className="w-3 h-3" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingRate(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">1 USD =</span>
            <span className="font-display font-bold text-lg">{exchangeRate.rate_cop_per_usd.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">COP</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary" style={{ color: 'hsl(var(--info))' }}>
              {exchangeRate.source === 'live' ? 'Live' : 'Manual'}
            </span>
          </div>
          {exchangeRate.notes && <p className="text-xs text-muted-foreground pl-1">{exchangeRate.notes}</p>}
          <p className="text-xs text-muted-foreground pl-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            Last updated: {exchangeRate.last_updated}
          </p>
        </div>
      )}
    </div>
  );
}
