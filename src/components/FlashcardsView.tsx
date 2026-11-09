import React, { useState, useEffect } from 'react';
import {
  Rotate3d,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Check,
  Copy,
  Layers,
  List,
  Sparkles,
  CheckCircle,
  Clock,
  Code,
} from 'lucide-react';
import { Flashcard } from '../types/studyKit';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards }) => {
  const [deck, setDeck] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'deck' | 'list' | 'json'>('deck');
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync if new flashcards arrive
  useEffect(() => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, deck.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  };

  const toggleMastered = (idx: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const copyJson = () => {
    const jsonStr = JSON.stringify(flashcards, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const currentCard = deck[currentIndex] || deck[0];
  const isCurrentMastered = masteredIds.has(currentIndex);
  const masteryPercentage = Math.round((masteredIds.size / deck.length) * 100);

  return (
    <div className="space-y-6">
      {/* View Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Interactive Flashcard Set</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {deck.length} terms & concepts strictly extracted from source text (5-10 cards)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Deck / List / JSON Switcher */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-700">
            <button
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                viewMode === 'deck'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deck Mode
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                viewMode === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON View
            </button>
          </div>
        </div>
      </div>

      {/* DECK MODE */}
      {viewMode === 'deck' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Progress & Stats */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">
                Card {currentIndex + 1} of {deck.length}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {masteredIds.size} Mastered ({masteryPercentage}%)
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Space</kbd> Flip
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">←</kbd> Prev
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">→</kbd> Next
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 cursor-pointer select-none group min-h-[300px] sm:min-h-[340px] flex items-center justify-center"
          >
            <div
              className={`w-full relative transition-transform duration-500 preserve-3d rounded-3xl p-8 border text-center shadow-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[340px] ${
                isFlipped
                  ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border-indigo-500/40'
                  : 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {/* Card Top Label */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-indigo-400 text-[11px]">
                  {isFlipped ? 'Definition / Answer' : 'Term / Question'}
                </span>
                <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>Click to flip</span>
                </span>
              </div>

              {/* Card Main Content */}
              <div className="py-6 flex-1 flex items-center justify-center px-4">
                <p
                  className={`text-xl sm:text-2xl font-bold leading-relaxed tracking-tight ${
                    isFlipped
                      ? 'text-slate-100 font-normal sm:text-xl'
                      : 'text-white'
                  }`}
                >
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              {/* Card Bottom Hint */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{isCurrentMastered ? '✓ Marked Mastered' : '○ Reviewing'}</span>
                <span className="text-[11px] text-slate-400">Strictly Source-Grounded</span>
              </div>
            </div>
          </div>

          {/* Deck Navigation & Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Previous Card (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Mark Mastered / Learning Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleMastered(currentIndex)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-2 ${
                  isCurrentMastered
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCurrentMastered ? 'Mastered!' : 'Mark as Mastered'}</span>
              </button>

              <button
                onClick={handleShuffle}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Shuffle Deck"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Reset Deck & Mastery"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Next Card (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deck.map((card, idx) => {
              const isMastered = masteredIds.has(idx);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    isMastered
                      ? 'bg-slate-900/90 border-emerald-500/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      Card #{idx + 1}
                    </span>
                    <button
                      onClick={() => toggleMastered(idx)}
                      className={`text-xs px-2 py-0.5 rounded-md border transition flex items-center space-x-1 ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isMastered ? 'Mastered' : 'Mark'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Front (Term / Question)
                      </div>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {card.front}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Back (Definition / Answer)
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {card.back}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JSON VIEW (Strictly matching user requirement 3) */}
      {viewMode === 'json' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Code className="w-4 h-4" />
              <span>Clean JSON Array (Frontend Parsable)</span>
            </div>
            <button
              onClick={copyJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-900/90 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            {JSON.stringify(flashcards, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
