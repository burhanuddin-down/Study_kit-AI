import React from 'react';
import { X, Trash2, ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';
import { StudyKit } from '../types/studyKit';

interface StudyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedKits: StudyKit[];
  onSelectKit: (kit: StudyKit) => void;
  onDeleteKit: (id: string) => void;
  onClearAll: () => void;
}

export const StudyHistoryModal: React.FC<StudyHistoryModalProps> = ({
  isOpen,
  onClose,
  savedKits,
  onSelectKit,
  onDeleteKit,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              My Saved Study Kits
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {savedKits.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {savedKits.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p>No study kits saved yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Generate a study kit and it will automatically be saved here.
              </p>
            </div>
          ) : (
            savedKits.map((kit) => (
              <div
                key={kit.id}
                className="group p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/40 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    onSelectKit(kit);
                    onClose();
                  }}
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {kit.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(kit.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>{kit.keyConcepts?.length || 0} Concepts</span>
                    <span>•</span>
                    <span>{kit.flashcards?.length || 0} Flashcards</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectKit(kit);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition flex items-center space-x-1"
                  >
                    <span>Open Kit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteKit(kit.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete study kit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedKits.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
