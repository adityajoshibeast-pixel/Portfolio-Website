type Project = {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoLink?: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-surface-2 bg-surface transition-all hover:border-accent/40 hover:-translate-y-1">
      <div className="aspect-video w-full overflow-hidden bg-surface-2">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted">
            preview_coming_soon.png
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-text">{project.title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs text-accent-2">
              {tag}
            </span>
          ))}
        </div>

        {project.demoLink && (
          <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-medium text-accent hover:underline">
            View Demo →
          </a>
        )}
      </div>
    </div>
  );
}