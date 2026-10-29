"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const MIN_MESSAGE_LENGTH = 30;

/**
 * ContactSection — "LET'S talk" contact form section.
 *
 * Assembled as a single client component (heading, divider, subtitle, and
 * the form card) because the message counter needs local state. Colors use
 * the site's existing tokens (lime accent, card/border/foreground).
 */
export default function ContactSection() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // No backend wired up yet — keep the page from navigating away.
    event.preventDefault();
  };

  return (
    <section id="contact" className="relative w-full overflow-hidden py-20">
      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Heading: bold sans + italic serif accent word */}
        <h2 className="font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          LET'S{" "}
          <span className="font-serif font-normal italic text-lime">talk</span>
        </h2>

        {/* Gradient divider underline */}
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
          Have a project in mind or just want to say hello? Feel free to reach
          out.
        </p>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 w-full max-w-3xl rounded-3xl border border-border bg-card p-8 sm:p-12"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-base font-semibold text-foreground"
            >
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Your Name"
              className="mt-3 w-full rounded-xl border border-border bg-background px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-lime focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="mt-8">
            <label
              htmlFor="contact-email"
              className="block text-base font-semibold text-foreground"
            >
              Your Email <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-3 w-full rounded-xl border border-border bg-background px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-lime focus:outline-none"
            />
          </div>

          {/* Message */}
          <div className="mt-8">
            <label
              htmlFor="contact-message"
              className="block text-base font-semibold text-foreground"
            >
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={MIN_MESSAGE_LENGTH}
              rows={6}
              placeholder="Write your message here..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-lime focus:outline-none"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              {message.length} / {MIN_MESSAGE_LENGTH} minimum characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-8 rounded-full bg-lime px-9 py-4 font-sans text-sm font-bold tracking-wide text-lime-foreground uppercase transition hover:brightness-95"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
