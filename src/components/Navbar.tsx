import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  Edit3,
  Share2,
  TrendingUp,
  Bot,
  LogOut,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'builder' | 'live';
  onChangeView: (view: 'dashboard' | 'builder' | 'live') => void;
  onOpenAIAnalysis: () => void;
  onOpenAIChat: () => void;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  onOpenAIAnalysis,
  onOpenAIChat,
  onOpenShareModal,
}) => {
  const { saveStatus, completenessScore } = usePortfolio();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-slate-950 text-slate-100 shadow-md">
      {/* Top Header: App Name ONLY on the left, Sign In / User Profile ONLY on the right */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: App Name / Logo ONLY */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => onChangeView('dashboard')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                FolioCraft<span className="text-indigo-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 -mt-1 hidden sm:block">
                Professional Portfolio Studio
              </span>
            </div>
          </div>

          {/* Right: Sign In / User Account ONLY */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div
                  onClick={openAuthModal}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  title={`Account: ${user.name} (${user.email})`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Responsive Navigation & Tools Bar (Below App Name) */}
      <div className="w-full bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Primary View Switchers: Dashboard, Builder, Live Preview */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onChangeView('builder')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'builder'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Builder"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Builder</span>
            </button>

            <button
              onClick={() => onChangeView('live')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'live'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Preview Live Site"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview</span>
            </button>
          </div>

          {/* Action Toolbar Tools: Auto-save status, AI Recruiter Audit, AI Copilot, Share & QR */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {/* Auto Save Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Auto Saved</span>
                </>
              )}
            </div>

            {/* AI Recruiter Audit */}
            <button
              onClick={onOpenAIAnalysis}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors"
              title="AI Recruiter Audit"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{completenessScore}% Audit</span>
            </button>

            {/* AI Copilot Assistant */}
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-sm transition-all"
              title="FolioBot AI Copilot"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">AI Copilot</span>
            </button>

            {/* Share & QR Export */}
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-colors"
              title="Share & Export"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
