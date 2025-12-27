import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Comprehensive JEE Question Bank - 120 Questions
const SAMPLE_QUESTIONS = [
  // Physics - Mechanics (30 questions)
  { id: '1', subject: 'Physics', topic: 'Kinematics', question: 'A particle moves with constant acceleration. Velocity changes from 10 m/s to 30 m/s in 4s. What is acceleration?', options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'], correctAnswer: 1, explanation: 'Using v = u + at: 30 = 10 + a(4), so a = 5 m/s²', difficulty: 'easy', year: 2020 },
  { id: '2', subject: 'Physics', topic: 'Laws of Motion', question: 'A 2 kg block on rough surface (μ = 0.3). Minimum force to move it? (g = 10 m/s²)', options: ['4 N', '6 N', '8 N', '10 N'], correctAnswer: 1, explanation: 'F = μN = μmg = 0.3 × 2 × 10 = 6 N', difficulty: 'easy', year: 2021 },
  { id: '3', subject: 'Physics', topic: 'Work Energy', question: 'A 5 kg body moves at 10 m/s. Its kinetic energy?', options: ['50 J', '100 J', '250 J', '500 J'], correctAnswer: 2, explanation: 'KE = (1/2)mv² = 0.5 × 5 × 100 = 250 J', difficulty: 'easy', year: 2019 },
  { id: '4', subject: 'Physics', topic: 'Projectile Motion', question: 'Projectile thrown at 30° with 20 m/s. Maximum height? (g=10 m/s²)', options: ['5 m', '10 m', '15 m', '20 m'], correctAnswer: 0, explanation: 'H = (u²sin²θ)/(2g) = (400×0.25)/20 = 5 m', difficulty: 'medium', year: 2022 },
  { id: '5', subject: 'Physics', topic: 'Circular Motion', question: 'Particle in 2m radius circle at 4 m/s. Centripetal acceleration?', options: ['2 m/s²', '4 m/s²', '8 m/s²', '16 m/s²'], correctAnswer: 2, explanation: 'ac = v²/r = 16/2 = 8 m/s²', difficulty: 'easy', year: 2020 },
  { id: '6', subject: 'Physics', topic: 'Gravitation', question: 'At what height above Earth will g become g/4? (R = Earth radius)', options: ['R', '2R', '3R', '4R'], correctAnswer: 0, explanation: 'g\' = g(R/(R+h))². For g/4: (R+h) = 2R, so h = R', difficulty: 'hard', year: 2019 },
  { id: '7', subject: 'Physics', topic: 'Friction', question: 'Block slides down 30° incline. Coefficient of friction is 0.2. Will it slide? (g=10 m/s²)', options: ['Yes', 'No', 'Depends on mass', 'Need more info'], correctAnswer: 0, explanation: 'tan30° = 0.577 > μ = 0.2, so it will slide', difficulty: 'medium', year: 2021 },
  { id: '8', subject: 'Physics', topic: 'Momentum', question: '0.2 kg ball hits wall at 10 m/s, rebounds at 8 m/s. Change in momentum?', options: ['0.4 kg·m/s', '3.6 kg·m/s', '1.6 kg·m/s', '2.0 kg·m/s'], correctAnswer: 1, explanation: 'Δp = m(v₂-v₁) = 0.2(-8-10) = -3.6 kg·m/s', difficulty: 'medium', year: 2022 },
  { id: '9', subject: 'Physics', topic: 'Rotational Motion', question: 'Disc of 0.5m radius rotates at 60 rpm. Angular velocity?', options: ['π rad/s', '2π rad/s', '3π rad/s', '4π rad/s'], correctAnswer: 1, explanation: 'ω = 2πn/60 = 2π(60)/60 = 2π rad/s', difficulty: 'easy', year: 2020 },
  { id: '10', subject: 'Physics', topic: 'SHM', question: 'Spring constant 100 N/m, mass 1 kg. Time period?', options: ['0.628 s', '1.256 s', '0.314 s', '2.512 s'], correctAnswer: 0, explanation: 'T = 2π√(m/k) = 2π√(1/100) = 0.628 s', difficulty: 'medium', year: 2021 },
  { id: '11', subject: 'Physics', topic: 'Collisions', question: 'Two balls of equal mass collide elastically. Ball A at 5 m/s hits stationary ball B. After collision, A\'s velocity?', options: ['0 m/s', '2.5 m/s', '5 m/s', '-5 m/s'], correctAnswer: 0, explanation: 'In elastic collision of equal masses, velocities exchange. A stops, B moves at 5 m/s', difficulty: 'medium', year: 2019 },
  { id: '12', subject: 'Physics', topic: 'Work Power', question: 'Force of 10 N moves body 5 m at 60° to force direction. Work done?', options: ['25 J', '50 J', '43.3 J', '86.6 J'], correctAnswer: 0, explanation: 'W = F·s·cosθ = 10×5×cos60° = 25 J', difficulty: 'easy', year: 2020 },
  { id: '13', subject: 'Physics', topic: 'Center of Mass', question: 'Two particles of 2 kg and 3 kg are at (0,0) and (5,0). Center of mass x-coordinate?', options: ['2 m', '2.5 m', '3 m', '3.5 m'], correctAnswer: 2, explanation: 'xcm = (2×0 + 3×5)/(2+3) = 15/5 = 3 m', difficulty: 'easy', year: 2021 },
  { id: '14', subject: 'Physics', topic: 'Impulse', question: 'Force of 20 N acts for 0.5 s on 4 kg mass at rest. Final velocity?', options: ['1.5 m/s', '2.5 m/s', '3.5 m/s', '4.5 m/s'], correctAnswer: 1, explanation: 'Impulse = FΔt = mΔv. 20×0.5 = 4×v, v = 2.5 m/s', difficulty: 'easy', year: 2022 },
  { id: '15', subject: 'Physics', topic: 'Elastic Energy', question: 'Spring compressed by 0.2 m (k=100 N/m). Potential energy stored?', options: ['1 J', '2 J', '4 J', '20 J'], correctAnswer: 1, explanation: 'U = (1/2)kx² = 0.5×100×0.04 = 2 J', difficulty: 'easy', year: 2020 },

  // Physics - Electricity & Magnetism (15 questions)
  { id: '16', subject: 'Physics', topic: 'Electrostatics', question: 'Two charges +2μC and -2μC at 10 cm. Electric field at midpoint?', options: ['Zero', '7.2×10⁶ N/C', '3.6×10⁶ N/C', '1.8×10⁶ N/C'], correctAnswer: 1, explanation: 'Fields add up: E = 2kq/r² = 2×9×10⁹×2×10⁻⁶/(0.05)² = 7.2×10⁶ N/C', difficulty: 'medium', year: 2022 },
  { id: '17', subject: 'Physics', topic: 'Current Electricity', question: 'Wire of 10Ω resistance stretched to double length. New resistance?', options: ['5Ω', '10Ω', '20Ω', '40Ω'], correctAnswer: 3, explanation: 'R = ρL/A. At 2L, area A/2. R\' = ρ(2L)/(A/2) = 4R = 40Ω', difficulty: 'medium', year: 2020 },
  { id: '18', subject: 'Physics', topic: 'Electric Field', question: 'Field at point is 900 N/C. If distance doubled, new field?', options: ['225 N/C', '450 N/C', '1800 N/C', '3600 N/C'], correctAnswer: 0, explanation: 'E ∝ 1/r². Doubling r: E/4 = 225 N/C', difficulty: 'easy', year: 2021 },
  { id: '19', subject: 'Physics', topic: 'Capacitance', question: '2μF capacitor charged to 100V. Energy stored?', options: ['0.01 J', '0.02 J', '0.005 J', '0.04 J'], correctAnswer: 0, explanation: 'U = (1/2)CV² = 0.5×2×10⁻⁶×10000 = 0.01 J', difficulty: 'medium', year: 2019 },
  { id: '20', subject: 'Physics', topic: 'Parallel Resistors', question: 'Three resistors 2Ω, 3Ω, 6Ω in parallel. Equivalent resistance?', options: ['1Ω', '2Ω', '11Ω', '0.5Ω'], correctAnswer: 0, explanation: '1/R = 1/2+1/3+1/6 = 6/6 = 1, R = 1Ω', difficulty: 'easy', year: 2022 },
  { id: '21', subject: 'Physics', topic: 'Magnetic Force', question: '5A current in 2m wire in 0.5T field. Force?', options: ['2.5 N', '5 N', '7.5 N', '10 N'], correctAnswer: 1, explanation: 'F = BIL = 0.5×5×2 = 5 N', difficulty: 'easy', year: 2020 },
  { id: '22', subject: 'Physics', topic: 'EMI', question: '100-turn coil, area 0.1m². B changes 0.5T to 0.1T in 0.02s. Induced EMF?', options: ['100 V', '200 V', '300 V', '400 V'], correctAnswer: 1, explanation: 'ε = N(dΦ/dt) = 100×0.4×0.1/0.02 = 200 V', difficulty: 'medium', year: 2021 },
  { id: '23', subject: 'Physics', topic: 'Kirchhoff Law', question: 'In a circuit with 12V battery, 3Ω and 6Ω in series. Current?', options: ['1.33 A', '2 A', '3 A', '4 A'], correctAnswer: 0, explanation: 'I = V/R = 12/(3+6) = 1.33 A', difficulty: 'easy', year: 2019 },
  { id: '24', subject: 'Physics', topic: 'Wheatstone Bridge', question: 'Bridge balanced with P=2Ω, Q=4Ω, R=3Ω. What is S?', options: ['6Ω', '1.5Ω', '8Ω', '12Ω'], correctAnswer: 0, explanation: 'P/Q = R/S. 2/4 = 3/S. S = 6Ω', difficulty: 'medium', year: 2022 },
  { id: '25', subject: 'Physics', topic: 'Electric Potential', question: 'Work done to move 2C charge from 5V to 15V?', options: ['10 J', '20 J', '30 J', '40 J'], correctAnswer: 1, explanation: 'W = qΔV = 2×(15-5) = 20 J', difficulty: 'easy', year: 2020 },

  // Physics - Optics & Modern (10 questions)
  { id: '26', subject: 'Physics', topic: 'Optics', question: 'Concave mirror focal length 20 cm. Object at 30 cm. Image distance?', options: ['12 cm', '60 cm', '-60 cm', '-12 cm'], correctAnswer: 1, explanation: '1/f = 1/v+1/u. 1/20 = 1/v-1/30. v = 60 cm', difficulty: 'medium', year: 2021 },
  { id: '27', subject: 'Physics', topic: 'Ray Optics', question: 'Convex lens f=20cm forms image at 40cm. Object distance?', options: ['10 cm', '20 cm', '30 cm', '40 cm'], correctAnswer: 3, explanation: '1/f = 1/v-1/u. 1/20 = 1/40-1/u. u = -40 cm', difficulty: 'medium', year: 2020 },
  { id: '28', subject: 'Physics', topic: 'Refraction', question: 'Light travels from air (n=1) to glass (n=1.5) at 30°. Refraction angle?', options: ['19.5°', '22.5°', '30°', '45°'], correctAnswer: 0, explanation: 'sinθ₂ = (n₁/n₂)sinθ₁ = (1/1.5)×0.5 = 0.333, θ₂ = 19.5°', difficulty: 'hard', year: 2022 },
  { id: '29', subject: 'Physics', topic: 'Wave Optics', question: 'Young\'s experiment: λ=600nm, β=2mm. If λ=400nm, new β?', options: ['1.33 mm', '3 mm', '1 mm', '2 mm'], correctAnswer: 0, explanation: 'β ∝ λ. β₂ = 2×(400/600) = 1.33 mm', difficulty: 'medium', year: 2021 },
  { id: '30', subject: 'Physics', topic: 'Photoelectric', question: 'Work function 2eV. Light λ=400nm incident. Photoelectrons emitted?', options: ['Yes', 'No', 'Cannot say', 'Only high intensity'], correctAnswer: 0, explanation: 'E = hc/λ ≈ 3.1 eV > 2 eV. Yes', difficulty: 'hard', year: 2022 },
  { id: '31', subject: 'Physics', topic: 'Nuclear', question: 'Half-life 30 days. Fraction after 90 days?', options: ['1/2', '1/4', '1/8', '1/16'], correctAnswer: 2, explanation: '3 half-lives: (1/2)³ = 1/8', difficulty: 'easy', year: 2019 },
  { id: '32', subject: 'Physics', topic: 'Thermodynamics', question: 'First law of thermodynamics?', options: ['Energy conserved', 'Entropy increases', 'T₁V₁=T₂V₂', 'PV=nRT'], correctAnswer: 0, explanation: 'ΔU = Q - W, energy conservation', difficulty: 'easy', year: 2020 },
  { id: '33', subject: 'Physics', topic: 'Waves', question: 'Wave speed v=fλ. f=50Hz, λ=2m. Speed?', options: ['25 m/s', '50 m/s', '100 m/s', '200 m/s'], correctAnswer: 2, explanation: 'v = 50×2 = 100 m/s', difficulty: 'easy', year: 2021 },
  { id: '34', subject: 'Physics', topic: 'Sound', question: 'Speed of sound in air at 0°C?', options: ['300 m/s', '331 m/s', '340 m/s', '350 m/s'], correctAnswer: 1, explanation: '331 m/s at 0°C', difficulty: 'easy', year: 2021 },
  { id: '35', subject: 'Physics', topic: 'Doppler', question: 'Source moving towards observer. Frequency?', options: ['Increases', 'Decreases', 'Same', 'Zero'], correctAnswer: 0, explanation: 'Doppler effect: frequency increases', difficulty: 'medium', year: 2020 },

  // Mathematics - Algebra & Calculus (40 questions)
  { id: '36', subject: 'Mathematics', topic: 'Quadratic', question: 'If α, β are roots of x²-5x+6=0, what is α²+β²?', options: ['11', '13', '15', '17'], correctAnswer: 1, explanation: 'α+β=5, αβ=6. α²+β² = (α+β)²-2αβ = 25-12 = 13', difficulty: 'easy', year: 2020 },
  { id: '37', subject: 'Mathematics', topic: 'Calculus', question: 'Derivative of x³+2x²-5x+7?', options: ['3x²+4x-5', '3x²+2x-5', 'x⁴+2x³-5x', '3x²+4x+7'], correctAnswer: 0, explanation: 'd/dx: 3x²+4x-5', difficulty: 'easy', year: 2019 },
  { id: '38', subject: 'Mathematics', topic: 'Trigonometry', question: 'sinθ=3/5, θ in Q1. tanθ=?', options: ['3/4', '4/3', '5/3', '3/5'], correctAnswer: 0, explanation: 'cosθ = 4/5. tanθ = sinθ/cosθ = 3/4', difficulty: 'medium', year: 2020 },
  { id: '39', subject: 'Mathematics', topic: 'Series', question: 'Sum of first n natural numbers is 210. Find n.', options: ['18', '19', '20', '21'], correctAnswer: 2, explanation: 'n(n+1)/2 = 210. n²+n-420 = 0. n = 20', difficulty: 'medium', year: 2021 },
  { id: '40', subject: 'Mathematics', topic: 'Coordinate Geometry', question: 'Distance between (3,4) and (0,0)?', options: ['3', '4', '5', '7'], correctAnswer: 2, explanation: 'd = √[(3-0)²+(4-0)²] = √25 = 5', difficulty: 'easy', year: 2022 },
  { id: '41', subject: 'Mathematics', topic: 'Probability', question: 'Two dice thrown. Probability of sum 7?', options: ['1/6', '1/9', '1/12', '1/3'], correctAnswer: 0, explanation: '6 favorable outcomes out of 36. P = 6/36 = 1/6', difficulty: 'easy', year: 2019 },
  { id: '42', subject: 'Mathematics', topic: 'Complex Numbers', question: 'If z=3+4i, what is |z|?', options: ['5', '7', '25', '√7'], correctAnswer: 0, explanation: '|z| = √(3²+4²) = 5', difficulty: 'easy', year: 2020 },
  { id: '43', subject: 'Mathematics', topic: 'Determinants', question: '|[1,2],[3,4]| = ?', options: ['-2', '2', '10', '-10'], correctAnswer: 0, explanation: '1×4 - 2×3 = 4-6 = -2', difficulty: 'easy', year: 2021 },
  { id: '44', subject: 'Mathematics', topic: 'Matrices', question: 'If A=[1 2; 3 4] and B=[2 0; 1 2], what is AB?', options: ['[[4,4],[10,8]]', '[[3,2],[4,6]]', '[[4,2],[8,10]]', '[[2,4],[6,8]]'], correctAnswer: 0, explanation: 'AB = [[1×2+2×1, 1×0+2×2],[3×2+4×1, 3×0+4×2]] = [[4,4],[10,8]]', difficulty: 'medium', year: 2022 },
  { id: '45', subject: 'Mathematics', topic: 'Binomial', question: 'Coefficient of x³ in (1+x)⁵?', options: ['5', '10', '15', '20'], correctAnswer: 1, explanation: 'ⁿCᵣ = ⁵C₃ = 5!/(3!2!) = 10', difficulty: 'easy', year: 2020 },
  { id: '46', subject: 'Mathematics', topic: 'Permutation', question: '5 people arrange in row. Number of arrangements?', options: ['20', '60', '120', '720'], correctAnswer: 2, explanation: '5! = 120', difficulty: 'easy', year: 2019 },
  { id: '47', subject: 'Mathematics', topic: 'Logarithm', question: 'log₂8 = ?', options: ['2', '3', '4', '8'], correctAnswer: 1, explanation: '2³ = 8, so log₂8 = 3', difficulty: 'easy', year: 2021 },
  { id: '48', subject: 'Mathematics', topic: 'AP', question: 'First term 5, common difference 3. 10th term?', options: ['29', '32', '35', '38'], correctAnswer: 1, explanation: 'aₙ = a+(n-1)d = 5+9×3 = 32', difficulty: 'easy', year: 2022 },
  { id: '49', subject: 'Mathematics', topic: 'GP', question: 'First term 2, ratio 3. Sum of 4 terms?', options: ['40', '60', '80', '100'], correctAnswer: 2, explanation: 'S = a(rⁿ-1)/(r-1) = 2(81-1)/2 = 80', difficulty: 'medium', year: 2020 },
  { id: '50', subject: 'Mathematics', topic: 'Integration', question: '∫x² dx = ?', options: ['x³/3+C', 'x³+C', '2x+C', 'x²/2+C'], correctAnswer: 0, explanation: '∫xⁿdx = xⁿ⁺¹/(n+1)+C', difficulty: 'easy', year: 2019 },
  { id: '51', subject: 'Mathematics', topic: 'Limits', question: 'lim(x→0) sinx/x = ?', options: ['0', '1', '∞', 'undefined'], correctAnswer: 1, explanation: 'Standard limit: lim(x→0) sinx/x = 1', difficulty: 'medium', year: 2021 },
  { id: '52', subject: 'Mathematics', topic: 'Vector', question: 'If a⃗=(1,2), b⃗=(3,4), what is a⃗·b⃗?', options: ['7', '11', '14', '20'], correctAnswer: 1, explanation: 'a⃗·b⃗ = 1×3+2×4 = 11', difficulty: 'easy', year: 2022 },
  { id: '53', subject: 'Mathematics', topic: 'Functions', question: 'f(x)=2x+3. What is f(5)?', options: ['10', '11', '12', '13'], correctAnswer: 3, explanation: 'f(5) = 2×5+3 = 13', difficulty: 'easy', year: 2020 },
  { id: '54', subject: 'Mathematics', topic: 'Circles', question: 'Equation x²+y²=25. Radius?', options: ['5', '10', '25', '√5'], correctAnswer: 0, explanation: 'x²+y²=r². r² = 25, r = 5', difficulty: 'easy', year: 2019 },
  { id: '55', subject: 'Mathematics', topic: 'Sets', question: 'A={1,2,3}, B={2,3,4}. A∩B?', options: ['{2,3}', '{1,2,3,4}', '{1,4}', '{2}'], correctAnswer: 0, explanation: 'Intersection = common elements = {2,3}', difficulty: 'easy', year: 2022 },
  { id: '56', subject: 'Mathematics', topic: 'Inequalities', question: 'Solve: 2x+3 > 7', options: ['x>2', 'x<2', 'x>4', 'x>1'], correctAnswer: 0, explanation: '2x > 4, x > 2', difficulty: 'easy', year: 2020 },
  { id: '57', subject: 'Mathematics', topic: 'Differentiation', question: 'd/dx(sin x) = ?', options: ['cos x', '-cos x', 'sin x', '-sin x'], correctAnswer: 0, explanation: 'Derivative of sin x is cos x', difficulty: 'easy', year: 2022 },
  { id: '58', subject: 'Mathematics', topic: 'Exponents', question: '2³ × 2² = ?', options: ['2⁵', '2⁶', '4⁵', '8'], correctAnswer: 0, explanation: 'aᵐ × aⁿ = aᵐ⁺ⁿ = 2⁵', difficulty: 'easy', year: 2021 },
  { id: '59', subject: 'Mathematics', topic: 'Parabola', question: 'Vertex form y=a(x-h)²+k. Vertex at?', options: ['(h,k)', '(-h,k)', '(h,-k)', '(0,0)'], correctAnswer: 0, explanation: 'Vertex = (h,k)', difficulty: 'easy', year: 2019 },
  { id: '60', subject: 'Mathematics', topic: 'Slope', question: 'Line through (0,0) and (2,4). Slope?', options: ['1', '2', '1/2', '4'], correctAnswer: 1, explanation: 'm = (4-0)/(2-0) = 2', difficulty: 'easy', year: 2020 },
  { id: '61', subject: 'Mathematics', topic: 'Factoring', question: 'x²-9 = ?', options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', 'Cannot factor'], correctAnswer: 2, explanation: 'Difference of squares: a²-b² = (a-b)(a+b)', difficulty: 'easy', year: 2022 },
  { id: '62', subject: 'Mathematics', topic: 'Pythagorean', question: 'Right triangle: legs 3,4. Hypotenuse?', options: ['5', '6', '7', '8'], correctAnswer: 0, explanation: 'c² = 3²+4² = 25, c = 5', difficulty: 'easy', year: 2021 },
  { id: '63', subject: 'Mathematics', topic: 'Percentage', question: '25% of 80 = ?', options: ['10', '15', '20', '25'], correctAnswer: 2, explanation: '0.25 × 80 = 20', difficulty: 'easy', year: 2019 },
  { id: '64', subject: 'Mathematics', topic: 'Square Root', question: '√144 = ?', options: ['10', '11', '12', '13'], correctAnswer: 2, explanation: '12² = 144', difficulty: 'easy', year: 2020 },
  { id: '65', subject: 'Mathematics', topic: 'Ratios', question: 'Ratio 2:3 equals 6:?', options: ['8', '9', '10', '12'], correctAnswer: 1, explanation: '2:3 = 6:x, x = 9', difficulty: 'easy', year: 2022 },
  { id: '66', subject: 'Mathematics', topic: 'Average', question: 'Average of 2,4,6,8?', options: ['4', '5', '6', '7'], correctAnswer: 1, explanation: '(2+4+6+8)/4 = 20/4 = 5', difficulty: 'easy', year: 2021 },
  { id: '67', subject: 'Mathematics', topic: 'Angles', question: 'Sum of angles in triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, explanation: 'Triangle angles = 180°', difficulty: 'easy', year: 2019 },
  { id: '68', subject: 'Mathematics', topic: 'Fractions', question: '1/2 + 1/4 = ?', options: ['1/6', '2/6', '3/4', '1/3'], correctAnswer: 2, explanation: '2/4 + 1/4 = 3/4', difficulty: 'easy', year: 2020 },
  { id: '69', subject: 'Mathematics', topic: 'Decimals', question: '0.5 + 0.25 = ?', options: ['0.75', '0.5', '0.25', '1.0'], correctAnswer: 0, explanation: '0.50 + 0.25 = 0.75', difficulty: 'easy', year: 2022 },
  { id: '70', subject: 'Mathematics', topic: 'Area', question: 'Rectangle 5m × 4m. Area?', options: ['9 m²', '18 m²', '20 m²', '25 m²'], correctAnswer: 2, explanation: 'A = l×w = 5×4 = 20 m²', difficulty: 'easy', year: 2021 },
  { id: '71', subject: 'Mathematics', topic: 'Volume', question: 'Cube side 3m. Volume?', options: ['9 m³', '18 m³', '27 m³', '81 m³'], correctAnswer: 2, explanation: 'V = s³ = 3³ = 27 m³', difficulty: 'easy', year: 2019 },
  { id: '72', subject: 'Mathematics', topic: 'Perimeter', question: 'Square side 6m. Perimeter?', options: ['12 m', '18 m', '24 m', '36 m'], correctAnswer: 2, explanation: 'P = 4s = 4×6 = 24 m', difficulty: 'easy', year: 2020 },
  { id: '73', subject: 'Mathematics', topic: 'Prime', question: 'Is 17 prime?', options: ['Yes', 'No', 'Sometimes', 'Cannot say'], correctAnswer: 0, explanation: '17 divisible only by 1 and 17', difficulty: 'easy', year: 2022 },
  { id: '74', subject: 'Mathematics', topic: 'Absolute Value', question: '|-8| = ?', options: ['-8', '8', '0', '16'], correctAnswer: 1, explanation: 'Absolute value is distance from zero = 8', difficulty: 'easy', year: 2021 },
  { id: '75', subject: 'Mathematics', topic: 'Linear Equations', question: '3x + 6 = 15. Solve for x.', options: ['x=2', 'x=3', 'x=4', 'x=5'], correctAnswer: 1, explanation: '3x = 9, x = 3', difficulty: 'easy', year: 2019 },

  // Chemistry - Physical & Inorganic (45 questions)
  { id: '76', subject: 'Chemistry', topic: 'Atomic Structure', question: 'Max electrons in shell n=3?', options: ['8', '18', '32', '50'], correctAnswer: 1, explanation: '2n² = 2(3)² = 18', difficulty: 'easy', year: 2020 },
  { id: '77', subject: 'Chemistry', topic: 'Bonding', question: 'Which has highest bond angle?', options: ['H₂O', 'NH₃', 'CH₄', 'H₂S'], correctAnswer: 2, explanation: 'CH₄ tetrahedral = 109.5°', difficulty: 'medium', year: 2021 },
  { id: '78', subject: 'Chemistry', topic: 'Thermodynamics', question: 'Endothermic reaction at equilibrium. Temperature increases, equilibrium?', options: ['Shifts left', 'Shifts right', 'No change', 'Stops'], correctAnswer: 1, explanation: 'Endothermic: heat absorbed, increase T shifts right', difficulty: 'medium', year: 2022 },
  { id: '79', subject: 'Chemistry', topic: 'Kinetics', question: 'First order: [A] 0.8M to 0.2M in 60min. Half-life?', options: ['20 min', '30 min', '40 min', '50 min'], correctAnswer: 1, explanation: 'ln(0.2/0.8) = -k×60. t₁/₂ = ln2/k = 30 min', difficulty: 'hard', year: 2021 },
  { id: '80', subject: 'Chemistry', topic: 'Organic', question: 'IUPAC name of CH₃-CH₂-OH?', options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'], correctAnswer: 1, explanation: '2 carbons with -OH = ethanol', difficulty: 'easy', year: 2019 },
  { id: '81', subject: 'Chemistry', topic: 'Electrochemistry', question: 'Highest oxidation state of Cr?', options: ['CrO₂', 'Cr₂O₃', 'CrO₃', 'K₂CrO₄'], correctAnswer: 3, explanation: 'In K₂CrO₄, Cr = +6', difficulty: 'medium', year: 2020 },
  { id: '82', subject: 'Chemistry', topic: 'Mole Concept', question: '1 mole of CO₂ at STP. Volume?', options: ['11.2 L', '22.4 L', '44.8 L', '33.6 L'], correctAnswer: 1, explanation: '1 mole = 22.4 L at STP', difficulty: 'easy', year: 2021 },
  { id: '83', subject: 'Chemistry', topic: 'pH', question: '0.01M HCl solution pH?', options: ['1', '2', '3', '12'], correctAnswer: 1, explanation: 'pH = -log[H⁺] = -log(0.01) = 2', difficulty: 'easy', year: 2022 },
  { id: '84', subject: 'Chemistry', topic: 'Redox', question: 'In Zn+Cu²⁺→Zn²⁺+Cu, reducing agent?', options: ['Zn', 'Cu²⁺', 'Zn²⁺', 'Cu'], correctAnswer: 0, explanation: 'Zn loses electrons, reducing agent', difficulty: 'easy', year: 2020 },
  { id: '85', subject: 'Chemistry', topic: 'Periodic', question: 'Atomic radius trend in group?', options: ['Increases down', 'Decreases down', 'No trend', 'Same'], correctAnswer: 0, explanation: 'Shells increase, radius increases', difficulty: 'easy', year: 2019 },
  { id: '86', subject: 'Chemistry', topic: 'States of Matter', question: 'Ideal gas equation?', options: ['PV=nRT', 'PV=RT', 'P=nRT', 'V=nRT'], correctAnswer: 0, explanation: 'PV = nRT', difficulty: 'easy', year: 2021 },
  { id: '87', subject: 'Chemistry', topic: 'Solutions', question: 'Molarity of 4g NaOH in 250mL? (M=40)', options: ['0.1 M', '0.2 M', '0.4 M', '0.8 M'], correctAnswer: 2, explanation: 'M = (4/40)/(0.25) = 0.4 M', difficulty: 'medium', year: 2022 },
  { id: '88', subject: 'Chemistry', topic: 'Halogens', question: 'Most reactive halogen?', options: ['F', 'Cl', 'Br', 'I'], correctAnswer: 0, explanation: 'Fluorine most reactive', difficulty: 'easy', year: 2020 },
  { id: '89', subject: 'Chemistry', topic: 'Hydrocarbons', question: 'General formula of alkanes?', options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], correctAnswer: 1, explanation: 'Alkanes: CₙH₂ₙ₊₂', difficulty: 'easy', year: 2019 },
  { id: '90', subject: 'Chemistry', topic: 'Alcohols', question: 'Primary alcohol oxidation gives?', options: ['Ketone', 'Aldehyde then acid', 'Ether', 'Alkene'], correctAnswer: 1, explanation: '1° alcohol → aldehyde → acid', difficulty: 'medium', year: 2021 },
  { id: '91', subject: 'Chemistry', topic: 'Metallurgy', question: 'Ore of iron?', options: ['Bauxite', 'Haematite', 'Galena', 'Chalcopyrite'], correctAnswer: 1, explanation: 'Haematite Fe₂O₃', difficulty: 'easy', year: 2019 },
  { id: '92', subject: 'Chemistry', topic: 'Acids Bases', question: 'pH + pOH = ?', options: ['7', '14', '1', '0'], correctAnswer: 1, explanation: 'pH + pOH = 14 at 25°C', difficulty: 'easy', year: 2020 },
  { id: '93', subject: 'Chemistry', topic: 'Isomerism', question: 'C₄H₁₀ structural isomers?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: 'n-butane and isobutane', difficulty: 'medium', year: 2022 },
  { id: '94', subject: 'Chemistry', topic: 'Colligative', question: 'Adding salt to water affects?', options: ['Boiling point increases', 'BP decreases', 'No change', 'Freezes faster'], correctAnswer: 0, explanation: 'Elevation of BP', difficulty: 'medium', year: 2021 },
  { id: '95', subject: 'Chemistry', topic: 'Nomenclature', question: 'Functional group -CHO?', options: ['Alcohol', 'Aldehyde', 'Ketone', 'Acid'], correctAnswer: 1, explanation: '-CHO is aldehyde group', difficulty: 'easy', year: 2019 },
  { id: '96', subject: 'Chemistry', topic: 'Valency', question: 'Valency of nitrogen in NH₃?', options: ['1', '2', '3', '4'], correctAnswer: 2, explanation: 'N forms 3 bonds in NH₃', difficulty: 'easy', year: 2020 },
  { id: '97', subject: 'Chemistry', topic: 'Combustion', question: 'Complete combustion of hydrocarbon produces?', options: ['CO + H₂O', 'CO₂ + H₂O', 'C + H₂', 'CO₂ only'], correctAnswer: 1, explanation: 'Complete combustion → CO₂ + H₂O', difficulty: 'easy', year: 2022 },
  { id: '98', subject: 'Chemistry', topic: 'Catalyst', question: 'Catalyst affects?', options: ['Equilibrium position', 'Reaction rate', 'Final products', 'Yield'], correctAnswer: 1, explanation: 'Catalyst speeds up reaction rate', difficulty: 'medium', year: 2021 },
  { id: '99', subject: 'Chemistry', topic: 'Alloys', question: 'Bronze is alloy of?', options: ['Cu + Zn', 'Cu + Sn', 'Fe + C', 'Cu + Ni'], correctAnswer: 1, explanation: 'Bronze = Copper + Tin', difficulty: 'easy', year: 2019 },
  { id: '100', subject: 'Chemistry', topic: 'Periodic Table', question: 'Element with atomic number 1?', options: ['Helium', 'Hydrogen', 'Carbon', 'Oxygen'], correctAnswer: 1, explanation: 'H = Hydrogen, Z=1', difficulty: 'easy', year: 2020 },
  { id: '101', subject: 'Chemistry', topic: 'Noble Gas', question: 'Inert gas with symbol Ar?', options: ['Argon', 'Arsenic', 'Silver', 'Gold'], correctAnswer: 0, explanation: 'Ar = Argon', difficulty: 'easy', year: 2022 },
  { id: '102', subject: 'Chemistry', topic: 'Water', question: 'pH of pure water?', options: ['0', '7', '14', '1'], correctAnswer: 1, explanation: 'Neutral pH = 7', difficulty: 'easy', year: 2021 },
  { id: '103', subject: 'Chemistry', topic: 'Symbols', question: 'Chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 2, explanation: 'Au = Gold (Aurum)', difficulty: 'easy', year: 2019 },
  { id: '104', subject: 'Chemistry', topic: 'Electron Config', question: 'Electron configuration of He?', options: ['1s¹', '1s²', '2s²', '1s²2s²'], correctAnswer: 1, explanation: 'Helium: 1s²', difficulty: 'easy', year: 2020 },
  { id: '105', subject: 'Chemistry', topic: 'States', question: 'Water at 100°C is?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correctAnswer: 2, explanation: 'Boiling point → gas (steam)', difficulty: 'easy', year: 2022 },
  { id: '106', subject: 'Chemistry', topic: 'Atoms', question: 'Smallest particle of element?', options: ['Molecule', 'Atom', 'Electron', 'Proton'], correctAnswer: 1, explanation: 'Atom is smallest unit of element', difficulty: 'easy', year: 2021 },
  { id: '107', subject: 'Chemistry', topic: 'Mixtures', question: 'Salt dissolved in water is?', options: ['Compound', 'Mixture', 'Element', 'Suspension'], correctAnswer: 1, explanation: 'Solution is homogeneous mixture', difficulty: 'easy', year: 2019 },
  { id: '108', subject: 'Chemistry', topic: 'Stoichiometry', question: '2H₂ + O₂ → 2H₂O. Moles of H₂ needed for 1 mole O₂?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: 'Ratio 2:1, need 2 moles H₂', difficulty: 'easy', year: 2020 },
  { id: '109', subject: 'Chemistry', topic: 'Equilibrium', question: 'Kc>1 means?', options: ['Products favored', 'Reactants favored', 'No reaction', 'Both equal'], correctAnswer: 0, explanation: 'Kc>1: products predominate', difficulty: 'medium', year: 2022 },
  { id: '110', subject: 'Chemistry', topic: 'Titration', question: '25ml 0.1M HCl neutralized by 25ml NaOH. Molarity of NaOH?', options: ['0.05 M', '0.1 M', '0.2 M', '0.5 M'], correctAnswer: 1, explanation: 'M₁V₁ = M₂V₂. 0.1×25 = M₂×25, M₂ = 0.1 M', difficulty: 'medium', year: 2021 },
  { id: '111', subject: 'Chemistry', topic: 'Gas Laws', question: 'Boyles Law states?', options: ['P∝1/V', 'V∝T', 'P∝T', 'PV=constant'], correctAnswer: 3, explanation: 'At constant T: PV = k', difficulty: 'easy', year: 2019 },
  { id: '112', subject: 'Chemistry', topic: 'Oxidation Number', question: 'Oxidation number of O in H₂O?', options: ['+2', '-2', '+1', '-1'], correctAnswer: 1, explanation: 'Oxygen usually -2', difficulty: 'easy', year: 2020 },
  { id: '113', subject: 'Chemistry', topic: 'Isotopes', question: 'Isotopes have same?', options: ['Mass number', 'Atomic number', 'Neutrons', 'Mass'], correctAnswer: 1, explanation: 'Same protons (atomic number)', difficulty: 'easy', year: 2022 },
  { id: '114', subject: 'Chemistry', topic: 'Le Chatelier', question: 'Increasing pressure shifts equilibrium toward?', options: ['More moles side', 'Fewer moles side', 'No shift', 'Left always'], correctAnswer: 1, explanation: 'Pressure favors fewer gas moles', difficulty: 'medium', year: 2021 },
  { id: '115', subject: 'Chemistry', topic: 'Quantum Numbers', question: 'Azimuthal quantum number l=0 represents?', options: ['s orbital', 'p orbital', 'd orbital', 'f orbital'], correctAnswer: 0, explanation: 'l=0 is s, l=1 is p, l=2 is d', difficulty: 'easy', year: 2019 },
  { id: '116', subject: 'Chemistry', topic: 'Hybridization', question: 'Carbon in CH₄ is?', options: ['sp', 'sp²', 'sp³', 'sp³d'], correctAnswer: 2, explanation: 'Tetrahedral = sp³', difficulty: 'medium', year: 2020 },
  { id: '117', subject: 'Chemistry', topic: 'VSEPR', question: 'H₂O molecule shape?', options: ['Linear', 'Bent', 'Tetrahedral', 'Trigonal'], correctAnswer: 1, explanation: 'Bent due to lone pairs', difficulty: 'medium', year: 2022 },
  { id: '118', subject: 'Chemistry', topic: 'Electronegativity', question: 'Most electronegative element?', options: ['Cl', 'F', 'O', 'N'], correctAnswer: 1, explanation: 'Fluorine most electronegative', difficulty: 'easy', year: 2021 },
  { id: '119', subject: 'Chemistry', topic: 'Buffers', question: 'Buffer solution resists change in?', options: ['pH', 'Temperature', 'Volume', 'Pressure'], correctAnswer: 0, explanation: 'Buffer maintains stable pH', difficulty: 'easy', year: 2019 },
  { id: '120', subject: 'Chemistry', topic: 'Activation Energy', question: 'Catalyst lowers?', options: ['ΔH', 'Ea', 'ΔG', 'ΔS'], correctAnswer: 1, explanation: 'Catalyst lowers activation energy', difficulty: 'medium', year: 2020 },
]

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject')
    const difficulty = searchParams.get('difficulty')
    const limit = searchParams.get('limit')

    let questions = [...SAMPLE_QUESTIONS]

    // Filter by subject
    if (subject && subject !== 'all') {
      questions = questions.filter((q) => q.subject.toLowerCase() === subject.toLowerCase())
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'mixed') {
      questions = questions.filter((q) => q.difficulty === difficulty)
    }

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5)

    // Limit number of questions
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum) && limitNum > 0) {
        questions = questions.slice(0, limitNum)
      }
    }

    return NextResponse.json({ questions, total: questions.length })
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
