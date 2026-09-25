import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Sparkles, User, Image, Link, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { AIContentModal } from '../../ai/AIContentModal';

export const ProfileEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const profile = activePortfolio.profile;

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'headline' | 'grammar-polish'>('headline');

  const handleChange = (field: string, value: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const openAIHeadline = () => {
    setAiModalType('headline');
    setIsAIModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Profile & Hero Section</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Your primary identity, tagline, availability status, and contact links</p>
        </div>

        <button
          onClick={openAIHeadline}
          className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>✨ AI Headline Generator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Alex Rivera"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title</label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Senior Full Stack & Cloud Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="min-w-0">
        <label className="block text-xs font-semibold text-slate-300 mb-1">Catchy Tagline</label>
        <input
          type="text"
          value={profile.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
          placeholder="Building resilient cloud systems & slick developer interfaces."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
          <label className="text-xs font-semibold text-slate-300">Bio / Elevator Pitch</label>
          <button
            onClick={() => {
              setAiModalType('grammar-polish');
              setIsAIModalOpen(true);
            }}
            className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Polish with AI
          </button>
        </div>
        <textarea
          rows={3}
          value={profile.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="5+ years crafting high-scale distributed applications, modern web products, and micro-frontend architectures..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profile.avatarUrl}
              onChange={(e) => handleChange('avatarUrl', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            {profile.avatarUrl && (
              <img src={profile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0" />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status Badge</label>
          <select
            value={profile.availabilityBadge}
            onChange={(e) => handleChange('availabilityBadge', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="open_to_work">Available for Hire (Open to Work)</option>
            <option value="freelancing">Open for Freelance / Consulting</option>
            <option value="seeking_internship">Seeking Internship</option>
            <option value="employed">Currently Employed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="alex@devfolio.tech"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
          <input
            type="text"
            value={profile.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 349-2048"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="min-w-0 sm:col-span-2 md:col-span-1">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button Label</label>
          <input
            type="text"
            value={profile.primaryActionText || ''}
            onChange={(e) => handleChange('primaryActionText', e.target.value)}
            placeholder="View Selected Projects"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Resume / CV Download URL</label>
          <input
            type="text"
            value={profile.resumeUrl || ''}
            onChange={(e) => handleChange('resumeUrl', e.target.value)}
            placeholder="https://example.com/resume.pdf"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>
      </div>

      <AIContentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title={aiModalType === 'headline' ? 'Generate Impactful Headlines' : 'Polish Profile Bio'}
        type={aiModalType}
        initialPrompt={aiModalType === 'headline' ? profile.title : profile.headline}
        context={profile}
        targetRole={activePortfolio.targetRole}
        onApply={(content) => {
          if (aiModalType === 'headline') {
            handleChange('tagline', content);
          } else {
            handleChange('headline', content);
          }
        }}
      />
    </div>
  );
};
