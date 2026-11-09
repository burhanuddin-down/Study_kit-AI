import React from 'react';
import { BookOpen, Sparkles, History, HelpCircle, ShieldCheck, Compass } from 'lucide-react';
import { SAMPLE_MATERIALS, SampleMaterial } from '../sampleData';

interface HeaderProps {
  onSelectSample: (sample: SampleMaterial) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onNewKit: () => void;
  hasActiveKit: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onOpenHistory,
  historyCount,
  onNewKit,
  hasActiveKit,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewKit}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                StudyKit AI
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Tutor & Exam Prep
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn notes & documents into structured study guides & flashcards
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Sample Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 hover:text-white rounded-lg border border-slate-700 transition">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Try Samples</span>
              <span className="md:hidden">Samples</span>
            </button>
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 hidden group-hover:block z-50 animate-fadeIn">
              <p className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Preloaded Academic Material
              </p>
              {SAMPLE_MATERIALS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-700 text-xs text-slate-200 transition flex items-start space-x-2"
                >
                  <span className="text-indigo-400 font-medium">[{sample.subject}]</span>
                  <span className="truncate">{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 hover:text-white rounded-lg border border-slate-700 transition"
            title="Saved Study Kits"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">My Kits</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Kit Button */}
          {hasActiveKit && (
            <button
              onClick={onNewKit}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Material</span>
            </button>
          )}

          {/* Trust Guarantee badge */}
          <div className="hidden lg:flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Grounding</span>
          </div>
        </div>
      </div>
    </header>
  );
};
