import React, { useState } from 'react';
import { Volume2, VolumeX, Check, Copy, BookOpen, Lightbulb } from 'lucide-react';
import { KeyConcept } from '../types/studyKit';

interface KeyConceptsViewProps {
  concepts: KeyConcept[];
  overview?: string;
}

export const KeyConceptsView: React.FC<KeyConceptsViewProps> = ({ concepts, overview }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSpeech = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) return;

    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    setPlayingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      {overview && (
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 sm:p-6 text-slate-200">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>High-Yield Synthesis</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            {overview}
          </p>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Core Concepts & Plain-Language Summaries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {concepts.length} key concepts extracted strictly from your source material
          </p>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((item, idx) => (
          <div
            key={idx}
            className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              {/* Concept Number & Actions */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  Concept #{idx + 1}
                </span>

                <div className="flex items-center space-x-1">
                  {/* TTS Audio */}
                  {'speechSynthesis' in window && (
                    <button
                      onClick={() =>
                        handleSpeech(`${item.concept}. ${item.explanation}`, idx)
                      }
                      title={playingIndex === idx ? 'Stop narration' : 'Listen to narration'}
                      className={`p-1.5 rounded-lg text-xs transition ${
                        playingIndex === idx
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {playingIndex === idx ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Copy */}
                  <button
                    onClick={() =>
                      handleCopy(`${item.concept}\n${item.explanation}`, idx)
                    }
                    title="Copy concept"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Concept Title */}
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                {item.concept}
              </h3>

              {/* Explanation in 2-3 plain sentences */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.explanation}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Plain & concise summary</span>
              <span className="font-mono">Exam Focus</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
