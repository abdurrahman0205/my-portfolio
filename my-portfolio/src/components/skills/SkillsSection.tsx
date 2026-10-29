import SkillsSphere from "@/components/skills/SkillsSphere";
import SkillsTerminal from "@/components/skills/SkillsTerminal";

/**
 * Section-scoped styles: theme-aware accent tokens + the small helper
 * classes used by the sphere pill and the terminal card. Everything keys
 * off `#skills`, so nothing leaks into the rest of the site.
 *
 * The accent reuses the site's lime (--lime) so the section matches the
 * banner, navbar, and contact button. To go back to an orange terminal
 * look, swap the hexes below (e.g. accent #E8742A, chip text #F0803C).
 */
const skillsCss = `
#skills {
  /* LIGHT THEME — adjust these three to re-tint the whole section */
  --skills-accent: #6f8f16;          /* borders, wireframe, chips, glow */
  --skills-chip-text: #587311;       /* chip + pill label text */
  --skills-disc: #ebe8e4;            /* sphere disc fill */
  --skills-chip-bg: color-mix(in srgb, var(--skills-accent) 6%, var(--card));
}
.dark #skills {
  /* DARK THEME — adjust these three to re-tint the whole section */
  --skills-accent: #cff45c;          /* site lime — matches Banner/Contact */
  --skills-chip-text: #cff45c;
  --skills-disc: #1e1e1e;
}

/* Terminal card shell — tweak radius/opacity here */
#skills .skills-card {
  background-color: var(--card);
  border: 1px solid color-mix(in srgb, var(--skills-accent) 40%, transparent);
  border-radius: 20px;               /* ADJUST: card corner rounding */
}

/* Skill chips — tweak border strength, padding lives on the element */
#skills .skills-chip {
  background-color: var(--skills-chip-bg);
  border: 1px solid color-mix(in srgb, var(--skills-accent) 50%, transparent);
  color: var(--skills-chip-text);
  transition: border-color 150ms ease;
}
#skills .skills-chip:hover {
  border-color: var(--skills-accent);
}

/* "Drag to explore" pill under the sphere */
#skills .skills-pill {
  background-color: color-mix(in srgb, var(--card) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--skills-accent) 45%, transparent);
  color: var(--skills-chip-text);
  backdrop-filter: blur(4px);
}

/* Accent-colored text (e.g. the terminal command) */
#skills .skills-accent-text {
  color: var(--skills-chip-text);
}

/* Faint grid-line background — ADJUST: 9% = line opacity, 60px = spacing */
#skills .skills-grid {
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--skills-accent) 9%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--skills-accent) 9%, transparent) 1px, transparent 1px);
  background-size: 60px 60px;
}
`;

/**
 * SkillsSection — the "MY TECH stack" section: a draggable skills sphere on
 * the left and a terminal-style skill card on the right (stacked below lg).
 * The heading mirrors the Contact section ("LET'S talk") — bold sans word
 * + italic serif accent word + gradient underline.
 */
export default function SkillsSection() {
  return (
    <section id="skills" className="relative w-full overflow-hidden py-20">
      <style>{skillsCss}</style>

      {/* Faint accent grid-line background */}
      <div
        className="skills-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Heading — same treatment as "LET'S talk" in the Contact section.
            ADJUST: change the words, sizes live in the classes. */}
        <h2 className="font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          MY TECH{" "}
          <span className="font-serif font-normal italic text-lime">stack</span>
        </h2>

        {/* Gradient divider — same as Contact */}
        <div
          className="mt-5 h-[3px] w-40 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--lime), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Subtitle */}
        <p className="mt-10 max-w-2xl text-lg text-muted-foreground">
          The tools and technologies I build with. Drag the sphere or read the
          skill tree.
        </p>

        {/* Two columns on lg+, stacked (sphere first) below */}
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SkillsSphere />
          <SkillsTerminal />
        </div>
      </div>
    </section>
  );
}
