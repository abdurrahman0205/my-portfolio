"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import AboutCanvas from "@/components/about/AboutCanvas";
import AboutCanvas02 from "./AboutCanvas02";

// ADJUST: where the reveal starts/ends as a fraction of viewport height.
// 0.85 = words start brightening when the block reaches 85% viewport height;
// 0.35 = fully revealed once its top reaches 35%.
const REVEAL_START = 0.85;
const REVEAL_END = 0.35;
// Words ahead of the reveal front sit at this opacity (design: ~0.25).
const DIM_OPACITY = 0.22;

/**
 * Splits text into per-word <span>s so the scroll reveal can address each
 * word individually. Spaces are preserved inside each word span.
 */
function Words({ text }: { text: string }): ReactNode {
  return text.split(" ").map((word, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered word list
    <span key={`${word}-${i}`} data-word>
      {word}{" "}
    </span>
  ));
}

/**
 * AboutSection — "WHO am I?" section: heading, intro line, a generative
 * scribble canvas on the left, and scroll-revealed paragraphs on the right.
 * Word-by-word brightening is driven by scroll position (rAF-throttled),
 * no animation libraries. Colors use the site's existing tokens (lime).
 */
export default function AboutSection() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = revealRef.current;
    if (!block) return;
    const words = Array.from(
      block.querySelectorAll<HTMLSpanElement>("[data-word]"),
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (motionQuery.matches) {
        for (const word of words) word.style.opacity = "1";
        return;
      }
      const rect = block.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 = reveal not started, 1 = fully revealed
      const progress =
        (vh * REVEAL_START - rect.top) / (vh * (REVEAL_START - REVEAL_END));
      const clamped = Math.max(0, Math.min(1, progress));
      // Each word crosses the front slightly after the previous one.
      const front = clamped * (words.length + 12);
      for (let i = 0; i < words.length; i++) {
        const t = Math.max(0, Math.min(1, front - i));
        words[i].style.opacity = (DIM_OPACITY + (1 - DIM_OPACITY) * t).toFixed(
          3,
        );
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motionQuery.addEventListener("change", apply);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionQuery.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section id="about" className="relative w-full overflow-hidden py-20">
      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Heading — same treatment as Contact/Skills.
            ADJUST: change the words, sizes live in the classes. */}
        <h2 className="font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          WHO{" "}
          <span className="font-serif font-normal italic text-lime">am</span> I?
        </h2>

        {/* Gradient divider — same as Contact/Skills */}
        <div
          className="mt-5 h-[3px] w-40 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--lime), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Intro line */}
        <p className="mt-10 max-w-4xl text-lg text-foreground sm:text-xl">
          I am a software engineer driven by a passion for building clean,
          intuitive, and reliable digital experiences.
        </p>

        {/* Two columns: generative canvas + revealed copy (stacked below lg) */}
        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: scribble animation card */}
          {/* <AboutCanvas /> */}
          <div className="grid-cols-2">
            <AboutCanvas02 />
          </div>
          

          {/* Right: eyebrow + scroll-revealed paragraphs */}
          <div className="grid-cols-10">
            <p className="font-mono text-sm tracking-[0.35em] text-muted-foreground uppercase">
              ( About Me )
            </p>

            <div ref={revealRef} className="mt-8 flex flex-col gap-8">
              <p className="text-base leading-relaxed text-foreground sm:text-lg">
                <Words text="I build web applications that bridge thoughtful frontend interfaces with robust backend systems. To me, software is more than code on a screen; it is about making technology feel effortless and genuinely useful to real people." />
              </p>
              <p className="text-base leading-relaxed text-foreground sm:text-lg">
                <Words text="My journey began with a simple curiosity for how things work under the hood. Over time, that curiosity evolved into a genuine passion for fluid interface animations, reliable backend architecture, and building user journeys that feel effortless and alive." />
              </p>
              <p className="text-base leading-relaxed text-foreground sm:text-lg">
                <Words text="Whether I am polishing micro-interactions or engineering full-stack systems, my core focus remains unchanged: creating software that brings people joy, solves real problems, and leaves a lasting positive impact." />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
