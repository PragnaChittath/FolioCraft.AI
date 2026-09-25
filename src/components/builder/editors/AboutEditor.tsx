import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Sparkles, FileText, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AIContentModal } from '../../ai/AIContentModal';

export const AboutEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const about = activePortfolio.about || {
    summary: '',
    careerObjective: '',
    yearsOfExperience: '',
    completedProjectsCount: '',
    satisfiedClientsCount: '',
    coffeeCount: '',
    highlights: [],
  };

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'about-me' | 'career-objective'>('about-me');
  const [newHighlight, setNewHighlight] = useState('');

  const handleChange = (field: string, value: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    const next = [...(about.highlights || []), newHighlight.trim()];
    handleChange('highlights', next);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (idx: number) => {
    const next = (about.highlights || []).filter((_, i) => i !== idx);
    handleChange('highlights', next);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>About Me & Career Story</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Introduce your journey, technical philosophy, and key career metrics</p>
        </div>

        <button
          onClick={() => {
            setAiModalType('about-me');
            setIsAIModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>✨ Write About Me with AI</span>
        </button>
      </div>

      {/* Main summary */}
      <div className="min-w-0">
        <label className="block text-xs font-semibold text-slate-300 mb-1">About Me Summary</label>
        <textarea
          rows={5}
          value={about.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="I'm a Full Stack Engineer obsessed with performance, clean system design, and intuitive UX..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>

      {/* Career Objective */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
          <label className="text-xs font-semibold text-slate-300">Target Career Objective (ATS Oriented)</label>
          <button
            onClick={() => {
              setAiModalType('career-objective');
              setIsAIModalOpen(true);
            }}
            className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3" /> Generate with AI
          </button>
        </div>
        <textarea
          rows={3}
          value={about.careerObjective || ''}
          onChange={(e) => handleChange('careerObjective', e.target.value)}
          placeholder="Seeking high-impact Senior Full Stack / Tech Lead opportunities where I can drive scalable system architecture..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1 truncate">Years of Exp.</label>
          <input
            type="text"
            value={about.yearsOfExperience || ''}
            onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
            placeholder="5+ or Fresher"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1 truncate">Projects</label>
          <input
            type="text"
            value={about.completedProjectsCount || ''}
            onChange={(e) => handleChange('completedProjectsCount', e.target.value)}
            placeholder="25+"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1 truncate">Collaborations</label>
          <input
            type="text"
            value={about.satisfiedClientsCount || ''}
            onChange={(e) => handleChange('satisfiedClientsCount', e.target.value)}
            placeholder="15+"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1 truncate">Coffee Metric</label>
          <input
            type="text"
            value={about.coffeeCount || ''}
            onChange={(e) => handleChange('coffeeCount', e.target.value)}
            placeholder="1,200+"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Highlights / Bullet points */}
      <div className="space-y-3 pt-2 min-w-0">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Key Strengths & Highlights
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHighlight()}
            placeholder="e.g. Architected serverless pipelines reducing operational latency by 42%"
            className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddHighlight}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-2">
          {(about.highlights || []).map((h, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-200"
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="break-words min-w-0">{h}</span>
              </div>
              <button
                onClick={() => handleRemoveHighlight(idx)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AIContentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title={aiModalType === 'about-me' ? 'Generate About Me Summary' : 'Generate Career Objective'}
        type={aiModalType}
        initialPrompt={aiModalType === 'about-me' ? about.summary : about.careerObjective}
        context={activePortfolio.profile}
        targetRole={activePortfolio.targetRole}
        onApply={(content) => {
          if (aiModalType === 'about-me') {
            handleChange('summary', content);
          } else {
            handleChange('careerObjective', content);
          }
        }}
      />
    </div>
  );
};
