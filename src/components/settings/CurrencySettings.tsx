import { DollarSign } from 'lucide-react';

export function CurrencySettings() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Currency Settings</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Primary Household Currency</span>
          <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>USD</span>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Secondary Project Currency</span>
          <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>COP</span>
        </div>
      </div>
    </div>
  );
}
