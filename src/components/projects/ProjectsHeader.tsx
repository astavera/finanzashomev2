import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProjectViewMode } from './projects-utils';

type ProjectsHeaderProps = {
  viewMode: ProjectViewMode;
  onViewModeChange: (mode: ProjectViewMode) => void;
  onAddGoal: () => void;
};

const viewModes: ProjectViewMode[] = ['both', 'USD', 'COP'];

export function ProjectsHeader({ viewMode, onViewModeChange, onAddGoal }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Projects & Goals</h1>
        <p className="text-muted-foreground text-sm">Track your savings goals across currencies</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {viewModes.map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {mode === 'both' ? 'Both' : mode}
            </button>
          ))}
        </div>
        <Button size="sm" className="gap-2" onClick={onAddGoal}>
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </div>
    </div>
  );
}
