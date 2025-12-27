# Question Bank System - Complete Guide

This guide explains how to populate your study app with real exam questions from CBSE, JEE, and NEET papers.

## Overview

The system has 3 main scripts:
1. **paper-downloader.js** - Downloads PDFs from official sources
2. **pdf-parser.js** - Extracts questions from PDFs
3. **import-questions.js** - Imports questions into database

## Prerequisites

```bash
npm install pdf-parse axios cheerio
npx prisma migrate dev --name add_question_model
```

## Step 1: Download Papers

### Option A: Manual Download (Recommended)
Visit official websites and download papers manually:
- CBSE: https://cbseacademic.nic.in/PreviousYearPapers.html
- JEE Main: https://jeemain.nta.nic.in/
- JEE Advanced: https://jeeadv.ac.in/
- NEET: https://neet.nta.nic.in/

Save papers in organized folders:
```
downloaded_papers/
  JEE_Main/
    2024/
      Physics/
      Chemistry/
      Mathematics/
  CBSE_10/
    2024/
      Physics/
      Chemistry/
  NEET/
    2024/
      Physics/
      Chemistry/
      Biology/
```

### Option B: Using the Downloader Script

**⚠️ IMPORTANT:** You need to manually verify and update URLs in the script as official websites frequently change their structure.

```javascript
const PaperDownloader = require('./scripts/paper-downloader');
const downloader = new PaperDownloader('./downloaded_papers');

// Download specific papers
await downloader.downloadAll({
  examTypes: ['JEE_Main', 'CBSE_10'],
  years: [2024, 2023, 2022],
  subjects: ['Physics', 'Chemistry', 'Mathematics']
});
```

**Note:** The downloader includes placeholder URLs. Before using, open [scripts/paper-downloader.js](scripts/paper-downloader.js) and update the `getJEEMainLinks()`, `getJEEAdvancedLinks()`, and `getNEETLinks()` methods with actual URLs from official websites.

## Step 2: Parse PDFs to Extract Questions

```bash
node scripts/pdf-parser.js
```

### Single PDF:
```javascript
const QuestionParser = require('./scripts/pdf-parser');
const parser = new QuestionParser();

const questions = await parser.parsePDF(
  './downloaded_papers/JEE_Main/2024/Physics/paper1.pdf',
  {
    examType: 'JEE_Main',
    year: 2024,
    subject: 'Physics',
    source: 'NTA JEE Main 2024',
    paperCode: 'JEE_Main_2024_Physics_P1'
  }
);

await parser.saveToJSON(questions, './parsed_questions/jee_main_2024_physics.json');
```

### Entire Folder:
```javascript
const questions = await parser.processPDFFolder(
  './downloaded_papers/JEE_Main/2024/Physics',
  {
    examType: 'JEE_Main',
    year: 2024,
    subject: 'Physics',
    source: 'NTA JEE Main 2024'
  }
);
```

## Step 3: Import Questions to Database

### Import Single File:
```bash
node scripts/import-questions.js file ./parsed_questions/jee_main_2024_physics.json
```

### Import Entire Folder:
```bash
node scripts/import-questions.js folder ./parsed_questions
```

### Check Statistics:
```bash
node scripts/import-questions.js stats
```

Output example:
```
=== DATABASE STATISTICS ===
Total questions: 1,247

By Exam Type:
  JEE_Main: 450
  CBSE_10: 320
  NEET: 477

By Subject:
  Physics: 415
  Chemistry: 416
  Mathematics: 416

By Difficulty:
  easy: 312
  medium: 623
  hard: 312
```

## Step 4: Update API Route

The [src/app/api/questions/route.ts](src/app/api/questions/route.ts) will automatically use database questions once they're imported. The existing filtering and shuffling logic works with both in-memory and database questions.

## Complete Workflow Example

```bash
# 1. Run database migration
npx prisma migrate dev --name add_question_model

# 2. Download papers manually from official websites
# Save to downloaded_papers/ folder

# 3. Parse all PDFs
node scripts/pdf-parser.js

# 4. Import all questions
node scripts/import-questions.js folder ./parsed_questions

# 5. Check results
node scripts/import-questions.js stats

# 6. Test in app
npm run dev
# Visit http://localhost:3000/practice
```

## Question Format

Each question in the database has:
- **subject**: Physics, Chemistry, Mathematics, Biology
- **topic**: Specific topic (e.g., "Mechanics", "Organic Chemistry")
- **question**: The question text
- **options**: Array of 4 options
- **correctAnswer**: Index 0-3 of correct option
- **explanation**: Solution explanation
- **difficulty**: easy, medium, hard
- **examType**: JEE_Main, JEE_Advanced, NEET, CBSE_10, CBSE_12
- **year**: 2020-2025
- **source**: Official source attribution
- **paperCode**: Unique paper identifier
- **marks**: Points for correct answer (default 1)
- **negativeMarks**: Points deducted for wrong answer (default 0)
- **timeEstimate**: Recommended time in seconds (default 60)

## Troubleshooting

### Parser can't extract questions:
- Open the PDF manually and check the format
- Questions should be numbered (Q1, Q.1, Question 1)
- Options should be labeled (A), (B), (C), (D)
- Adjust regex patterns in [scripts/pdf-parser.js](scripts/pdf-parser.js#L45-L70)

### Duplicate questions:
The importer automatically detects and skips duplicates based on question text matching.

### Validation errors:
Check that all required fields are present:
```javascript
{
  question: "What is...?",
  options: ["A", "B", "C", "D"],  // Must have exactly 4
  correctAnswer: 0,  // Must be 0-3
  subject: "Physics",
  examType: "JEE_Main",  // Must be valid exam type
  difficulty: "medium"  // Must be easy/medium/hard
}
```

### Download fails:
- Check internet connection
- Verify URLs are correct and accessible
- Official websites may have rate limiting
- Add longer delays between downloads (increase `delay(2000)` to `delay(5000)`)

## Legal & Attribution

- All papers are downloaded from official examination board websites
- Questions are attributed with source, year, and exam type
- For educational use only
- Maintain proper attribution in the app UI

## Performance Tips

- Import in batches (default 100 questions per batch)
- Parser processes ~10-20 questions per PDF depending on format
- Database can handle 100,000+ questions with proper indexing
- Use caching for frequently accessed questions

## Next Steps

After importing questions:
1. Test the practice page with new questions
2. Verify filtering works (by subject, difficulty, exam type)
3. Check that explanations display correctly
4. Update the UI to show exam type and year
5. Add filter options for users to select exam type

## Questions?

The scripts are designed to be customizable. Check the source code:
- [scripts/paper-downloader.js](scripts/paper-downloader.js) - Download logic
- [scripts/pdf-parser.js](scripts/pdf-parser.js) - Parsing patterns
- [scripts/import-questions.js](scripts/import-questions.js) - Database import
- [prisma/schema.prisma](prisma/schema.prisma) - Question model definition
