import { ColorTheme, FontFamily, ThemeConfig } from '../types/portfolio';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  cardLight: string;
  cardDark: string;
  borderLight: string;
  borderDark: string;
  ring: string;
  glow: string;
  textLight: string;
  textDark: string;
  textMutedLight: string;
  textMutedDark: string;
}

export const COLOR_PALETTES: Record<ColorTheme, ThemeColors> = {
  indigo: {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    primaryLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    primaryDark: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    accent: 'text-indigo-400',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-slate-950',
    cardLight: 'bg-white border-slate-200 shadow-sm',
    cardDark: 'bg-slate-900/90 border-slate-800 shadow-xl',
    borderLight: 'border-slate-200',
    borderDark: 'border-slate-800',
    ring: 'focus:ring-indigo-500',
    glow: 'rgba(99, 102, 241, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-slate-400',
  },
  emerald: {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    primaryLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    primaryDark: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    accent: 'text-emerald-400',
    bgLight: 'bg-emerald-50/30',
    bgDark: 'bg-zinc-950',
    cardLight: 'bg-white border-zinc-200 shadow-sm',
    cardDark: 'bg-zinc-900/90 border-zinc-800 shadow-xl',
    borderLight: 'border-zinc-200',
    borderDark: 'border-zinc-800',
    ring: 'focus:ring-emerald-500',
    glow: 'rgba(16, 185, 129, 0.25)',
    textLight: 'text-zinc-900',
    textDark: 'text-zinc-100',
    textMutedLight: 'text-zinc-600',
    textMutedDark: 'text-zinc-400',
  },
  cyan: {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
    primaryLight: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    primaryDark: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    accent: 'text-cyan-400',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-[#0b1329]',
    cardLight: 'bg-white border-slate-200 shadow-sm',
    cardDark: 'bg-[#111c38]/90 border-cyan-900/40 shadow-xl',
    borderLight: 'border-slate-200',
    borderDark: 'border-cyan-900/30',
    ring: 'focus:ring-cyan-500',
    glow: 'rgba(6, 182, 212, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-cyan-200/70',
  },
  violet: {
    primary: 'bg-violet-600 text-white hover:bg-violet-700',
    primaryLight: 'bg-violet-50 text-violet-700 border-violet-200',
    primaryDark: 'bg-violet-950/60 text-violet-300 border-violet-800/60',
    accent: 'text-violet-400',
    bgLight: 'bg-purple-50/20',
    bgDark: 'bg-[#0f0b1e]',
    cardLight: 'bg-white border-purple-100 shadow-sm',
    cardDark: 'bg-[#181230]/90 border-violet-900/40 shadow-xl',
    borderLight: 'border-purple-200',
    borderDark: 'border-violet-900/30',
    ring: 'focus:ring-violet-500',
    glow: 'rgba(139, 92, 246, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-violet-200/70',
  },
  rose: {
    primary: 'bg-rose-600 text-white hover:bg-rose-700',
    primaryLight: 'bg-rose-50 text-rose-700 border-rose-200',
    primaryDark: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    accent: 'text-rose-400',
    bgLight: 'bg-rose-50/20',
    bgDark: 'bg-[#180d12]',
    cardLight: 'bg-white border-rose-100 shadow-sm',
    cardDark: 'bg-[#23121b]/90 border-rose-900/40 shadow-xl',
    borderLight: 'border-rose-200',
    borderDark: 'border-rose-900/30',
    ring: 'focus:ring-rose-500',
    glow: 'rgba(244, 63, 94, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-rose-200/70',
  },
  amber: {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    primaryLight: 'bg-amber-50 text-amber-700 border-amber-200',
    primaryDark: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    accent: 'text-amber-400',
    bgLight: 'bg-amber-50/20',
    bgDark: 'bg-[#17130b]',
    cardLight: 'bg-white border-amber-100 shadow-sm',
    cardDark: 'bg-[#231d10]/90 border-amber-900/40 shadow-xl',
    borderLight: 'border-amber-200',
    borderDark: 'border-amber-900/30',
    ring: 'focus:ring-amber-500',
    glow: 'rgba(245, 158, 11, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-amber-200/70',
  },
  blue: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    primaryLight: 'bg-blue-50 text-blue-700 border-blue-200',
    primaryDark: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    accent: 'text-blue-400',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-[#0a1128]',
    cardLight: 'bg-white border-slate-200 shadow-sm',
    cardDark: 'bg-[#0f1b3e]/90 border-blue-900/40 shadow-xl',
    borderLight: 'border-slate-200',
    borderDark: 'border-blue-900/30',
    ring: 'focus:ring-blue-500',
    glow: 'rgba(59, 130, 246, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-blue-200/70',
  },
  slate: {
    primary: 'bg-slate-800 text-white hover:bg-slate-900',
    primaryLight: 'bg-slate-100 text-slate-800 border-slate-300',
    primaryDark: 'bg-slate-800 text-slate-200 border-slate-700',
    accent: 'text-slate-400',
    bgLight: 'bg-slate-100',
    bgDark: 'bg-slate-950',
    cardLight: 'bg-white border-slate-300 shadow-sm',
    cardDark: 'bg-slate-900 border-slate-800 shadow-xl',
    borderLight: 'border-slate-300',
    borderDark: 'border-slate-800',
    ring: 'focus:ring-slate-500',
    glow: 'rgba(148, 163, 184, 0.25)',
    textLight: 'text-slate-900',
    textDark: 'text-slate-100',
    textMutedLight: 'text-slate-600',
    textMutedDark: 'text-slate-400',
  },
};

export const FONT_CLASSES: Record<FontFamily, { fontClass: string; headingClass: string; label: string }> = {
  'plus-jakarta': {
    fontClass: 'font-[Plus_Jakarta_Sans,sans-serif]',
    headingClass: 'font-[Plus_Jakarta_Sans,sans-serif] font-bold tracking-tight',
    label: 'Plus Jakarta Sans (Modern & Clean)',
  },
  'jetbrains-mono': {
    fontClass: 'font-[JetBrains_Mono,monospace]',
    headingClass: 'font-[JetBrains_Mono,monospace] font-bold tracking-tight',
    label: 'JetBrains Mono (Developer & Terminal)',
  },
  playfair: {
    fontClass: 'font-[Plus_Jakarta_Sans,sans-serif]',
    headingClass: 'font-[Playfair_Display,serif] font-bold',
    label: 'Playfair Display (Executive & Editorial)',
  },
  'space-grotesk': {
    fontClass: 'font-[Space_Grotesk,sans-serif]',
    headingClass: 'font-[Space_Grotesk,sans-serif] font-bold tracking-tight',
    label: 'Space Grotesk (Tech & Brutalist)',
  },
  system: {
    fontClass: 'font-sans',
    headingClass: 'font-sans font-bold',
    label: 'System UI',
  },
};

export const TEMPLATE_METAS = [
  {
    id: 'modern-dev',
    title: 'Modern Dev',
    subtitle: 'Sleek dark/light developer aesthetic with glowing cards & tech badges',
    tags: ['Popular', 'Software Engineer', 'Full Stack'],
    badge: 'Recommended',
  },
  {
    id: 'minimal-pro',
    title: 'Minimal Pro',
    subtitle: 'Swiss typography, crisp borders, ultra-clean whitespace',
    tags: ['Clean', 'Fresher', 'Junior Dev'],
    badge: 'Recruiter Favorite',
  },
  {
    id: 'creative-glass',
    title: 'Creative Glass',
    subtitle: 'Luminous glassmorphism, floating blur effects & vibrant gradients',
    tags: ['UI/UX', 'Frontend', 'Creative'],
    badge: 'Stunning',
  },
  {
    id: 'terminal-matrix',
    title: 'Terminal Matrix',
    subtitle: 'Cyberpunk command-line interface with interactive bash commands',
    tags: ['Backend', 'DevOps', 'Cybersecurity'],
    badge: 'Geeky',
  },
  {
    id: 'executive-neo',
    title: 'Executive Neo',
    subtitle: 'Refined serif headers, deep rich palettes & executive presence',
    tags: ['Tech Lead', 'Architect', 'Manager'],
    badge: 'High Impact',
  },
  {
    id: 'bold-editorial',
    title: 'Bold Editorial',
    subtitle: 'Magazine-style punchy layout with large numbers & strong typography',
    tags: ['Designer', 'Product', 'Founder'],
    badge: 'Distinctive',
  },
  {
    id: 'neo-brutalist',
    title: 'Neo Brutalist',
    subtitle: 'High contrast borders, retro shadows, vibrant pop-art tags',
    tags: ['Indie Hacker', 'Creator', 'Web3'],
    badge: 'Trendy',
  },
  {
    id: 'clean-corporate',
    title: 'Clean Corporate',
    subtitle: 'Enterprise-grade structured layout, elegant timelines and clarity',
    tags: ['Java', 'Enterprise', 'Consultant'],
    badge: 'Corporate',
  },
];
