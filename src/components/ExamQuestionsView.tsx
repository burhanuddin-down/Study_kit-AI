import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Target,
} from 'lucide-react';
import { StudyKitQuestions } from '../types/studyKit';

interface ExamQuestionsViewProps {
  questions: StudyKitQuestions;
}

export const ExamQuestionsView: React.FC<ExamQuestionsViewProps> = ({ questions }) => {
  // MCQ state
  const [selectedMcqIndex, setSelectedMcqIndex] = useState<number | null>(null);
  const [isMcqSubmitted, setIsMcqSubmitted] = useState<boolean>(false);

  // Short Answer state
  const [shortAnswerInput, setShortAnswerInput] = useState<string>('');
  const [showShortAnswerSolution, setShowShortAnswerSolution] = useState<boolean>(false);
  const [shortAnswerSelfGrade, setShortAnswerSelfGrade] = useState<'correct' | 'partial' | 'review' | null>(null);

  // Conceptual Application state
  const [conceptualInput, setConceptualInput] = useState<string>('');
  const [showConceptualSolution, setShowConceptualSolution] = useState<boolean>(false);
  const [conceptualSelfGrade, setConceptualSelfGrade] = useState<'mastered' | 'learning' | null>(null);

  const { mcq, shortAnswer, conceptualApplication } = questions;

  // Determine correct MCQ index
  const correctIdx =
    typeof mcq.correctIndex === 'number' && mcq.correctIndex >= 0 && mcq.correctIndex < mcq.options.length
      ? mcq.correctIndex
      : mcq.options.findIndex(
          (opt) =>
            opt.toLowerCase() === mcq.correctAnswer.toLowerCase() ||
            opt.toLowerCase().includes(mcq.correctAnswer.toLowerCase()) ||
            mcq.correctAnswer.toLowerCase().includes(opt.toLowerCase())
        );

  const finalCorrectIdx = correctIdx !== -1 ? correctIdx : 0;

  const handleMcqSelect = (idx: number) => {
    if (isMcqSubmitted) return;
    setSelectedMcqIndex(idx);
    setIsMcqSubmitted(true);
  };

  const handleResetMcq = () => {
    setSelectedMcqIndex(null);
    setIsMcqSubmitted(false);
  };

  // Completion calculation
  let completedCount = 0;
  if (isMcqSubmitted) completedCount++;
  if (showShortAnswerSolution || shortAnswerSelfGrade) completedCount++;
  if (showConceptualSolution || conceptualSelfGrade) completedCount++;

  return (
    <div className="space-y-8">
      {/* Header and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Strict Source Exam Practice</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            3 distinct, balanced questions (MCQ, Short Answer, Conceptual Application)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-300">
              Exam Practice Progress:
            </span>
            <div className="text-xs text-indigo-400 font-bold">
              {completedCount} of 3 Questions Answered
            </div>
          </div>
          <div className="w-16 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* QUESTION 1: MULTIPLE CHOICE QUESTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Question 1 • MCQ
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {mcq.difficulty || 'Easy'} Difficulty
            </span>
          </div>

          {isMcqSubmitted && (
            <button
              onClick={handleResetMcq}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 leading-snug">
          {mcq.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {mcq.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let optionStyles = 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80';

            if (isMcqSubmitted) {
              if (idx === finalCorrectIdx) {
                optionStyles = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200 font-medium shadow-sm';
              } else if (idx === selectedMcqIndex && idx !== finalCorrectIdx) {
                optionStyles = 'border-rose-500/80 bg-rose-500/10 text-rose-200';
              } else {
                optionStyles = 'border-slate-800/60 bg-slate-900/40 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleMcqSelect(idx)}
                disabled={isMcqSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start space-x-3 ${optionStyles}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isMcqSubmitted && idx === finalCorrectIdx
                      ? 'bg-emerald-500 text-slate-950'
                      : isMcqSubmitted && idx === selectedMcqIndex
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-700/60 text-slate-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm leading-relaxed flex-1">{opt}</span>

                {isMcqSubmitted && idx === finalCorrectIdx && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isMcqSubmitted && idx === selectedMcqIndex && idx !== finalCorrectIdx && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {isMcqSubmitted && (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm animate-fadeIn">
            <div className="flex items-center space-x-2 font-semibold text-emerald-400 mb-1 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct Answer & Explanation:</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {mcq.explanation}
            </p>
          </div>
        )}
      </div>

      {/* QUESTION 2: SHORT ANSWER QUESTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Question 2 • Short Answer
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {shortAnswer.difficulty || 'Medium'} Difficulty
            </span>
          </div>

          <span className="text-xs text-slate-500">Provide high-scoring response</span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 leading-snug">
          {shortAnswer.question}
        </h3>

        {/* Student Input Workspace */}
        <div className="mb-4">
          <textarea
            value={shortAnswerInput}
            onChange={(e) => setShortAnswerInput(e.target.value)}
            rows={3}
            placeholder="Type your answer here to test yourself before checking the sample solution..."
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed resize-y"
          />
        </div>

        {/* Reveal Solution Button */}
        <button
          onClick={() => setShowShortAnswerSolution(!showShortAnswerSolution)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-indigo-300 border border-slate-700 transition"
        >
          <span>{showShortAnswerSolution ? 'Hide Model Benchmark' : 'Compare with Sample High-Scoring Answer'}</span>
          {showShortAnswerSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* High Scoring Answer Box */}
        {showShortAnswerSolution && (
          <div className="mt-4 p-5 rounded-xl bg-slate-800/80 border border-purple-500/30 text-sm space-y-3 animate-fadeIn">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Sample High-Scoring Answer:</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/60">
                {shortAnswer.sampleAnswer}
              </p>
            </div>

            {shortAnswer.keyPoints && shortAnswer.keyPoints.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">
                  Key Criteria & Grading Points:
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                  {shortAnswer.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Self assessment */}
            <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-400">How did your answer compare?</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShortAnswerSelfGrade('correct')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                    shortAnswerSelfGrade === 'correct'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ✓ Complete
                </button>
                <button
                  onClick={() => setShortAnswerSelfGrade('partial')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                    shortAnswerSelfGrade === 'partial'
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ~ Partial
                </button>
                <button
                  onClick={() => setShortAnswerSelfGrade('review')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                    shortAnswerSelfGrade === 'review'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Needs Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUESTION 3: CONCEPTUAL APPLICATION QUESTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Question 3 • Conceptual Application
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {conceptualApplication.difficulty || 'Hard'} Difficulty
            </span>
          </div>

          <span className="text-xs text-slate-500">Real-World Scenario</span>
        </div>

        {/* Real World Scenario if distinct */}
        {conceptualApplication.scenario && (
          <div className="mb-3 p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
            <span className="font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Real-World Scenario:
            </span>
            {conceptualApplication.scenario}
          </div>
        )}

        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 leading-snug">
          {conceptualApplication.question}
        </h3>

        {/* Student sandbox */}
        <div className="mb-4">
          <textarea
            value={conceptualInput}
            onChange={(e) => setConceptualInput(e.target.value)}
            rows={3}
            placeholder="Draft your analysis of how the concept applies to this real-world scenario..."
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed resize-y"
          />
        </div>

        {/* Reveal Solution Button */}
        <button
          onClick={() => setShowConceptualSolution(!showConceptualSolution)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-rose-300 border border-slate-700 transition"
        >
          <span>
            {showConceptualSolution
              ? 'Hide Real-World Breakdown'
              : 'Reveal High-Scoring Application Solution'}
          </span>
          {showConceptualSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Application Solution */}
        {showConceptualSolution && (
          <div className="mt-4 p-5 rounded-xl bg-slate-800/80 border border-rose-500/30 text-sm space-y-3 animate-fadeIn">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>High-Scoring Conceptual Application Breakdown:</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/60">
                {conceptualApplication.sampleAnswer}
              </p>
            </div>

            {/* Self evaluation */}
            <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Mastered this application?</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConceptualSelfGrade('mastered')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium border transition ${
                    conceptualSelfGrade === 'mastered'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ✓ Understood Application
                </button>
                <button
                  onClick={() => setConceptualSelfGrade('learning')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium border transition ${
                    conceptualSelfGrade === 'learning'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Need Further Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
