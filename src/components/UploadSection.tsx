import React, { useState, useRef, DragEvent } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  Layers,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { UploadedFileItem } from '../types/studyKit';
import { SAMPLE_MATERIALS, SampleMaterial } from '../sampleData';

interface UploadSectionProps {
  onGenerate: (payload: {
    text: string;
    images: { data: string; mimeType: string; name?: string }[];
    subjectHint?: string;
  }) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (sample: SampleMaterial) => void;
  presetText?: string;
  presetHint?: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onGenerate,
  isLoading,
  onSelectSample,
  presetText = '',
  presetHint = '',
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'both'>('text');
  const [textInput, setTextInput] = useState<string>(presetText);
  const [subjectHint, setSubjectHint] = useState<string>(presetHint);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preset if updated from parent (e.g. sample clicked)
  React.useEffect(() => {
    if (presetText) {
      setTextInput(presetText);
      setActiveTab('text');
    }
  }, [presetText]);

  React.useEffect(() => {
    if (presetHint) {
      setSubjectHint(presetHint);
    }
  }, [presetHint]);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValidationError(null);

    const newFiles: UploadedFileItem[] = [];
    Array.from(files).forEach((file) => {
      // Validate image type
      if (!file.type.startsWith('image/')) {
        setValidationError('Please upload image files (PNG, JPG, WEBP) of your study notes or textbook pages.');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setValidationError(`"${file.name}" exceeds 15MB limit. Please upload a smaller image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: 'file_' + Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            base64,
            previewUrl: URL.createObjectURL(file),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const hasText = textInput.trim().length > 0;
    const hasImages = uploadedFiles.length > 0;

    if (!hasText && !hasImages) {
      setValidationError('Please paste notes/text or upload at least one study material image.');
      return;
    }

    if (hasText && textInput.trim().length < 40 && !hasImages) {
      setValidationError('Please provide slightly more context (at least 40 characters) for an accurate academic study kit.');
      return;
    }

    const imagesPayload = uploadedFiles.map((f) => ({
      data: f.base64,
      mimeType: f.type,
      name: f.name,
    }));

    await onGenerate({
      text: textInput.trim(),
      images: imagesPayload,
      subjectHint: subjectHint.trim() || undefined,
    });
  };

  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Strict Source Grounding • Free Account Token-Efficient</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transform Raw Study Notes Into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
            Exam-Ready Kits
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Upload handwritten notes, textbook photos, or paste lecture transcripts. Our academic tutor parses the content to build core concept summaries, 3 balanced exam questions, and interactive flashcards.
        </p>

        {/* Quick Sample Chips */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick load examples:</span>
          {SAMPLE_MATERIALS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-indigo-500/50 transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>{sample.subject}: {sample.title.split('&')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pasted Notes / Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'image'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Document / Photos</span>
            {uploadedFiles.length > 0 && (
              <span className="ml-1 bg-white/20 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {uploadedFiles.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === 'both'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Both (Photos + Notes)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Optional Topic or Subject Hint */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Subject / Topic Context <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={subjectHint}
              onChange={(e) => setSubjectHint(e.target.value)}
              placeholder="e.g. AP Biology Unit 4, Macroeconomics Chapter 12, Organic Chemistry midterm..."
              className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Text Area (Visible on 'text' or 'both') */}
          {(activeTab === 'text' || activeTab === 'both') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Study Materials / Notes
                </label>
                <div className="text-[11px] text-slate-500 font-mono">
                  {wordCount} words • {textInput.length} chars
                </div>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={activeTab === 'both' ? 5 : 8}
                placeholder="Paste your lecture notes, textbook summary, transcript, or syllabus notes here... AI will strictly ground concepts and questions in this exact text."
                className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed resize-y"
              />
            </div>
          )}

          {/* Image Upload Area (Visible on 'image' or 'both') */}
          {(activeTab === 'image' || activeTab === 'both') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Document Photos / Scanned Notes
                </label>
                <span className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP (up to 15MB)</span>
              </div>

              {/* Drag Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files)}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Click to upload or drag & drop document images
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Photos of whiteboard notes, textbook pages, printed handouts, or slide screenshots
                </p>
              </div>

              {/* Uploaded Thumbnails */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
                    >
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file.id);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="p-1.5 bg-slate-900/90 text-[10px] text-slate-300 truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Instructions & Quality Guarantee */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-300 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How your Study Kit is formulated:</span>
            </div>
            <ul className="list-disc list-inside text-slate-400 pl-1 space-y-0.5">
              <li>3 to 5 core concepts explained in 2-3 plain sentences</li>
              <li>3 distinct balanced exam questions (MCQ, Short Answer, Conceptual Application)</li>
              <li>Interactive set of 5 to 10 flashcards strictly adhering to source facts</li>
            </ul>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-lg ${
                isLoading
                  ? 'bg-indigo-700/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Study Material & Building Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Actionable Study Kit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
