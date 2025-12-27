const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * Question Importer
 * Imports parsed questions from JSON into database
 */

class QuestionImporter {
  constructor() {
    this.batchSize = 100;
    this.importedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
  }

  /**
   * Generate hash for duplicate detection
   */
  generateQuestionHash(question) {
    const normalized = question.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('md5').update(normalized).digest('hex');
  }

  /**
   * Validate question data
   */
  validateQuestion(question) {
    const errors = [];
    
    if (!question.question || question.question.trim() === '') {
      errors.push('Question text is empty');
    }
    
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      errors.push('Must have exactly 4 options');
    }
    
    if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
      errors.push('correctAnswer must be 0-3');
    }
    
    if (!question.subject) {
      errors.push('Subject is required');
    }
    
    const validExamTypes = ['JEE_Main', 'JEE_Advanced', 'NEET', 'CBSE_10', 'CBSE_12'];
    if (!validExamTypes.includes(question.examType)) {
      errors.push(`examType must be one of: ${validExamTypes.join(', ')}`);
    }
    
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(question.difficulty)) {
      errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}`);
    }
    
    return errors;
  }

  /**
   * Check if question already exists
   */
  async questionExists(questionText) {
    const hash = this.generateQuestionHash(questionText);
    
    // Check by exact hash match or similar text
    const existing = await prisma.question.findFirst({
      where: {
        question: {
          contains: questionText.substring(0, 50) // First 50 chars
        }
      }
    });
    
    return existing !== null;
  }

  /**
   * Import a single question
   */
  async importQuestion(question) {
    try {
      // Validate
      const errors = this.validateQuestion(question);
      if (errors.length > 0) {
        console.error(`Validation failed for question: ${question.question?.substring(0, 50)}...`);
        console.error(`Errors: ${errors.join(', ')}`);
        this.errorCount++;
        return false;
      }
      
      // Check for duplicates
      const exists = await this.questionExists(question.question);
      if (exists) {
        console.log(`Skipping duplicate: ${question.question.substring(0, 50)}...`);
        this.skippedCount++;
        return false;
      }
      
      // Insert into database
      await prisma.question.create({
        data: {
          subject: question.subject,
          topic: question.topic || 'General',
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || '',
          difficulty: question.difficulty,
          examType: question.examType,
          year: question.year,
          source: question.source || '',
          paperCode: question.paperCode || null,
          marks: question.marks || 1,
          negativeMarks: question.negativeMarks || 0,
          timeEstimate: question.timeEstimate || 60
        }
      });
      
      this.importedCount++;
      return true;
    } catch (error) {
      console.error(`Error importing question: ${error.message}`);
      this.errorCount++;
      return false;
    }
  }

  /**
   * Import questions in batches
   */
  async importBatch(questions) {
    console.log(`Processing batch of ${questions.length} questions...`);
    
    for (const question of questions) {
      await this.importQuestion(question);
    }
  }

  /**
   * Import from a JSON file
   */
  async importFromFile(filePath) {
    try {
      console.log(`Reading file: ${filePath}`);
      
      const data = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(data);
      
      if (!Array.isArray(questions)) {
        throw new Error('JSON file must contain an array of questions');
      }
      
      console.log(`Found ${questions.length} questions to import`);
      
      // Process in batches
      for (let i = 0; i < questions.length; i += this.batchSize) {
        const batch = questions.slice(i, i + this.batchSize);
        await this.importBatch(batch);
        
        console.log(`Progress: ${Math.min(i + this.batchSize, questions.length)}/${questions.length}`);
      }
      
      this.printSummary();
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
    }
  }

  /**
   * Import from multiple JSON files in a folder
   */
  async importFromFolder(folderPath) {
    try {
      console.log(`Scanning folder: ${folderPath}`);
      
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
      
      console.log(`Found ${files.length} JSON files`);
      
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        console.log(`\nProcessing: ${file}`);
        await this.importFromFile(filePath);
      }
      
      console.log('\n=== FINAL SUMMARY ===');
      this.printSummary();
    } catch (error) {
      console.error(`Error scanning folder: ${error.message}`);
    }
  }

  /**
   * Print import summary
   */
  printSummary() {
    console.log('\n=== IMPORT SUMMARY ===');
    console.log(`Imported: ${this.importedCount}`);
    console.log(`Skipped (duplicates): ${this.skippedCount}`);
    console.log(`Errors: ${this.errorCount}`);
    console.log(`Total processed: ${this.importedCount + this.skippedCount + this.errorCount}`);
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const total = await prisma.question.count();
    
    const byExam = await prisma.question.groupBy({
      by: ['examType'],
      _count: true
    });
    
    const bySubject = await prisma.question.groupBy({
      by: ['subject'],
      _count: true
    });
    
    const byDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: true
    });
    
    console.log('\n=== DATABASE STATISTICS ===');
    console.log(`Total questions: ${total}`);
    
    console.log('\nBy Exam Type:');
    byExam.forEach(item => {
      console.log(`  ${item.examType}: ${item._count}`);
    });
    
    console.log('\nBy Subject:');
    bySubject.forEach(item => {
      console.log(`  ${item.subject}: ${item._count}`);
    });
    
    console.log('\nBy Difficulty:');
    byDifficulty.forEach(item => {
      console.log(`  ${item.difficulty}: ${item._count}`);
    });
  }

  /**
   * Clear all questions (use with caution!)
   */
  async clearAll() {
    console.log('⚠️ WARNING: This will delete ALL questions!');
    const deleted = await prisma.question.deleteMany({});
    console.log(`Deleted ${deleted.count} questions`);
  }

  /**
   * Cleanup
   */
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = QuestionImporter;

// CLI usage
if (require.main === module) {
  const importer = new QuestionImporter();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];
  
  async function main() {
    try {
      switch (command) {
        case 'file':
          if (!target) {
            console.error('Usage: node import-questions.js file <path-to-json>');
            process.exit(1);
          }
          await importer.importFromFile(target);
          break;
          
        case 'folder':
          if (!target) {
            console.error('Usage: node import-questions.js folder <path-to-folder>');
            process.exit(1);
          }
          await importer.importFromFolder(target);
          break;
          
        case 'stats':
          await importer.getStats();
          break;
          
        case 'clear':
          console.log('Type "yes" to confirm deletion of all questions:');
          // In a real CLI, you'd wait for input here
          // await importer.clearAll();
          break;
          
        default:
          console.log('Question Importer');
          console.log('\nUsage:');
          console.log('  node import-questions.js file <path-to-json>');
          console.log('  node import-questions.js folder <path-to-folder>');
          console.log('  node import-questions.js stats');
          console.log('\nExample:');
          console.log('  node import-questions.js file ./parsed_questions/jee_main_2024.json');
          console.log('  node import-questions.js folder ./parsed_questions');
      }
    } catch (error) {
      console.error('Fatal error:', error);
    } finally {
      await importer.disconnect();
    }
  }
  
  main();
}
