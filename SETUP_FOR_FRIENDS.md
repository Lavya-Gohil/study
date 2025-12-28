# Setup Guide for Friends/Collaborators

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lavya-Gohil/study.git
   cd study
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get the `.env` file**
   - Ask Lavya (gohil.lavya@gmail.com) for the `.env` file with database credentials
   - Or copy `.env.example` to `.env` and ask for the DATABASE_URL password
   - Place the `.env` file in the root directory

4. **Run database migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Visit http://localhost:3000
   - Create an account to get started

## Database Access

The app uses a **shared Supabase PostgreSQL database**. This means:
- ✅ Everyone uses the same database (no local setup needed)
- ✅ Data is synced across all instances
- ✅ Works on any machine without local database installation
- ✅ Completely free (Supabase free tier)

## Admin Access

To access the admin panel at `/admin`:
- Any logged-in user can access it currently (for testing)
- In production, only `gohil.lavya@gmail.com` will have access

## Troubleshooting

### "Can't connect to database"
- Make sure you have the correct `.env` file with the DATABASE_URL
- Run `npx prisma generate` to regenerate the Prisma client

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and run `npm install` fresh

### Port already in use
- The app runs on port 3000 by default
- Kill any process using port 3000 or change the port in package.json

## Features Available

- ✅ User authentication (sign up/sign in)
- ✅ Dashboard with study tracking
- ✅ Practice mode with 120+ questions
- ✅ Focus timer with device lock
- ✅ Analytics and progress tracking
- ✅ Notes system
- ✅ Achievements and streaks
- ✅ Admin panel for question management
- ✅ Dark mode toggle

## Need Help?

Contact Lavya: gohil.lavya@gmail.com
GitHub: https://github.com/Lavya-Gohil/study
