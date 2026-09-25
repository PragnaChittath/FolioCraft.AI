import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BuilderSidebar } from './components/builder/BuilderSidebar';
import { SectionEditorRouter } from './components/builder/SectionEditorRouter';
import { PortfolioLivePreview } from './components/preview/PortfolioLivePreview';
import { PublicPortfolioView } from './components/preview/PublicPortfolioView';
import { AuthModal } from './components/AuthModal';
import { SavedSetsModal } from './components/modals/SavedSetsModal';
import { AIAnalysisModal } from './components/ai/AIAnalysisModal';
import { AIPortfolioAssistantDrawer } from './components/ai/AIPortfolioAssistantDrawer';
import { ResumeImportModal } from './components/ai/ResumeImportModal';
import { GitHubSyncModal } from './components/ai/GitHubSyncModal';
import { ShareExportModal } from './components/share/ShareExportModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ProjectItem } from './types/portfolio';
import {
  Eye,
  Edit3,
  Folder,
  CheckCircle2,
  Loader2,
  Columns,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { activePortfolio, portfolios, saveStatus, updatePortfolio, exportPortfolioJSON } = usePortfolio();

  const [currentView, setCurrentView] = useState<'dashboard' | 'builder' | 'live'>('builder');
  // Builder responsive layout mode: 'editor' | 'split' | 'preview'
  const [builderTab, setBuilderTab] = useState<'editor' | 'split' | 'preview'>('editor');
  // Sidebar collapsed state for tablet / compact desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isSavedSetsOpen, setIsSavedSetsOpen] = useState(false);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResumeImportOpen, setIsResumeImportOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<ProjectItem | null>(null);

  // Auto detect initial screen width to set intelligent defaults
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setBuilderTab('split');
        setIsSidebarCollapsed(false);
      } else if (width >= 768) {
        // Tablet portrait/landscape: start in comfortable editor mode with compact/expandable sidebar
        if (builderTab === 'split' && width < 1024) {
          setBuilderTab('editor');
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check URL hash for direct standalone public portfolio view (#p/slug)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#p/')) {
        setCurrentView('live');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handle Resume Import Auto-population
  const handleImportResumeData = (data: any) => {
    updatePortfolio((prev) => {
      const next = { ...prev };
      if (data.profile) {
        next.profile = {
          ...next.profile,
          fullName: data.profile.fullName || next.profile.fullName,
          title: data.profile.title || next.profile.title,
          headline: data.profile.headline || next.profile.headline,
          email: data.profile.email || next.profile.email,
          phone: data.profile.phone || next.profile.phone,
          location: data.profile.location || next.profile.location,
        };
        if (data.profile.about) {
          next.about = {
            ...next.about,
            summary: data.profile.about,
          };
        }
      }

      if (data.projects && Array.isArray(data.projects)) {
        const mappedProjects: ProjectItem[] = data.projects.map((p: any, idx: number) => ({
          id: `proj-import-${Date.now()}-${idx}`,
          title: p.title || 'Project',
          subtitle: p.subtitle || 'Software Project',
          description: p.description || '',
          technologies: Array.isArray(p.technologies) ? p.technologies : ['TypeScript'],
          category: 'Web',
          featured: true,
          liveUrl: p.liveUrl || '',
          githubUrl: p.githubUrl || '',
          coverImage: '',
        }));
        next.projects = [...mappedProjects, ...next.projects];
      }

      if (data.skills && Array.isArray(data.skills)) {
        const mappedSkills = data.skills.map((s: any, idx: number) => ({
          id: `skill-import-${Date.now()}-${idx}`,
          name: s.name,
          category: s.category || 'Languages',
          proficiency: s.proficiency || 85,
          level: 'Advanced' as const,
        }));
        next.skills = [...mappedSkills, ...next.skills];
      }

      if (data.experiences && Array.isArray(data.experiences)) {
        const mappedExp = data.experiences.map((e: any, idx: number) => ({
          id: `exp-import-${Date.now()}-${idx}`,
          role: e.role,
          company: e.company,
          location: e.location || 'Remote',
          type: (e.type || 'Full-time') as any,
          startDate: e.startDate || '2023-01',
          endDate: e.endDate || 'Present',
          current: !!e.current,
          description: e.description || '',
          achievements: Array.isArray(e.achievements) ? e.achievements : [],
          technologies: Array.isArray(e.technologies) ? e.technologies : [],
        }));
        next.experience = [...mappedExp, ...next.experience];
      }

      if (data.education && Array.isArray(data.education)) {
        const mappedEdu = data.education.map((ed: any, idx: number) => ({
          id: `edu-import-${Date.now()}-${idx}`,
          degree: ed.degree,
          institution: ed.institution,
          startDate: ed.startDate || '2020',
          endDate: ed.endDate || '2024',
          grade: ed.grade || '',
        }));
        next.education = [...mappedEdu, ...next.education];
      }

      return next;
    });

    setCurrentView('builder');
  };

  // Handle GitHub sync repository additions
  const handleAddGitHubProjects = (newProjects: ProjectItem[]) => {
    updatePortfolio((prev) => ({
      ...prev,
      projects: [...newProjects, ...prev.projects],
    }));
    setCurrentView('builder');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar: App Name on Left, Sign In on Right, sub-nav below */}
      {currentView !== 'live' && (
        <Navbar
          currentView={currentView}
          onChangeView={setCurrentView}
          onOpenAIAnalysis={() => setIsAIAnalysisOpen(true)}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {currentView === 'dashboard' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Dashboard
              onOpenBuilder={() => setCurrentView('builder')}
              onOpenAIAnalysis={() => setIsAIAnalysisOpen(true)}
              onOpenResumeImport={() => setIsResumeImportOpen(true)}
              onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenLiveSite={() => setCurrentView('live')}
              onOpenSavedSets={() => setIsSavedSetsOpen(true)}
            />
          </div>
        )}

        {currentView === 'builder' && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Tablet & Mobile Responsive Builder Layout Switcher */}
            <div className="xl:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-1.5 shrink-0 flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setBuilderTab('editor')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    builderTab === 'editor'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Editor Form View"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>

                {/* Split view toggle (for tablets & screens >= 900px) */}
                <button
                  onClick={() => setBuilderTab('split')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    builderTab === 'split'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Side-by-Side Dual View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split View</span>
                </button>

                <button
                  onClick={() => setBuilderTab('preview')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    builderTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Live Interactive Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Quick info or Saved sets trigger on tablet */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSavedSetsOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
                >
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Saved Sets ({portfolios.length})</span>
                </button>
              </div>
            </div>

            {/* Builder Working Area */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Left Pane: Sidebar & Editor Form */}
              <div
                className={`flex-1 flex flex-col md:flex-row overflow-hidden border-r border-slate-800 min-w-0 transition-all ${
                  builderTab === 'preview' ? 'hidden' : 'flex'
                } ${builderTab === 'split' ? 'w-full xl:w-[50%] lg:w-[50%]' : 'w-full'}`}
              >
                <BuilderSidebar
                  onOpenSavedSets={() => setIsSavedSetsOpen(true)}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 min-w-0">
                  <SectionEditorRouter />
                </div>
              </div>

              {/* Right Pane: Live Interactive Device Preview */}
              <div
                className={`flex-col overflow-hidden min-w-0 ${
                  builderTab === 'editor'
                    ? 'hidden xl:flex xl:w-[50%] lg:w-[50%]'
                    : builderTab === 'preview'
                    ? 'flex w-full'
                    : 'flex w-full xl:w-[50%] lg:w-[50%]'
                }`}
              >
                <PortfolioLivePreview
                  onOpenProjectModal={(p) => setSelectedProjectForModal(p)}
                  onOpenFullscreen={() => setCurrentView('live')}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'live' && (
          <PublicPortfolioView
            portfolio={activePortfolio}
            onBackToBuilder={() => {
              window.location.hash = '';
              setCurrentView('builder');
            }}
            onOpenProjectModal={(p) => setSelectedProjectForModal(p)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Footer & Saved Sets Bar (Visible on Dashboard and Builder at the bottom/end of the app) */}
      {currentView !== 'live' && (
        <footer className="w-full bg-slate-950/95 border-t border-slate-800/80 px-3 sm:px-6 py-2 shrink-0 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSavedSetsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all shadow-sm group"
                title="Manage Saved Sets"
              >
                <Folder className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Saved Sets</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                  {portfolios.length}
                </span>
              </button>

              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span>Active:</span>
                <span className="text-slate-300 font-medium truncate max-w-[150px]">
                  {activePortfolio.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                    <span>Auto-saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Persistent storage ready</span>
                  </>
                )}
              </div>
              <span>•</span>
              <span>FolioCraft Studio</span>
            </div>
          </div>
        </footer>
      )}

      {/* Interactive Global Modals */}
      <AuthModal />

      <SavedSetsModal
        isOpen={isSavedSetsOpen}
        onClose={() => setIsSavedSetsOpen(false)}
        onOpenBuilder={() => setCurrentView('builder')}
        onOpenLiveSite={() => setCurrentView('live')}
      />

      <AIAnalysisModal
        isOpen={isAIAnalysisOpen}
        onClose={() => setIsAIAnalysisOpen(false)}
        portfolio={activePortfolio}
      />

      <AIPortfolioAssistantDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        portfolio={activePortfolio}
      />

      <ResumeImportModal
        isOpen={isResumeImportOpen}
        onClose={() => setIsResumeImportOpen(false)}
        onImportExtractedData={handleImportResumeData}
      />

      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        onAddProjects={handleAddGitHubProjects}
      />

      <ShareExportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        portfolio={activePortfolio}
        onExportJSON={exportPortfolioJSON}
        onOpenLiveSite={() => setCurrentView('live')}
      />

      <ProjectDetailModal
        project={selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <MainApp />
      </PortfolioProvider>
    </AuthProvider>
  );
}
