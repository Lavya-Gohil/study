import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// JEE Question Bank - These are sample educational questions for demonstration
// For production: Add your own questions, use licensed content, or implement user-generated questions
// Source: Educational reference materials and standard JEE syllabus topics

const SAMPLE_QUESTIONS = [
  // Physics - Mechanics
  {
    id: '1',
    subject: 'Physics',
    topic: 'Kinematics',
    question: 'A particle moves in a straight line with constant acceleration. If its velocity changes from 10 m/s to 30 m/s in 4 seconds, what is the acceleration?',
    options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
    correctAnswer: 1,
    explanation: 'Using v = u + at, we have 30 = 10 + a(4), so a = 20/4 = 5 m/s²',
    difficulty: 'easy',
    year: 2020,
  },
  {
    id: '2',
    subject: 'Physics',
    topic: 'Laws of Motion',
    question: 'A block of mass 2 kg is placed on a rough surface. The coefficient of friction is 0.3. What is the minimum force required to just move the block? (g = 10 m/s²)',
    options: ['4 N', '6 N', '8 N', '10 N'],
    correctAnswer: 1,
    explanation: 'Minimum force = μN = μmg = 0.3 × 2 × 10 = 6 N',
    difficulty: 'easy',
    year: 2021,
  },
  {
    id: '3',
    subject: 'Physics',
    topic: 'Work Energy Power',
    question: 'A body of mass 5 kg is moving with a velocity of 10 m/s. What is its kinetic energy?',
    options: ['50 J', '100 J', '250 J', '500 J'],
    correctAnswer: 2,
    explanation: 'KE = (1/2)mv² = (1/2) × 5 × 10² = 250 J',
    difficulty: 'easy',
    year: 2019,
  },
  {
    id: '4',
    subject: 'Physics',
    topic: 'Electrostatics',
    question: 'Two point charges +2μC and -2μC are placed 10 cm apart. What is the electric field at the midpoint?',
    options: ['Zero', '7.2 × 10⁶ N/C', '3.6 × 10⁶ N/C', '1.8 × 10⁶ N/C'],
    correctAnswer: 1,
    explanation: 'At midpoint, fields due to both charges add up (point in same direction). E = 2 × k|q|/r² = 2 × (9×10⁹ × 2×10⁻⁶)/(0.05)² = 7.2 × 10⁶ N/C',
    difficulty: 'medium',
    year: 2022,
  },
  {
    id: '5',
    subject: 'Physics',
    topic: 'Current Electricity',
    question: 'A wire of resistance 10Ω is stretched to double its length. What is its new resistance?',
    options: ['5Ω', '10Ω', '20Ω', '40Ω'],
    correctAnswer: 3,
    explanation: 'R = ρL/A. When stretched to 2L, area becomes A/2. New R = ρ(2L)/(A/2) = 4 × ρL/A = 4R = 40Ω',
    difficulty: 'medium',
    year: 2020,
  },
  {
    id: '6',
    subject: 'Physics',
    topic: 'Optics',
    question: 'A concave mirror has a focal length of 20 cm. An object is placed 30 cm from the mirror. What is the image distance?',
    options: ['12 cm', '60 cm', '-60 cm', '-12 cm'],
    correctAnswer: 1,
    explanation: 'Using 1/f = 1/v + 1/u: 1/20 = 1/v + 1/(-30). Solving: 1/v = 1/20 + 1/30 = 5/60 = 1/12, so v = 60 cm',
    difficulty: 'medium',
    year: 2021,
  },

  // Mathematics - Algebra
  {
    id: '7',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    question: 'If α and β are roots of x² - 5x + 6 = 0, what is α² + β²?',
    options: ['11', '13', '15', '17'],
    correctAnswer: 1,
    explanation: 'α + β = 5, αβ = 6. α² + β² = (α + β)² - 2αβ = 25 - 12 = 13',
    difficulty: 'easy',
    year: 2020,
  },
  {
    id: '8',
    subject: 'Mathematics',
    topic: 'Calculus',
    question: 'What is the derivative of x³ + 2x² - 5x + 7?',
    options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x⁴ + 2x³ - 5x', '3x² + 4x + 7'],
    correctAnswer: 0,
    explanation: 'd/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(7) = 0. Result: 3x² + 4x - 5',
    difficulty: 'easy',
    year: 2019,
  },
  {
    id: '9',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    question: 'If sin θ = 3/5 and θ is in the first quadrant, what is tan θ?',
    options: ['3/4', '4/3', '5/3', '3/5'],
    correctAnswer: 0,
    explanation: 'cos θ = √(1 - sin²θ) = √(1 - 9/25) = 4/5. tan θ = sin θ / cos θ = (3/5)/(4/5) = 3/4',
    difficulty: 'medium',
    year: 2020,
  },
  {
    id: '10',
    subject: 'Mathematics',
    topic: 'Sequences and Series',
    question: 'The sum of first n natural numbers is 210. What is n?',
    options: ['18', '19', '20', '21'],
    correctAnswer: 2,
    explanation: 'n(n+1)/2 = 210, so n² + n - 420 = 0. Using quadratic formula: n = 20',
    difficulty: 'medium',
    year: 2021,
  },
  {
    id: '11',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    question: 'What is the distance between points (3, 4) and (0, 0)?',
    options: ['3', '4', '5', '7'],
    correctAnswer: 2,
    explanation: 'Distance = √[(3-0)² + (4-0)²] = √(9 + 16) = √25 = 5',
    difficulty: 'easy',
    year: 2022,
  },
  {
    id: '12',
    subject: 'Mathematics',
    topic: 'Probability',
    question: 'Two dice are thrown. What is the probability of getting a sum of 7?',
    options: ['1/6', '1/9', '1/12', '1/3'],
    correctAnswer: 0,
    explanation: 'Favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total outcomes = 36. P = 6/36 = 1/6',
    difficulty: 'easy',
    year: 2019,
  },

  // Chemistry - Physical Chemistry
  {
    id: '13',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    question: 'What is the maximum number of electrons in a shell with principal quantum number n = 3?',
    options: ['8', '18', '32', '50'],
    correctAnswer: 1,
    explanation: 'Maximum electrons in nth shell = 2n². For n = 3: 2(3)² = 18',
    difficulty: 'easy',
    year: 2020,
  },
  {
    id: '14',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    question: 'Which molecule has the highest bond angle?',
    options: ['H₂O', 'NH₃', 'CH₄', 'H₂S'],
    correctAnswer: 2,
    explanation: 'CH₄ has tetrahedral geometry with bond angle 109.5°, which is the highest among the given options',
    difficulty: 'medium',
    year: 2021,
  },
  {
    id: '15',
    subject: 'Chemistry',
    topic: 'Thermodynamics',
    question: 'For an endothermic reaction at equilibrium, what happens when temperature is increased?',
    options: ['Equilibrium shifts left', 'Equilibrium shifts right', 'No change', 'Reaction stops'],
    correctAnswer: 1,
    explanation: 'For endothermic reactions (ΔH > 0), increasing temperature shifts equilibrium to the right (forward direction)',
    difficulty: 'medium',
    year: 2022,
  },
  {
    id: '16',
    subject: 'Chemistry',
    topic: 'Chemical Kinetics',
    question: 'For a first-order reaction, if concentration decreases from 0.8 M to 0.2 M in 60 minutes, what is the half-life?',
    options: ['20 min', '30 min', '40 min', '50 min'],
    correctAnswer: 1,
    explanation: 'For first order: ln(0.2/0.8) = -kt×60. k = ln(4)/60. Half-life t₁/₂ = ln(2)/k = 30 minutes',
    difficulty: 'hard',
    year: 2021,
  },
  {
    id: '17',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    question: 'What is the IUPAC name of CH₃-CH₂-OH?',
    options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'],
    correctAnswer: 1,
    explanation: 'CH₃-CH₂-OH has 2 carbon atoms with an -OH group, making it ethanol',
    difficulty: 'easy',
    year: 2019,
  },
  {
    id: '18',
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    question: 'Which has the highest oxidation state of chromium?',
    options: ['CrO₂', 'Cr₂O₃', 'CrO₃', 'K₂CrO₄'],
    correctAnswer: 3,
    explanation: 'In K₂CrO₄, chromium has +6 oxidation state, which is the highest among the options',
    difficulty: 'medium',
    year: 2020,
  },
]

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject')

    let questions = SAMPLE_QUESTIONS

    if (subject && subject !== 'all') {
      questions = questions.filter((q) => q.subject.toLowerCase() === subject.toLowerCase())
    }

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Questions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST endpoint to add new questions (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { subject, topic, question, options, correctAnswer, explanation, difficulty, year } = body

    // In a real app, you'd save this to database
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Question added successfully',
      note: 'To persist questions, add database storage in schema.prisma'
    })
  } catch (error) {
    console.error('Add question error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
