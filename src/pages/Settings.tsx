import { useAppStore } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';
import { useFinancialConfig } from '@/hooks/use-financial-config';
import { assetPath } from '@/lib/asset-path';
import {
  AccountSettings,
  AppPreferencesSettings,
  CurrencySettings,
  ExchangeRateSettings,
  HouseholdMembersSettings,
  IncomeBudgetSettings,
  ResetSettings,
} from '@/components/settings';

const APP_VERSION = '4.0.0';

export default function SettingsPage() {
  const brandPhoto = assetPath('auth-photo.jpeg');
  const store = useAppStore();
  const financialConfig = useFinancialConfig();
  const { theme, toggle } = useTheme();

  const weeklyIncome = financialConfig.data?.weeklyIncome ?? 1536;
  const exchangeRate = financialConfig.data?.exchangeRate ?? {
    provider_name: 'Remitly',
    rate_cop_per_usd: 4000,
    last_updated: new Date().toISOString().slice(0, 10),
    source: 'manual' as const,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your household, preferences, and app configuration</p>
        <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/40 bg-slate-200">
            <img src={brandPhoto} alt="Finanzas Hogar" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-foreground">Finanzas Hogar</p>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Version {APP_VERSION}
            </p>
          </div>
        </div>
      </div>

      <HouseholdMembersSettings
        users={store.users}
        updateUser={store.updateUser}
        addUser={store.addUser}
        deleteUser={store.deleteUser}
      />

      <IncomeBudgetSettings
        weeklyIncome={weeklyIncome}
        onUpdateWeeklyIncome={financialConfig.updateWeeklyIncome}
      />

      <CurrencySettings />

      <ExchangeRateSettings
        exchangeRate={exchangeRate}
        onUpdateExchangeRate={financialConfig.updateExchangeRate}
      />

      <AppPreferencesSettings theme={theme} onToggleTheme={toggle} />

      <AccountSettings />

      <ResetSettings />
    </div>
  );
}
