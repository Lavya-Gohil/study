import OpenAI from 'openai'

// Check if OpenAI key is configured
const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key'

const openai = hasOpenAIKey ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function generateDailyStudyPlan(
  examType: string,
  subjects: string[],
  dailyHours: number,
  examDate: Date,
  previousProgress?: any,
  maxTasks: number = 10
) {
  // Return mock data if no OpenAI key
  if (!openai) {
    console.log('⚠️ Using DEMO study plan (add OpenAI API key for real AI planning)')
    const tasksPerSubject = Math.max(1, Math.floor(dailyHours / subjects.length))
    return subjects.slice(0, Math.min(3, subjects.length)).map((subject, index) => ({
      subject,
      topic: `${subject} - Core Concepts & Practice`,
      duration: tasksPerSubject,
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      type: index % 2 === 0 ? 'theory' : 'practice',
      completed: false
    })).slice(0, maxTasks)
  }
  const daysUntilExam = Math.ceil(
    (examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const prompt = `You are an expert study planner for competitive exams. Create a detailed daily study plan.

Exam: ${examType}
Subjects: ${subjects.join(', ')}
Daily Study Hours: ${dailyHours}
Days Until Exam: ${daysUntilExam}
${previousProgress ? `Previous Progress: ${JSON.stringify(previousProgress)}` : ''}

Create a balanced study plan for today with:
1. Specific topics for each subject
2. Time allocation (totaling ${dailyHours} hours)
3. Priority levels (high, medium, low)
4. Mix of theory, practice, and revision

Return a JSON array of tasks with this structure:
[
  {
    "subject": "subject name",
    "topic": "specific topic",
    "duration": duration in hours,
    "priority": "high|medium|low",
    "type": "theory|practice|revision"
  }
]

Only return the JSON array, no other text.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const content = completion.choices[0].message.content
  if (!content) throw new Error('No response from OpenAI')

  const allTasks = JSON.parse(content)
  return allTasks.slice(0, maxTasks)
}

export async function solveDoubt(question: string, subject: string, context?: string) {
  // Return mock answer if no OpenAI key
  if (!openai) {
    console.log('⚠️ Using DEMO answer (add OpenAI API key for real AI tutoring)')
    return `📚 Demo Answer for: "${question}"

This is a demonstration mode. Your question about ${subject} has been received!

To get real AI-powered step-by-step solutions:
1. Sign up at platform.openai.com
2. Get your API key
3. Add it to .env as OPENAI_API_KEY
4. Get detailed explanations and solutions!

For now, here are some tips:
• Break down the problem into smaller parts
• Review fundamental concepts
• Practice similar problems
• Check your textbook for related topics

Keep studying! 🎯`
  }
  const prompt = `You are an expert tutor helping a student preparing for competitive exams.

Subject: ${subject}
Question: ${question}
${context ? `Context: ${context}` : ''}

Provide a clear, step-by-step explanation. Include:
1. Core concept explanation
2. Step-by-step solution
3. Common mistakes to avoid
4. Related topics to review

Keep it concise but thorough.`

  if (!openai) return null

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export async function analyzeWeeklyProgress(progressData: any) {
  const prompt = `Analyze this student's weekly study progress and provide insights:

${JSON.stringify(progressData, null, 2)}

Provide:
1. Key strengths and weaknesses
2. Subject-wise performance
3. Recommendations for next week
4. Motivation message

Return as JSON:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "subjectAnalysis": {"subject": "analysis"},
  "recommendations": ["rec1", "rec2"],
  "motivationMessage": "message"
}

Only return the JSON, no other text.`

  if (!openai) {
    return {
      strengths: ['Consistent study routine'],
      weaknesses: ['Add OpenAI key for detailed analysis'],
      subjectAnalysis: {},
      recommendations: ['Keep up the good work!'],
      motivationMessage: 'Great progress!'
    }
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const content = completion.choices[0].message.content
  if (!content) throw new Error('No response from OpenAI')

  return JSON.parse(content)
}
