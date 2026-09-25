import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TargetRole } from '../../types/portfolio';
import {
  Folder,
  FolderPlus,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Download,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

interface SavedSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBuilder: () => void;
  onOpenLiveSite: () => void;
}

export const SavedSetsModal: React.FC<SavedSetsModalProps> = ({
  isOpen,
  onClose,
  onOpenBuilder,
  onOpenLiveSite,
}) => {
  const {
    portfolios,
    activePortfolio,
    activePortfolioId,
    setActivePortfolioId,
    createPortfolio,
    duplicatePortfolio,
    deletePortfolio,
    renamePortfolio,
    saveCurrentAsSet,
    exportPortfolioJSON,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showSaveNewPrompt, setShowSaveNewPrompt] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetRole, setNewSetRole] = useState<TargetRole>('fullstack');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSets = portfolios.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.targetRole && p.targetRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const handleSaveCurrentAsNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetName.trim()) return;
    saveCurrentAsSet(newSetName.trim());
    setNewSetName('');
    setShowSaveNewPrompt(false);
  };

  const handleCreateFreshSet = () => {
    const id = createPortfolio(newSetName.trim() || 'New Portfolio Set', newSetRole);
    setNewSetName('');
    setShowSaveNewPrompt(false);
    onOpenBuilder();
    onClose();
  };

  const handleSelectToEdit = (id: string) => {
    setActivePortfolioId(id);
    onOpenBuilder();
    onClose();
  };

  const handleSelectToView = (id: string) => {
    setActivePortfolioId(id);
    onOpenLiveSite();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Saved Sets</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {portfolios.length} {portfolios.length === 1 ? 'set' : 'sets'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage, rename, duplicate, or switch between your saved portfolio sets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar / Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved sets by name or role..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSaveNewPrompt(!showSaveNewPrompt)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Save Set</span>
            </button>
          </div>
        </div>

        {/* Save New Prompt Collapsible */}
        {showSaveNewPrompt && (
          <div className="p-4 bg-indigo-950/30 border-b border-indigo-500/20 shrink-0 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">Create or Save as New Portfolio Set</span>
              <button
                onClick={() => setShowSaveNewPrompt(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder="e.g. Backend Lead Portfolio 2026"
                className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveCurrentAsNew}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap"
                >
                  Save Current Set
                </button>
                <button
                  type="button"
                  onClick={handleCreateFreshSet}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold whitespace-nowrap"
                >
                  Create Blank
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Sets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredSets.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Folder className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-300">No saved sets found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery ? `No sets matching "${searchQuery}"` : 'Create and save your first portfolio set.'}
              </p>
            </div>
          ) : (
            filteredSets.map((set) => {
              const isActive = set.id === activePortfolioId;
              const isEditing = editingId === set.id;
              const isDeleting = deleteConfirmId === set.id;

              const enabledCount = Object.values(set.enabledSections || {}).filter(Boolean).length;
              const projectCount = (set.projects || []).length;
              const skillCount = (set.skills || []).length;
              const formattedDate = set.updatedAt
                ? new Date(set.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={set.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1 max-w-md">
                            <input
                              type="text"
                              value={editTitle}
                              autoFocus
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(set.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-indigo-500 text-xs sm:text-sm text-white focus:outline-none w-full"
                            />
                            <button
                              onClick={() => handleSaveRename(set.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                              title="Save name"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-white truncate">
                              {set.title}
                            </h3>
                            <button
                              onClick={() => startRename(set.id, set.title)}
                              className="p-1 rounded-md text-slate-500 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                              title="Rename Set"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active Set</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 font-mono text-[10px] text-slate-300 uppercase">
                          {set.targetRole || 'Fullstack'}
                        </span>
                        <span>•</span>
                        <span>{projectCount} projects</span>
                        <span>•</span>
                        <span>{skillCount} skills</span>
                        <span>•</span>
                        <span>{enabledCount} sections</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {isDeleting ? (
                        <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/40 p-1.5 rounded-xl animate-in fade-in">
                          <span className="text-[11px] font-semibold text-rose-300 px-1">Delete set?</span>
                          <button
                            onClick={() => {
                              deletePortfolio(set.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSelectToView(set.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                            title="Preview Live Portfolio"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden md:inline">View</span>
                          </button>

                          <button
                            onClick={() => handleSelectToEdit(set.id)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                            title="Edit in Builder"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => duplicatePortfolio(set.id)}
                            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Duplicate Set"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {portfolios.length > 1 && (
                            <button
                              onClick={() => setDeleteConfirmId(set.id)}
                              className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                              title="Delete Set"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>All portfolio changes are automatically saved to persistent storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
