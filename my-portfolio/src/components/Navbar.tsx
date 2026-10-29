import { Button } from "@/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

// Dummy nav links — first entry is styled as the active page (lime).
const navLinks = [
  { label: "Intro", href: "#intro", active: true },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Project", href: "#work" },
  // { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

/**
 * Navbar — top navigation bar.
 *
 * Layout: brand on the left, centered nav links, and actions on the right
 * (theme toggle + Resume button).
 */
export function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        {/* Brand / logo */}
        <a
          href="#intro"
          className="font-mono text-sm font-bold tracking-[0.3em] uppercase"
        >
          Abdur Rahman<span className="text-lime">.</span>
        </a>

        {/* Centered nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`font-mono text-xs tracking-[0.25em] uppercase transition-colors ${link.active
                    ? "text-lime"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right-side actions: dark/light toggle + Resume button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" className="h-10 px-6">
            Resume
          </Button>
        </div>
      </nav>
    </header>
  );
}
