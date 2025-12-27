# 🆓 100% Free Setup - No Credit Card Needed

## You Can Run This App Completely FREE! 🎉

### Step 1: Copy Environment File (30 seconds)
```bash
cp .env.example .env
```

### Step 2: Generate Auth Secret (30 seconds)
```bash
openssl rand -base64 32
```
Copy the output and paste it into `.env` as `NEXTAUTH_SECRET`

### Step 3: Get FREE Database (2 minutes)

**Supabase (Recommended - Easiest)**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (free, no card needed)
4. Create new project (pick any name/password)
5. Wait 2 minutes for it to set up
6. Go to Settings → Database
7. Copy "Connection String" (URI mode)
8. Paste into `.env` as `DATABASE_URL`

**Your .env should look like:**
```env
DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Leave these as-is for demo mode
OPENAI_API_KEY="your-openai-api-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

### Step 4: Setup Database (1 minute)
```bash
npm run db:push
```

### Step 5: Run the App! 🚀
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## What Works Without Paying?

### ✅ Works 100% Free (Demo Mode):
- Sign up / Sign in
- Complete onboarding
- View study plans (demo tasks)
- Use focus timer
- Track streaks
- Ask doubts (gets demo answers)
- Beautiful UI

### 💰 Need API Key For (Can Add Later):
- Real AI-generated study plans ($5 OpenAI credits)
- Real AI doubt solving ($5 OpenAI credits)
- Payment processing (Stripe is free in test mode)

---

## Testing the Free Version

1. **Sign Up**
   - Go to http://localhost:3000
   - Click "Get Started"
   - Create account

2. **Complete Onboarding**
   - Pick exam type
   - Select subjects
   - Set hours
   - Pick date

3. **See Demo Features**
   - ✅ Study plan (demo tasks)
   - ✅ Focus timer (fully working!)
   - ✅ Streak counter
   - ✅ Doubt solver (demo answers)

---

## Want Real AI Later?

When you have $5 for OpenAI:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Add $5 credits
3. Get API key
4. Update `.env`:
   ```env
   OPENAI_API_KEY="sk-your-real-key-here"
   ```
5. Restart server - AI features activate! 🎯

---

## Free Database Options

All have generous free tiers:

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Supabase** | 500MB | Easiest setup ⭐ |
| **Railway** | $5 credit | Good UI |
| **Neon** | 3GB | Most storage |
| **Local** | Unlimited | Development |

---

## Troubleshooting

**"Can't connect to database"**
- Check Supabase project is running
- Verify DATABASE_URL is correct (check for typos)
- Try copying connection string again

**"Demo study plan showing"**
- This is normal without OpenAI key!
- App works fine, just shows example tasks
- Add OpenAI key later for real AI

**Port 3000 in use**
```bash
npx kill-port 3000
npm run dev
```

---

## Summary

**Cost to run full app: $0 🎉**

Only need money for:
- OpenAI API ($5 minimum) - optional, demo mode works fine
- Production deployment - Vercel is free!

**Everything else is 100% free forever!**

Happy coding! 🚀
