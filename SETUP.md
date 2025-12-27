# StudyFocus - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` and add these required values:

```env
# Database - Use a free PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/study_focus_db"

# NextAuth Secret - Generate with command below
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Stripe - Get from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
```

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 Detailed Setup

### Database Options

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL, then create database
createdb study_focus_db

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/study_focus_db"
```

#### Option B: Supabase (Free Cloud Database)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Add to `.env` as `DATABASE_URL`

#### Option C: Railway (Free Cloud Database)
1. Go to [railway.app](https://railway.app)
2. New Project > Add PostgreSQL
3. Copy DATABASE_URL from Variables tab
4. Add to `.env`

### OpenAI Setup
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account / Sign in
3. Go to API Keys section
4. Create new secret key
5. Copy and add to `.env` as `OPENAI_API_KEY`
6. Add credits to account (~$5 is enough for testing)

### Stripe Setup (For Subscriptions)

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for free account

2. **Get API Keys**
   - Dashboard > Developers > API Keys
   - Copy Secret key and Publishable key
   - Add to `.env`:
     ```env
     STRIPE_SECRET_KEY="sk_test_..."
     STRIPE_PUBLIC_KEY="pk_test_..."
     ```

3. **Create Products**
   - Dashboard > Products > Add Product
   - Create "Premium Monthly" - ₹499/month
   - Create "Premium Yearly" - ₹3999/year
   - Copy Price IDs and add to `.env`:
     ```env
     STRIPE_PRICE_ID_MONTHLY="price_..."
     STRIPE_PRICE_ID_YEARLY="price_..."
     ```

4. **Setup Webhook** (for production)
   - Dashboard > Developers > Webhooks
   - Add endpoint: `your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook secret to `.env`:
     ```env
     STRIPE_WEBHOOK_SECRET="whsec_..."
     ```

### Google OAuth (Optional)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy Client ID and Secret to `.env`:
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

---

## 🧪 Testing the App

### 1. Sign Up
- Visit `http://localhost:3000`
- Click "Get Started"
- Create account with email/password

### 2. Complete Onboarding
- Select exam type (e.g., JEE Main)
- Choose subjects
- Set daily study hours
- Set exam date

### 3. View Dashboard
- See AI-generated study plan
- Check your streak (starts at 0)
- Try focus timer
- Test doubt solver

### 4. Test Subscription (Optional)
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

---

## 🐛 Common Issues

### "Error connecting to database"
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Try `npx prisma db push` again

### "OpenAI API Error"
- Verify API key is correct
- Check if you have credits in OpenAI account
- Ensure no extra spaces in .env file

### "Prisma Client not found"
- Run `npx prisma generate`
- Restart dev server

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

---

## 📚 Next Steps

1. **Customize the app**
   - Update colors in `tailwind.config.ts`
   - Modify AI prompts in `src/lib/openai.ts`
   - Add more exam types in onboarding

2. **Deploy to production**
   - Push to GitHub
   - Deploy on Vercel
   - Update environment variables
   - Add production database
   - Configure Stripe webhooks

3. **Add features**
   - Weekly progress analytics
   - Parent dashboard
   - Mobile app
   - Practice tests

---

## 🆘 Need Help?

- Check the main [README.md](README.md)
- Review code comments
- Check Prisma schema in `prisma/schema.prisma`
- Review API routes in `src/app/api/`

---

## 🎯 Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/         # Authentication
│   │   ├── study-plan/   # AI study plans
│   │   ├── doubts/       # AI doubt solver
│   │   ├── focus/        # Focus sessions
│   │   ├── streak/       # Streak tracking
│   │   └── webhooks/     # Stripe webhooks
│   ├── auth/             # Auth pages (signin/signup)
│   ├── dashboard/        # Main app dashboard
│   ├── doubts/           # Doubt solver page
│   ├── onboarding/       # User onboarding
│   ├── pricing/          # Subscription plans
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   ├── FocusTimer.tsx
│   ├── StreakDisplay.tsx
│   └── StudyPlan.tsx
└── lib/                  # Utility functions
    ├── auth.ts           # NextAuth configuration
    ├── prisma.ts         # Database client
    ├── openai.ts         # AI functions
    └── stripe.ts         # Payment processing
```

---

Happy coding! 🚀
