import Image from "next/image";
import { Button } from "@/components/Button";

/**
 * Banner — the hero section shown at the top of the page.
 *
 * Layout: text column on the left (eyebrow, serif headline, subtext, and two
 * action buttons) with a framed portrait on the right.
 */
export function Banner() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 items-center gap-12 px-6 py-16 md:flex-row">
      {/* Left column: copy + actions */}
      <div className="flex flex-col gap-8">
        {/* Eyebrow label */}
        <p className="font-mono text-sm tracking-[0.25em] text-muted-foreground uppercase">
          Abdul Basit · Full-Stack Developer
        </p>

        {/* Main serif headline */}
        <h1 className="font-serif text-6xl leading-[1.05] text-foreground md:text-7xl">
          Building AI-native products with Next.js &amp; Node.
        </h1>

        {/* Supporting paragraph */}
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Full-stack developer crafting AI-native web products with clarity and
          precision.
        </p>

        {/* Action buttons (both reuse the shared Button component) */}
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">View Work</Button>
          <Button variant="outline">Get In Touch</Button>
        </div>
      </div>

      {/* Right column: framed portrait */}
      <div className="relative hidden shrink-0 md:block">
        <div className="rounded-3xl border border-lime/30 p-2">
          <Image
            src="/portrait.png"
            alt="Portrait of Abdul Basit"
            width={380}
            height={460}
            priority
            className="rounded-2xl object-cover grayscale"
          />
        </div>
      </div>
    </section>
  );
}
