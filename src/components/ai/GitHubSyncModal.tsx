import React, { useState } from 'react';
import {
  Github,
  Star,
  GitFork,
  Loader2,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProjects: (projects: ProjectItem[]) => void;
  initialUsername?: string;
}

function cleanGitHubInput(input: string): string {
  if (!input) return '';
  let str = input.trim();
  str = str.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '');
  str = str.split('?')[0].split('#')[0];
  str = str.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
  const parts = str.split('/');
  return parts[0] ? parts[0].trim() : '';
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onAddProjects,
  initialUsername = '',
}) => {
  const [username, setUsername] = useState(initialUsername || 'octocat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleFetch = async () => {
    const sanitized = cleanGitHubInput(username);
    if (!sanitized) {
      setError('Please enter a valid GitHub username or profile URL.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: sanitized }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed fetching GitHub profile');

      setProfileData(data.profile);
      setRepos(data.projects || []);
      // Preselect top 3 by default
      const initialSelected = new Set<string>((data.projects || []).slice(0, 4).map((p: any) => p.id));
      setSelectedRepoIds(initialSelected);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'GitHub fetch error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedRepoIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRepoIds(next);
  };

  const handleConfirmAdd = () => {
    const chosen = repos.filter((r) => selectedRepoIds.has(r.id));
    if (chosen.length > 0) {
      onAddProjects(chosen);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-slate-800 text-white border border-slate-700">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Import Repositories from GitHub</h2>
            <p className="text-xs text-slate-400">
              Fetch your public repos, stars, and languages to automatically create portfolio project cards
            </p>
          </div>
        </div>

        {/* Username input & Search button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="Enter GitHub username or URL (e.g. PragnaChittath or https://github.com/...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading || !username.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            <span>Fetch Repos</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User profile card */}
        {profileData && (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700"
              />
              <div>
                <div className="font-bold text-sm text-slate-100">{profileData.name}</div>
                <div className="text-xs text-slate-400 font-mono">@{profileData.username}</div>
                {profileData.bio && <div className="text-xs text-slate-300 line-clamp-1 mt-0.5">{profileData.bio}</div>}
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono shrink-0">
              <div>{profileData.publicRepos} Public Repos</div>
              <div>{profileData.followers} Followers</div>
            </div>
          </div>
        )}

        {/* Repos list */}
        {repos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">
                Select Projects to Import ({selectedRepoIds.size} of {repos.length}):
              </span>
              <button
                onClick={() => {
                  if (selectedRepoIds.size === repos.length) setSelectedRepoIds(new Set());
                  else setSelectedRepoIds(new Set(repos.map((r) => r.id)));
                }}
                className="text-indigo-400 hover:underline"
              >
                {selectedRepoIds.size === repos.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {repos.map((repo) => {
                const isSelected = selectedRepoIds.has(repo.id);
                return (
                  <div
                    key={repo.id}
                    onClick={() => toggleSelect(repo.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm truncate">{repo.title}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{repo.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                      <span className="text-indigo-300">{repo.category}</span>
                      <div className="flex items-center gap-2">
                        {repo.stars > 0 && (
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {repo.stars}
                          </span>
                        )}
                        {repo.forks > 0 && (
                          <span className="flex items-center gap-0.5">
                            <GitFork className="w-3 h-3" />
                            {repo.forks}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                disabled={selectedRepoIds.size === 0}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Import {selectedRepoIds.size} Projects</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
