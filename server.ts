import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous body limit for image uploads (handwritten notes, textbook photos)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate-study-kit', async (req: Request, res: Response) => {
  try {
    const { text, images, subjectHint } = req.body;

    const hasText = Boolean(text && typeof text === 'string' && text.trim().length > 0);
    const hasImages = Boolean(images && Array.isArray(images) && images.length > 0);

    if (!hasText && !hasImages) {
      return res.status(400).json({
        error: 'Please provide study materials: either pasted text/notes or uploaded document images.',
      });
    }

    const parts: any[] = [];

    // Add images if provided
    if (hasImages) {
      for (const img of images) {
        if (img.data && img.mimeType) {
          // Strip data URL prefix if present
          const base64Data = img.data.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: img.mimeType,
            },
          });
        }
      }
    }

    // Prompt content
    const promptText = `
You are an expert academic tutor and exam preparation assistant. Your goal is to transform the provided raw study materials (which may be text notes, textbook page photos, or lecture document images) into an actionable structured study kit.

CRITICAL INSTRUCTIONS & CONSTRAINTS:
1. Grounding & Zero Hallucination:
   - Base all concepts, questions, and flashcards STRICTLY and EXCLUSIVELY on the provided source material.
   - Do NOT reference external internet knowledge or unmentioned facts. If a concept is not in the material, do NOT invent or include it.
2. Structure:
   - 1. Key concepts and summaries: Extract between 3 and 5 core concepts from the provided material. Explain each concept in 2-3 concise sentences using plain, easy-to-understand language.
   - 2. Generate 3 distinct questions based strictly on the source material:
        a) Multiple Choice Question (MCQ): 4 options, mark the correct answer with a brief explanation. (Balance: Easy or Medium)
        b) Short Answer Question: Provide the question and a sample high-scoring answer based strictly on the text. (Balance: Medium)
        c) Conceptual Application Question: Ask how a key concept applies to a real-world scenario. (Balance: Hard)
        - Ensure a rough balance between easy, medium, and hard difficulty.
   - 3. Flashcard set:
        - Exactly between 5 and 10 flashcards.
        - Each with "front" (Term or Question) and "back" (Definition or Answer).
3. Efficiency:
   - Provide clear, direct, and concise academic output.

${subjectHint ? `Context / Topic hint: ${subjectHint}` : ''}
${hasText ? `\n--- SOURCE TEXT & NOTES ---\n${text.trim()}\n--- END SOURCE TEXT ---` : ''}

You MUST return your response as a valid JSON object with the following exact structure:
{
  "title": "A clear, descriptive academic title for this study kit",
  "overview": "1-2 sentence concise summary of the material provided",
  "keyConcepts": [
    {
      "concept": "Name of concept",
      "explanation": "2-3 concise sentences in plain, easy-to-understand language."
    }
  ],
  "questions": {
    "mcq": {
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact text of the correct option",
      "correctIndex": 0,
      "explanation": "Brief explanation why this is correct based strictly on the source material.",
      "difficulty": "Easy"
    },
    "shortAnswer": {
      "question": "Short answer question text...",
      "sampleAnswer": "Sample high scoring answer strictly based on source material.",
      "keyPoints": ["Key point 1", "Key point 2"],
      "difficulty": "Medium"
    },
    "conceptualApplication": {
      "question": "Scenario question asking how a key concept applies to a real world scenario...",
      "scenario": "The specific real-world context...",
      "sampleAnswer": "High scoring sample answer explaining how the concept applies to this scenario.",
      "difficulty": "Hard"
    }
  },
  "flashcards": [
    {
      "front": "Term or Question",
      "back": "Definition or Answer"
    }
  ]
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for high fidelity to source text
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini model returned empty response.');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      // Fallback: cleanup potential markdown code blocks
      const cleanJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      parsedResult = JSON.parse(cleanJson);
    }

    // Validate flashcards count constraint (5-10)
    if (parsedResult.flashcards && Array.isArray(parsedResult.flashcards)) {
      if (parsedResult.flashcards.length > 10) {
        parsedResult.flashcards = parsedResult.flashcards.slice(0, 10);
      }
    }

    // Ensure keyConcepts count constraint (3-5)
    if (parsedResult.keyConcepts && Array.isArray(parsedResult.keyConcepts)) {
      if (parsedResult.keyConcepts.length > 5) {
        parsedResult.keyConcepts = parsedResult.keyConcepts.slice(0, 5);
      }
    }

    // Attach metadata
    const studyKit = {
      id: 'kit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      sourceType: hasText && hasImages ? 'both' : hasImages ? 'image' : 'text',
      rawSnippet: hasText ? text.slice(0, 200) + (text.length > 200 ? '...' : '') : undefined,
      ...parsedResult,
    };

    return res.json({ success: true, studyKit });
  } catch (error: any) {
    console.error('Error generating study kit:', error);
    return res.status(500).json({
      error: error.message || 'Failed to parse study materials and generate study kit.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
