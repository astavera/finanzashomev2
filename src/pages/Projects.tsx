import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import {
  ColombiaGoalsSummary,
  ProjectForm,
  ProjectGroupSection,
  ProjectsHeader,
  getProjectTotals,
  splitProjectsByCurrency,
  type ProjectViewMode,
} from '@/components/projects';
import { useFinancialConfig } from '@/hooks/use-financial-config';
import { useProjectYearlyCollectionsQuery, useProjectsQuery } from '@/hooks/use-financial-data';
import { formatCOP, formatUSD } from '@/lib/currency';
import type { Project } from '@/lib/types';
import { createProject, deleteProject, updateProject } from '@/services/projects';

const DEFAULT_EXCHANGE_RATE = 4000;

export default function Projects() {
  const queryClient = useQueryClient();
  const financialConfig = useFinancialConfig();
  const [viewMode, setViewMode] = useState<ProjectViewMode>('both');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: projects = [], isLoading, error } = useProjectsQuery();
  const currentYear = new Date().getFullYear();
  const { data: yearlyCollections = {} } = useProjectYearlyCollectionsQuery(currentYear);
  const { usdProjects, copProjects } = useMemo(() => splitProjectsByCurrency(projects), [projects]);
  const copTotals = useMemo(() => getProjectTotals(copProjects), [copProjects]);
  const yearlyTotals = useMemo(
    () =>
      projects.reduce(
        (totals, project) => {
          const collected = yearlyCollections[project.id]?.yearlyCollected ?? 0;
          if (project.currency === 'COP') {
            return { ...totals, cop: totals.cop + collected };
          }
          return { ...totals, usd: totals.usd + collected };
        },
        { usd: 0, cop: 0 },
      ),
    [projects, yearlyCollections],
  );
  const exchangeRate = financialConfig.data?.exchangeRate.rate_cop_per_usd ?? DEFAULT_EXCHANGE_RATE;

  const invalidateProjectQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['project-yearly-collections'] }),
    ]);
  };

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast.success('Goal created');
      setEditingProject(null);
      setShowForm(false);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Unable to create goal');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => updateProject(id, updates),
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast.success('Goal updated');
      setEditingProject(null);
      setShowForm(false);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Unable to update goal');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast.success('Goal deleted');
      setDeleteId(null);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Unable to delete goal');
    },
  });

  const handleSave = (data: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, updates: data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAddGoal = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <ProjectsHeader viewMode={viewMode} onViewModeChange={setViewMode} onAddGoal={handleAddGoal} />

      {isLoading && <div className="glass-card p-12 text-center text-muted-foreground">Loading goals...</div>}

      {error && (
        <div className="glass-card p-12 text-center text-destructive">
          {error instanceof Error ? error.message : 'Unable to load goals'}
        </div>
      )}

      {!isLoading && !error && viewMode !== 'USD' && copProjects.length > 0 && (
        <ColombiaGoalsSummary
          totalTarget={copTotals.target}
          totalSaved={copTotals.saved}
          exchangeRate={exchangeRate}
        />
      )}

      {!isLoading && !error && (
        <div className="glass-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground">{currentYear} goal counter</p>
              <h3 className="font-display text-lg font-semibold">Collected from fixed weekly payments</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:min-w-72">
              <div className="rounded-lg bg-secondary/30 p-3 text-right">
                <p className="text-[10px] uppercase text-muted-foreground">USD</p>
                <p className="font-display font-semibold text-positive">{formatUSD(yearlyTotals.usd)}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3 text-right">
                <p className="text-[10px] uppercase text-muted-foreground">COP</p>
                <p className="font-display font-semibold text-positive">{formatCOP(yearlyTotals.cop)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && viewMode !== 'COP' && (
        <ProjectGroupSection
          title="USD Goals"
          emptyText="No USD goals yet. Add one above!"
          projects={usdProjects}
          exchangeRate={exchangeRate}
          yearlyCollections={yearlyCollections}
          year={currentYear}
          icon={DollarSign}
          iconClassName="text-success"
          gridClassName="grid grid-cols-1 md:grid-cols-3 gap-4"
          onEdit={handleEdit}
          onDelete={setDeleteId}
        />
      )}

      {!isLoading && !error && viewMode !== 'USD' && (
        <ProjectGroupSection
          title="Colombia Goals (COP)"
          emptyText="No Colombia goals yet. Add one above!"
          projects={copProjects}
          exchangeRate={exchangeRate}
          yearlyCollections={yearlyCollections}
          year={currentYear}
          icon={Globe}
          iconClassName="text-accent"
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onEdit={handleEdit}
          onDelete={setDeleteId}
        />
      )}

      <ProjectForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingProject(null);
        }}
        onSave={handleSave}
        initialData={editingProject}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Goal"
        description="This will permanently remove this savings goal."
        onConfirm={() => {
          if (deleteId) deleteProjectMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
