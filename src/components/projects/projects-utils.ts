import type { Project } from '@/lib/types';

export type ProjectViewMode = 'both' | 'COP' | 'USD';

export function splitProjectsByCurrency(projects: Project[]) {
  return {
    usdProjects: projects.filter((project) => project.currency === 'USD'),
    copProjects: projects.filter((project) => project.currency === 'COP'),
  };
}

export function getProjectTotals(projects: Project[]) {
  return projects.reduce(
    (totals, project) => ({
      target: totals.target + project.target_amount,
      saved: totals.saved + project.current_amount,
    }),
    { target: 0, saved: 0 },
  );
}

export function getProgressPercent(saved: number, target: number) {
  return target > 0 ? (saved / target) * 100 : 0;
}
