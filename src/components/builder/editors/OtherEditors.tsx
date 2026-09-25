import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import {
  GraduationCap,
  Award,
  Trophy,
  Terminal,
  Share2,
  BookOpen,
  Quote,
  Heart,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react';

// 1. Internships Editor
export const InternshipsEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const internships = activePortfolio.internships || [];

  const handleAdd = () => {
    const item = {
      id: `intern-${Date.now()}`,
      role: 'Software Developer Intern',
      company: 'Tech Startup Labs',
      location: 'Remote',
      startDate: '2024-05',
      endDate: '2024-08',
      current: false,
      description: 'Worked on front-end components and microservice APIs.',
      learnings: ['Agile sprint planning', 'CI/CD deployment pipelines'],
    };
    updatePortfolio((prev) => ({
      ...prev,
      internships: [item, ...prev.internships],
    }));
  };

  const handleUpdate = (id: string, updates: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      internships: prev.internships.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  };

  const handleDelete = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      internships: prev.internships.filter((i) => i.id !== id),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Internships</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Internship experiences, mentor guidance, and key learnings</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" /> Add Internship
        </button>
      </div>

      <div className="space-y-4">
        {internships.map((intern, idx) => (
          <div key={intern.id || `intern-${idx}`} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-100 truncate">{intern.role}</span>
              <button onClick={() => handleDelete(intern.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={intern.role}
                onChange={(e) => handleUpdate(intern.id, { role: e.target.value })}
                placeholder="Role"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={intern.company}
                onChange={(e) => handleUpdate(intern.id, { company: e.target.value })}
                placeholder="Company"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={`${intern.startDate} - ${intern.endDate}`}
                onChange={(e) => {
                  const [s, end] = e.target.value.split('-');
                  handleUpdate(intern.id, { startDate: s?.trim() || '', endDate: end?.trim() || '' });
                }}
                placeholder="2024-05 - 2024-08"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono sm:col-span-2 md:col-span-1"
              />
            </div>
            <textarea
              rows={2}
              value={intern.description}
              onChange={(e) => handleUpdate(intern.id, { description: e.target.value })}
              placeholder="Internship summary & responsibilities..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Education Editor
export const EducationEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const education = activePortfolio.education || [];

  const handleAdd = () => {
    const item = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'University Name',
      fieldOfStudy: 'Software Engineering',
      startDate: '2021',
      endDate: '2025',
      grade: '3.8 GPA',
      location: 'City, State',
    };
    updatePortfolio((prev) => ({
      ...prev,
      education: [...prev.education, item],
    }));
  };

  const handleUpdate = (id: string, updates: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const handleDelete = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Education</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Degrees, colleges, CGPA, and coursework</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" /> Add Degree
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div key={edu.id || `edu-${idx}`} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-100 truncate">{edu.degree}</span>
              <button onClick={() => handleDelete(edu.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdate(edu.id, { degree: e.target.value })}
                placeholder="Degree (e.g. B.S. in Computer Science)"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleUpdate(edu.id, { institution: e.target.value })}
                placeholder="Institution / University"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => handleUpdate(edu.id, { startDate: e.target.value })}
                placeholder="Start Year"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => handleUpdate(edu.id, { endDate: e.target.value })}
                placeholder="Graduation Year"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={edu.grade || ''}
                onChange={(e) => handleUpdate(edu.id, { grade: e.target.value })}
                placeholder="Grade / CGPA"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Certifications Editor
export const CertificationsEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const certs = activePortfolio.certifications || [];

  const handleAdd = () => {
    const item = {
      id: `cert-${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2024-05',
      credentialId: 'AWS-123456',
    };
    updatePortfolio((prev) => ({
      ...prev,
      certifications: [...prev.certifications, item],
    }));
  };

  const handleUpdate = (id: string, updates: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const handleDelete = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Certifications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Professional cloud, security, and developer credentials</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      <div className="space-y-4">
        {certs.map((c, idx) => (
          <div key={c.id || `cert-${idx}`} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-100 truncate">{c.name}</span>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={c.name}
                onChange={(e) => handleUpdate(c.id, { name: e.target.value })}
                placeholder="Certification Name"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                value={c.issuer}
                onChange={(e) => handleUpdate(c.id, { issuer: e.target.value })}
                placeholder="Issuer (e.g. AWS, Oracle, Google)"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={c.issueDate}
                onChange={(e) => handleUpdate(c.id, { issueDate: e.target.value })}
                placeholder="Issue Date (e.g. 2024-05)"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
              <input
                type="text"
                value={c.credentialId || ''}
                onChange={(e) => handleUpdate(c.id, { credentialId: e.target.value })}
                placeholder="Credential ID / Verification URL"
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Coding Profiles Editor
export const CodingProfilesEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const profiles = activePortfolio.codingProfiles || {};

  const handleUpdate = (field: string, val: string) => {
    let clean = val.trim();
    if (field === 'github') {
      clean = clean.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/^@+/, '').replace(/\/$/, '');
    } else if (field === 'leetcode') {
      clean = clean.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\//i, '').replace(/^@+/, '').replace(/\/$/, '');
    } else if (field === 'codeforces') {
      clean = clean.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//i, '').replace(/^@+/, '').replace(/\/$/, '');
    } else if (field === 'hackerrank') {
      clean = clean.replace(/^(https?:\/\/)?(www\.)?hackerrank\.com\//i, '').replace(/^@+/, '').replace(/\/$/, '');
    }
    updatePortfolio((prev) => ({
      ...prev,
      codingProfiles: {
        ...prev.codingProfiles,
        [field]: clean,
      },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>Coding & Competitive Profiles</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Link your GitHub, LeetCode, Codeforces, HackerRank & Kaggle usernames or URLs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'github', label: 'GitHub Username or URL', placeholder: 'octocat or https://github.com/...' },
          { key: 'leetcode', label: 'LeetCode Username or URL', placeholder: 'alex_code or https://leetcode.com/...' },
          { key: 'codeforces', label: 'Codeforces Handle or URL', placeholder: 'tourist' },
          { key: 'hackerrank', label: 'HackerRank Username or URL', placeholder: 'alex_hack' },
          { key: 'kaggle', label: 'Kaggle Username', placeholder: 'alex_data' },
          { key: 'devpost', label: 'Devpost Profile', placeholder: 'alex_hackathons' },
        ].map((item) => (
          <div key={item.key} className="min-w-0">
            <label className="block text-xs font-semibold text-slate-300 mb-1">{item.label}</label>
            <input
              type="text"
              value={(profiles as any)[item.key] || ''}
              onChange={(e) => handleUpdate(item.key, e.target.value)}
              placeholder={item.placeholder}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Social Links Editor
export const SocialLinksEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const socials = activePortfolio.socialLinks || {};

  const handleUpdate = (field: string, val: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: val.trim(),
      },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>Social Media & Web Profiles</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Connect your professional networks and personal platforms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'linkedin', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/...' },
          { key: 'twitter', label: 'X (Twitter) Profile URL', placeholder: 'https://twitter.com/...' },
          { key: 'medium', label: 'Medium / Substack URL', placeholder: 'https://medium.com/@...' },
          { key: 'website', label: 'Personal Website URL', placeholder: 'https://mywebsite.com' },
          { key: 'dribbble', label: 'Dribbble / Behance URL', placeholder: 'https://dribbble.com/...' },
          { key: 'discord', label: 'Discord Username / Server', placeholder: 'alex#0001' },
        ].map((item) => (
          <div key={item.key} className="min-w-0">
            <label className="block text-xs font-semibold text-slate-300 mb-1">{item.label}</label>
            <input
              type="text"
              value={(socials as any)[item.key] || ''}
              onChange={(e) => handleUpdate(item.key, e.target.value)}
              placeholder={item.placeholder}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Contact Section Editor
export const ContactEditor: React.FC = () => {
  const { activePortfolio, updatePortfolio } = usePortfolio();
  const contact = activePortfolio.contact || {
    email: '',
    phone: '',
    location: '',
    calendlyUrl: '',
    customMessage: '',
    enableDirectForm: true,
  };

  const handleUpdate = (field: string, val: any) => {
    updatePortfolio((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val,
      },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl min-w-0">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>Contact & Inquiries</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Direct contact details and messaging options for recruiters</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => handleUpdate('email', e.target.value)}
            placeholder="alex@devfolio.tech"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
          <input
            type="text"
            value={contact.phone || ''}
            onChange={(e) => handleUpdate('phone', e.target.value)}
            placeholder="+1 (555) 349-2048"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
          />
        </div>
      </div>

      <div className="min-w-0">
        <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Friendly Note</label>
        <textarea
          rows={3}
          value={contact.customMessage || ''}
          onChange={(e) => handleUpdate('customMessage', e.target.value)}
          placeholder="I'm always open to discussing new opportunities, open-source projects, or tech ideas!"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white leading-relaxed"
        />
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
          <input
            type="checkbox"
            checked={contact.enableDirectForm}
            onChange={(e) => handleUpdate('enableDirectForm', e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
          />
          <span>Enable Direct Message Submission Form in Portfolio</span>
        </label>
      </div>
    </div>
  );
};
