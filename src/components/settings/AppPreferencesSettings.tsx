import { Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function AppPreferencesSettings({
  theme,
  onToggleTheme,
}: {
  theme: string;
  onToggleTheme: () => void;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-display font-semibold">App Preferences</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-primary" />
            ) : (
              <Sun className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />
            )}
            <span className="text-sm">Theme</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <Switch checked={theme === 'dark'} onCheckedChange={onToggleTheme} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Data Persistence</span>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'hsl(var(--info) / 0.15)', color: 'hsl(var(--info))' }}>
            Supabase
          </span>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
          <span className="text-sm">Number of Weeks per Month</span>
          <span className="font-semibold">4</span>
        </div>
      </div>
    </div>
  );
}
