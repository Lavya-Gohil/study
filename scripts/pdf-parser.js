const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

/**
 * PDF Parser for Exam Papers
 * Extracts questions from CBSE, JEE, NEET exam PDFs
 */

class QuestionParser {
  constructor() {
    this.questions = [];
  }

  /**
   * Parse a PDF file and extract questions
   */
  async parsePDF(pdfPath, metadata) {
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      
      console.log(`Processing: ${path.basename(pdfPath)}`);
      console.log(`Pages: ${data.numpages}`);
      
      const text = data.text;
      const questions = this.extractQuestions(text, metadata);
      
      console.log(`Extracted ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error(`Error parsing ${pdfPath}:`, error.message);
      return [];
    }
  }

  /**
   * Extract questions from text using pattern matching
   */
  extractQuestions(text, metadata) {
    const questions = [];
    
    // Common question patterns
    // Pattern 1: Q1. or Q.1 or Question 1
    const questionPattern = /(?:Q\.?\s*\d+|Question\s+\d+)[:\.]?\s*(.*?)(?=Q\.?\s*\d+|Question\s+\d+|$)/gis;
    
    // Pattern 2: Multiple choice options (A), (B), (C), (D) or (a), (b), (c), (d)
    const optionsPattern = /\(([A-Da-d])\)\s*([^\(\)]+?)(?=\([A-Da-d]\)|$)/g;
    
    // Extract question blocks
    const questionBlocks = text.match(questionPattern) || [];
    
    for (const block of questionBlocks) {
      try {
        const question = this.parseQuestionBlock(block, metadata);
        if (question) {
          questions.push(question);
        }
      } catch (error) {
        console.log('Skipping malformed question block');
      }
    }
    
    return questions;
  }

  /**
   * Parse individual question block
   */
  parseQuestionBlock(block, metadata) {
    // Extract question text (before options)
    const questionText = this.extractQuestionText(block);
    if (!questionText || questionText.length < 20) return null;
    
    // Extract options
    const options = this.extractOptions(block);
    if (options.length < 3) return null;
    
    // Try to find correct answer (often marked with * or specified at end)
    const correctAnswer = this.findCorrectAnswer(block, options);
    
    // Estimate difficulty based on keywords
    const difficulty = this.estimateDifficulty(questionText);
    
    return {
      subject: metadata.subject,
      topic: metadata.topic || 'General',
      question: questionText,
      options: options,
      correctAnswer: correctAnswer !== -1 ? correctAnswer : 0,
      explanation: '',
      difficulty: difficulty,
      examType: metadata.examType,
      year: metadata.year,
      source: metadata.source,
      paperCode: metadata.paperCode,
      marks: metadata.marks || 1,
      negativeMarks: metadata.negativeMarks || 0,
      timeEstimate: this.estimateTime(difficulty)
    };
  }

  /**
   * Extract clean question text
   */
  extractQuestionText(block) {
    // Remove question number prefix
    let text = block.replace(/^(?:Q\.?\s*\d+|Question\s+\d+)[:\.]?\s*/i, '');
    
    // Extract text before options start
    const optionsStart = text.search(/\([A-Da-d]\)/);
    if (optionsStart !== -1) {
      text = text.substring(0, optionsStart);
    }
    
    return text.trim();
  }

  /**
   * Extract multiple choice options
   */
  extractOptions(block) {
    const options = [];
    const optionsPattern = /\(([A-Da-d])\)\s*([^\(\)]+?)(?=\([A-Da-d]\)|Answer|Correct|$)/gi;
    
    let match;
    while ((match = optionsPattern.exec(block)) !== null) {
      options.push(match[2].trim());
    }
    
    // Ensure we have 4 options
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }
    
    return options.slice(0, 4);
  }

  /**
   * Find correct answer from various markers
   */
  findCorrectAnswer(block, options) {
    // Look for answer markers
    const answerPatterns = [
      /Answer[:\s]*\(?([A-Da-d])\)?/i,
      /Correct[:\s]*\(?([A-Da-d])\)?/i,
      /\*\s*\(([A-Da-d])\)/i,
    ];
    
    for (const pattern of answerPatterns) {
      const match = block.match(pattern);
      if (match) {
        const letter = match[1].toUpperCase();
        return letter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      }
    }
    
    return -1; // Not found
  }

  /**
   * Estimate difficulty based on keywords
   */
  estimateDifficulty(text) {
    const hardKeywords = ['derive', 'prove', 'calculate the value', 'integrate', 'differentiate'];
    const mediumKeywords = ['explain', 'calculate', 'find', 'determine', 'solve'];
    
    const lowerText = text.toLowerCase();
    
    if (hardKeywords.some(kw => lowerText.includes(kw))) {
      return 'hard';
    } else if (mediumKeywords.some(kw => lowerText.includes(kw))) {
      return 'medium';
    }
    
    return 'easy';
  }

  /**
   * Estimate time to solve based on difficulty
   */
  estimateTime(difficulty) {
    switch (difficulty) {
      case 'hard': return 180; // 3 minutes
      case 'medium': return 120; // 2 minutes
      default: return 60; // 1 minute
    }
  }

  /**
   * Process entire folder of PDFs
   */
  async processPDFFolder(folderPath, metadata) {
    const allQuestions = [];
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder not found: ${folderPath}`);
      return allQuestions;
    }
    
    const files = fs.readdirSync(folderPath);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    
    console.log(`\nFound ${pdfFiles.length} PDF files in ${folderPath}`);
    
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(folderPath, pdfFile);
      const questions = await this.parsePDF(pdfPath, metadata);
      allQuestions.push(...questions);
    }
    
    return allQuestions;
  }

  /**
   * Save questions to JSON file
   */
  saveToJSON(questions, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`\nSaved ${questions.length} questions to ${outputPath}`);
  }
}

module.exports = QuestionParser;

// CLI usage
if (require.main === module) {
  const parser = new QuestionParser();
  
  // Example: Parse JEE Main Physics papers
  const exampleMetadata = {
    subject: 'Physics',
    topic: 'General',
    examType: 'JEE Main',
    year: 2024,
    source: 'NTA JEE Main',
    paperCode: 'JEE-2024-P1',
    marks: 4,
    negativeMarks: 1
  };
  
  console.log('PDF Parser Ready!');
  console.log('\nUsage:');
  console.log('const parser = require("./pdf-parser");');
  console.log('parser.processPDFFolder("./papers/jee", metadata).then(questions => {');
  console.log('  parser.saveToJSON(questions, "./output/questions.json");');
  console.log('});');
}
