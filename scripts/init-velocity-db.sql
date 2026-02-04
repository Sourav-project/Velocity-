-- Velocity Study Planner Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences table (Energy levels and peak hours)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  peak_hours_start TIME DEFAULT '09:00',
  peak_hours_end TIME DEFAULT '12:00',
  energy_slump_start TIME DEFAULT '14:00',
  energy_slump_end TIME DEFAULT '16:00',
  preferred_session_length INTEGER DEFAULT 45,
  daily_study_hours INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Study Periods/Courses table
CREATE TABLE IF NOT EXISTS study_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  exam_date DATE NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_period_id UUID NOT NULL REFERENCES study_periods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  difficulty INTEGER DEFAULT 5, -- 1-10 scale
  importance INTEGER DEFAULT 5, -- 1-10 scale (C in formula)
  estimated_time INTEGER, -- in minutes
  actual_time INTEGER, -- in minutes (tracked by user)
  due_date DATE NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  intensity VARCHAR(50) DEFAULT 'medium', -- high, medium, low (for energy mapping)
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, overdue
  is_review_task BOOLEAN DEFAULT FALSE,
  original_task_id UUID REFERENCES tasks(id), -- for review task tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Spaced Repetition Schedule table
CREATE TABLE IF NOT EXISTS spaced_repetitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_study_date DATE NOT NULL,
  review_1_date DATE, -- 1 day
  review_3_date DATE, -- 3 days
  review_7_date DATE, -- 7 days
  review_30_date DATE, -- 30 days
  review_1_completed BOOLEAN DEFAULT FALSE,
  review_3_completed BOOLEAN DEFAULT FALSE,
  review_7_completed BOOLEAN DEFAULT FALSE,
  review_30_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Session History table (for Pomodoro and actual time tracking)
CREATE TABLE IF NOT EXISTS session_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_start_time TIMESTAMP,
  session_end_time TIMESTAMP,
  duration_minutes INTEGER, -- actual duration
  pomodoro_count INTEGER, -- number of 25min pomodoros
  focus_level VARCHAR(50), -- very_low, low, medium, high, very_high
  breaks_taken INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Chat History table (Nova interactions)
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  study_period_id UUID REFERENCES study_periods(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- user, assistant
  message TEXT NOT NULL,
  metadata JSONB, -- store task_id, suggestions, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Task Redistribution Log (tracking catch-up engine decisions)
CREATE TABLE IF NOT EXISTS redistribution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  original_due_date DATE NOT NULL,
  new_due_date DATE NOT NULL,
  priority_score DECIMAL(10, 2), -- P = (D × C) / T
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exam Countdown Buffer tracking
CREATE TABLE IF NOT EXISTS exam_buffers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_period_id UUID NOT NULL REFERENCES study_periods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase VARCHAR(50) DEFAULT 'learning', -- learning, revision, mock_tests, rest
  phase_start_date DATE,
  phase_end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_study_period_id ON tasks(study_period_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_study_periods_user_id ON study_periods(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_spaced_repetitions_task_id ON spaced_repetitions(task_id);
