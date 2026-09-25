import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  PortfolioData,
  SectionKey,
  TargetRole,
  ThemeConfig,
  LanguageCode,
} from '../types/portfolio';
import { createInitialPortfolio } from '../utils/defaults';
import { useAuth } from './AuthContext';

const PORTFOLIOS_STORAGE_KEY = 'foliocraft_all_portfolios_v2';
const ACTIVE_ID_KEY = 'foliocraft_active_portfolio_id_v2';

interface PortfolioContextType {
  portfolios: PortfolioData[];
  activePortfolio: PortfolioData;
  activePortfolioId: string;
  activeSection: SectionKey | 'theme';
  setActiveSection: (sec: SectionKey | 'theme') => void;
  updatePortfolio: (updater: (prev: PortfolioData) => PortfolioData) => void;
  updateTheme: (themeUpdate: Partial<ThemeConfig>) => void;
  updateTargetRole: (role: TargetRole) => void;
  updateLanguage: (lang: LanguageCode) => void;
  toggleSectionVisibility: (sectionKey: SectionKey) => void;
  reorderSections: (newOrder: SectionKey[]) => void;
  addCustomSection: (title: string, layoutType?: 'cards' | 'timeline' | 'list' | 'text') => string;
  deleteCustomSection: (id: string) => void;
  setActivePortfolioId: (id: string) => void;
  createPortfolio: (title: string, role?: TargetRole) => string;
  duplicatePortfolio: (id: string) => string;
  deletePortfolio: (id: string) => void;
  renamePortfolio: (id: string, newTitle: string) => void;
  saveCurrentAsSet: (title?: string) => string;
  importPortfolioJSON: (jsonStr: string) => boolean;
  exportPortfolioJSON: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  completenessScore: number;
  missingSectionsList: Array<{ key: SectionKey; label: string; reason: string }>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Helper to sanitize portfolio data and ensure unique keys across sections
function sanitizePortfolio(p: PortfolioData): PortfolioData {
  if (!p) return p;
  const sectionsOrder = Array.from(
    new Set(
      (p.sectionsOrder || [
        'profile',
        'about',
        'experience',
        'projects',
        'skills',
        'internships',
        'education',
        'codingProfiles',
        'certifications',
        'achievements',
        'blogs',
        'testimonials',
        'socialLinks',
        'hobbies',
        'contact',
      ]).filter(Boolean)
    )
  );

  return {
    ...p,
    language: 'en',
    sectionsOrder,
    education: (p.education || []).map((e, idx) => ({
      ...e,
      id: e.id ? `${e.id}` : `edu-${idx}-${Date.now()}`,
    })),
    certifications: (p.certifications || []).map((c, idx) => ({
      ...c,
      id: c.id ? `${c.id}` : `cert-${idx}-${Date.now()}`,
    })),
    internships: (p.internships || []).map((i, idx) => ({
      ...i,
      id: i.id ? `${i.id}` : `intern-${idx}-${Date.now()}`,
    })),
    experience: (p.experience || []).map((exp, idx) => ({
      ...exp,
      id: exp.id ? `${exp.id}` : `exp-${idx}-${Date.now()}`,
    })),
    projects: (p.projects || []).map((proj, idx) => ({
      ...proj,
      id: proj.id ? `${proj.id}` : `proj-${idx}-${Date.now()}`,
    })),
    skills: (p.skills || []).map((s, idx) => ({
      ...s,
      id: s.id ? `${s.id}` : `skill-${idx}-${Date.now()}`,
    })),
  };
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [portfolios, setPortfolios] = useState<PortfolioData[]>(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any lingering mock demo items
          const cleaned = parsed
            .filter((item) => item && item.id !== 'port-alex-fs-01' && item.id !== 'port-priya-fresher-02')
            .map(sanitizePortfolio);
          if (cleaned.length > 0) {
            return cleaned;
          }
        }
      }
    } catch (e) {
      console.error('Failed loading portfolios from storage', e);
    }
    const initial = createInitialPortfolio(user);
    return [sanitizePortfolio(initial)];
  });

  const [activePortfolioId, setActivePortfolioId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && savedId !== 'port-alex-fs-01' && savedId !== 'port-priya-fresher-02') {
        return savedId;
      }
    } catch (e) {}
    return portfolios[0]?.id || `port-${Date.now()}`;
  });

  const [activeSection, setActiveSection] = useState<SectionKey | 'theme'>('profile');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Active Portfolio item
  const activePortfolio = useMemo(() => {
    const found = portfolios.find((p) => p.id === activePortfolioId);
    return found || portfolios[0] || createInitialPortfolio(user);
  }, [portfolios, activePortfolioId, user]);

  // Persist portfolios to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
      if (activePortfolioId) {
        localStorage.setItem(ACTIVE_ID_KEY, activePortfolioId);
      }
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [portfolios, activePortfolioId]);

  // Update user details in active portfolio if freshly logged in and empty
  useEffect(() => {
    if (user?.name || user?.email) {
      setPortfolios((prevList) =>
        prevList.map((p) => {
          if (p.id === activePortfolioId && (!p.profile.fullName || !p.profile.email)) {
            return {
              ...p,
              profile: {
                ...p.profile,
                fullName: p.profile.fullName || user.name || '',
                email: p.profile.email || user.email || '',
              },
            };
          }
          return p;
        })
      );
    }
  }, [user, activePortfolioId]);

  const updatePortfolio = useCallback(
    (updater: (prev: PortfolioData) => PortfolioData) => {
      setSaveStatus('saving');
      setPortfolios((prevList) =>
        prevList.map((p) => {
          if (p.id === activePortfolio.id) {
            const updated = updater(p);
            return {
              ...updated,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        })
      );
      const timer = setTimeout(() => setSaveStatus('saved'), 300);
      return () => clearTimeout(timer);
    },
    [activePortfolio.id]
  );

  const updateTheme = useCallback(
    (themeUpdate: Partial<ThemeConfig>) => {
      updatePortfolio((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          ...themeUpdate,
        },
      }));
    },
    [updatePortfolio]
  );

  const updateTargetRole = useCallback(
    (targetRole: TargetRole) => {
      updatePortfolio((prev) => ({
        ...prev,
        targetRole,
      }));
    },
    [updatePortfolio]
  );

  const updateLanguage = useCallback(
    (_language: LanguageCode) => {
      // Keep English only
      updatePortfolio((prev) => ({
        ...prev,
        language: 'en',
      }));
    },
    [updatePortfolio]
  );

  const toggleSectionVisibility = useCallback(
    (sectionKey: SectionKey) => {
      updatePortfolio((prev) => {
        const currentlyEnabled = prev.enabledSections[sectionKey] ?? true;
        return {
          ...prev,
          enabledSections: {
            ...prev.enabledSections,
            [sectionKey]: !currentlyEnabled,
          },
        };
      });
    },
    [updatePortfolio]
  );

  const reorderSections = useCallback(
    (newOrder: SectionKey[]) => {
      updatePortfolio((prev) => ({
        ...prev,
        sectionsOrder: newOrder,
      }));
    },
    [updatePortfolio]
  );

  const addCustomSection = useCallback(
    (title: string, layoutType: 'cards' | 'timeline' | 'list' | 'text' = 'cards') => {
      const sectionId = `custom-${Date.now()}`;
      const newCustomSection = {
        id: sectionId,
        title: title || 'Custom Section',
        layoutType,
        items: [],
        enabled: true,
      };

      updatePortfolio((prev) => ({
        ...prev,
        customSections: [...(prev.customSections || []), newCustomSection],
        sectionsOrder: [...prev.sectionsOrder, sectionId],
        enabledSections: {
          ...prev.enabledSections,
          [sectionId]: true,
        },
      }));

      setActiveSection(sectionId);
      return sectionId;
    },
    [updatePortfolio]
  );

  const deleteCustomSection = useCallback(
    (id: string) => {
      updatePortfolio((prev) => {
        const filteredCustom = (prev.customSections || []).filter((s) => s.id !== id);
        const filteredOrder = prev.sectionsOrder.filter((k) => k !== id);
        const nextEnabled = { ...prev.enabledSections };
        delete nextEnabled[id];

        return {
          ...prev,
          customSections: filteredCustom,
          sectionsOrder: filteredOrder,
          enabledSections: nextEnabled,
        };
      });

      setActiveSection('profile');
    },
    [updatePortfolio]
  );

  const createPortfolio = useCallback(
    (title: string, role: TargetRole = 'fullstack') => {
      const newId = `port-${Date.now()}`;
      const cleanTitle = title.trim() || 'New Portfolio';
      const newSlug =
        cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `folio-${Date.now()}`;

      const base = createInitialPortfolio(user);
      const newPortfolio: PortfolioData = {
        ...base,
        id: newId,
        userId: user?.id || 'user-local',
        title: cleanTitle,
        slug: newSlug,
        targetRole: role,
        updatedAt: new Date().toISOString(),
      };

      setPortfolios((prev) => [newPortfolio, ...prev]);
      setActivePortfolioId(newId);
      return newId;
    },
    [user]
  );

  const duplicatePortfolio = useCallback(
    (id: string) => {
      const target = portfolios.find((p) => p.id === id) || activePortfolio;
      const newId = `port-${Date.now()}`;
      const duplicated: PortfolioData = {
        ...JSON.parse(JSON.stringify(target)),
        id: newId,
        title: `${target.title} (Copy)`,
        slug: `${target.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
        updatedAt: new Date().toISOString(),
      };

      setPortfolios((prev) => [duplicated, ...prev]);
      setActivePortfolioId(newId);
      return newId;
    },
    [portfolios, activePortfolio]
  );

  const renamePortfolio = useCallback(
    (id: string, newTitle: string) => {
      const trimmed = newTitle.trim();
      if (!trimmed) return;
      setPortfolios((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updatedSlug =
              trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || p.slug;
            return {
              ...p,
              title: trimmed,
              slug: updatedSlug,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        })
      );
    },
    []
  );

  const saveCurrentAsSet = useCallback(
    (customTitle?: string) => {
      const title = customTitle?.trim() || `${activePortfolio.title} (Saved Set)`;
      const newId = `port-${Date.now()}`;
      const savedSet: PortfolioData = {
        ...JSON.parse(JSON.stringify(activePortfolio)),
        id: newId,
        title,
        slug: `${activePortfolio.slug}-set-${Math.floor(100 + Math.random() * 900)}`,
        updatedAt: new Date().toISOString(),
      };
      setPortfolios((prev) => [savedSet, ...prev]);
      setActivePortfolioId(newId);
      return newId;
    },
    [activePortfolio]
  );

  const deletePortfolio = useCallback(
    (id: string) => {
      setPortfolios((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        if (filtered.length === 0) {
          const fresh = createInitialPortfolio(user);
          setActivePortfolioId(fresh.id);
          return [fresh];
        }
        if (activePortfolioId === id) {
          setActivePortfolioId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activePortfolioId, user]
  );

  const importPortfolioJSON = useCallback(
    (jsonStr: string) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed.profile && !parsed.projects) {
          throw new Error('Invalid portfolio schema');
        }
        const newId = `port-imported-${Date.now()}`;
        const newPortfolio: PortfolioData = sanitizePortfolio({
          ...createInitialPortfolio(user),
          ...parsed,
          id: newId,
          userId: user?.id || 'user-local',
          title: parsed.title || 'Imported Portfolio',
          updatedAt: new Date().toISOString(),
        });
        setPortfolios((prev) => [newPortfolio, ...prev]);
        setActivePortfolioId(newId);
        return true;
      } catch (err) {
        console.error('Import failed', err);
        return false;
      }
    },
    [user]
  );

  const exportPortfolioJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePortfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activePortfolio.slug || 'portfolio'}-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [activePortfolio]);

  // Compute completeness score dynamically
  const { completenessScore, missingSectionsList } = useMemo(() => {
    let score = 0;
    const missing: Array<{ key: SectionKey; label: string; reason: string }> = [];

    // Profile check
    if (activePortfolio.profile?.fullName?.trim() && activePortfolio.profile?.title?.trim() && activePortfolio.profile?.email?.trim()) {
      score += 20;
    } else {
      missing.push({ key: 'profile', label: 'Profile Header', reason: 'Full name, title, or email is incomplete.' });
    }

    if (activePortfolio.profile?.avatarUrl?.trim()) score += 5;

    // About check
    if (activePortfolio.about?.summary?.trim() && activePortfolio.about.summary.length > 30) {
      score += 15;
    } else {
      missing.push({ key: 'about', label: 'About Me', reason: 'Add a professional career summary or bio.' });
    }

    // Projects check
    if (activePortfolio.projects && activePortfolio.projects.length >= 2) {
      score += 25;
    } else if (activePortfolio.projects && activePortfolio.projects.length === 1) {
      score += 15;
      missing.push({ key: 'projects', label: 'Projects', reason: 'Add at least 2 projects to showcase your craft.' });
    } else {
      missing.push({ key: 'projects', label: 'Projects', reason: 'No projects added yet.' });
    }

    // Skills check
    if (activePortfolio.skills && activePortfolio.skills.length >= 4) {
      score += 15;
    } else {
      missing.push({ key: 'skills', label: 'Skills & Tech Stack', reason: 'Add your primary technical skills.' });
    }

    // Experience / Internships check
    if ((activePortfolio.experience && activePortfolio.experience.length > 0) || (activePortfolio.internships && activePortfolio.internships.length > 0)) {
      score += 10;
    } else {
      missing.push({ key: 'experience', label: 'Experience / Internships', reason: 'Add work experience or internships.' });
    }

    // Education check
    if (activePortfolio.education && activePortfolio.education.length > 0) {
      score += 5;
    } else {
      missing.push({ key: 'education', label: 'Education', reason: 'Add your degree or university info.' });
    }

    // Coding & Social links
    if (activePortfolio.codingProfiles?.github?.trim() || activePortfolio.socialLinks?.linkedin?.trim()) {
      score += 5;
    }

    return {
      completenessScore: Math.min(100, score),
      missingSectionsList: missing,
    };
  }, [activePortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        activePortfolio,
        activePortfolioId,
        activeSection,
        setActiveSection,
        updatePortfolio,
        updateTheme,
        updateTargetRole,
        updateLanguage,
        toggleSectionVisibility,
        reorderSections,
        addCustomSection,
        deleteCustomSection,
        setActivePortfolioId,
        createPortfolio,
        duplicatePortfolio,
        deletePortfolio,
        renamePortfolio,
        saveCurrentAsSet,
        importPortfolioJSON,
        exportPortfolioJSON,
        saveStatus,
        completenessScore,
        missingSectionsList,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
