import React from 'react';
import { PortfolioData, ProjectItem } from '../../types/portfolio';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ArrowLeft, Share2 } from 'lucide-react';

interface PublicPortfolioViewProps {
  portfolio: PortfolioData;
  onBackToBuilder: () => void;
  onOpenProjectModal: (project: ProjectItem) => void;
  onOpenShareModal: () => void;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  portfolio,
  onBackToBuilder,
  onOpenProjectModal,
  onOpenShareModal,
}) => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Top Floating Action Bar (Optimized for mobile & desktop) */}
      <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs text-slate-200">
        <button
          onClick={onBackToBuilder}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-medium shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-xs">Studio</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700 shrink-0 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-1.5 font-mono text-slate-400 text-xs truncate max-w-[220px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">{portfolio.slug}</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-700 shrink-0" />

        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-600/30 shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="text-xs">Share</span>
        </button>
      </div>

      {/* Main Fullpage Template Output */}
      <TemplateRenderer
        portfolio={portfolio}
        onOpenProjectModal={onOpenProjectModal}
        isPreviewMode={false}
      />
    </div>
  );
};
