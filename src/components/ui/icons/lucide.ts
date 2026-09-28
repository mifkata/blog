import {
  Briefcase,
  Check,
  Circle,
  Clock,
  Cloud,
  Code,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  Heart,
  Info,
  Lightbulb,
  Menu,
  PanelsTopLeft,
  Server,
  Shield,
  Star,
  Users,
  Wrench,
} from "@lucide/astro";

// Explicit registry: every icon must be imported above and listed here so
// unused Lucide icons are tree-shaken out of the bundle.
export const icons = {
  bulb: Lightbulb,
  briefcase: Briefcase,
  check: Check,
  circle: Circle,
  clock: Clock,
  cloud: Cloud,
  code: Code,
  database: Database,
  document: FileText,
  "external-link": ExternalLink,
  "git-branch": GitBranch,
  globe: Globe,
  heart: Heart,
  info: Info,
  layout: PanelsTopLeft,
  menu: Menu,
  server: Server,
  shield: Shield,
  star: Star,
  tool: Wrench,
  users: Users,
} as const;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];
