/**
 * Project data — single source of truth for the Featured Projects section.
 * Replace these samples with your real projects.
 *
 * `image` is served from /public — drop your screenshot in there and point
 * at it (e.g. "/assets/my-project.png"). `liveUrl` opens in a new tab.
 */
export interface Project {
  title: string;
  org: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  image: string;
}

export const projects: Project[] = [
  {
    title: "Trader Support Portal — MOCI Qatar",
    org: "Hassad Food",
    description:
      "Built a trader support portal from scratch for the Ministry of Commerce and Industry (MOCI), Qatar, supporting traders with transportation-cost subsidies during a regional supply disruption. Customized Dynamics 365 CRM to support subsidy business processes, developed CRM automations and business logic to streamline workflows, and designed backend APIs to integrate trader records with government systems.",
    techStack: [
      "Dynamics 365",
      "Backend APIs",
      "CRM Automation",
      "Power Automate",
      "System Integration",
    ],
    liveUrl: "https://example.com",
    image: "/assets/project-placeholder.svg",
  },
  {
    title: "Invest Qatar (IPAQ)",
    org: "Applab Qatar",
    description:
      "Worked on Incentives and Investment Relations (IR) modules for a comprehensive CRM project. Implemented and managed automatic workflows and business process flows, customized Power Pages to enhance user interactions, developed custom dashboards and web APIs for seamless Dynamics CRM integration, and facilitated integration with government entities for efficient data exchange.",
    techStack: [
      "Dynamics 365",
      "Power Pages",
      "Power Automate",
      "Web APIs",
      "Govt Integration",
    ],
    liveUrl: "https://example.com",
    image: "/assets/project-placeholder.svg",
  },
];
