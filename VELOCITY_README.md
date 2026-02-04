# Velocity - Adaptive Study Planner

An intelligent learning management system designed to overcome "planner guilt" by adapting to students' pace, energy levels, and learning patterns. Powered by Nova, an AI study assistant.

## Core Features

### 1. **Dynamic Catch-Up Engine**
- **Priority Formula**: P = (D × C) / T
  - D = Difficulty (1-10)
  - C = Importance/Criticality (1-10)
  - T = Time remaining until deadline (days)
- Automatically redistributes overdue tasks across remaining days
- Redistributes based on priority rather than simply marking as "late"
- Logs all redistribution decisions with reasoning

### 2. **Cognitive Load & Energy Mapping**
- **Peak Hours Scheduling**: Schedules high-intensity tasks during student's peak performance hours
- **Energy Slump Management**: Reserves low-intensity tasks for afternoon energy dips
- **Task Intensity Classification**:
  - High: Complex, difficult concepts requiring full mental capacity
  - Medium: Moderate difficulty, can handle with good focus
  - Low: Revision, light reading, easy practice problems
- **Cognitive Load Calculation**: Combines task difficulty, importance, and remaining time
- **Smart Scheduling Algorithm**: Matches task intensity to available energy levels throughout the day

### 3. **Spaced Repetition System (SRS)**
Automatically schedules review sessions at scientifically optimal intervals:
- **1-day review**: Reinforce immediate memory
- **3-day review**: Strengthen recall after the forgetting curve begins
- **7-day review**: Combat the majority of information loss
- **30-day review**: Lock in long-term retention

Auto-generates lightweight review tasks in the task list. Perfect for exam preparation!

### 4. **Nova AI Assistant**
Intelligent chatbot powered by GPT-4 that understands the complete Velocity system:
- **Personalized guidance** on task prioritization
- **Motivation & support** to overcome planner guilt
- **Study strategy recommendations** based on current workload
- **Real-time context awareness** of your tasks and schedule
- **Evidence-based advice** on learning techniques

### 5. **Energy Analytics Dashboard**
- **Retention rate tracking** for spaced repetition
- **Task intensity distribution** visualization
- **Cognitive load analysis** across all tasks
- **Peak productivity hours** identification
- **Smart recommendations** for optimal study timing

## Architecture

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **AI**: Vercel AI SDK 6 with OpenAI models
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui, Radix UI
- **Data Visualization**: Recharts

### Database Schema

#### Core Tables
- **users**: User accounts and profiles
- **user_preferences**: Energy patterns, peak hours, daily study targets
- **study_periods**: Courses/exams with deadlines
- **tasks**: Individual study tasks with priority metrics
- **spaced_repetitions**: SRS schedules and completion tracking

#### Analytics & History
- **session_history**: Pomodoro sessions, actual vs. estimated time
- **chat_history**: Nova conversation logs
- **redistribution_logs**: Catch-up engine decisions with reasoning
- **exam_buffers**: Countdown phase tracking (learning → revision → mocks → rest)

### Key Algorithms

#### Priority Score Calculation
```
Priority = (Difficulty × Importance) / Days_Remaining
```

#### Cognitive Load Estimation
```
Load = Base_Priority × Time_Multiplier
where Time_Multiplier = min(Estimated_Time / 45, 2)
```

#### Schedule Optimization
1. Sort tasks by cognitive load (highest first)
2. Generate available time slots for each day
3. Score task-to-slot matches based on:
   - Energy level alignment (high-intensity tasks → peak hours)
   - Duration fit
   - Consecutive session buffer (30 min minimum)
4. Assign tasks to optimal slots with remaining capacity

## User Flow

### Onboarding
1. Create account (email/password)
2. Add study period (course name, exam date, description)
3. Set energy preferences:
   - Peak hours (when most alert)
   - Energy slump times
   - Daily study target
   - Preferred session length (typically 45 min)

### Daily Usage
1. **View Dashboard**: See overview of tasks, schedule, progress
2. **Add Tasks**: Create tasks with difficulty, importance, estimated time
3. **Check Schedule**: See tasks distributed across calendar
4. **Consult Nova**: Ask about priorities, strategies, motivation
5. **Track Energy**: Understand personal productivity patterns
6. **Complete Reviews**: Follow SRS schedule for long-term retention

### Smart Redistribution
When tasks fall behind:
1. **Detection**: System identifies overdue tasks
2. **Priority Scoring**: Each task gets P = (D × C) / T score
3. **Intelligent Redistribution**: High-priority tasks get earlier slots
4. **Energy Mapping**: Scheduled during appropriate energy windows
5. **Logging**: Tracks why redistribution happened for learning

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user profile

### Tasks
- `GET /api/tasks` - Fetch user tasks (with filters)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Study Management
- `GET /api/study-periods` - List study periods
- `POST /api/onboarding` - Complete onboarding setup
- `GET /api/user-preferences` - Get energy/schedule preferences

### Smart Features
- `POST /api/catch-up` - Analyze overdue tasks and get redistribution plan
- `GET /api/spaced-repetitions` - Fetch review schedules
- `POST /api/spaced-repetitions` - Create SRS schedule
- `PATCH /api/spaced-repetitions/[id]` - Mark review completed
- `POST /api/redistribution-log` - Log redistribution decision

### AI
- `POST /api/chat` - Chat with Nova AI assistant

## Setup Instructions

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup
1. Create Supabase project
2. Run migration: `scripts/init-velocity-db.sql`
3. Enable Row Level Security (RLS) on tables for security

### Deploy
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Usage Tips

### Overcoming Planner Guilt
- Velocity treats late tasks as scheduling opportunities, not failures
- The Catch-Up Engine redistributes intelligently—no "bad" rescheduling
- Focus on the algorithm's priority ranking, not artificial deadlines

### Maximizing Retention
- Spaced repetition is science-backed: complete all four review sessions
- Review sessions are automatically created; just follow the schedule
- Nova can explain WHY spaced repetition works and motivate consistency

### Energy-Based Scheduling
- Be honest about peak hours—this personalizes everything
- Low-intensity tasks during slumps prevent burnout
- Mix subjects to use different mental resources

### Nova's Best Uses
- "I have 5 overdue tasks—where do I start?" → Priority analysis
- "Am I on track for the exam?" → Deadline countdown guidance
- "Why am I so tired studying at 2 PM?" → Energy pattern analysis
- "How do I study better?" → Evidence-based learning techniques

## Features Coming Soon

1. **Exam Countdown Buffer**: Auto-transition from learning → revision → mocks → rest
2. **Focus Mode with Pomodoro**: Track actual time vs. estimated, learn personal pace
3. **Advanced Analytics**: Identify productivity patterns, optimal study times
4. **Study Groups**: Collaborate with peers, share resources
5. **Mobile App**: Native iOS/Android with offline support
6. **Custom Review Intervals**: Adjust SRS schedule for different subjects
7. **Goal Setting**: Long-term learning objectives with milestone tracking

## Research & References

Velocity implements evidence-based learning science:
- **Spaced Repetition**: Ebbinghaus forgetting curve (Cepeda et al., 2006)
- **Cognitive Load Theory**: Sweller (1988) - matching task intensity to capacity
- **Distributed Learning**: Brown, Roediger & McDaniel (2014)
- **Time Management**: Cirillo's Pomodoro Technique
- **Priority Frameworks**: Eisenhower matrix adapted for academic work

## License

Velocity is built with v0 and uses modern open-source technologies. Use freely for educational purposes.

---

**Velocity**: *Adaptive learning that adapts to YOU, not the other way around.*
