import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function AccountSettings() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold">Account</h3>
          <p className="text-xs text-muted-foreground mt-1">Sign out from your current session</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success('Logged out');
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
