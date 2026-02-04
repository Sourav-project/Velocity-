# Velocity - Quick Start Guide

## For Users: Getting Started with Velocity

### Step 1: Sign Up
1. Go to your Velocity instance
2. Click "Sign up" on the login page
3. Enter your name, email, and password
4. Click "Create Account"

### Step 2: Complete Onboarding
1. **Course Information**
   - Course/Subject name (e.g., "Biology", "MCAT")
   - Optional description of topics
   - Exam date (when you need to be ready)

2. **Energy Patterns**
   - When are you most alert? (Peak hours: e.g., 9 AM - 12 PM)
   - When do you dip energy-wise? (Slump: e.g., 2 PM - 4 PM)
   - Daily study target (e.g., 6 hours)
   - Preferred session length (e.g., 45 minutes)

### Step 3: Start Adding Tasks
1. Click "Add New Task"
2. Fill in:
   - **Title**: What are you studying?
   - **Subject**: Which topic?
   - **Due Date**: When is it due?
   - **Difficulty**: 1-10 (how hard?)
   - **Importance**: 1-10 (how critical?)
   - **Estimated Time**: Minutes needed
   - **Intensity**: High/Medium/Low (cognitive load)

3. Click "Create Task"

### Step 4: Check Your Dashboard
- **Overview**: See progress and any catch-up situations
- **Tasks**: All tasks sorted by priority (using P = (D×C)/T)
- **Schedule**: Calendar view of your work
- **Energy**: Analytics on your workload
- **Nova**: Chat with your AI study assistant

### Step 5: Ask Nova for Help
Click the "Nova" tab and try:
- "What should I focus on today?"
- "Help me prioritize my tasks"
- "I'm feeling overwhelmed"
- "Explain spaced repetition"
- "What are my peak hours again?"

### Step 6: Follow Your Schedule
- High-intensity tasks appear during your peak hours
- Low-intensity tasks during energy slumps
- Spaced repetition reviews appear automatically
- When overdue tasks exist, Velocity redistributes intelligently

## For Developers: Running Velocity Locally

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

### Installation

1. **Clone the repository** (or download the code from v0)
   ```bash
   git clone <your-repo>
   cd velocity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Go to Project Settings → API
   - Copy your API URL and anon key
   - Copy your service role key

4. **Create `.env.local`**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

5. **Initialize the database**
   - Go to your Supabase dashboard
   - Click "SQL Editor"
   - Click "New Query"
   - Copy the entire content of `scripts/init-velocity-db.sql`
   - Paste it and click "Run"
   - Wait for success confirmation

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   - Go to `http://localhost:3000`
   - You should see the login page

### First Test

1. Create an account (any email, any password)
2. Complete the onboarding (fill in dummy data is fine)
3. Add a task with:
   - Title: "Test Task"
   - Difficulty: 5
   - Importance: 7
   - Estimated Time: 30
   - Due Date: 2 weeks from now
4. View it on the dashboard
5. Try the Nova chat: "What's my first priority?"

## Core Concepts

### Priority Formula
Every task gets a score: **P = (D × C) / T**

- **D** (Difficulty): 1-10, how hard is this?
- **C** (Criticality): 1-10, how important?
- **T** (Time Left): Days until due

**Example**: A difficulty 8, importance 9 task due in 2 days:
```
P = (8 × 9) / 2 = 36 (HIGH PRIORITY)
```

The same task due in 14 days:
```
P = (8 × 9) / 14 = 5.1 (LOWER PRIORITY)
```

Velocity sorts all tasks by this score. Always do high P-score tasks first!

### Energy Mapping
- **Peak Hours**: You picked 9 AM - 12 PM? High-intensity tasks then
- **Slump Time**: You picked 2 PM - 4 PM? Light tasks only
- **Prevents Burnout**: Matches your brain's actual capacity

### Spaced Repetition
After you mark a task complete:
- 1 day later: Quick 20-min review
- 3 days later: Longer review session
- 7 days later: Deep review
- 30 days later: Final reinforcement

This matches how human memory works (Ebbinghaus curve). Finish all 4 reviews = 100% retention!

### Nova AI
Your 24/7 study buddy. She knows:
- Your exact task list
- Your energy patterns
- How much time you have
- Learning science & study techniques

Ask her anything about YOUR study plan, not generic advice.

## Troubleshooting

### "Unauthorized" error on login
- Check your email/password
- Make sure you completed signup
- Clear browser cookies and try again

### Tasks not appearing
- Make sure you're logged in
- Check that you completed onboarding
- Refresh the page (F5)

### Database errors during setup
- Verify your Supabase credentials in `.env.local`
- Make sure you ran the SQL migration script
- Check Supabase dashboard shows new tables

### Nova not responding
- Make sure you have OpenAI API access (it uses GPT-4)
- Check your API key is valid
- Try a simpler message first

### Energy Analytics shows "0 tasks"
- Add more tasks first
- Make sure tasks have difficulty/importance values

## Tips for Success

### Getting the Most Out of Velocity

1. **Be Honest About Energy**
   - Your peak hours and slumps are personal
   - If you're wrong, adjust them in settings
   - The system gets smarter as you use it

2. **Prioritize with P Formula**
   - Don't just use due date alone
   - Difficulty + Importance matter too
   - Velocity does this math for you

3. **Complete Spaced Repetitions**
   - Don't skip reviews
   - They only take 20 minutes
   - They're worth 80% of your learning

4. **Ask Nova When Stuck**
   - "I have 5 overdue tasks" → Get priority ranking
   - "Am I on track?" → Countdown analysis
   - "Should I take a break?" → Energy & wellbeing advice

5. **Trust the Redistribution**
   - When tasks fall behind, Velocity reschedulesNot because you failed, but because it's smart
   - No "planner guilt" — just adapt and move forward

## Keyboard Shortcuts

- `Ctrl+K` / `Cmd+K`: Coming soon (quick task search)
- `Ctrl+Alt+N` / `Cmd+Shift+N`: Coming soon (new task)

## Getting Help

### In-App
- Click the **Nova** tab and ask anything
- She understands the Velocity system completely

### Documentation
- Read `VELOCITY_README.md` for full details
- Read `PROJECT_SUMMARY.md` for architecture

### Issues
- Check browser console (F12) for error messages
- Verify `.env.local` variables are set correctly
- Make sure Supabase database tables were created

---

**Ready to stop feeling guilty about your study schedule?**

Start with Velocity and let it adapt to YOU. 🚀

*Adaptive learning. Real relief from planner guilt.*
