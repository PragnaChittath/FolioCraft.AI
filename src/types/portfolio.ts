export type TargetRole = 
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'java'
  | 'python'
  | 'data-analyst'
  | 'uiux'
  | 'flutter'
  | 'cloud-devops'
  | 'general';

export type TemplateId = 
  | 'modern-dev'
  | 'minimal-pro'
  | 'creative-glass'
  | 'terminal-matrix'
  | 'executive-neo'
  | 'bold-editorial'
  | 'neo-brutalist'
  | 'clean-corporate';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ja' | 'pt' | 'zh';

export type ColorTheme = 'indigo' | 'emerald' | 'cyan' | 'violet' | 'rose' | 'amber' | 'blue' | 'slate';

export type FontFamily = 'plus-jakarta' | 'jetbrains-mono' | 'playfair' | 'space-grotesk' | 'system';

export interface ThemeConfig {
  templateId: TemplateId;
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  darkMode: boolean;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  backgroundStyle: 'mesh' | 'grid' | 'dots' | 'glass' | 'clean';
}

export interface ProfileSection {
  fullName: string;
  title: string;
  tagline: string;
  headline: string;
  avatarUrl: string;
  coverImageUrl?: string;
  email: string;
  phone?: string;
  location?: string;
  availabilityBadge: 'open_to_work' | 'freelancing' | 'employed' | 'seeking_internship';
  resumeUrl?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
}

export interface AboutSection {
  summary: string;
  careerObjective?: string;
  yearsOfExperience?: string;
  completedProjectsCount?: string;
  satisfiedClientsCount?: string;
  coffeeCount?: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  mentor?: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  learnings: string[];
  certificateUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  coverImage?: string;
  galleryImages?: string[];
  demoVideoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  category: 'Web' | 'Mobile' | 'AI/ML' | 'Cloud' | 'Open Source' | 'UI/UX' | 'Game Dev';
  featured: boolean;
  stars?: number;
  metrics?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Languages' | 'AI & Data' | 'Tools & Methods' | 'Soft Skills';
  proficiency: number; // 1-100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  highlight?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  grade?: string;
  location?: string;
  coursework?: string[];
  activities?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  link?: string;
  iconType?: 'trophy' | 'medal' | 'star' | 'award';
}

export interface CodingProfiles {
  github?: string;
  leetcode?: string;
  codeforces?: string;
  hackerrank?: string;
  codechef?: string;
  kaggle?: string;
  devpost?: string;
  stackoverflow?: string;
  gfg?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  medium?: string;
  dribbble?: string;
  behance?: string;
  instagram?: string;
  discord?: string;
  website?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime?: string;
  coverImage?: string;
  url?: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  company: string;
  avatarUrl?: string;
  text: string;
  linkedinUrl?: string;
  rating?: number;
}

export interface HobbyItem {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}

export interface ContactSection {
  email: string;
  phone?: string;
  location?: string;
  calendlyUrl?: string;
  customMessage?: string;
  enableDirectForm: boolean;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  layoutType: 'cards' | 'timeline' | 'list' | 'text';
  iconName?: string;
  content?: string;
  items: CustomSectionItem[];
  enabled: boolean;
}

export type StandardSectionKey = 
  | 'profile'
  | 'about'
  | 'experience'
  | 'internships'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'codingProfiles'
  | 'socialLinks'
  | 'blogs'
  | 'testimonials'
  | 'hobbies'
  | 'contact';

export type SectionKey = StandardSectionKey | string;

export interface SectionMeta {
  key: SectionKey;
  label: string;
  icon: string;
  enabled: boolean;
  isCustom?: boolean;
  required?: boolean;
}

export interface PortfolioData {
  id: string;
  userId: string;
  title: string;
  slug: string;
  updatedAt: string;
  targetRole: TargetRole;
  language: LanguageCode;
  theme: ThemeConfig;
  sectionsOrder: SectionKey[];
  enabledSections: Record<string, boolean>;

  profile: ProfileSection;
  about: AboutSection;
  experience: ExperienceItem[];
  internships: InternshipItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  codingProfiles: CodingProfiles;
  socialLinks: SocialLinks;
  blogs: BlogItem[];
  testimonials: TestimonialItem[];
  hobbies: HobbyItem[];
  contact: ContactSection;
  customSections?: CustomSection[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
}

export interface AIPortfolioAnalysis {
  overallScore: number;
  impactScore: number;
  atsScore: number;
  roleMatchScore: number;
  summaryAssessment: string;
  strengths: string[];
  missingSections: Array<{
    sectionName: string;
    severity: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  roleSpecificSuggestions: string[];
  recommendedKeywords: string[];
  quickFixes: Array<{
    field: string;
    action: string;
    impact: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
