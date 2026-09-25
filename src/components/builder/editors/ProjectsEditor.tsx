import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProjectItem } from '../../../types/portfolio';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ExternalLink,
  Github,
  Star,
  Video,
  Image,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AIContentModal } from '../../ai/AIContentModal';

export const ProjectsEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const projects = activePortfolio.projects || [];

  const [editingId, setEditingId] = useState<string | null>(projects[0]?.id || null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeProjectForAI, setActiveProjectForAI] = useState<ProjectItem | null>(null);

  const handleUpdateProject = (id: string, updates: Partial<ProjectItem>) => {
    updatePortfolio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      subtitle: 'Modern Web Application',
      description: 'A cutting-edge software application solving real-world challenges.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      technologies: ['React', 'TypeScript', 'TailwindCSS'],
      category: 'Web',
      featured: true,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/repo',
      metrics: 'Over 1,000+ active users with 99.9% uptime',
    };
    updatePortfolio((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    setEditingId(newProj.id);
  };

  const handleDeleteProject = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const handleOpenAIDesc = (proj: ProjectItem) => {
    setActiveProjectForAI(proj);
    setIsAIModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Projects & Case Studies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Showcase your apps, live demos, GitHub repositories, and quantifiable impact</p>
        </div>

        <button
          onClick={handleAddProject}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => {
          const isExpanded = editingId === proj.id;

          return (
            <div
              key={proj.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
            >
              {/* Collapsed Header Bar */}
              <div
                onClick={() => setEditingId(isExpanded ? null : proj.id)}
                className="p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {proj.coverImage ? (
                    <img src={proj.coverImage} alt={proj.title} className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover ring-1 ring-slate-700 shrink-0" />
                  ) : (
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 truncate">{proj.title}</span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-indigo-400 font-mono truncate">{proj.category} • {proj.technologies.slice(0, 3).join(', ')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(proj.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-800 space-y-4 bg-slate-950/40 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(proj.id, { title: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / One-liner</label>
                      <input
                        type="text"
                        value={proj.subtitle || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { subtitle: e.target.value })}
                        placeholder="Real-time distributed metrics collector"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-300">Project Description (STAR Method)</label>
                      <button
                        onClick={() => handleOpenAIDesc(proj)}
                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Sparkles className="w-3 h-3" /> ✨ Enhance with AI STAR formula
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(proj.id, { description: e.target.value })}
                      placeholder="Designed and deployed an automated system handling..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={proj.category}
                        onChange={(e) => handleUpdateProject(proj.id, { category: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Web">Web Application</option>
                        <option value="Mobile">Mobile Application</option>
                        <option value="AI/ML">AI & Machine Learning</option>
                        <option value="Cloud">Cloud & DevOps</option>
                        <option value="Open Source">Open Source Tool</option>
                        <option value="UI/UX">UI/UX & Design</option>
                        <option value="Game Dev">Game Development</option>
                      </select>
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Impact / Measurable Metric</label>
                      <input
                        type="text"
                        value={proj.metrics || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { metrics: e.target.value })}
                        placeholder="e.g. 5,000+ active users; 40% latency reduction"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://app.example.com"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="min-w-0 sm:col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Demo Video Embed URL</label>
                      <input
                        type="text"
                        value={proj.demoVideoUrl || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { demoVideoUrl: e.target.value })}
                        placeholder="https://youtube.com/embed/..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                      <input
                        type="text"
                        value={proj.coverImage || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Technologies (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) =>
                          handleUpdateProject(proj.id, {
                            technologies: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Node.js, PostgreSQL"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={proj.featured}
                        onChange={(e) => handleUpdateProject(proj.id, { featured: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
                      />
                      <span>Mark as Featured Project</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeProjectForAI && (
        <AIContentModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          title={`Enhance "${activeProjectForAI.title}" Description`}
          type="project-description"
          initialPrompt={activeProjectForAI.description}
          context={activeProjectForAI}
          targetRole={activePortfolio.targetRole}
          onApply={(content) => {
            handleUpdateProject(activeProjectForAI.id, { description: content });
          }}
        />
      )}
    </div>
  );
};
