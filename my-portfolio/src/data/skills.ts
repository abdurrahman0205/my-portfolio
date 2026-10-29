import type { IconType } from "react-icons";
import {
  SiCss,
  SiFlask,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSqlite,
} from "react-icons/si";

/**
 * Skill data — single source of truth for both the skills sphere and the
 * terminal card. Replace the sample entries with your real skills.
 *
 * `icon` is an optional react-icons (Simple Icons "Si*") component key.
 * Skills without an icon render as chips only; skills with an icon also
 * appear as logos floating on the sphere (keep it around 8–12 for best
 * results).
 */
export interface Skill {
  name: string;
  icon?: IconType;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: [{ name: "Python", icon: SiPython }, { name: "SQL" }],
  },
  {
    name: "Web Technologies",
    skills: [
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
    ],
  },
  {
    name: "Frameworks",
    skills: [
      { name: "Flask", icon: SiFlask },
      { name: "React", icon: SiReact },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "scikit-learn", icon: SiScikitlearn },
      { name: "PyTorch", icon: SiPytorch },
    ],
  },
  {
    name: "Databases",
    skills: [
      { name: "MySQL", icon: SiMysql },
      { name: "SQLite", icon: SiSqlite },
    ],
  },
  {
    name: "Version Control",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    name: "Core Concepts",
    skills: [{ name: "DSA" }, { name: "OOP" }, { name: "REST APIs" }],
  },
  {
    name: "Tools",
    skills: [{ name: "VS Code" }, { name: "OpenCode" }],
  },
];

/** Flat list of skills that have a logo — used by the sphere. */
export const sphereSkills = skillCategories
  .flatMap((category) => category.skills)
  .filter((skill): skill is Skill & { icon: IconType } => Boolean(skill.icon));
