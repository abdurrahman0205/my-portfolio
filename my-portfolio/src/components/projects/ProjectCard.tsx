import { ExternalLink } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * ProjectCard — one featured project: preview image on top, then a card
 * with the title, an org badge, a description, tech-stack chips, and a
 * "Live Demo" button that opens the project in a new tab.
 * Colors reuse the site tokens (card/border/foreground + lime accent).
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col">
      {/* Preview image — ADJUST: aspect/rounding live on these classes */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      {/* Card body */}
      <div className="relative mt-4 flex flex-1 flex-col rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Title + org badge */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            {project.title}
          </h3>
          <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-mono text-xs font-medium text-lime">
            {project.org}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {project.description}
        </p>

        {/* Tech stack chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Live demo button — opens in a new tab */}
        <div className="mt-8">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-sans text-sm font-bold tracking-wide text-lime-foreground uppercase transition hover:brightness-95"
          >
            Live Demo
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
