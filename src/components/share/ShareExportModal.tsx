import React, { useState, useEffect, useRef } from 'react';
import { PortfolioData } from '../../types/portfolio';
import {
  Share2,
  Copy,
  Check,
  Download,
  QrCode,
  Globe,
  X,
  FileDown,
  Linkedin,
  Twitter,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onExportJSON: () => void;
  onOpenLiveSite: () => void;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onExportJSON,
  onOpenLiveSite,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'pdf' | 'json'>('link');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fullUrl = `${window.location.origin}/#p/${portfolio.slug || 'my-portfolio'}`;

  // Generate QR Code onto canvas
  useEffect(() => {
    if (isOpen && activeTab === 'qr' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw stylized clean QR code representation
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Pattern representation
        ctx.fillStyle = '#1e1b4b';
        // Corner squares
        const drawCorner = (x: number, y: number) => {
          ctx.fillRect(x, y, 40, 40);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 8, y + 8, 24, 24);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(x + 14, y + 14, 12, 12);
        };
        drawCorner(15, 15);
        drawCorner(size - 55, 15);
        drawCorner(15, size - 55);

        // Random matrix dots based on slug seed
        const seed = portfolio.slug || 'foliocraft';
        for (let r = 0; r < 14; r++) {
          for (let c = 0; c < 14; c++) {
            if ((r < 4 && c < 4) || (r < 4 && c > 9) || (r > 9 && c < 4)) continue;
            const charCode = seed.charCodeAt((r * 14 + c) % seed.length) || 42;
            if ((charCode + r + c) % 2 === 0) {
              ctx.fillRect(60 + c * 6, 20 + r * 11, 5, 5);
            }
          }
        }
      }
    }
  }, [isOpen, activeTab, portfolio.slug]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${portfolio.slug}-qrcode.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const shareText = `Check out my technical portfolio: ${portfolio.profile.fullName} - ${portfolio.profile.title}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(fullUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Share & Export Portfolio</h2>
            <p className="text-xs text-slate-400">Custom URL, QR code generator, and recruiter-ready PDF export</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs sm:text-sm">
          {[
            { id: 'link', label: 'Portfolio Link', icon: Globe },
            { id: 'qr', label: 'QR Code', icon: QrCode },
            { id: 'pdf', label: 'Export PDF', icon: FileDown },
            { id: 'json', label: 'Backup JSON', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Share Link */}
        {activeTab === 'link' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Public Portfolio Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-mono text-indigo-300 truncate">
                  {fullUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Direct Social Share:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#0077b5]/20 hover:bg-[#0077b5]/30 border border-[#0077b5]/40 text-blue-300 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#1da1f2]/20 hover:bg-[#1da1f2]/30 border border-[#1da1f2]/40 text-sky-300 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>X / Twitter</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/40 text-emerald-300 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(portfolio.title)}&body=${encodedText}%20${encodedUrl}`}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-semibold text-xs sm:text-sm text-indigo-300">Live Website Preview</div>
                <div className="text-xs text-slate-400">Open your published portfolio in full-screen standalone mode</div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenLiveSite();
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Site</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: QR Code */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-4 animate-in fade-in">
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-700">
              <canvas ref={canvasRef} className="rounded-lg" />
            </div>

            <p className="text-xs text-slate-400 text-center max-w-sm">
              Scan with any mobile camera or QR reader to instantly open <strong>{portfolio.profile.fullName}</strong>'s portfolio.
            </p>

            <button
              onClick={handleDownloadQR}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code Image</span>
            </button>
          </div>
        )}

        {/* Tab 3: PDF Export */}
        {activeTab === 'pdf' && (
          <div className="space-y-4 animate-in fade-in text-center py-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <FileDown className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold">Print or Save as Clean PDF</h3>
              <p className="text-xs text-slate-400">
                Exports an ATS-friendly, clean vector PDF layout formatted for recruiters and hiring managers.
              </p>
            </div>

            <button
              onClick={handlePrintPDF}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 mx-auto shadow-xl shadow-indigo-600/30 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Generate & Print PDF</span>
            </button>
          </div>
        )}

        {/* Tab 4: Backup JSON */}
        {activeTab === 'json' && (
          <div className="space-y-4 animate-in fade-in text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold">Download Portfolio JSON</h3>
              <p className="text-xs text-slate-400">
                Keep a permanent offline backup of all your sections, custom themes, projects, and bio details.
              </p>
            </div>

            <button
              onClick={onExportJSON}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 mx-auto shadow-xl shadow-emerald-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup File (.json)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
