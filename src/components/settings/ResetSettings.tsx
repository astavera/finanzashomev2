import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';

export function ResetSettings() {
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-destructive">Reset Sample Data</h3>
            <p className="text-xs text-muted-foreground mt-1">Restore all data to original seeded values</p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => setShowReset(true)}>
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      <DeleteConfirmation
        open={showReset}
        onOpenChange={setShowReset}
        title="Reset All Data"
        description="This will restore all data to the original sample values. All your changes will be lost."
        onConfirm={() => {
          toast.error('Reset sample data is no longer wired to local storage. Use Supabase seed/reset flow instead.');
          setShowReset(false);
        }}
      />
    </>
  );
}
