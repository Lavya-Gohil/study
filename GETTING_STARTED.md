# 🚀 Quick Start Guide - StudyFocus

## Welcome! 👋

You've successfully set up the StudyFocus AI Study Planner codebase. This guide will help you get it running in under 10 minutes.

---

## ⚡ Super Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm run setup
```

This installs all packages and generates Prisma client.

### 2. Setup Environment
```bash
# Copy the example file
cp .env.example .env
```

### 3. Edit `.env` File

**Minimum Required (to run app):**
```env
# Use any PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/study_focus_db"

# Generate this secret
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Get from platform.openai.com
OPENAI_API_KEY="sk-..."

# Get from dashboard.stripe.com
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."

# Leave these for now (needed for subscriptions)
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_MONTHLY="price_..."
STRIPE_PRICE_ID_YEARLY="price_..."
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Setup Database
```bash
npm run db:push
```

### 5. Run the App! 🎉
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 🔑 Getting API Keys

### 1. PostgreSQL Database (5 minutes)

**Option A: Supabase (Recommended - Free)**
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click "New Project"
4. Copy the connection string from Settings > Database
5. Paste into `.env` as `DATABASE_URL`

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
createdb study_focus_db

# Add to .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/study_focus_db"
```

### 2. OpenAI API Key (3 minutes)

1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account / Sign in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy key and paste into `.env` as `OPENAI_API_KEY`
6. **Important:** Add $5-10 in credits for testing

### 3. Stripe Keys (5 minutes)

1. Visit [stripe.com](https://stripe.com)
2. Create account / Sign in
3. Enable "Test mode" (toggle in top right)
4. Go to Developers > API Keys
5. Copy both keys to `.env`:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `STRIPE_PUBLIC_KEY`

**Create Products:**
1. Products > Add Product
2. Create "Premium Monthly" - ₹499/month recurring
3. Create "Premium Yearly" - ₹3999/year recurring
4. Copy Price IDs to `.env`:
   ```env
   STRIPE_PRICE_ID_MONTHLY="price_xxxxx"
   STRIPE_PRICE_ID_YEARLY="price_xxxxx"
   ```

### 4. Google OAuth (Optional - 5 minutes)

1. [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

---

## 🧪 Test the App

### 1. Create Account
- Go to http://localhost:3000
- Click "Get Started"
- Sign up with email/password

### 2. Complete Onboarding
- Choose exam (e.g., JEE Main)
- Select 3-4 subjects
- Set 4-6 hours/day
- Pick exam date (future)

### 3. View Dashboard
✅ You should see:
- AI-generated study plan
- Streak counter (0 days)
- Focus timer button
- Ask Doubt button

### 4. Test Features

**Focus Timer:**
- Click "Focus Timer"
- Try Pomodoro mode
- Watch timer countdown

**AI Doubt Solver:**
- Click "Ask Doubt"
- Select subject
- Type a question
- Get AI answer

**Complete Tasks:**
- Click checkboxes to mark tasks done
- Watch streak update when all complete

### 5. Test Subscription (Optional)

**Use Stripe Test Card:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

- Go to Pricing
- Click "Start Free Trial"
- Enter test card
- Should redirect to dashboard with Premium status

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio (DB GUI)

# Setup
npm run setup            # Install + generate Prisma
```

---

## 🐛 Troubleshooting

### "Can't connect to database"
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL is correct
# Try pushing schema again:
npm run db:push
```

### "OpenAI API Error"
- Check API key is correct (starts with `sk-`)
- Verify you have credits in OpenAI account
- Check for extra spaces in `.env`

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run db:generate
```

### "Port 3000 in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### "Prisma Client not found"
```bash
npm run db:generate
```

---

## 📁 Project Structure

```
study-focus-app/
├── src/
│   ├── app/              # Pages & API routes
│   │   ├── api/          # Backend endpoints
│   │   ├── dashboard/    # Main app page
│   │   ├── auth/         # Login/signup
│   │   ├── onboarding/   # Setup wizard
│   │   ├── doubts/       # Q&A page
│   │   └── pricing/      # Plans page
│   ├── components/       # React components
│   └── lib/              # Utils & configs
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Your secrets (don't commit!)
└── package.json          # Dependencies
```

---

## 🎯 What You Can Do Now

✅ **Working Features:**
1. Sign up / Sign in
2. Google OAuth (if configured)
3. 4-step onboarding
4. AI study plan generation
5. Focus timer (Pomodoro & Deep Focus)
6. Streak tracking
7. Task completion
8. AI doubt solver
9. Subscription system
10. Responsive UI

---

## 📚 Next Steps

### Customize the App
1. **Change Branding**
   - Edit `src/app/page.tsx` (landing page)
   - Update colors in Tailwind config
   - Change app name throughout

2. **Modify AI Prompts**
   - Edit `src/lib/openai.ts`
   - Customize study plan generation
   - Adjust doubt solving responses

3. **Add Exam Types**
   - Edit `src/app/onboarding/page.tsx`
   - Add to `EXAM_TYPES` array

4. **Customize Subjects**
   - Edit `COMMON_SUBJECTS` in onboarding

### Deploy to Production
1. Push code to GitHub
2. Sign up on [Vercel](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy!
6. Update Stripe webhook URL

### Add More Features
- Weekly analytics dashboard
- Progress charts
- Email notifications
- Mobile app
- Dark mode
- Export data

---

## 🆘 Need Help?

**Documentation:**
- [README.md](README.md) - Overview
- [SETUP.md](SETUP.md) - Detailed setup
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Architecture
- [CHECKLIST.md](CHECKLIST.md) - Feature list

**Resources:**
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)
- Stripe: [stripe.com/docs](https://stripe.com/docs)
- OpenAI: [platform.openai.com/docs](https://platform.openai.com/docs)

---

## 🎉 You're All Set!

Your AI-powered study planner is ready to help students ace their exams.

**Happy coding! 🚀**

---

### Quick Reference

```bash
# Start development
npm run dev

# View database
npm run db:studio

# Build for production
npm run build
npm run start
```

**Default Ports:**
- App: http://localhost:3000
- Prisma Studio: http://localhost:5555

**Test Credentials:**
- Email: test@example.com
- Password: password123

**Stripe Test Card:**
- 4242 4242 4242 4242 (any future date, any CVC)

---

**Built with ❤️ for students**
