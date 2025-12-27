import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import pdf from 'pdf-parse';

const DOWNLOAD_DIR = path.join(process.cwd(), 'downloaded_papers');
const PARSED_DIR = path.join(process.cwd(), 'parsed_questions');

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await adminAuthMiddleware(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { metadata } = body;

    // Create parsed questions directory
    if (!fs.existsSync(PARSED_DIR)) {
      fs.mkdirSync(PARSED_DIR, { recursive: true });
    }

    // Find PDFs in the download directory
    const pdfDir = path.join(
      DOWNLOAD_DIR,
      metadata.examType,
      metadata.year.toString(),
      metadata.subject
    );

    if (!fs.existsSync(pdfDir)) {
      return NextResponse.json(
        { error: 'No downloaded papers found. Download PDFs first.' },
        { status: 400 }
      );
    }

    const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      return NextResponse.json(
        { error: 'No PDF files found in the directory' },
        { status: 400 }
      );
    }

    let allQuestions: any[] = [];
    let filesProcessed = 0;

    // Process each PDF
    for (const pdfFile of pdfFiles) {
      try {
        const pdfPath = path.join(pdfDir, pdfFile);
        console.log(`Parsing: ${pdfFile}`);

        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdf(dataBuffer);
        const text = pdfData.text;

        // Extract questions using regex patterns
        const questions = extractQuestions(text, {
          ...metadata,
          paperCode: `${metadata.examType}_${metadata.year}_${metadata.subject}_${path.parse(pdfFile).name}`,
        });

        allQuestions.push(...questions);
        filesProcessed++;

        console.log(`✓ Parsed ${questions.length} questions from ${pdfFile}`);
      } catch (error: any) {
        console.error(`✗ Failed to parse ${pdfFile}:`, error.message);
      }
    }

    // Save all questions to JSON file
    const outputFile = path.join(
      PARSED_DIR,
      `${metadata.examType}_${metadata.year}_${metadata.subject}_${Date.now()}.json`
    );

    fs.writeFileSync(outputFile, JSON.stringify(allQuestions, null, 2));

    return NextResponse.json({
      success: true,
      questionCount: allQuestions.length,
      filesProcessed,
      totalFiles: pdfFiles.length,
      outputFile,
    });
  } catch (error: any) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse papers' },
      { status: 500 }
    );
  }
}

function extractQuestions(text: string, metadata: any): any[] {
  const questions: any[] = [];

  // Split text into question blocks
  const questionPattern = /(?:Q\.?\s*\d+|Question\s+\d+)[:\.]?\s*(.*?)(?=Q\.?\s*\d+|Question\s+\d+|$)/gi;
  const blocks = text.match(questionPattern) || [];

  for (const block of blocks) {
    try {
      const question = parseQuestionBlock(block, metadata);
      if (question) {
        questions.push(question);
      }
    } catch (error) {
      console.error('Error parsing question block:', error);
    }
  }

  return questions;
}

function parseQuestionBlock(block: string, metadata: any): any | null {
  // Extract question text
  const questionText = extractQuestionText(block);
  if (!questionText || questionText.length < 10) return null;

  // Extract options
  const options = extractOptions(block);
  if (options.length !== 4) return null;

  // Find correct answer
  const correctAnswer = findCorrectAnswer(block, options);
  if (correctAnswer === -1) return null;

  // Estimate difficulty
  const difficulty = estimateDifficulty(questionText);

  // Extract explanation if available
  const explanation = extractExplanation(block) || '';

  return {
    subject: metadata.subject,
    topic: 'General',
    question: questionText.trim(),
    options: options,
    correctAnswer: correctAnswer,
    explanation: explanation.trim(),
    difficulty: difficulty,
    examType: metadata.examType,
    year: metadata.year,
    source: metadata.source,
    paperCode: metadata.paperCode,
    marks: 1,
    negativeMarks: 0,
    timeEstimate: difficulty === 'hard' ? 180 : difficulty === 'medium' ? 120 : 60,
  };
}

function extractQuestionText(block: string): string {
  // Remove question number
  let text = block.replace(/^(?:Q\.?\s*\d+|Question\s+\d+)[:\.]?\s*/i, '');
  
  // Remove options part
  text = text.replace(/\([A-Da-d]\).*/g, '');
  
  return text.trim();
}

function extractOptions(block: string): string[] {
  const options: string[] = [];
  const optionPattern = /\(([A-Da-d])\)\s*([^\(\)]+?)(?=\([A-Da-d]\)|Answer|Correct|Solution|Explanation|$)/gi;
  
  let match;
  while ((match = optionPattern.exec(block)) !== null) {
    options.push(match[2].trim());
  }

  // Ensure we have exactly 4 options
  while (options.length < 4) {
    options.push(`Option ${String.fromCharCode(65 + options.length)}`);
  }

  return options.slice(0, 4);
}

function findCorrectAnswer(block: string, options: string[]): number {
  // Try to find answer markers
  const patterns = [
    /Answer[:\s]*\(?([A-Da-d])\)?/i,
    /Correct[:\s]*\(?([A-Da-d])\)?/i,
    /\*\s*\(([A-Da-d])\)/i,
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) {
      const letter = match[1].toUpperCase();
      return letter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    }
  }

  // Default to first option if no answer found
  return 0;
}

function extractExplanation(block: string): string {
  const explanationPattern = /(?:Solution|Explanation|Answer)[:\s]*(.*?)(?=Q\.?\s*\d+|Question\s+\d+|$)/i;
  const match = block.match(explanationPattern);
  return match ? match[1].trim() : '';
}

function estimateDifficulty(text: string): 'easy' | 'medium' | 'hard' {
  const lowerText = text.toLowerCase();
  
  const hardKeywords = ['derive', 'prove', 'integrate', 'differentiate', 'complex'];
  const mediumKeywords = ['explain', 'calculate', 'find', 'determine', 'solve'];
  
  if (hardKeywords.some(k => lowerText.includes(k))) return 'hard';
  if (mediumKeywords.some(k => lowerText.includes(k))) return 'medium';
  return 'easy';
}
