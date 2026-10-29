import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

/**
 * ProjectsSection — "FEATURED projects" section: heading in the same style
 * as the other sections (bold sans + italic serif accent word + gradient
 * divider), then a responsive grid of project cards. No categories, no
 * timeline — just projects.
 */
export default function ProjectsSection() {
  return (
    <section id="projects" className="relative w-full overflow-hidden py-20">
      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Heading — same treatment as About/Skills/Contact.
            ADJUST: change the words, sizes live in the classes. */}
        <h2 className="font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          FEATURED{" "}
          <span className="font-serif font-normal italic text-lime">
            projects
          </span>
        </h2>

        {/* Gradient divider — same as the other sections */}
        <div
          className="mt-5 h-[3px] w-40 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--lime), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Cards: one column on mobile, two on lg+ */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
