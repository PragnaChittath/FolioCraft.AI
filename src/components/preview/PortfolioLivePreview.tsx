import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ProjectItem } from '../../types/portfolio';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PortfolioLivePreviewProps {
  onOpenProjectModal: (project: ProjectItem) => void;
  onOpenFullscreen: () => void;
}

export const PortfolioLivePreview: React.FC<PortfolioLivePreviewProps> = ({
  onOpenProjectModal,
  onOpenFullscreen,
}) => {
  const { activePortfolio } = usePortfolio();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(100);

  const containerWidths = {
    desktop: 'w-full max-w-[1200px]',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[device];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative min-w-0">
      {/* Device Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              device === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
            title="Desktop Simulator"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              device === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
            title="Tablet Simulator"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              device === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
            title="Mobile Simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 10))}
              className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] w-8 sm:w-10 text-center text-slate-300">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenFullscreen}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Full Screen Preview"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline text-xs font-semibold">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex justify-center items-start bg-slate-950/80 custom-scrollbar min-w-0">
        <div
          className={`transition-all duration-300 ${containerWidths} shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-900`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Mock Browser Topbar when not full desktop */}
          {device !== 'desktop' && (
            <div className="px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 px-3 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-500 truncate text-center">
                foliocraft.ai/p/{activePortfolio.slug}
              </div>
            </div>
          )}

          <TemplateRenderer
            portfolio={activePortfolio}
            onOpenProjectModal={onOpenProjectModal}
            isPreviewMode={true}
          />
        </div>
      </div>
    </div>
  );
};
