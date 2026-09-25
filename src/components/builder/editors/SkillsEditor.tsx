import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SkillItem } from '../../../types/portfolio';
import { Cpu, Plus, Trash2, Star, Sparkles, Wand2 } from 'lucide-react';
import { AIContentModal } from '../../ai/AIContentModal';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud & DevOps',
  'Languages',
  'AI & Data',
  'Tools & Methods',
  'Soft Skills',
] as const;

export const SkillsEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const skills = activePortfolio.skills || [];

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState<any>('Frontend');
  const [newSkillProf, setNewSkillProf] = useState<number>(85);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const level: any =
      newSkillProf >= 90 ? 'Expert' : newSkillProf >= 75 ? 'Advanced' : newSkillProf >= 50 ? 'Intermediate' : 'Beginner';

    const item: SkillItem = {
      id: `s-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCat,
      proficiency: newSkillProf,
      level,
      highlight: false,
    };

    updatePortfolio((prev) => ({
      ...prev,
      skills: [...prev.skills, item],
    }));

    setNewSkillName('');
  };

  const handleUpdateSkill = (id: string, updates: Partial<SkillItem>) => {
    updatePortfolio((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const handleDeleteSkill = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Skills & Technical Stack</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Add categorized technologies, frameworks, tools, and proficiency metrics</p>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>✨ AI Skill Recommender</span>
        </button>
      </div>

      {/* Add New Skill Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Add New Skill
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="e.g. Next.js, Docker, PyTorch"
            className="sm:col-span-2 lg:col-span-2 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={newSkillCat}
            onChange={(e) => setNewSkillCat(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSkill}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Existing Skills List */}
      <div className="space-y-3 min-w-0">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Configured Skills ({skills.length})</span>
          <span>Click star to highlight</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((s) => (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all min-w-0 ${
                s.highlight
                  ? 'bg-indigo-600/10 border-indigo-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-100 truncate">{s.name}</div>
                  <div className="text-[11px] text-indigo-400 truncate">{s.category}</div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUpdateSkill(s.id, { highlight: !s.highlight })}
                    className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                      s.highlight ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={s.highlight ? 'Remove Highlight' : 'Highlight as Key Skill'}
                  >
                    <Star className={`w-4 h-4 ${s.highlight ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slider for proficiency */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Proficiency</span>
                  <span className="font-mono font-semibold text-slate-200">{s.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={s.proficiency}
                  onChange={(e) => {
                    const prof = Number(e.target.value);
                    const lvl: any =
                      prof >= 90 ? 'Expert' : prof >= 75 ? 'Advanced' : prof >= 50 ? 'Intermediate' : 'Beginner';
                    handleUpdateSkill(s.id, { proficiency: prof, level: lvl });
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIContentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="AI In-Demand Skill Recommendations"
        type="skill-recommendations"
        initialPrompt={skills.map((s) => s.name).join(', ')}
        targetRole={activePortfolio.targetRole}
        onApply={(raw) => {
          try {
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            const newSkillsToAdd: SkillItem[] = [];
            Object.entries(parsed).forEach(([cat, list]: any) => {
              if (Array.isArray(list)) {
                list.forEach((itemStr) => {
                  if (!skills.some((existing) => existing.name.toLowerCase() === itemStr.toLowerCase())) {
                    newSkillsToAdd.push({
                      id: `s-rec-${Date.now()}-${Math.random()}`,
                      name: itemStr,
                      category: (cat === 'frontend' ? 'Frontend' : cat === 'backend' ? 'Backend' : cat === 'databases' ? 'Database' : cat === 'cloudDevops' ? 'Cloud & DevOps' : 'Tools & Methods') as any,
                      proficiency: 85,
                      level: 'Advanced',
                    });
                  }
                });
              }
            });
            if (newSkillsToAdd.length > 0) {
              updatePortfolio((prev) => ({
                ...prev,
                skills: [...prev.skills, ...newSkillsToAdd],
              }));
            }
          } catch (e) {
            console.error('Error applying AI skills', e);
          }
        }}
      />
    </div>
  );
};
