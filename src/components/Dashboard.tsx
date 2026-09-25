import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { TargetRole } from '../types/portfolio';
import {
  Sparkles,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Edit3,
  TrendingUp,
  FileText,
  Github,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Folder,
  ShieldCheck,
  Check,
  X,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DashboardProps {
  onOpenBuilder: () => void;
  onOpenAIAnalysis: () => void;
  onOpenResumeImport: () => void;
  onOpenGitHubSync: () => void;
  onOpenShareModal: () => void;
  onOpenLiveSite: () => void;
  onOpenSavedSets: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenBuilder,
  onOpenAIAnalysis,
  onOpenResumeImport,
  onOpenGitHubSync,
  onOpenShareModal,
  onOpenLiveSite,
  onOpenSavedSets,
}) => {
  const { user } = useAuth();
  const {
    portfolios,
    activePortfolio,
    activePortfolioId,
    setActivePortfolioId,
    createPortfolio,
    duplicatePortfolio,
    deletePortfolio,
    renamePortfolio,
    completenessScore,
    missingSectionsList,
    updateTargetRole,
  } = usePortfolio();

  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<TargetRole>('fullstack');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPortfolio(newTitle.trim(), newRole);
    setNewTitle('');
    setIsCreating(false);
    onOpenBuilder();
  };

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      renamePortfolio(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const displayName = user?.name || activePortfolio?.profile?.fullName || 'Developer';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-5 sm:p-8 lg:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Professional Developer Portfolio Studio</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName}! 🚀
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
              Build, customize, and publish your technical portfolio with verified skills, interactive projects, and modern responsive themes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBuilder}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Open Portfolio Builder</span>
              </button>

              <button
                onClick={() => {
                  const savedSetsEl = document.getElementById('saved-sets-section');
                  if (savedSetsEl) {
                    savedSetsEl.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onOpenSavedSets();
                  }
                }}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Folder className="w-4 h-4 text-indigo-400" />
                <span>View Saved Sets ({portfolios.length})</span>
              </button>
            </div>
          </div>

          {/* Completeness Ring Card */}
          <div className="shrink-0 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center w-full md:w-56 lg:w-60 shadow-xl">
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${completenessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-lg sm:text-xl font-extrabold text-white">{completenessScore}%</span>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-200">Portfolio Completeness</div>
            <div className="text-[11px] text-slate-400">
              {completenessScore >= 80 ? '🌟 Highly Complete' : '⚡ Add more sections to reach 100%'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Accelerator Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={onOpenResumeImport}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center gap-4 group shadow-sm"
        >
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300">Resume Import</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Auto-fill projects, experience, and bio from your CV</div>
          </div>
        </div>

        <div
          onClick={onOpenGitHubSync}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center gap-4 group shadow-sm"
        >
          <div className="p-3 rounded-xl bg-slate-800 text-white border border-slate-700 group-hover:scale-110 transition-transform shrink-0">
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300">GitHub Repos Sync</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Import repositories, languages, and live links</div>
          </div>
        </div>

        <div
          onClick={onOpenShareModal}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center gap-4 group shadow-sm"
        >
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform shrink-0">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300">Share & PDF Export</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Custom URL, QR code, and clean paper PDF</div>
          </div>
        </div>
      </div>

      {/* Target Role & Quality Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Target Role Alignment</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Tailor suggestions and layout weighting for your primary specialty.
          </p>

          <select
            value={activePortfolio.targetRole}
            onChange={(e) => updateTargetRole(e.target.value as TargetRole)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="frontend">Frontend Developer (React, Next, UI)</option>
            <option value="backend">Backend Developer (Node, Python, Go)</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="java">Java / Spring Boot Developer</option>
            <option value="python">Python & AI Engineer</option>
            <option value="data-analyst">Data Analyst / Scientist</option>
            <option value="uiux">UI/UX & Product Designer</option>
            <option value="flutter">Flutter / Mobile Developer</option>
            <option value="cloud-devops">Cloud & DevOps Architect</option>
          </select>
        </div>

        <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Portfolio Quality Checklist</span>
            </h3>
            <span className="text-xs text-slate-400">{missingSectionsList.length} items to optimize</span>
          </div>

          {missingSectionsList.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Great job! All core sections are filled with content.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {missingSectionsList.slice(0, 4).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Portfolio Sets Section (Positioned at the bottom/end of the app) */}
      <div id="saved-sets-section" className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-400" />
              <span>My Saved Sets ({portfolios.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage, rename, duplicate, switch, or delete your saved portfolio sets anytime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Portfolio Set</span>
            </button>
            <button
              onClick={onOpenSavedSets}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              Manage Modal
            </button>
          </div>
        </div>

        {/* Create Portfolio Inline Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 animate-in fade-in shadow-xl">
            <h3 className="font-bold text-sm text-white">Create New Portfolio Set</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Senior Fullstack Portfolio"
                className="px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as TargetRole)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
                <option value="java">Java Developer</option>
                <option value="python">Python / AI Engineer</option>
                <option value="data-analyst">Data Analyst</option>
                <option value="uiux">UI/UX Designer</option>
                <option value="flutter">Flutter Developer</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Create Set
              </button>
            </div>
          </form>
        )}

        {/* Saved Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((p) => {
            const isActive = p.id === activePortfolioId;
            const isEditing = editingId === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setActivePortfolioId(p.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/80 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                      {p.targetRole || 'Developer'}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Set
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        autoFocus
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(p.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="px-2 py-1 rounded bg-slate-950 border border-indigo-500 text-xs text-white w-full"
                      />
                      <button
                        onClick={() => handleSaveRename(p.id)}
                        className="p-1 rounded bg-emerald-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded bg-slate-800 text-slate-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{p.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(p.id, p.title);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-indigo-300 transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 font-mono truncate">foliocraft.ai/p/{p.slug}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-200">{(p.projects || []).length}</span> projects
                    <span>•</span>
                    <span className="font-semibold text-slate-200">{(p.skills || []).length}</span> skills
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicatePortfolio(p.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Duplicate Set"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {portfolios.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePortfolio(p.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePortfolioId(p.id);
                        onOpenBuilder();
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs ml-1 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
