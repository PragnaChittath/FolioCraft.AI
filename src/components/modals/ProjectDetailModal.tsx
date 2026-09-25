import React from 'react';
import { ProjectItem } from '../../types/portfolio';
import { X, ExternalLink, Github, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {project.category || 'Featured'}
            </span>
            {project.stars !== undefined && project.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {project.stars} GitHub Stars
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h2>

          {project.subtitle && (
            <p className="text-sm font-medium text-indigo-400">{project.subtitle}</p>
          )}
        </div>

        {/* Gallery / Cover Image */}
        {project.coverImage && (
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Video Walkthrough Embed if provided */}
        {project.demoVideoUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Video Demo</h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={project.demoVideoUrl}
                title={project.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Description & Impact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Project Overview</h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
            {project.longDescription || project.description}
          </p>

          {project.metrics && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{project.metrics}</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tech Stack & Architecture</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live App</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
