import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Copy, RefreshCw, X, Wand2 } from 'lucide-react';
import { TargetRole } from '../../types/portfolio';

interface AIContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'about-me' | 'headline' | 'project-description' | 'career-objective' | 'skill-recommendations' | 'grammar-polish';
  initialPrompt?: string;
  context?: any;
  targetRole?: TargetRole;
  onApply: (generatedContent: string | any) => void;
}

export const AIContentModal: React.FC<AIContentModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  initialPrompt = '',
  context = {},
  targetRole = 'fullstack',
  onApply,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [tone, setTone] = useState<'professional' | 'creative' | 'concise' | 'impactful'>('impactful');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [headlineOptions, setHeadlineOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          prompt,
          context,
          tone,
          targetRole,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate');

      if (data.notice) {
        setNotice(data.notice);
      }

      if (type === 'headline') {
        try {
          const parsed = JSON.parse(data.content);
          if (Array.isArray(parsed)) {
            setHeadlineOptions(parsed);
            setGeneratedResult(parsed[0] || '');
          } else {
            setGeneratedResult(data.content);
          }
        } catch {
          setGeneratedResult(data.content);
        }
      } else {
        setGeneratedResult(data.content);
      }
    } catch (err: any) {
      console.error(err);
      setError('AI service is currently busy. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (contentToApply?: string) => {
    const finalContent = contentToApply || generatedResult;
    onApply(finalContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-xs text-slate-400">Target Role: <span className="text-indigo-300 font-semibold uppercase">{targetRole}</span></p>
          </div>
        </div>

        {/* Input prompt area */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Instructions / Raw Draft / Keywords
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 3 years of React experience, lead redesign of billing platform, cut loading time by 50%..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Tone Selector */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Tone:</span>
              {(['impactful', 'professional', 'concise', 'creative'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded-md text-xs capitalize transition-all ${
                    tone === t ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>{generatedResult ? 'Regenerate' : 'Generate with AI'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        {notice && (
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* AI Results preview */}
        {headlineOptions.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Select a Headline Option:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {headlineOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-indigo-950/40 border border-slate-700/60 hover:border-indigo-500/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  onClick={() => handleApply(opt)}
                >
                  <span className="text-xs sm:text-sm text-slate-200">{opt}</span>
                  <button className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-medium shrink-0">
                    Use this
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : generatedResult ? (
          <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Generated Output
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-line font-sans">
              {generatedResult}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Portfolio</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
