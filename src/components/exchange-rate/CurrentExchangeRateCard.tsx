import { ArrowRightLeft, Wifi, WifiOff } from 'lucide-react';
import type { ExchangeRate } from '@/lib/types';
import { cn } from '@/lib/utils';

type CurrentExchangeRateCardProps = {
  exchangeRate: ExchangeRate;
};

export function CurrentExchangeRateCard({ exchangeRate }: CurrentExchangeRateCardProps) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Current Remitly Rate</p>
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-lg font-medium">1 USD</span>
        <ArrowRightLeft className="w-5 h-5 text-primary" />
        <span className="text-4xl font-display font-bold gradient-text">
          {exchangeRate.rate_cop_per_usd.toLocaleString()} COP
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span>Last updated: {exchangeRate.last_updated}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]',
            exchangeRate.source === 'live' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning',
          )}
        >
          {exchangeRate.source === 'live' ? (
            <>
              <Wifi className="w-3 h-3" /> Live
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" /> Manual
            </>
          )}
        </span>
      </div>
      {exchangeRate.notes && <p className="text-xs text-muted-foreground mt-2">{exchangeRate.notes}</p>}
    </div>
  );
}
