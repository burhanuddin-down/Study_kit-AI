/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  Layers,
  FileText,
  Download,
  Printer,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  AlertCircle,
  Compass,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { StudyKit } from './types/studyKit';
import { SampleMaterial } from './sampleData';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { KeyConceptsView } from './components/KeyConceptsView';
import { ExamQuestionsView } from './components/ExamQuestionsView';
import { FlashcardsView } from './components/FlashcardsView';
import { StudyHistoryModal } from './components/StudyHistoryModal';
import { ExportModal } from './components/ExportModal';

const STORAGE_KEY = 'studykit_history_v1';

export default function App() {
  const [activeKit, setActiveKit] = useState<StudyKit | null>(null);
  const [savedKits, setSavedKits] = useState<StudyKit[]>([]);
  const [activeTab, setActiveTab] = useState<'concepts' | 'questions' | 'flashcards' | 'full'>('concepts');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Preset inputs when selecting sample
  const [presetText, setPresetText] = useState('');
  const [presetHint, setPresetHint] = useState('');

  // Load saved kits from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedKits(parsed);
          // Don't auto-open unless user wants, but we keep the kits ready
        }
      }
    } catch (e) {
      console.error('Failed to load study kits from localStorage', e);
    }
  }, []);

  // Save to localStorage when savedKits changes
  const saveKitsToStorage = (kits: StudyKit[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kits));
      setSavedKits(kits);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleGenerate = async (payload: {
    text: string;
    images: { data: string; mimeType: string; name?: string }[];
    subjectHint?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-study-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate study kit.');
      }

      const newKit: StudyKit = data.studyKit;
      setActiveKit(newKit);
      setActiveTab('concepts');

      // Prepend to history
      const updated = [newKit, ...savedKits.filter((k) => k.id !== newKit.id)];
      saveKitsToStorage(updated);
    } catch (err: any) {
      console.error('Error generating kit:', err);
      setError(err.message || 'An error occurred while analyzing the study material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleMaterial) => {
    setPresetText(sample.text);
    setPresetHint(sample.hint);
    setActiveKit(null); // return to upload form with populated content
  };

  const handleDeleteKit = (id: string) => {
    const updated = savedKits.filter((k) => k.id !== id);
    saveKitsToStorage(updated);
    if (activeKit?.id === id) {
      setActiveKit(null);
    }
  };

  const handleClearAllHistory = () => {
    saveKitsToStorage([]);
    if (activeKit && savedKits.some((k) => k.id === activeKit.id)) {
      setActiveKit(null);
    }
    setIsHistoryOpen(false);
  };

  const handleCopyShare = () => {
    if (!activeKit) return;
    const shareText = `StudyKit AI: ${activeKit.title}\nIncludes ${activeKit.keyConcepts.length} core concepts, 3 exam practice questions, and ${activeKit.flashcards.length} interactive flashcards.`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        onSelectSample={handleSelectSample}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedKits.length}
        onNewKit={() => {
          setActiveKit(null);
          setPresetText('');
          setPresetHint('');
        }}
        hasActiveKit={Boolean(activeKit)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Error notification banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start space-x-3 text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-rose-200">Unable to generate study kit</p>
                <p className="mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs text-rose-400 hover:text-white px-2 py-1 rounded-lg bg-rose-950/50"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View 1: Material Upload / Input Screen */}
        {!activeKit && (
          <UploadSection
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
            presetText={presetText}
            presetHint={presetHint}
          />
        )}

        {/* View 2: Generated Study Kit Dashboard */}
        {activeKit && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-fadeIn">
            {/* Kit Top Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      Actionable Study Kit
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(activeKit.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center space-x-1 font-medium bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>100% Grounded in Uploaded Material</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {activeKit.title}
                  </h1>

                  {activeKit.overview && (
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {activeKit.overview}
                    </p>
                  )}
                </div>

                {/* Kit Toolbar Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Export / Print</span>
                  </button>

                  <button
                    onClick={handleCopyShare}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                    title="Copy Summary"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveKit(null);
                      setPresetText('');
                      setPresetHint('');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>New Study Material</span>
                  </button>
                </div>
              </div>

              {/* Study Mode Navigation Tabs */}
              <div className="mt-8 flex flex-wrap border-b border-slate-800 gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`flex items-center space-x-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 ${
                    activeTab === 'concepts'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1. Key Concepts ({activeKit.keyConcepts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex items-center space-x-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 ${
                    activeTab === 'questions'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>2. Exam Practice (3 Questions)</span>
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center space-x-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 ${
                    activeTab === 'flashcards'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>3. Flashcards Deck ({activeKit.flashcards.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('full')}
                  className={`flex items-center space-x-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 ${
                    activeTab === 'full'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Full Study Guide</span>
                </button>
              </div>
            </div>

            {/* Tab Views */}
            <div className="pt-2">
              {activeTab === 'concepts' && (
                <KeyConceptsView
                  concepts={activeKit.keyConcepts}
                  overview={activeKit.overview}
                />
              )}

              {activeTab === 'questions' && (
                <ExamQuestionsView questions={activeKit.questions} />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardsView flashcards={activeKit.flashcards} />
              )}

              {activeTab === 'full' && (
                <div className="space-y-10">
                  <section>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <span>Section 1: Key Concepts & Summaries</span>
                      </h3>
                      <p className="text-xs text-slate-400">Core concepts extracted strictly from source material</p>
                    </div>
                    <KeyConceptsView concepts={activeKit.keyConcepts} />
                  </section>

                  <section className="pt-6 border-t border-slate-800">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5 text-indigo-400" />
                        <span>Section 2: Balanced Exam Questions</span>
                      </h3>
                      <p className="text-xs text-slate-400">MCQ, Short Answer, and Conceptual Application</p>
                    </div>
                    <ExamQuestionsView questions={activeKit.questions} />
                  </section>

                  <section className="pt-6 border-t border-slate-800">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Layers className="w-5 h-5 text-indigo-400" />
                        <span>Section 3: Flashcard Set</span>
                      </h3>
                      <p className="text-xs text-slate-400">5-10 terms with front/back definitions</p>
                    </div>
                    <FlashcardsView flashcards={activeKit.flashcards} />
                  </section>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* History Modal */}
      <StudyHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedKits={savedKits}
        onSelectKit={(kit) => {
          setActiveKit(kit);
          setActiveTab('concepts');
        }}
        onDeleteKit={handleDeleteKit}
        onClearAll={handleClearAllHistory}
      />

      {/* Export Modal */}
      {activeKit && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          studyKit={activeKit}
        />
      )}
    </div>
  );
}
