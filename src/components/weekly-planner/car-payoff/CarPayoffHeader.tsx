import { Car } from 'lucide-react';
import { PAYOFF_GOAL } from '../car-payoff-utils';

export function CarPayoffHeader() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Car className="w-5 h-5 text-accent" />
      <h3 className="font-display font-semibold text-lg">Car Payoff Tracker</h3>
      <span className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Goal: {PAYOFF_GOAL}</span>
    </div>
  );
}
