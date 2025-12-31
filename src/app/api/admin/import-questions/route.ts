import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const PARSED_DIR = path.join(process.cwd(), 'parsed_questions');

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await adminAuthMiddleware(request);
  if (authError) return authError;

  try {
    // Get all JSON files from parsed directory
    if (!fs.existsSync(PARSED_DIR)) {
      return NextResponse.json(
        { error: 'No parsed questions found. Parse PDFs first.' },
        { status: 400 }
      );
    }

    const jsonFiles = fs.readdirSync(PARSED_DIR).filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return NextResponse.json(
        { error: 'No JSON files found in parsed directory' },
        { status: 400 }
      );
    }

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Process each JSON file
    for (const jsonFile of jsonFiles) {
      try {
        const filePath = path.join(PARSED_DIR, jsonFile);
        const data = fs.readFileSync(filePath, 'utf8');
        const questions = JSON.parse(data);

        if (!Array.isArray(questions)) continue;

        // Import each question
        for (const question of questions) {
          try {
            // Validate question
            const validationError = validateQuestion(question);
            if (validationError) {
              console.error(`Validation failed: ${validationError}`);
              errors++;
              continue;
            }

            // Check for duplicates
            const exists = await questionExists(question.question);
            if (exists) {
              console.log(`Skipping duplicate: ${question.question.substring(0, 50)}...`);
              skipped++;
              continue;
            }

            // Insert into database
            await prisma.question.create({
              data: {
                subject: question.subject,
                topic: question.topic || 'General',
                question: question.question,
                options: JSON.stringify(question.options),
                correctAnswer: question.correctAnswer,
                explanation: question.explanation || '',
                difficulty: question.difficulty,
                examType: question.examType,
                year: question.year,
                source: question.source || '',
                paperCode: question.paperCode || null,
                marks: question.marks || 1,
                negativeMarks: question.negativeMarks || 0,
                timeEstimate: question.timeEstimate || 60,
              },
            });

            imported++;
          } catch (error: any) {
            console.error(`Error importing question: ${error.message}`);
            errors++;
          }
        }
      } catch (error: any) {
        console.error(`Error processing file ${jsonFile}:`, error.message);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors,
      total: imported + skipped + errors,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import questions' },
      { status: 500 }
    );
  }
}

function validateQuestion(question: any): string | null {
  if (!question.question || question.question.trim() === '') {
    return 'Question text is empty';
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    return 'Must have exactly 4 options';
  }

  if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
    return 'correctAnswer must be 0-3';
  }

  if (!question.subject) {
    return 'Subject is required';
  }

  const validExamTypes = ['JEE_Main', 'JEE_Advanced', 'NEET', 'CBSE_10', 'CBSE_12'];
  if (!validExamTypes.includes(question.examType)) {
    return 'Invalid examType';
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(question.difficulty)) {
    return 'Invalid difficulty';
  }

  return null;
}

async function questionExists(questionText: string): Promise<boolean> {
  const existing = await prisma.question.findFirst({
    where: {
      question: {
        contains: questionText.substring(0, 50),
      },
    },
  });

  return existing !== null;
}
