import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { CustomSection, CustomSectionItem } from '../../../types/portfolio';
import {
  FolderPlus,
  Plus,
  Trash2,
  ExternalLink,
  LayoutGrid,
  List,
  Clock,
  AlignLeft,
  Calendar,
  Sparkles,
  Check,
} from 'lucide-react';

interface CustomSectionEditorProps {
  sectionId: string;
}

export const CustomSectionEditor: React.FC<CustomSectionEditorProps> = ({ sectionId }) => {
  const { activePortfolio, updatePortfolio, deleteCustomSection } = usePortfolio();
  
  const customSection = (activePortfolio.customSections || []).find((s) => s.id === sectionId) || {
    id: sectionId,
    title: 'Custom Section',
    layoutType: 'cards' as const,
    items: [],
    enabled: true,
  };

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSubtitle, setNewItemSubtitle] = useState('');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemLink, setNewItemLink] = useState('');

  const updateCurrentSection = (updates: Partial<CustomSection>) => {
    updatePortfolio((prev) => {
      const existing = prev.customSections || [];
      const updatedList = existing.map((s) => (s.id === sectionId ? { ...s, ...updates } : s));
      return {
        ...prev,
        customSections: updatedList,
      };
    });
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    const item: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle.trim(),
      subtitle: newItemSubtitle.trim() || undefined,
      date: newItemDate.trim() || undefined,
      description: newItemDescription.trim() || undefined,
      link: newItemLink.trim() || undefined,
    };

    updateCurrentSection({
      items: [...(customSection.items || []), item],
    });

    setNewItemTitle('');
    setNewItemSubtitle('');
    setNewItemDate('');
    setNewItemDescription('');
    setNewItemLink('');
  };

  const handleUpdateItem = (itemId: string, updates: Partial<CustomSectionItem>) => {
    const updatedItems = (customSection.items || []).map((i) => (i.id === itemId ? { ...i, ...updates } : i));
    updateCurrentSection({ items: updatedItems });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = (customSection.items || []).filter((i) => i.id !== itemId);
    updateCurrentSection({ items: updatedItems });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Custom Section
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">{customSection.title || 'Untitled Section'}</h2>
          <p className="text-xs text-slate-400">Configure layout style, items, links, and content</p>
        </div>

        <button
          onClick={() => deleteCustomSection(sectionId)}
          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Section</span>
        </button>
      </div>

      {/* Section Title & Layout Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section Display Title</label>
          <input
            type="text"
            value={customSection.title}
            onChange={(e) => updateCurrentSection({ title: e.target.value })}
            placeholder="e.g. Publications, Volunteer Work, Awards, Services"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Layout Presentation Style</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'cards', label: 'Cards', icon: LayoutGrid },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'list', label: 'List', icon: List },
              { id: 'text', label: 'Text', icon: AlignLeft },
            ].map((layout) => {
              const Icon = layout.icon;
              const isSelected = (customSection.layoutType || 'cards') === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => updateCurrentSection({ layoutType: layout.id as any })}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{layout.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text / Markdown content if layoutType is 'text' */}
      {customSection.layoutType === 'text' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Custom Section Content</label>
          <textarea
            rows={6}
            value={customSection.content || ''}
            onChange={(e) => updateCurrentSection({ content: e.target.value })}
            placeholder="Write your custom section paragraphs or markdown text here..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>
      )}

      {/* Item creation box (for cards, timeline, list) */}
      {customSection.layoutType !== 'text' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Add New Item / Entry to {customSection.title}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Item Title (e.g. Research Paper, Award Name, Service)"
              className="px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              value={newItemSubtitle}
              onChange={(e) => setNewItemSubtitle(e.target.value)}
              placeholder="Subtitle / Organization (Optional)"
              className="px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newItemDate}
              onChange={(e) => setNewItemDate(e.target.value)}
              placeholder="Date / Tag / Badge (e.g. 2025 or IEEE Conference)"
              className="px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <input
              type="text"
              value={newItemLink}
              onChange={(e) => setNewItemLink(e.target.value)}
              placeholder="Link URL (e.g. https://doi.org/... or https://...)"
              className="px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
            />
          </div>

          <textarea
            rows={2}
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            placeholder="Description or key takeaways..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!newItemTitle.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing Items List */}
      {customSection.layoutType !== 'text' && (
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Current Entries ({(customSection.items || []).length})
          </label>

          {(customSection.items || []).length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
              No items added to this section yet. Fill the form above to add your first entry.
            </div>
          ) : (
            <div className="space-y-3">
              {(customSection.items || []).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{item.title}</span>
                      {item.date && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-indigo-300">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>}
                    {item.description && <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline font-mono"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.link}</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors self-end sm:self-auto shrink-0"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
