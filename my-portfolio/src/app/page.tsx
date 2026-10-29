import AboutSection from "@/components/about/AboutSection";
import { Banner } from "@/components/Banner";
import ContactSection from "@/components/contact/ContactSection";
import { Navbar } from "@/components/Navbar";
import ProjectsSection from "@/components/projects/ProjectsSection";
import SkillsSection from "@/components/skills/SkillsSection";

// Home page — composes the Navbar (top nav + theme toggle), the Banner
// (hero section), the About, Skills, Projects, and Contact sections.
// Layout is dark by default (see root layout + globals.css).
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <Banner />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
