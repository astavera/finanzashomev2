import { cn } from '@/lib/utils';

type CardMetricGridProps = {
  metrics: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
};

export function CardMetricGrid({ metrics }: CardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(({ label, value, color }) => (
        <div key={label} className="glass-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className={cn('font-display font-bold text-lg', color)}>{value}</p>
        </div>
      ))}
    </div>
  );
}
