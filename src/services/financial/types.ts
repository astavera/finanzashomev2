import type { Database } from '@/integrations/supabase/types';
import type {
  BankBalanceWeek,
  CarPayoffWeek,
  ExchangeRate,
  MonthlyAllocation,
} from '@/lib/types';

export type WeeklyBudgetRow = Database['public']['Tables']['weekly_budgets']['Row'];
export type WeeklyBudgetUpdate = Database['public']['Tables']['weekly_budgets']['Update'];
export type MonthlyAllocationUpdate = Database['public']['Tables']['monthly_allocations']['Update'];
export type HouseholdSettingsRow = Database['public']['Tables']['household_settings']['Row'];
export type HouseholdSettingsUpdate = Database['public']['Tables']['household_settings']['Update'];
export type BankBalanceTrackerUpdate = Database['public']['Tables']['bank_balance_tracker']['Update'];
export type CarPayoffTrackerUpdate = Database['public']['Tables']['car_payoff_tracker']['Update'];

export type WeeklyBudgetSeed = {
  week_number: number;
  income: number;
  extra_income: number;
};

export type BankBalanceRowWithWeek = Database['public']['Tables']['bank_balance_tracker']['Row'] & {
  weekly_budgets: { week_number: number; income: number } | null;
};

export type CarPayoffRowWithWeek = Database['public']['Tables']['car_payoff_tracker']['Row'] & {
  weekly_budgets: { week_number: number } | null;
};

export type CarPayoffNotes = {
  saved?: boolean;
  monthlyPaymentPaid?: boolean;
  accumulatedSavings?: number;
  appliedPaymentsToDate?: number;
  debtBaselineAmount?: number;
  lastMonthlyReset?: string;
};

export type FinancialSettings = {
  weeklyIncome: number;
  extraIncomes: Record<number, number>;
  exchangeRate: ExchangeRate;
  monthlyAllocations: MonthlyAllocation[];
  bankBalances: BankBalanceWeek[];
  carPayoff: CarPayoffWeek[];
  accumulatedCarSavings: number;
  appliedCarPaymentsToDate: number;
};
