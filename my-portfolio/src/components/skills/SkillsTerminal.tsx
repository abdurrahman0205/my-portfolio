import { skillCategories } from "@/data/skills";

/**
 * SkillsTerminal — a static "terminal card" listing every skill category as
 * monospace chips. Purely presentational; the only interaction is a subtle
 * hover on the chips (handled by the .skills-chip class from the section).
 */
export default function SkillsTerminal() {
  return (
    <div className="skills-card w-full p-6 sm:p-8">
      {/* Terminal header line */}
      <p className="font-mono text-xs sm:text-sm">
        <span className="text-muted-foreground">skill_tree.json</span>
        <span className="text-muted-foreground"> — </span>
        <span className="text-emerald-500">$</span>{" "}
        <span className="skills-accent-text">cat languages.json</span>
      </p>

      {/* Categories + skill chips */}
      <div className="mt-6 flex flex-col gap-5">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <p className="font-mono text-[11px] text-muted-foreground">
              &quot;{category.name}&quot;
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="skills-chip rounded-md px-2.5 py-1 font-mono text-xs sm:text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
