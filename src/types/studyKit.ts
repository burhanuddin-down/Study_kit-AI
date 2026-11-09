export interface KeyConcept {
  concept: string;
  explanation: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex?: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ShortAnswerQuestion {
  question: string;
  sampleAnswer: string;
  keyPoints?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ConceptualApplicationQuestion {
  question: string;
  scenario?: string;
  sampleAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyKitQuestions {
  mcq: MCQQuestion;
  shortAnswer: ShortAnswerQuestion;
  conceptualApplication: ConceptualApplicationQuestion;
}

export interface StudyKit {
  id: string;
  title: string;
  createdAt: string;
  overview?: string;
  sourceType: 'text' | 'image' | 'both';
  rawSnippet?: string;
  keyConcepts: KeyConcept[];
  questions: StudyKitQuestions;
  flashcards: Flashcard[];
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  base64: string;
  previewUrl: string;
}
