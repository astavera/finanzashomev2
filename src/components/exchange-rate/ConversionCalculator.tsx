import { Input } from '@/components/ui/input';
import { formatCOP, formatUSD, copToUsd, usdToCop } from '@/lib/currency';

type ConversionCalculatorProps = {
  usdInput: string;
  copInput: string;
  rate: number;
  onUsdChange: (value: string) => void;
  onCopChange: (value: string) => void;
};

export function ConversionCalculator({ usdInput, copInput, rate, onUsdChange, onCopChange }: ConversionCalculatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4 text-sm">USD to COP</h3>
        <Input
          type="number"
          value={usdInput}
          onChange={(event) => onUsdChange(event.target.value)}
          className="bg-secondary/30 mb-3"
          placeholder="USD amount"
        />
        <div className="bg-secondary/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Result</p>
          <p className="text-2xl font-display font-bold">{formatCOP(usdToCop(Number(usdInput) || 0, rate))}</p>
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4 text-sm">COP to USD</h3>
        <Input
          type="number"
          value={copInput}
          onChange={(event) => onCopChange(event.target.value)}
          className="bg-secondary/30 mb-3"
          placeholder="COP amount"
        />
        <div className="bg-secondary/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Result</p>
          <p className="text-2xl font-display font-bold">{formatUSD(copToUsd(Number(copInput) || 0, rate))}</p>
        </div>
      </div>
    </div>
  );
}
