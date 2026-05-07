import { CheckCircle2, TrendingDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { formatUSD } from '@/lib/currency';
import type { CarPayoffWeek } from '@/lib/types';
import { cn } from '@/lib/utils';
import { WEEKLY_EXTRA_TARGET } from '../car-payoff-utils';

type WeeklyExtraSavingsGridProps = {
  carPayoff: CarPayoffWeek[];
  onUpdate: (week: number, updates: Partial<CarPayoffWeek>) => void;
};

export function WeeklyExtraSavingsGrid({ carPayoff, onUpdate }: WeeklyExtraSavingsGridProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="w-4 h-4 text-positive" />
        <span className="text-sm font-medium">Abonos Semanales Extra - Fondo Pay-off</span>
        <span className="text-xs text-muted-foreground ml-auto">{formatUSD(WEEKLY_EXTRA_TARGET)}/semana</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {carPayoff.map((week) => (
          <div
            key={week.week}
            className={cn(
              'rounded-xl p-4 transition-all border-2',
              week.saved ? 'bg-positive/10 border-positive/30' : 'bg-secondary/20 border-transparent',
            )}
          >
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <Checkbox
                checked={week.saved ?? false}
                onCheckedChange={(checked) => onUpdate(week.week, { saved: !!checked })}
              />
              <span className="text-sm font-medium">Semana {week.week}</span>
              {week.saved && <CheckCircle2 className="w-3 h-3 text-positive" />}
            </label>
            <Input
              type="number"
              value={week.collected}
              placeholder="0"
              className="h-8 text-xs bg-secondary/30 border-border/30"
              onChange={(event) => onUpdate(week.week, { collected: Number(event.target.value) })}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              {week.saved
                ? `Abonado: ${formatUSD(week.collected)}`
                : week.collected >= WEEKLY_EXTRA_TARGET
                  ? 'Listo para abonar'
                  : `Pendiente ${formatUSD(Math.max(WEEKLY_EXTRA_TARGET - week.collected, 0))}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
