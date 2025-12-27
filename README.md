# StudyFocus - AI-Powered Study Planner

A focused study app that uses AI to create daily study plans, lock distractions, and keep students accountable through streaks and performance analytics. Built for students preparing for competitive exams (JEE, SAT, boards).

## Features

### MVP Features ✅
- **User Authentication**: Email/password and Google OAuth
- **Onboarding Flow**: Multi-step form for exam type, subjects, study hours, and exam date
- **AI-Generated Study Plans**: Personalized daily tasks using OpenAI GPT-4
- **Focus Timer**: Pomodoro (25 min) and Deep Focus (60 min) modes
- **Streak System**: Track daily completion and maintain study streaks
- **AI Doubt Solver**: Text-based question answering powered by AI
- **Subscription System**: Free tier with 7-day premium trial via Stripe
- **Progress Tracking**: Database-backed study session and completion tracking

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Payments**: Stripe

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Stripe account
- Google OAuth credentials (optional)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in required variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `OPENAI_API_KEY`: From OpenAI Platform
   - `STRIPE_SECRET_KEY` & pricing IDs: From Stripe Dashboard
   - `GOOGLE_CLIENT_ID/SECRET`: From Google Cloud Console (optional)

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## External Services Setup

### PostgreSQL Database
- **Local**: Install PostgreSQL and create a database
- **Cloud**: Use [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech)

### OpenAI API
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to `.env` as `OPENAI_API_KEY`

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Create two subscription products (Monthly ₹499 & Yearly ₹3999)
4. Copy price IDs to `.env`
5. Set up webhook: `/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`

### Google OAuth (Optional)
1. [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Redirect URI: `http://localhost:3000/api/auth/callback/google`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard
│   ├── doubts/           # AI doubt solver
│   ├── onboarding/       # User onboarding
│   └── pricing/          # Subscription plans
├── components/           # React components
└── lib/                  # Utilities (auth, prisma, openai, stripe)
```

## Key Features Implementation

### AI Study Plan Generation
Uses OpenAI GPT-4 to create personalized daily study schedules based on:
- Exam type (JEE, SAT, etc.)
- Selected subjects
- Daily study hours
- Days until exam

### Streak System
Tracks consecutive days of study plan completion with visual progress indicators.

### Focus Timer
- **Pomodoro**: 25 min work + 5 min break
- **Deep Focus**: 60 min uninterrupted session

### Monetization
- **Free**: Basic features, limited functionality
- **Premium**: ₹499/month or ₹3999/year with 7-day trial

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database
Use cloud PostgreSQL (Supabase/Railway/Neon)

### Update Stripe Webhook
Change webhook URL to production endpoint

## API Endpoints

- `POST /api/auth/register` - Sign up
- `GET /api/study-plan` - Get AI-generated plan
- `POST /api/doubts` - Ask AI question
- `GET /api/streak` - Get user streak
- `POST /api/checkout` - Create Stripe session

## Future Enhancements
- Mobile app
- Group study rooms
- Practice tests
- Performance analytics
- Parent dashboard

---

Built for students preparing for competitive exams 🎓
