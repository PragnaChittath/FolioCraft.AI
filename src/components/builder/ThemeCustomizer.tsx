import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ColorTheme, FontFamily, TemplateId } from '../../types/portfolio';
import { TEMPLATE_METAS, COLOR_PALETTES, FONT_CLASSES } from '../../utils/themeStyles';
import {
  Palette,
  Type,
  Sun,
  Moon,
  Sparkles,
  Layout,
  Check,
  Grid,
} from 'lucide-react';

export const ThemeCustomizer: React.FC = () => {
  const { activePortfolio, updateTheme } = usePortfolio();
  const theme = activePortfolio.theme;

  const colorThemes: ColorTheme[] = ['indigo', 'emerald', 'cyan', 'violet', 'rose', 'amber', 'blue', 'slate'];
  const fontFamilies: FontFamily[] = ['plus-jakarta', 'space-grotesk', 'jetbrains-mono', 'playfair', 'system'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl min-w-0">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
          <Palette className="w-6 h-6 text-indigo-400 shrink-0" />
          <span>Theme & Template Studio</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Select from 8 distinctive layouts, custom color palettes, and typographic styles
        </p>
      </div>

      {/* 1. Template Picker */}
      <div className="space-y-3 min-w-0">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Choose Template Design ({TEMPLATE_METAS.length} Available)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TEMPLATE_METAS.map((tmpl) => {
            const isSelected = theme.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => updateTheme({ templateId: tmpl.id as TemplateId })}
                className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-w-0 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300 truncate">
                      {tmpl.title}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-tight line-clamp-2">{tmpl.subtitle}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 truncate">
                    {tmpl.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Color Scheme & Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        {/* Color Palette */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Accent Color Palette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {colorThemes.map((c) => {
              const isSelected = theme.colorTheme === c;
              const colorBg = {
                indigo: 'bg-indigo-500',
                emerald: 'bg-emerald-500',
                cyan: 'bg-cyan-500',
                violet: 'bg-violet-500',
                rose: 'bg-rose-500',
                amber: 'bg-amber-500',
                blue: 'bg-blue-500',
                slate: 'bg-slate-500',
              }[c];

              return (
                <button
                  key={c}
                  onClick={() => updateTheme({ colorTheme: c })}
                  className={`p-2 sm:p-2.5 rounded-xl border flex items-center gap-1.5 sm:gap-2 capitalize text-xs font-semibold transition-all min-w-0 ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-400 text-white shadow-md'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${colorBg} shrink-0`} />
                  <span className="truncate">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Light / Dark Mode & Background */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 min-w-0">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Color Mode
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateTheme({ darkMode: true })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  theme.darkMode
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 shrink-0" />
                <span>Dark Theme</span>
              </button>
              <button
                onClick={() => updateTheme({ darkMode: false })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  !theme.darkMode
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 shrink-0" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Background Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['mesh', 'grid', 'dots', 'clean'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => updateTheme({ backgroundStyle: style })}
                  className={`py-2 px-2 rounded-lg text-xs capitalize font-medium border transition-all text-center ${
                    theme.backgroundStyle === style
                      ? 'bg-slate-800 border-indigo-400 text-white'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography & Border Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        {/* Typography */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Font Family</span>
          </label>
          <div className="space-y-2">
            {fontFamilies.map((f) => {
              const isSelected = theme.fontFamily === f;
              const meta = FONT_CLASSES[f];
              return (
                <button
                  key={f}
                  onClick={() => updateTheme({ fontFamily: f })}
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                      : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className={meta.fontClass}>{meta.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Border Radius */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Corner Curvature</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'none', label: 'Sharp Corners (0px - Brutalist)', radius: 'rounded-none' },
              { id: 'sm', label: 'Slight Round (4px - Minimal)', radius: 'rounded-sm' },
              { id: 'md', label: 'Standard Round (8px - Modern)', radius: 'rounded-lg' },
              { id: 'lg', label: 'Pill Round (16px - Creative)', radius: 'rounded-2xl' },
            ].map((r) => {
              const isSelected = (theme.borderRadius || 'md') === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => updateTheme({ borderRadius: r.id as any })}
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                      : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="truncate">{r.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
