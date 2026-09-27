import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Copy, RefreshCw, X, Wand2, Info } from 'lucide-react';
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

function getLocalContentFallback(type: string, prompt: string, targetRole: string): string {
  const role = targetRole || 'Software Professional';
  const raw = (prompt || '').trim();

  switch (type) {
    case 'about-me':
      if (raw.length > 20) {
        return `I am a dedicated ${role} specializing in building robust, performant, and user-centric digital experiences. ${raw}\n\nDriven by continuous learning and architectural clarity, I enjoy collaborating with cross-functional engineering teams to transform complex requirements into scalable, clean solutions.`;
      }
      return `I am an ambitious and detail-oriented ${role} with a deep passion for building high-performance, accessible, and scalable digital solutions. With a proven foundation in modern software development and engineering best practices, I excel at transforming complex business requirements into elegant, user-centric architectures. I thrive in collaborative environments celebrating code quality and continuous learning.`;

    case 'headline':
      return JSON.stringify([
        `${role} | Crafting High-Velocity Web Apps & Scalable Systems`,
        `Modern ${role} specializing in Scalable Architecture & Clean Code`,
        `Passionate ${role} | Building Scalable, Modern & High-Performance Solutions`,
        `Full-Lifecycle ${role} | Dedicated to Engineering Excellence & UX`,
        `Driven ${role} with a Track Record of Delivering High-Impact Products`,
      ]);

    case 'project-description':
      if (raw.length > 15) {
        return `Architected and deployed ${raw}.\n\n• Designed modular components with clean separation of concerns and robust data validation.\n• Optimized frontend state management and API latency, ensuring sub-second response times under load.\n• Implemented secure authentication, automated testing pipelines, and responsive cross-device UI.\n• Deployed on cloud infrastructure with automated CI/CD workflows and monitoring telemetry.`;
      }
      return `Architected and developed a full-stack solution utilizing modern engineering standards to address real-world workflows.\n\n• Designed modular system architecture with clean separation of concerns and robust data validation.\n• Optimized frontend state management and API latency, ensuring sub-second response times under load.\n• Implemented secure authentication, automated testing pipelines, and responsive cross-device UI.\n• Deployed on cloud infrastructure with automated CI/CD workflows and monitoring telemetry.`;

    case 'career-objective':
      return `Dedicated and forward-thinking ${role} aiming to leverage robust system architecture, clean design patterns, and collaborative engineering skills to deliver scalable, business-critical solutions in an innovative tech environment.`;

    case 'skill-recommendations':
      return JSON.stringify({
        frontend: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'State Management', 'Vite'],
        backend: ['Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs', 'GraphQL'],
        databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
        cloudDevops: ['Docker', 'Kubernetes', 'AWS (S3, Lambda)', 'CI/CD Pipelines', 'GitHub Actions'],
        tools: ['Git', 'Postman', 'Figma', 'Jest / Vitest', 'Linux'],
      });

    case 'grammar-polish':
      if (raw) {
        return raw
          .replace(/\bi am\b/gi, 'I am')
          .replace(/\bexperience in\b/gi, 'expertise across')
          .replace(/\bworked on\b/gi, 'spearheaded the development of')
          .replace(/\bmade\b/gi, 'engineered')
          .replace(/\bresponsible for\b/gi, 'led the execution of');
      }
      return 'Engineered high-scale, production-ready software solutions with focus on performance, reliability, and maintainability.';

    default:
      return raw || 'Successfully engineered scalable, performant software applications.';
  }
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
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
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
      if (data.success && data.content) {
        if (data.notice || data.isFallback) {
          setNotice(data.notice || 'Generated via Smart Career Engine.');
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
      } else {
        throw new Error(data.error || 'Server returned invalid response');
      }
    } catch (err: any) {
      console.warn('Using client-side smart career content fallback:', err);
      const fallback = getLocalContentFallback(type, prompt, targetRole);
      setNotice('Generated via built-in Smart Career Engine (offline-resilient mode).');

      if (type === 'headline') {
        try {
          const parsed = JSON.parse(fallback);
          if (Array.isArray(parsed)) {
            setHeadlineOptions(parsed);
            setGeneratedResult(parsed[0] || '');
          } else {
            setGeneratedResult(fallback);
          }
        } catch {
          setGeneratedResult(fallback);
        }
      } else {
        setGeneratedResult(fallback);
      }
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
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
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
              <span>{generatedResult ? 'Regenerate' : 'Generate Content'}</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-[11px] text-indigo-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
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
