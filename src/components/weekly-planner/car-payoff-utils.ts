import type { CarPayoffWeek } from '@/lib/types';
import {
  CAR_PAYOFF_APR,
  CAR_PAYOFF_CURRENT_DEBT,
  CAR_PAYOFF_DEBT_AS_OF,
  CAR_PAYOFF_MONTHLY_PAYMENT,
} from '@/services/financial/constants';

export const MONTHLY_PAYMENT = CAR_PAYOFF_MONTHLY_PAYMENT;
export const APR = CAR_PAYOFF_APR;
export const DAILY_RATE = APR / 100 / 365;
export const MONTHLY_RATE = APR / 100 / 12;
export const CURRENT_DEBT = CAR_PAYOFF_CURRENT_DEBT;
export const DEBT_AS_OF = CAR_PAYOFF_DEBT_AS_OF;
export const WEEKLY_EXTRA_TARGET = 288;
export const PAYOFF_GOAL = 'December 2026';

export function monthsUntilPayoff(today = new Date()) {
  const target = new Date(2026, 11, 1);
  return Math.max(0, (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()));
}

export function debtToday(principal: number, startDate: Date, today = new Date()) {
  const days = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  return principal * Math.pow(1 + DAILY_RATE, days);
}

export function buildCarPayoffMetrics(
  carPayoff: CarPayoffWeek[],
  accumulatedSavings: number,
  appliedPaymentsToDate = 0,
) {
  const monthlyExtraSaved = carPayoff.reduce((sum, week) => sum + week.collected, 0);
  const paidWeeklyExtra = carPayoff
    .filter((week) => week.saved)
    .reduce((sum, week) => sum + week.collected, 0);
  const pendingWeeklyExtra = Math.max(0, monthlyExtraSaved - paidWeeklyExtra);
  const totalYearlySaved = accumulatedSavings + monthlyExtraSaved;
  const monthlyPaid = carPayoff.some((week) => week.monthlyPaymentPaid);
  const baseDebtToday = debtToday(CURRENT_DEBT, DEBT_AS_OF);
  const monthlyInterest = baseDebtToday * MONTHLY_RATE;
  const principalFromPayment = monthlyPaid ? Math.max(0, MONTHLY_PAYMENT - monthlyInterest) : 0;
  const totalAppliedPayments = appliedPaymentsToDate + principalFromPayment + paidWeeklyExtra;
  const currentDebtToday = Math.max(0, baseDebtToday - totalAppliedPayments);
  const availableToPay = accumulatedSavings + pendingWeeklyExtra;
  const projectedDebt = Math.max(0, currentDebtToday - pendingWeeklyExtra);
  const debtAfterLumpPayment = Math.max(0, currentDebtToday - availableToPay);
  const interestSavedMonthly = totalAppliedPayments * MONTHLY_RATE;

  return {
    monthlyExtraSaved,
    paidWeeklyExtra,
    pendingWeeklyExtra,
    totalYearlySaved,
    monthlyPaid,
    baseDebtToday,
    currentDebtToday,
    monthlyInterest,
    principalFromPayment,
    appliedPaymentsToDate,
    totalAppliedPayments,
    availableToPay,
    projectedDebt,
    debtAfterLumpPayment,
    interestSavedMonthly,
  };
}
