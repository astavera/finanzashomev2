import type { LucideIcon } from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import type { Project } from '@/lib/types';
import type { ProjectYearlyCollection } from '@/services/projects';

type ProjectGroupSectionProps = {
  title: string;
  emptyText: string;
  projects: Project[];
  exchangeRate: number;
  yearlyCollections: Record<string, ProjectYearlyCollection>;
  year: number;
  icon: LucideIcon;
  iconClassName: string;
  gridClassName: string;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
};

export function ProjectGroupSection({
  title,
  emptyText,
  projects,
  exchangeRate,
  yearlyCollections,
  year,
  icon: Icon,
  iconClassName,
  gridClassName,
  onEdit,
  onDelete,
}: ProjectGroupSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconClassName}`} />
        <h2 className="font-display font-semibold text-xl">{title}</h2>
        <span className="text-xs text-muted-foreground">({projects.length})</span>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">{emptyText}</div>
      ) : (
        <div className={gridClassName}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              exchangeRate={exchangeRate}
              yearlyCollection={yearlyCollections[project.id]}
              year={year}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
