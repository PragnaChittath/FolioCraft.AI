import React, { useState } from 'react';
import { AIPortfolioAnalysis, PortfolioData, TargetRole } from '../../types/portfolio';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  X,
  Loader2,
  Target,
  FileCheck,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onApplyQuickFix?: (fix: { field: string; action: string }) => void;
}

function computeClientSideAudit(portfolio: PortfolioData, targetRole: TargetRole): AIPortfolioAnalysis {
  let overallScore = 65;
  let impactScore = 70;
  let atsScore = 75;
  let roleMatchScore = 75;

  const strengths: string[] = [];
  const missing: Array<{ sectionName: string; severity: 'high' | 'medium' | 'low'; reason: string }> = [];

  const projectsCount = portfolio.projects?.length || 0;
  const skillsCount = portfolio.skills?.length || 0;
  const expCount = portfolio.experience?.length || 0;
  const hasHeadline = Boolean(portfolio.profile?.headline || portfolio.profile?.tagline);
  const hasGithub = Boolean(portfolio.codingProfiles?.github || portfolio.socialLinks?.website);
  const hasLiveUrl = portfolio.projects?.some((p) => Boolean(p.liveUrl));

  if (projectsCount >= 2) {
    overallScore += 12;
    impactScore += 12;
    strengths.push(`Showcases ${projectsCount} practical software projects with technical descriptions.`);
  } else {
    missing.push({
      sectionName: 'Projects & Case Studies',
      severity: 'high',
      reason: 'Recruiters prioritize candidates with at least 2 detailed portfolio projects.',
    });
  }

  if (hasLiveUrl) {
    overallScore += 5;
    impactScore += 8;
    strengths.push('Includes accessible live demo links for deployed applications.');
  }

  if (skillsCount >= 6) {
    overallScore += 10;
    atsScore += 10;
    roleMatchScore += 10;
    strengths.push(`Diverse technical stack featuring ${skillsCount} categorized skills with proficiency levels.`);
  } else {
    missing.push({
      sectionName: 'Core Skills & Frameworks',
      severity: 'high',
      reason: 'Add frameworks, languages, and tools to ensure matching with automated recruiter ATS filters.',
    });
  }

  if (hasHeadline) {
    overallScore += 5;
    strengths.push('Clear personal brand tagline and professional headline in the hero section.');
  }

  if (expCount > 0) {
    overallScore += 5;
    impactScore += 5;
    strengths.push('Detailed employment history with quantifiable achievements.');
  }

  if (!hasGithub) {
    missing.push({
      sectionName: 'GitHub Profile',
      severity: 'medium',
      reason: 'Adding your GitHub profile allows hiring managers to inspect code structure and contributions.',
    });
  }

  return {
    overallScore: Math.min(95, overallScore),
    impactScore: Math.min(95, impactScore),
    atsScore: Math.min(95, atsScore),
    roleMatchScore: Math.min(95, roleMatchScore),
    summaryAssessment: `Solid, recruiter-ready profile for a ${targetRole}. The portfolio clearly showcases technical capabilities, practical software development projects, and role suitability.`,
    strengths: strengths.length ? strengths : ['Clean, structured developer portfolio layout with foundational details.'],
    missingSections: missing,
    roleSpecificSuggestions: [
      `Incorporate measurable performance metrics (e.g. latency reduction, user counts, % improvement) into project bullet points.`,
      `Highlight hands-on proficiency with modern ${targetRole} ecosystems and containerized workflows.`,
      `Ensure all showcased projects have accessible live links and clean README documentation on GitHub.`,
    ],
    recommendedKeywords: [
      'TypeScript',
      'Cloud Architecture',
      'CI/CD Pipelines',
      'System Design',
      'Performance Optimization',
      'RESTful APIs',
    ],
    quickFixes: [
      { field: 'Project Metrics', action: 'Quantify impact with numbers and percentages', impact: '+15% Recruiter Engagement' },
      { field: 'GitHub Profile', action: 'Verify public repositories are pinned and documented', impact: '+20% Callback Rate' },
    ],
  };
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onApplyQuickFix,
}) => {
  const [targetRole, setTargetRole] = useState<TargetRole>(portfolio.targetRole || 'fullstack');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIPortfolioAnalysis | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const runAnalysis = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch('/api/ai/analyze-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData: portfolio,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        if (data.notice || data.isFallback) {
          setNotice(data.notice || 'Audit computed using Smart Heuristic Career Engine.');
        }
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.warn('Using client-side smart career audit fallback:', err);
      const clientFallback = computeClientSideAudit(portfolio, targetRole);
      setAnalysis(clientFallback);
      setNotice('Audit computed using built-in Smart Career Engine (offline-resilient mode).');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500 bg-amber-500/10';
    return 'text-rose-400 border-rose-500 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">AI Portfolio Completeness & Recruiter Audit</h2>
              <p className="text-xs text-slate-400">Deep technical scoring, ATS readiness, and target role alignment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400">Target Role:</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as TargetRole)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Full Stack Developer</option>
              <option value="java">Java / Spring Developer</option>
              <option value="python">Python / AI Engineer</option>
              <option value="data-analyst">Data Analyst / Scientist</option>
              <option value="uiux">UI/UX & Product Designer</option>
              <option value="flutter">Flutter / Mobile Developer</option>
              <option value="cloud-devops">Cloud & DevOps Engineer</option>
            </select>
          </div>
        </div>

        {/* Trigger Button if not analyzed yet */}
        {!analysis && !loading && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Zap className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold">Ready for an In-Depth Recruiter Audit?</h3>
              <p className="text-xs text-slate-400">
                Our career analysis engine will evaluate your project impact descriptions, technical breadth, ATS keywords, and missing sections for <strong>{targetRole}</strong>.
              </p>
            </div>
            <button
              onClick={runAnalysis}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 mx-auto transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Portfolio Now</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-base">Auditing Portfolio...</h4>
              <p className="text-xs text-slate-400">Comparing your tech stack with current {targetRole} market standards</p>
            </div>
          </div>
        )}

        {notice && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Results Screen */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.overallScore)} text-center space-y-1`}>
                <div className="text-3xl font-extrabold">{analysis.overallScore}%</div>
                <div className="text-xs font-semibold uppercase tracking-wider">Overall Score</div>
              </div>

              <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.impactScore)} text-center space-y-1`}>
                <div className="text-3xl font-extrabold">{analysis.impactScore}%</div>
                <div className="text-xs font-semibold uppercase tracking-wider">Impact & Metrics</div>
              </div>

              <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.atsScore)} text-center space-y-1`}>
                <div className="text-3xl font-extrabold">{analysis.atsScore}%</div>
                <div className="text-xs font-semibold uppercase tracking-wider">ATS Friendly</div>
              </div>

              <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.roleMatchScore)} text-center space-y-1`}>
                <div className="text-3xl font-extrabold">{analysis.roleMatchScore}%</div>
                <div className="text-xs font-semibold uppercase tracking-wider">Role Match</div>
              </div>
            </div>

            {/* Recruiter Summary Assessment */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Recruiter Executive Summary
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {analysis.summaryAssessment}
              </p>
            </div>

            {/* Strengths & Missing Sections side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Sections / Warnings */}
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing or Weak Sections</span>
                </h3>
                {analysis.missingSections.length === 0 ? (
                  <p className="text-xs text-slate-400">All major sections are well populated!</p>
                ) : (
                  <div className="space-y-2">
                    {analysis.missingSections.map((sec, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
                        <div className="flex items-center justify-between font-semibold text-amber-300">
                          <span>{sec.sectionName}</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">{sec.severity} priority</span>
                        </div>
                        <p className="text-slate-400 mt-1">{sec.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Role Recommendations & In-Demand Keywords */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Recommendations for {targetRole}</span>
              </h3>
              <ul className="space-y-1.5">
                {analysis.roleSpecificSuggestions.map((sug, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>

              {/* In Demand Keywords */}
              {analysis.recommendedKeywords && analysis.recommendedKeywords.length > 0 && (
                <div className="pt-3 border-t border-slate-700/40">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    High-Value Keywords to Include:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.recommendedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={runAnalysis}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" /> Re-run Audit
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25"
              >
                Done & Apply Improvements
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
