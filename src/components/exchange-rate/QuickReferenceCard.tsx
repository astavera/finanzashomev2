import { formatCOP, formatUSD, copToUsd, usdToCop } from '@/lib/currency';

type QuickReferenceCardProps = {
  rate: number;
};

export function QuickReferenceCard({ rate }: QuickReferenceCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold mb-3 text-sm">Quick Reference</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {[50, 100, 200, 500].map((usd) => (
          <div key={usd} className="bg-secondary/30 rounded-xl p-3 text-center">
            <p className="text-muted-foreground">{formatUSD(usd)}</p>
            <p className="font-semibold">{formatCOP(usdToCop(usd, rate))}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
        {[100000, 500000, 1000000, 2000000].map((cop) => (
          <div key={cop} className="bg-secondary/30 rounded-xl p-3 text-center">
            <p className="text-muted-foreground">{formatCOP(cop)}</p>
            <p className="font-semibold">{formatUSD(copToUsd(cop, rate))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
