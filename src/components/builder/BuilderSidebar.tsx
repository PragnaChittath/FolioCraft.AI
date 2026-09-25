import React, { useState } from 'react';
import { SectionKey } from '../../types/portfolio';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Layers,
  Cpu,
  Award,
  Trophy,
  Terminal,
  Share2,
  BookOpen,
  Quote,
  Heart,
  Mail,
  Palette,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Plus,
  FolderPlus,
  Folder,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const STANDARD_SECTION_CONFIG: Record<string, { label: string; shortLabel: string; icon: any }> = {
  profile: { label: 'Profile & Hero', shortLabel: 'Profile', icon: User },
  about: { label: 'About Me & Goals', shortLabel: 'About', icon: FileText },
  projects: { label: 'Projects & Demos', shortLabel: 'Projects', icon: Layers },
  skills: { label: 'Skills & Tech Stack', shortLabel: 'Skills', icon: Cpu },
  experience: { label: 'Work Experience', shortLabel: 'Experience', icon: Briefcase },
  internships: { label: 'Internships', shortLabel: 'Internships', icon: GraduationCap },
  education: { label: 'Education', shortLabel: 'Education', icon: GraduationCap },
  certifications: { label: 'Certifications', shortLabel: 'Certifications', icon: Award },
  achievements: { label: 'Achievements', shortLabel: 'Achievements', icon: Trophy },
  codingProfiles: { label: 'Coding Profiles', shortLabel: 'Coding', icon: Terminal },
  socialLinks: { label: 'Social Profiles', shortLabel: 'Socials', icon: Share2 },
  blogs: { label: 'Blogs & Articles', shortLabel: 'Blogs', icon: BookOpen },
  testimonials: { label: 'Testimonials', shortLabel: 'Testimonials', icon: Quote },
  hobbies: { label: 'Hobbies & Interests', shortLabel: 'Hobbies', icon: Heart },
  contact: { label: 'Contact Details', shortLabel: 'Contact', icon: Mail },
};

interface BuilderSidebarProps {
  onOpenSavedSets?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  onOpenSavedSets,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const {
    portfolios,
    activePortfolio,
    activeSection,
    setActiveSection,
    toggleSectionVisibility,
    reorderSections,
    addCustomSection,
    deleteCustomSection,
  } = usePortfolio();

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customLayout, setCustomLayout] = useState<'cards' | 'timeline' | 'list' | 'text'>('cards');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customSections = activePortfolio.customSections || [];
  const customSectionMap = new Map(customSections.map((c) => [c.id, c]));

  const sectionsOrder = Array.from(new Set(activePortfolio.sectionsOrder || Object.keys(STANDARD_SECTION_CONFIG)));

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionsOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    reorderSections(newOrder);
  };

  const handleCreateCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    addCustomSection(customTitle.trim(), customLayout);
    setCustomTitle('');
    setIsAddingCustom(false);
  };

  return (
    <>
      {/* Mobile & Small Tablet Top Horizontal Rail */}
      <div className="md:hidden w-full bg-slate-900 border-b border-slate-800 p-2 shrink-0 z-20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 flex-1">
            <button
              onClick={() => setActiveSection('theme')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                activeSection === 'theme'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Theme</span>
            </button>

            {sectionsOrder.map((sectionKey) => {
              const isCustom = sectionKey.startsWith('custom-');
              const customData = isCustom ? customSectionMap.get(sectionKey) : null;
              const standardConfig = !isCustom ? STANDARD_SECTION_CONFIG[sectionKey] : null;
              if (!isCustom && !standardConfig) return null;

              const label = isCustom
                ? customData?.title || 'Custom'
                : standardConfig!.shortLabel;
              const Icon = isCustom ? FolderPlus : standardConfig!.icon;
              const isSelected = activeSection === sectionKey;
              const isEnabled = activePortfolio.enabledSections[sectionKey] !== false;

              return (
                <button
                  key={`m-${sectionKey}`}
                  onClick={() => setActiveSection(sectionKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md font-semibold'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  } ${!isEnabled ? 'opacity-50' : ''}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors"
            title="All Sections List"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Full Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto space-y-1 animate-in fade-in shadow-2xl">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 flex items-center justify-between">
              <span>All Portfolio Sections</span>
              {onOpenSavedSets && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSavedSets();
                  }}
                  className="text-indigo-400 hover:text-indigo-300 lowercase font-mono text-[11px] flex items-center gap-1"
                >
                  <Folder className="w-3 h-3" />
                  <span>saved sets ({portfolios.length})</span>
                </button>
              )}
            </div>
            {sectionsOrder.map((sectionKey) => {
              const isCustom = sectionKey.startsWith('custom-');
              const customData = isCustom ? customSectionMap.get(sectionKey) : null;
              const standardConfig = !isCustom ? STANDARD_SECTION_CONFIG[sectionKey] : null;
              if (!isCustom && !standardConfig) return null;

              const label = isCustom ? customData?.title || 'Custom Section' : standardConfig!.label;
              const Icon = isCustom ? FolderPlus : standardConfig!.icon;
              const isSelected = activeSection === sectionKey;
              const isEnabled = activePortfolio.enabledSections[sectionKey] !== false;

              return (
                <button
                  key={`m-drop-${sectionKey}`}
                  onClick={() => {
                    setActiveSection(sectionKey);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={`truncate ${!isEnabled ? 'line-through opacity-50' : ''}`}>{label}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 h-full shrink-0 transition-all duration-200 select-none ${
          isCollapsed ? 'w-16' : 'w-56 lg:w-64'
        }`}
      >
        {/* Top Header / Collapse Button */}
        <div className="p-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          {!isCollapsed ? (
            <button
              onClick={() => setActiveSection('theme')}
              className={`flex-1 p-2 rounded-xl flex items-center justify-between transition-all mr-1.5 ${
                activeSection === 'theme'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md font-bold'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
              }`}
              title="Theme & Styles"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Palette className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-xs font-semibold truncate">Theme & Layout</span>
              </div>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30 shrink-0 hidden lg:inline">
                {activePortfolio.theme.templateId}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setActiveSection('theme')}
              className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-all ${
                activeSection === 'theme'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
              }`}
              title="Theme & Layout Studio"
            >
              <Palette className="w-4 h-4 text-amber-300 shrink-0" />
            </button>
          )}

          {/* Toggle Sidebar Collapse */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {!isCollapsed && (
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              <span>Sections</span>
              <span>{sectionsOrder.length}</span>
            </div>
          )}

          {sectionsOrder.map((sectionKey, idx) => {
            const isCustom = sectionKey.startsWith('custom-');
            const customData = isCustom ? customSectionMap.get(sectionKey) : null;
            const standardConfig = !isCustom ? STANDARD_SECTION_CONFIG[sectionKey] : null;

            if (!isCustom && !standardConfig) return null;

            const label = isCustom ? customData?.title || 'Custom Section' : standardConfig!.label;
            const shortLabel = isCustom ? customData?.title || 'Custom' : standardConfig!.shortLabel;
            const Icon = isCustom ? FolderPlus : standardConfig!.icon;
            const isEnabled = activePortfolio.enabledSections[sectionKey] !== false;
            const isActive = activeSection === sectionKey;

            if (isCollapsed) {
              return (
                <button
                  key={`${sectionKey}-${idx}`}
                  onClick={() => setActiveSection(sectionKey)}
                  className={`w-full p-2.5 rounded-xl flex flex-col items-center justify-center transition-all relative group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  } ${!isEnabled ? 'opacity-40' : ''}`}
                  title={`${label} ${!isEnabled ? '(Hidden)' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-medium truncate w-full text-center mt-1 leading-none">
                    {shortLabel}
                  </span>
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-slate-950 text-white text-xs whitespace-nowrap border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {label}
                  </div>
                </button>
              );
            }

            return (
              <div
                key={`${sectionKey}-${idx}`}
                className={`group flex items-center justify-between p-1.5 lg:p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 border border-indigo-500/40 text-indigo-300 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {/* Click to edit section */}
                <button
                  onClick={() => setActiveSection(sectionKey)}
                  className="flex-1 flex items-center gap-2 text-left text-xs lg:text-sm truncate mr-1 min-w-0"
                >
                  <Icon
                    className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${
                      isActive ? 'text-indigo-400' : isCustom ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span className={`truncate ${!isEnabled ? 'line-through opacity-50' : ''}`}>{label}</span>
                  {isCustom && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 shrink-0">
                      custom
                    </span>
                  )}
                </button>

                {/* Reorder and Visibility controls */}
                <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20 text-slate-400 hover:text-white"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'down');
                    }}
                    disabled={idx === sectionsOrder.length - 1}
                    className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20 text-slate-400 hover:text-white"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(sectionKey);
                    }}
                    className={`p-1 rounded hover:bg-slate-700/60 transition-colors ${
                      isEnabled ? 'text-slate-400 hover:text-white' : 'text-rose-400'
                    }`}
                    title={isEnabled ? 'Hide section' : 'Show section'}
                  >
                    {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>

                  {isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomSection(sectionKey);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Custom Section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Add Custom Section & Saved Sets */}
        <div className="p-2 lg:p-3 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900/95">
          {!isCollapsed ? (
            <>
              {!isAddingCustom ? (
                <button
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full py-2 px-2.5 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/10 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              ) : (
                <form
                  onSubmit={handleCreateCustomSection}
                  className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>New Custom Section</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    autoFocus
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Research, Awards"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    {(['cards', 'timeline', 'list', 'text'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCustomLayout(t)}
                        className={`py-1 rounded capitalize font-medium border ${
                          customLayout === t
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                  >
                    Create
                  </button>
                </form>
              )}

              {onOpenSavedSets && (
                <button
                  onClick={onOpenSavedSets}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors"
                  title="Saved Sets"
                >
                  <div className="flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Saved Sets</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {portfolios.length}
                  </span>
                </button>
              )}
            </>
          ) : (
            <div className="space-y-1.5 flex flex-col items-center">
              <button
                onClick={() => setIsAddingCustom(true)}
                className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-colors"
                title="Add Custom Section"
              >
                <Plus className="w-4 h-4" />
              </button>

              {onOpenSavedSets && (
                <button
                  onClick={onOpenSavedSets}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                  title={`Saved Sets (${portfolios.length})`}
                >
                  <Folder className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
