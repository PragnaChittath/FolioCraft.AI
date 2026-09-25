import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ExperienceItem } from '../../../types/portfolio';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const ExperienceEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const experience = activePortfolio.experience || [];
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

  const handleAdd = () => {
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Full Stack Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      type: 'Full-time',
      startDate: '2024-01',
      endDate: 'Present',
      current: true,
      description: 'Led architecture and feature development for customer-facing web applications.',
      achievements: ['Increased platform throughput by 35% through query indexing and Redis caching.'],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    };

    updatePortfolio((prev) => ({
      ...prev,
      experience: [item, ...prev.experience],
    }));
    setExpandedId(item.id);
  };

  const handleUpdate = (id: string, updates: Partial<ExperienceItem>) => {
    updatePortfolio((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const handleDelete = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Work Experience</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Full-time, contract, or freelance software engineering positions</p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div key={exp.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-100 truncate">{exp.role}</h3>
                  <div className="text-xs text-indigo-400 font-medium truncate">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(exp.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-800 space-y-4 bg-slate-950/40 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdate(exp.id, { role: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdate(exp.id, { company: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdate(exp.id, { startDate: e.target.value })}
                        placeholder="2023-01"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => handleUpdate(exp.id, { endDate: e.target.value })}
                        placeholder="Present or 2024-05"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white disabled:opacity-40"
                      />
                    </div>

                    <div className="min-w-0 sm:col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type</label>
                      <select
                        value={exp.type}
                        onChange={(e) => handleUpdate(exp.id, { type: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Overview Description</label>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleUpdate(exp.id, { description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies Used (Comma separated)</label>
                    <input
                      type="text"
                      value={exp.technologies.join(', ')}
                      onChange={(e) =>
                        handleUpdate(exp.id, {
                          technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
