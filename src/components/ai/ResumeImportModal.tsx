import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportExtractedData: (extractedData: any) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  onImportExtractedData,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFileData({
        base64: base64String,
        mimeType: file.type || 'application/pdf',
        name: file.name,
      });
    };
    reader.onerror = () => {
      setError('Failed reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleParse = async () => {
    if (!resumeText.trim() && !fileData) {
      setError('Please provide raw resume text or upload a PDF/Document.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim() || undefined,
          fileData: fileData ? fileData.base64 : undefined,
          mimeType: fileData ? fileData.mimeType : undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed parsing resume');

      setPreviewResult(data.extractedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error parsing resume');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!previewResult) return;
    onImportExtractedData(previewResult);
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
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Smart Resume-to-Portfolio Import</h2>
            <p className="text-xs text-slate-400">
              Extract projects, work experience, education, and skills with Gemini AI
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!previewResult ? (
          <div className="space-y-5">
            {/* File upload zone */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-950/40 text-center space-y-3 transition-colors">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <label className="cursor-pointer text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                  <span>Upload your resume (PDF, DOCX, TXT)</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500 mt-0.5">Supports PDF and plain text resume files</p>
              </div>

              {fileData && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 font-mono">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>{fileData.name}</span>
                </div>
              )}
            </div>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <span className="relative px-3 bg-slate-900 text-xs uppercase font-semibold text-slate-500">Or Paste Text</span>
            </div>

            {/* Paste resume text */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Paste Resume / LinkedIn Profile Text:
              </label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume sections (Profile, Experience, Education, Projects, Skills) here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleParse}
                disabled={loading || (!resumeText && !fileData)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Analyzing with AI...' : 'Parse & Extract Sections'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Preview Extracted Data */
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> AI successfully parsed your resume!
              </span>
              <button
                onClick={() => setPreviewResult(null)}
                className="text-slate-400 hover:text-white underline text-xs"
              >
                Re-upload
              </button>
            </div>

            {/* Profile summary */}
            {previewResult.profile && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Profile</h4>
                <div className="text-base font-bold text-slate-100">{previewResult.profile.fullName}</div>
                <div className="text-xs text-indigo-400 font-medium">{previewResult.profile.title}</div>
                <p className="text-xs text-slate-300 line-clamp-2">{previewResult.profile.about}</p>
              </div>
            )}

            {/* Counts summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xl font-bold text-indigo-400">{previewResult.projects?.length || 0}</div>
                <div className="text-[11px] text-slate-400">Projects</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xl font-bold text-emerald-400">{previewResult.experiences?.length || 0}</div>
                <div className="text-[11px] text-slate-400">Experiences</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xl font-bold text-cyan-400">{previewResult.skills?.length || 0}</div>
                <div className="text-[11px] text-slate-400">Skills</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xl font-bold text-amber-400">{previewResult.education?.length || 0}</div>
                <div className="text-[11px] text-slate-400">Education</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Import Into Portfolio Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
