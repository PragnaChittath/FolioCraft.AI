import React, { useState } from 'react';
import { PortfolioData, ProjectItem, SectionKey, CustomSection } from '../../types/portfolio';
import { COLOR_PALETTES, FONT_CLASSES } from '../../utils/themeStyles';
import { TRANSLATIONS } from '../../utils/languages';
import {
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Code,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal,
  CheckCircle,
  Quote,
  Heart,
  Send,
  Download,
  Calendar,
  Layers,
  Star,
  Cpu,
  Trophy,
  Coffee,
  Check,
  FolderPlus,
  Clock,
  List as ListIcon,
  AlignLeft,
} from 'lucide-react';

export interface TemplateProps {
  portfolio: PortfolioData;
  onOpenProjectModal?: (project: ProjectItem) => void;
  isPreviewMode?: boolean;
}

export const TemplateRenderer: React.FC<TemplateProps> = ({
  portfolio,
  onOpenProjectModal,
  isPreviewMode = false,
}) => {
  const { templateId, colorTheme, fontFamily, darkMode, borderRadius } = portfolio.theme || {};
  const palette = COLOR_PALETTES[colorTheme || 'indigo'] || COLOR_PALETTES.indigo;
  const font = FONT_CLASSES[fontFamily || 'plus-jakarta'] || FONT_CLASSES['plus-jakarta'];
  const t = TRANSLATIONS[portfolio.language || 'en'] || TRANSLATIONS.en;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const customSections = portfolio.customSections || [];
  const customSectionMap = new Map<string, CustomSection>(customSections.map((c) => [c.id, c]));

  const projects = (portfolio.projects || []).filter((p) => p && p.title && p.title.trim());
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const radiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-3xl',
  }[borderRadius || 'md'];

  const isDark = darkMode ?? true;
  const bgClass = isDark ? palette.bgDark : palette.bgLight;
  const textClass = isDark ? palette.textDark : palette.textLight;
  const textMuted = isDark ? palette.textMutedDark : palette.textMutedLight;
  const cardClass = isDark ? palette.cardDark : palette.cardLight;
  const borderClass = isDark ? palette.borderDark : palette.borderLight;

  const isEnabled = (key: string) => portfolio.enabledSections?.[key] !== false;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  // Section existence checkers (Strict Optional Field discipline)
  const hasProfile = isEnabled('profile') && (
    portfolio.profile?.fullName?.trim() ||
    portfolio.profile?.title?.trim() ||
    portfolio.profile?.tagline?.trim() ||
    portfolio.profile?.headline?.trim() ||
    portfolio.profile?.avatarUrl?.trim()
  );

  const hasAbout = isEnabled('about') && (
    portfolio.about?.summary?.trim() ||
    portfolio.about?.careerObjective?.trim() ||
    portfolio.about?.yearsOfExperience?.trim() ||
    portfolio.about?.completedProjectsCount?.trim() ||
    portfolio.about?.satisfiedClientsCount?.trim() ||
    portfolio.about?.coffeeCount?.trim() ||
    (portfolio.about?.highlights && portfolio.about.highlights.length > 0)
  );

  const hasProjects = isEnabled('projects') && projects.length > 0;
  const hasSkills = isEnabled('skills') && (portfolio.skills || []).length > 0;
  const hasExperience = isEnabled('experience') && (portfolio.experience || []).length > 0;
  const hasInternships = isEnabled('internships') && (portfolio.internships || []).length > 0;
  const hasEducation = isEnabled('education') && (portfolio.education || []).length > 0;
  const hasCertifications = isEnabled('certifications') && (portfolio.certifications || []).length > 0;
  
  const codingProfiles = portfolio.codingProfiles || {};
  const hasCodingProfiles = isEnabled('codingProfiles') && (
    codingProfiles.github?.trim() ||
    codingProfiles.leetcode?.trim() ||
    codingProfiles.codeforces?.trim() ||
    codingProfiles.hackerrank?.trim() ||
    codingProfiles.kaggle?.trim() ||
    codingProfiles.devpost?.trim() ||
    codingProfiles.stackoverflow?.trim()
  );

  const socialLinks = portfolio.socialLinks || {};
  const hasSocials = isEnabled('socialLinks') && (
    socialLinks.linkedin?.trim() ||
    socialLinks.twitter?.trim() ||
    socialLinks.medium?.trim() ||
    socialLinks.website?.trim() ||
    socialLinks.dribbble?.trim() ||
    socialLinks.discord?.trim()
  );

  const hasBlogs = isEnabled('blogs') && (portfolio.blogs || []).length > 0;
  const hasTestimonials = isEnabled('testimonials') && (portfolio.testimonials || []).length > 0;
  const hasHobbies = isEnabled('hobbies') && (portfolio.hobbies || []).length > 0;
  const hasContact = isEnabled('contact') && (
    portfolio.contact?.email?.trim() ||
    portfolio.contact?.phone?.trim() ||
    portfolio.contact?.location?.trim() ||
    portfolio.contact?.customMessage?.trim() ||
    portfolio.contact?.enableDirectForm
  );

  // Sections order - guaranteed deduplicated
  const sectionsOrder = Array.from(
    new Set(
      portfolio.sectionsOrder || [
        'profile',
        'about',
        'projects',
        'skills',
        'experience',
        'internships',
        'education',
        'certifications',
        'codingProfiles',
        'blogs',
        'testimonials',
        'hobbies',
        'contact',
      ]
    )
  );

  const renderSection = (key: string, sectionIndex = 0) => {
    const secKey = `sec-${key}-${sectionIndex}`;

    // Custom Section
    if (key.startsWith('custom-')) {
      const customData = customSectionMap.get(key);
      if (!customData || !customData.enabled || !isEnabled(key)) return null;
      const hasContent = customData.layoutType === 'text'
        ? !!customData.content?.trim()
        : (customData.items && customData.items.length > 0);

      if (!hasContent && !customData.title?.trim()) return null;

      return (
        <section key={secKey} id={key} className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${font.headingClass}`}>{customData.title}</h2>
            </div>
          </div>

          {/* Text Style */}
          {customData.layoutType === 'text' && customData.content && (
            <p className={`text-sm sm:text-base ${textMuted} leading-relaxed whitespace-pre-line`}>
              {customData.content}
            </p>
          )}

          {/* Cards Style */}
          {customData.layoutType === 'cards' && customData.items && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customData.items.map((item, idx) => (
                <div key={item.id || `c-card-${idx}`} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                    {item.date && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 shrink-0">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.subtitle && <p className="text-xs text-indigo-400 font-medium">{item.subtitle}</p>}
                  {item.description && <p className={`text-xs ${textMuted} leading-relaxed`}>{item.description}</p>}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Timeline Style */}
          {customData.layoutType === 'timeline' && customData.items && (
            <div className="space-y-4 border-l-2 border-indigo-500/30 pl-4 ml-2">
              {customData.items.map((item, idx) => (
                <div key={item.id || `c-time-${idx}`} className="space-y-1 relative">
                  <span className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                    {item.date && <span className="text-xs font-mono text-slate-400">{item.date}</span>}
                  </div>
                  {item.subtitle && <p className="text-xs text-indigo-400 font-medium">{item.subtitle}</p>}
                  {item.description && <p className={`text-xs ${textMuted}`}>{item.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* List Style */}
          {customData.layoutType === 'list' && customData.items && (
            <ul className="space-y-2.5">
              {customData.items.map((item, idx) => (
                <li key={item.id || `c-list-${idx}`} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      {item.subtitle && <span className="text-slate-400 text-xs ml-2">({item.subtitle})</span>}
                      {item.description && <p className={`text-xs ${textMuted} mt-0.5`}>{item.description}</p>}
                    </div>
                  </div>
                  {item.date && <span className="text-xs font-mono text-slate-400 shrink-0">{item.date}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      );
    }

    // Standard Section Handlers
    switch (key) {
      case 'profile': {
        if (!hasProfile) return null;
        const hasAvatar = !!portfolio.profile.avatarUrl?.trim();

        return (
          <section key={secKey} id="profile" className="pt-4 pb-8">
            <div className={`flex flex-col ${hasAvatar ? 'md:flex-row' : ''} items-center gap-8 md:gap-12`}>
              {/* Avatar with status badge */}
              {hasAvatar && (
                <div className="relative group shrink-0">
                  <div
                    className={`w-36 h-36 md:w-44 md:h-44 ${radiusClass} overflow-hidden ring-4 ${
                      isDark ? 'ring-slate-800' : 'ring-white'
                    } shadow-2xl transition-transform duration-300 group-hover:scale-105`}
                  >
                    <img
                      src={portfolio.profile.avatarUrl}
                      alt={portfolio.profile.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {portfolio.profile.availabilityBadge && (
                    <div
                      className={`absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg border ${
                        portfolio.profile.availabilityBadge === 'open_to_work'
                          ? 'bg-emerald-500/90 text-white border-emerald-400'
                          : portfolio.profile.availabilityBadge === 'freelancing'
                          ? 'bg-cyan-500/90 text-white border-cyan-400'
                          : 'bg-indigo-500/90 text-white border-indigo-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      {portfolio.profile.availabilityBadge === 'open_to_work'
                        ? t.openToWork
                        : portfolio.profile.availabilityBadge === 'freelancing'
                        ? t.freelancing
                        : portfolio.profile.availabilityBadge === 'seeking_internship'
                        ? t.seekingInternship
                        : t.employed}
                    </div>
                  )}
                </div>
              )}

              {/* Bio & Intro */}
              <div className={`flex-1 text-center ${hasAvatar ? 'md:text-left' : 'text-center'} space-y-3`}>
                {portfolio.profile.title?.trim() && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{portfolio.profile.title}</span>
                  </div>
                )}

                {portfolio.profile.fullName?.trim() && (
                  <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${font.headingClass}`}>
                    {portfolio.profile.fullName}
                  </h1>
                )}

                {portfolio.profile.tagline?.trim() && (
                  <p className="text-lg md:text-xl font-medium text-indigo-400">
                    {portfolio.profile.tagline}
                  </p>
                )}

                {portfolio.profile.headline?.trim() && (
                  <p className={`text-sm md:text-base ${textMuted} leading-relaxed max-w-2xl ${!hasAvatar ? 'mx-auto' : ''}`}>
                    {portfolio.profile.headline}
                  </p>
                )}

                {/* Contact quick tags */}
                {(portfolio.profile.location?.trim() || portfolio.profile.email?.trim() || portfolio.profile.phone?.trim()) && (
                  <div className={`flex flex-wrap items-center justify-center ${hasAvatar ? 'md:justify-start' : 'justify-center'} gap-4 pt-2 text-xs text-slate-400`}>
                    {portfolio.profile.location?.trim() && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {portfolio.profile.location}
                      </span>
                    )}
                    {portfolio.profile.email?.trim() && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        {portfolio.profile.email}
                      </span>
                    )}
                  </div>
                )}

                {/* Call to Actions */}
                <div className={`flex flex-wrap items-center justify-center ${hasAvatar ? 'md:justify-start' : 'justify-center'} gap-3 pt-3`}>
                  {hasProjects && (
                    <a
                      href="#projects"
                      className={`px-5 py-2.5 ${radiusClass} ${palette.primary} text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2`}
                    >
                      <span>{portfolio.profile.primaryActionText || t.featuredProjects}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  {hasContact && (
                    <a
                      href="#contact"
                      className={`px-5 py-2.5 ${radiusClass} ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      } text-sm font-medium transition-all flex items-center gap-2 border ${borderClass}`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>{portfolio.profile.secondaryActionText || t.contactMe}</span>
                    </a>
                  )}

                  {portfolio.profile.resumeUrl?.trim() && (
                    <a
                      href={portfolio.profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-4 py-2.5 ${radiusClass} border border-slate-600/40 hover:border-slate-400 text-xs font-medium transition-all flex items-center gap-1.5`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Resume / CV</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'about': {
        if (!hasAbout) return null;
        const hasMetrics = !!(
          portfolio.about.yearsOfExperience?.trim() ||
          portfolio.about.completedProjectsCount?.trim() ||
          portfolio.about.satisfiedClientsCount?.trim() ||
          portfolio.about.coffeeCount?.trim()
        );

        return (
          <section key={secKey} id="about" className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Code className="w-5 h-5" />
              </div>
              <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.aboutMe}</h2>
            </div>

            {portfolio.about.summary?.trim() && (
              <p className={`text-base md:text-lg ${textMuted} leading-relaxed whitespace-pre-line`}>
                {portfolio.about.summary}
              </p>
            )}

            {portfolio.about.careerObjective?.trim() && (
              <div className={`p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-sm ${textMuted}`}>
                <span className="font-semibold text-indigo-400 block mb-1">Career Focus & Objective:</span>
                {portfolio.about.careerObjective}
              </div>
            )}

            {/* Metrics Counters */}
            {hasMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/30 text-center">
                {portfolio.about.yearsOfExperience?.trim() && (
                  <div className="p-3 rounded-lg bg-slate-500/5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                      {portfolio.about.yearsOfExperience}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Experience</div>
                  </div>
                )}
                {portfolio.about.completedProjectsCount?.trim() && (
                  <div className="p-3 rounded-lg bg-slate-500/5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      {portfolio.about.completedProjectsCount}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Projects Shipped</div>
                  </div>
                )}
                {portfolio.about.satisfiedClientsCount?.trim() && (
                  <div className="p-3 rounded-lg bg-slate-500/5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                      {portfolio.about.satisfiedClientsCount}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Collaborations</div>
                  </div>
                )}
                {portfolio.about.coffeeCount?.trim() && (
                  <div className="p-3 rounded-lg bg-slate-500/5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
                      <Coffee className="w-5 h-5 text-amber-500" />
                      <span>{portfolio.about.coffeeCount}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Coffee Brewed</div>
                  </div>
                )}
              </div>
            )}

            {/* Highlights bullet list */}
            {portfolio.about.highlights && portfolio.about.highlights.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {portfolio.about.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      }

      case 'projects': {
        if (!hasProjects) return null;

        return (
          <section key={secKey} id="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.projects}</h2>
                  <p className="text-xs text-slate-400">Demonstrated software applications, architectures & demos</p>
                </div>
              </div>

              {categories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/40 rounded-lg border border-slate-700/50 text-xs">
                  {categories.map((cat, idx) => (
                    <button
                      key={`${cat}-${idx}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-md transition-all font-medium ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id || `proj-${idx}`}
                  className={`group flex flex-col justify-between p-5 sm:p-6 ${radiusClass} ${cardClass} border ${borderClass} transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/50 hover:-translate-y-1`}
                >
                  <div className="space-y-4">
                    {project.coverImage?.trim() && (
                      <div
                        className={`w-full h-48 ${radiusClass} overflow-hidden bg-slate-800 relative cursor-pointer`}
                        onClick={() => onOpenProjectModal && onOpenProjectModal(project)}
                      >
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {project.featured && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Featured</span>
                          </div>
                        )}
                        {project.category && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-mono">
                            {project.category}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.stars !== undefined && project.stars > 0 && (
                          <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {project.stars}
                          </span>
                        )}
                      </div>

                      {project.subtitle?.trim() && (
                        <p className="text-xs text-indigo-400/90 font-medium mt-0.5">{project.subtitle}</p>
                      )}
                    </div>

                    {project.description?.trim() && (
                      <p className={`text-sm ${textMuted} line-clamp-3 leading-relaxed`}>
                        {project.description}
                      </p>
                    )}

                    {project.metrics?.trim() && (
                      <div className="px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                        🚀 {project.metrics}
                      </div>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={`${tech}-${tIdx}`}
                            className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-500/10 text-slate-300 border border-slate-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Links */}
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-700/40">
                    <button
                      onClick={() => onOpenProjectModal && onOpenProjectModal(project)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl?.trim() && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="GitHub Source"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl?.trim() && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t.viewProject}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'skills': {
        if (!hasSkills) return null;

        return (
          <section key={secKey} id="skills" className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.skills}</h2>
                <p className="text-xs text-slate-400">Core technologies, frameworks & tooling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {portfolio.skills.map((skill, sIdx) => (
                <div
                  key={skill.id || `skill-${sIdx}`}
                  className={`p-3.5 rounded-xl border ${
                    skill.highlight
                      ? 'border-indigo-500/40 bg-indigo-500/5'
                      : isDark
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-200 bg-white'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm">{skill.name}</span>
                      {skill.highlight && <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />}
                    </div>
                    {skill.proficiency > 0 && <span className="text-xs font-mono text-slate-400">{skill.proficiency}%</span>}
                  </div>

                  {skill.proficiency > 0 && (
                    <div className="w-full h-1.5 rounded-full bg-slate-700/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.proficiency > 85 ? 'bg-indigo-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{skill.category}</span>
                    {skill.level && <span className="capitalize font-medium">{skill.level}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'experience': {
        if (!hasExperience) return null;

        return (
          <section key={secKey} id="experience" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.experience}</h2>
                <p className="text-xs text-slate-400">Professional career history and achievements</p>
              </div>
            </div>

            <div className="space-y-4">
              {portfolio.experience.map((item, eIdx) => (
                <div
                  key={item.id || `exp-${eIdx}`}
                  className={`p-6 ${radiusClass} ${cardClass} border ${borderClass} space-y-3 relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{item.role}</h3>
                      <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium">
                        <span>{item.company}</span>
                        {item.type && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-normal">
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {(item.startDate || item.endDate) && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.startDate} — {item.current ? 'Present' : item.endDate}</span>
                      </div>
                    )}
                  </div>

                  {item.description?.trim() && (
                    <p className={`text-sm ${textMuted} leading-relaxed`}>
                      {item.description}
                    </p>
                  )}

                  {item.achievements && item.achievements.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {item.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.technologies.map((tTech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/80 text-slate-400">
                          {tTech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'internships': {
        if (!hasInternships) return null;

        return (
          <section key={secKey} id="internships" className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>{t.internships}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.internships.map((intern, iIdx) => (
                <div key={intern.id || `intern-${iIdx}`} className={`p-5 ${radiusClass} ${cardClass} border ${borderClass} space-y-2`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{intern.role}</h4>
                      <p className="text-xs text-amber-400 font-medium">{intern.company}</p>
                    </div>
                    {(intern.startDate || intern.endDate) && (
                      <span className="text-xs font-mono text-slate-400">{intern.startDate} - {intern.endDate}</span>
                    )}
                  </div>

                  {intern.description?.trim() && <p className={`text-xs ${textMuted}`}>{intern.description}</p>}

                  {intern.learnings && intern.learnings.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">Key Learnings:</span>
                      {intern.learnings.map((l, idx) => (
                        <p key={idx} className="text-slate-300 flex items-start gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{l}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'education': {
        if (!hasEducation) return null;

        return (
          <section key={secKey} id="education" className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.education}</h2>
            </div>

            <div className="space-y-4">
              {portfolio.education.map((edu, edIdx) => (
                <div key={edu.id || `edu-${edIdx}`} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-100">{edu.degree}</h3>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-xs text-slate-400 font-mono">
                        {edu.startDate} — {edu.endDate}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">{edu.institution}</p>
                  {edu.grade && (
                    <div className="text-xs text-emerald-400 font-semibold pt-1">
                      Grade: {edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'certifications': {
        if (!hasCertifications) return null;

        return (
          <section key={secKey} id="certifications" className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
              <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.certifications}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.certifications.map((cert, cIdx) => (
                <div key={cert.id || `cert-${cIdx}`} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-100">{cert.name}</h3>
                    {cert.issueDate && <span className="text-[11px] font-mono text-slate-400 shrink-0">{cert.issueDate}</span>}
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-[11px] font-mono text-slate-400 truncate">ID: {cert.credentialId}</p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'codingProfiles': {
        if (!hasCodingProfiles) return null;

        return (
          <section key={secKey} id="codingProfiles" className={`p-6 ${radiusClass} ${cardClass} border ${borderClass} space-y-4`}>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>{t.codingProfiles}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {codingProfiles.github?.trim() && (
                <a
                  href={
                    codingProfiles.github.startsWith('http')
                      ? codingProfiles.github
                      : `https://github.com/${codingProfiles.github.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center gap-3 transition-colors"
                >
                  <Github className="w-5 h-5 text-white shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">GitHub</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      @{codingProfiles.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/^@/, '').replace(/\/$/, '')}
                    </div>
                  </div>
                </a>
              )}

              {codingProfiles.leetcode?.trim() && (
                <a
                  href={
                    codingProfiles.leetcode.startsWith('http')
                      ? codingProfiles.leetcode
                      : `https://leetcode.com/${codingProfiles.leetcode.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center gap-3 transition-colors"
                >
                  <Code className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">LeetCode</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      @{codingProfiles.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\//i, '').replace(/^@/, '').replace(/\/$/, '')}
                    </div>
                  </div>
                </a>
              )}

              {codingProfiles.codeforces?.trim() && (
                <a
                  href={
                    codingProfiles.codeforces.startsWith('http')
                      ? codingProfiles.codeforces
                      : `https://codeforces.com/profile/${codingProfiles.codeforces.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center gap-3 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-red-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">Codeforces</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      @{codingProfiles.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//i, '').replace(/^@/, '').replace(/\/$/, '')}
                    </div>
                  </div>
                </a>
              )}

              {codingProfiles.hackerrank?.trim() && (
                <a
                  href={
                    codingProfiles.hackerrank.startsWith('http')
                      ? codingProfiles.hackerrank
                      : `https://hackerrank.com/${codingProfiles.hackerrank.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center gap-3 transition-colors"
                >
                  <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">HackerRank</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      @{codingProfiles.hackerrank.replace(/^(https?:\/\/)?(www\.)?hackerrank\.com\//i, '').replace(/^@/, '').replace(/\/$/, '')}
                    </div>
                  </div>
                </a>
              )}
            </div>
          </section>
        );
      }

      case 'blogs': {
        if (!hasBlogs) return null;

        return (
          <section key={secKey} id="blogs" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.blogs}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.blogs.map((blog, bIdx) => (
                <div key={blog.id || `blog-${bIdx}`} className={`p-5 ${radiusClass} ${cardClass} border ${borderClass} space-y-3`}>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="font-bold text-base hover:text-indigo-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className={`text-xs ${textMuted} line-clamp-2`}>{blog.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'testimonials': {
        if (!hasTestimonials) return null;

        return (
          <section key={secKey} id="testimonials" className="space-y-4">
            <h2 className={`text-2xl font-bold ${font.headingClass} flex items-center gap-2`}>
              <Quote className="w-5 h-5 text-indigo-400" />
              <span>{t.testimonials}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.testimonials.map((test, tIdx) => (
                <div key={test.id || `test-${tIdx}`} className={`p-6 ${radiusClass} ${cardClass} border ${borderClass} space-y-4`}>
                  <p className={`text-sm italic ${textMuted} leading-relaxed`}>
                    "{test.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                    {test.avatarUrl && (
                      <img src={test.avatarUrl} alt={test.authorName} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-100">{test.authorName}</div>
                      <div className="text-xs text-indigo-400">{test.authorRole} at {test.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'hobbies': {
        if (!hasHobbies) return null;

        return (
          <section key={secKey} id="hobbies" className={`p-6 ${radiusClass} ${cardClass} border ${borderClass} space-y-4`}>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>{t.hobbies}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {portfolio.hobbies.map((h, hIdx) => (
                <div key={h.id || `hobby-${hIdx}`} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 space-y-1">
                  <div className="font-semibold text-xs sm:text-sm text-slate-200">{h.name}</div>
                  {h.description && <div className="text-[11px] text-slate-400 leading-tight">{h.description}</div>}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'contact': {
        if (!hasContact) return null;

        return (
          <section key={secKey} id="contact" className={`p-6 sm:p-8 ${radiusClass} ${cardClass} border ${borderClass} space-y-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${font.headingClass}`}>{t.contactMe}</h2>
                <p className="text-xs text-slate-400">Let's connect for opportunities, projects & tech advisory</p>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${portfolio.contact?.enableDirectForm ? 'md:grid-cols-2' : ''} gap-8`}>
              {/* Info & Links */}
              <div className="space-y-4">
                {portfolio.contact.customMessage?.trim() && (
                  <p className={`text-sm ${textMuted} leading-relaxed`}>
                    {portfolio.contact.customMessage}
                  </p>
                )}

                <div className="space-y-2.5 text-sm">
                  {portfolio.contact.email?.trim() && (
                    <a
                      href={`mailto:${portfolio.contact.email}`}
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{portfolio.contact.email}</span>
                    </a>
                  )}
                  {portfolio.contact.phone?.trim() && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{portfolio.contact.phone}</span>
                    </div>
                  )}
                  {portfolio.contact.location?.trim() && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{portfolio.contact.location}</span>
                    </div>
                  )}
                </div>

                {/* Social icons row */}
                {hasSocials && (
                  <div className="flex items-center gap-2.5 pt-4">
                    {socialLinks.linkedin?.trim() && (
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {socialLinks.twitter?.trim() && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Twitter / X"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {socialLinks.website?.trim() && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Direct message form */}
              {portfolio.contact.enableDirectForm && (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t.name}</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t.email}</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t.message}</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Hi! I'd love to connect regarding..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 ${radiusClass} ${palette.primary} text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{contactSubmitted ? t.messageSent : t.sendMessage}</span>
                  </button>
                </form>
              )}
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full min-h-full transition-colors duration-300 ${bgClass} ${textClass} ${font.fontClass} ${
        templateId === 'terminal-matrix' ? 'font-mono' : ''
      }`}
      style={{
        backgroundImage:
          portfolio.theme?.backgroundStyle === 'grid'
            ? isDark
              ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)'
              : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)'
            : portfolio.theme?.backgroundStyle === 'dots'
            ? isDark
              ? 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)'
              : 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)'
            : undefined,
        backgroundSize: portfolio.theme?.backgroundStyle ? '24px 24px' : undefined,
      }}
    >
      {/* Background Mesh Gradient Orbs */}
      {portfolio.theme?.backgroundStyle === 'mesh' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: palette.glow }}
          />
          <div
            className="absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: palette.glow }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {sectionsOrder.map((sectionKey, idx) => renderSection(sectionKey, idx))}

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {portfolio.profile?.fullName || 'Developer Portfolio'}. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-indigo-300">FolioCraft AI</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
