import { describe, expect, it } from 'vitest';
import { getCreditCardTotals, getOrdinal, getUtilization } from '@/components/credit-cards';
import { getProgressPercent, getProjectTotals, splitProjectsByCurrency } from '@/components/projects';
import { buildCarPayoffMetrics } from '@/components/weekly-planner/car-payoff-utils';
import { getCurrentMonthRange, getPreviousMonthRange, moveDateToMonth } from '@/lib/date-ranges';
import type { CarPayoffWeek, CreditCard, Project } from '@/lib/types';

const baseCard: CreditCard = {
  id: 'card-1',
  card_name: 'Test Card',
  issuer: 'Test Bank',
  network: 'Visa',
  last4: '1234',
  credit_limit: 1000,
  current_balance: 250,
  closing_date: 12,
  due_date: 20,
  color_from: '#111111',
  color_to: '#222222',
};

describe('credit card utilities', () => {
  it('calculates utilization and portfolio totals', () => {
    expect(getUtilization(baseCard)).toBe(25);
    expect(getUtilization({ ...baseCard, credit_limit: 0 })).toBe(0);

    expect(getCreditCardTotals([baseCard, { ...baseCard, id: 'card-2', current_balance: 100, credit_limit: 500 }])).toEqual({
      totalBalance: 350,
      totalLimit: 1500,
      totalAvailable: 1150,
      overallUtilization: 23.333333333333332,
    });
  });

  it('formats ordinal day labels', () => {
    expect(getOrdinal(1)).toBe('1st');
    expect(getOrdinal(2)).toBe('2nd');
    expect(getOrdinal(3)).toBe('3rd');
    expect(getOrdinal(11)).toBe('11th');
    expect(getOrdinal(22)).toBe('22nd');
  });
});

describe('project utilities', () => {
  const projects: Project[] = [
    { id: 'usd-1', project_name: 'USD Goal', target_amount: 1000, current_amount: 250, currency: 'USD' },
    { id: 'cop-1', project_name: 'COP Goal', target_amount: 2000, current_amount: 500, currency: 'COP' },
  ];

  it('splits projects by currency and calculates totals', () => {
    const split = splitProjectsByCurrency(projects);

    expect(split.usdProjects).toHaveLength(1);
    expect(split.copProjects).toHaveLength(1);
    expect(getProjectTotals(projects)).toEqual({ target: 3000, saved: 750 });
  });

  it('handles progress percentages without division by zero', () => {
    expect(getProgressPercent(25, 100)).toBe(25);
    expect(getProgressPercent(25, 0)).toBe(0);
  });
});

describe('car payoff utilities', () => {
  it('applies previous month payments and only checked current weeks to debt totals', () => {
    const weeks: CarPayoffWeek[] = [
      { week: 1, target: 288, collected: 288, saved: true, monthlyPaymentPaid: false },
      { week: 2, target: 288, collected: 288, saved: false, monthlyPaymentPaid: false },
    ];

    const metrics = buildCarPayoffMetrics(weeks, 100, 500);

    expect(metrics.appliedPaymentsToDate).toBe(500);
    expect(metrics.paidWeeklyExtra).toBe(288);
    expect(metrics.pendingWeeklyExtra).toBe(288);
    expect(metrics.totalAppliedPayments).toBe(788);
  });
});

describe('weekly planner utilities', () => {
  it('builds the current month date range used to hide prior-month expenses', () => {
    expect(getCurrentMonthRange(new Date(2026, 4, 6))).toEqual({
      start: '2026-05-01',
      next: '2026-06-01',
    });
  });

  it('moves recurring expense dates into the current month', () => {
    expect(getPreviousMonthRange(new Date(2026, 4, 6))).toEqual({
      start: '2026-04-01',
      next: '2026-05-01',
    });
    expect(moveDateToMonth('2026-04-30', new Date(2026, 4, 6))).toBe('2026-05-30');
  });
});
