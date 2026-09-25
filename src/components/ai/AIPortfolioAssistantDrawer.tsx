import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PortfolioData } from '../../types/portfolio';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Trash2,
  Maximize2,
  Minimize2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AIPortfolioAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
}

const PROMPT_SUGGESTIONS = [
  'How do I make my project descriptions sound impressive to recruiters?',
  'What key skills am I missing for my target role?',
  'Give me 3 impactful STAR bullet points for my work experience.',
  'How can I explain my academic or personal projects during an interview?',
  'Suggest a catchy headline for my portfolio.',
];

export const AIPortfolioAssistantDrawer: React.FC<AIPortfolioAssistantDrawerProps> = ({
  isOpen,
  onClose,
  portfolio,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello ${portfolio.profile.fullName.split(' ')[0] || 'there'}! 👋 I'm **FolioBot**, your AI Portfolio & Career Coach.
      
Ask me anything:
• How to improve your project descriptions with the STAR method
• What missing sections or skills will impress recruiters for **${portfolio.targetRole || 'developer'}** roles
• Bullet points and elevator pitches tailored to your background!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          portfolioContext: {
            name: portfolio.profile.fullName,
            title: portfolio.profile.title,
            targetRole: portfolio.targetRole,
            skillsCount: portfolio.skills.length,
            projectsCount: portfolio.projects.length,
            experienceCount: portfolio.experience.length,
          },
          targetRole: portfolio.targetRole,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to get response');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I ran into an issue answering your question. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content: `Chat cleared! How can I assist with your portfolio today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-slate-900 border border-slate-800 text-slate-100 ${
        isExpanded
          ? 'inset-4 sm:inset-10 rounded-2xl'
          : 'bottom-4 right-4 w-[95vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>FolioBot AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-400">Your 24/7 Tech Career & Portfolio Coach</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}
              <div
                className={`text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>FolioBot is crafting your advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested questions:</span>
          </div>
          <div className="flex flex-nowrap overflow-x-auto gap-1.5 pb-1 no-scrollbar">
            {PROMPT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/90 rounded-b-2xl flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FolioBot anything about your portfolio..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
