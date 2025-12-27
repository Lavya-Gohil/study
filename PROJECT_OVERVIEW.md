# 🎓 StudyFocus - Complete AI Study Planner

## Overview

StudyFocus is a full-stack web application designed to help students preparing for competitive exams (JEE, SAT, Boards) stay focused, consistent, and organized using AI-powered features.

## ✅ Implemented Features

### 1. **User Authentication**
- Email/password registration and login
- Google OAuth integration
- Session management with NextAuth.js
- Protected routes with middleware

### 2. **Onboarding System**
- 4-step interactive form
- Collects: exam type, subjects, daily hours, exam date
- Beautiful UI with progress indicators
- Data stored in PostgreSQL

### 3. **AI Study Plan Generator**
- Powered by OpenAI GPT-4
- Generates personalized daily study plans
- Considers exam date, subjects, and available hours
- Task breakdown with priority levels
- Completion tracking

### 4. **Focus Timer**
- **Pomodoro Mode**: 25 min work + 5 min break cycles
- **Deep Focus Mode**: 60 min uninterrupted sessions
- Circular progress visualization
- Session logging in database
- Distraction lock indicator

### 5. **Streak System**
- Tracks consecutive study days
- Shows current streak and longest streak
- Total study days counter
- Motivational messages
- Visual fire emoji indicator

### 6. **AI Doubt Solver**
- Text-based question submission
- Subject-specific answers
- Powered by OpenAI GPT-4
- Answer history storage
- Clear, step-by-step explanations

### 7. **Subscription System**
- Free tier with limited features
- Premium plans (Monthly/Yearly)
- 7-day free trial
- Stripe payment integration
- Automatic subscription management
- Webhook handling for status updates

### 8. **Dashboard**
- Clean, modern UI
- Today's study plan display
- Streak visualization
- Quick access to timer and doubts
- Task completion with checkbox tracking

### 9. **Pricing Page**
- 3-tier display (Free, Monthly, Yearly)
- Feature comparison
- Clear CTAs
- Trial information
- Stripe checkout integration

### 10. **Landing Page**
- Hero section with CTA
- Feature highlights
- Social proof stats
- Responsive design
- Gradient backgrounds

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - RESTful endpoints
- **NextAuth.js** - Authentication
- **Prisma ORM** - Database queries
- **PostgreSQL** - Data storage

### External APIs
- **OpenAI GPT-4** - AI study plans & doubt solving
- **Stripe** - Payment processing
- **Google OAuth** - Social login

## 📊 Database Schema

### Core Tables
1. **User** - Authentication, profile, subscription
2. **Account** - OAuth accounts
3. **Session** - User sessions
4. **StudyPlan** - Daily AI-generated plans
5. **Streak** - Consistency tracking
6. **FocusSession** - Timer sessions
7. **Doubt** - Q&A history
8. **WeeklyProgress** - Analytics data

## 🔐 Security Features

- Password hashing with bcrypt
- JWT session tokens
- CSRF protection
- Environment variable protection
- API route authentication
- Webhook signature verification

## 💰 Monetization Model

### Free Tier
- Basic timer
- Manual planning
- 2 subjects max
- No AI features

### Premium (₹499/month or ₹3999/year)
- 7-day free trial
- AI study plans
- Unlimited subjects
- AI doubt solver
- Advanced analytics
- Distraction lock
- Priority support

## 📁 Project Structure

```
app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth/         # Register, signin
│   │   │   ├── onboarding/   # Save onboarding
│   │   │   ├── study-plan/   # Generate & update plans
│   │   │   ├── streak/       # Get streak data
│   │   │   ├── focus/        # Log sessions
│   │   │   ├── doubts/       # AI Q&A
│   │   │   ├── checkout/     # Stripe checkout
│   │   │   └── webhooks/     # Stripe events
│   │   ├── auth/
│   │   │   ├── signin/       # Login page
│   │   │   └── signup/       # Register page
│   │   ├── dashboard/        # Main app
│   │   ├── doubts/           # Q&A interface
│   │   ├── onboarding/       # Onboarding flow
│   │   ├── pricing/          # Plans page
│   │   └── page.tsx          # Landing
│   ├── components/
│   │   ├── FocusTimer.tsx    # Timer component
│   │   ├── StreakDisplay.tsx # Streak UI
│   │   └── StudyPlan.tsx     # Task list
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── prisma.ts         # DB client
│   │   ├── openai.ts         # AI functions
│   │   └── stripe.ts         # Payments
│   └── middleware.ts         # Route protection
├── .env                       # Environment variables
├── .env.example              # Template
├── package.json              # Dependencies
├── README.md                 # Documentation
└── SETUP.md                  # Setup guide
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your keys

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `GET /api/auth/signin` - Login
- `GET /api/auth/signout` - Logout

### Features
- `POST /api/onboarding` - Save onboarding
- `GET /api/study-plan` - Get/generate plan
- `PATCH /api/study-plan` - Mark task complete
- `GET /api/streak` - Get streak data
- `POST /api/focus` - Start session
- `PATCH /api/focus` - Complete session
- `POST /api/doubts` - Ask question
- `GET /api/doubts` - Get history
- `POST /api/checkout` - Create payment
- `POST /api/webhooks/stripe` - Handle events

## 🎨 UI Features

- Gradient backgrounds
- Smooth animations
- Responsive design (mobile-first)
- Loading states
- Error handling
- Toast notifications
- Progress indicators
- Modern card layouts

## 🔄 User Flow

1. **Landing** → Sign up
2. **Onboarding** → 4-step form
3. **Dashboard** → View AI plan
4. **Study** → Use timer, mark tasks
5. **Doubt** → Ask AI questions
6. **Upgrade** → Subscribe via Stripe
7. **Repeat** → Maintain streak

## 📈 Success Metrics

- Daily Active Users (DAU)
- Streak completion rate
- Free → Paid conversion
- Average session duration
- Task completion rate
- Subscription retention

## 🔮 Future Enhancements

### Phase 2
- [ ] Weekly analytics dashboard
- [ ] Progress charts (Recharts)
- [ ] Performance predictions
- [ ] Subject-wise insights

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Dark mode

### Phase 4
- [ ] Group study rooms
- [ ] Leaderboards
- [ ] Gamification badges
- [ ] Live doubt sessions

### Phase 5
- [ ] Practice test generator
- [ ] Video explanations
- [ ] Parent dashboard
- [ ] School integrations

## 🐛 Known Limitations

- Study plans generated once per day
- Streak resets if missed (by design)
- Premium features require subscription
- Timer doesn't force distraction lock (browser limitation)
- No offline functionality

## 💡 Configuration

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret
- `OPENAI_API_KEY` - AI features
- `STRIPE_SECRET_KEY` - Payments
- `STRIPE_PUBLIC_KEY` - Client-side
- `STRIPE_WEBHOOK_SECRET` - Webhooks
- `STRIPE_PRICE_ID_MONTHLY` - Monthly plan
- `STRIPE_PRICE_ID_YEARLY` - Yearly plan

### Optional
- `GOOGLE_CLIENT_ID` - Google OAuth
- `GOOGLE_CLIENT_SECRET` - Google OAuth

## 📦 Dependencies

### Production
- next, react, react-dom
- @prisma/client
- next-auth, @auth/prisma-adapter
- stripe
- openai
- bcrypt
- zod
- tailwindcss

### Development
- typescript
- @types/node, @types/react
- prisma
- eslint

## 🚢 Deployment

### Recommended Stack
- **Frontend/API**: Vercel
- **Database**: Supabase / Railway / Neon
- **Storage**: Not required for MVP

### Deployment Steps
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Update Stripe webhook URL
6. Test production

## 📧 Support

For questions or issues:
- Check SETUP.md for detailed instructions
- Review code comments
- Check Prisma schema
- Review API route implementations

## 📄 License

MIT License - Free to use and modify

## 🙏 Credits

Built with:
- Next.js
- OpenAI
- Stripe
- Prisma
- Tailwind CSS

---

**Ready to help students ace their exams! 🎯**
