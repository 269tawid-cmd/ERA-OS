-- Era OS Database Schema
-- Run this in Supabase SQL Editor
-- Version: 1.0

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TASKS TABLE
-- ============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    pillar TEXT NOT NULL CHECK (pillar IN ('HACK', 'BUILD', 'AI', 'PRESENCE')),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 48),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'abandoned')),
    xp_value INTEGER NOT NULL DEFAULT 10 CHECK (xp_value >= 1 AND xp_value <= 100),
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence TEXT CHECK (recurrence IN ('daily', 'weekly') OR recurrence IS NULL),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for tasks
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_pillar ON tasks(pillar);
CREATE INDEX idx_tasks_month ON tasks(month);
CREATE INDEX idx_tasks_status_pillar ON tasks(status, pillar);

-- ============================================
-- USER PROGRESS TABLE
-- ============================================

CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    current_month INTEGER NOT NULL DEFAULT 1 CHECK (current_month >= 1 AND current_month <= 48),
    start_date DATE NOT NULL DEFAULT current_date,
    streak_current INTEGER NOT NULL DEFAULT 0 CHECK (streak_current >= 0),
    streak_best INTEGER NOT NULL DEFAULT 0 CHECK (streak_best >= 0),
    pillar_xp JSONB NOT NULL DEFAULT '{"HACK": 0, "BUILD": 0, "AI": 0, "PRESENCE": 0}',
    monthly_completion JSONB NOT NULL DEFAULT '{}',
    badges TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user_progress
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- ============================================
-- LOGS TABLE
-- ============================================

CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT current_date,
    content TEXT NOT NULL CHECK (char_length(content) <= 500),
    pillar TEXT NOT NULL CHECK (pillar IN ('HACK', 'BUILD', 'AI', 'PRESENCE')),
    is_win BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for logs
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_date ON logs(date);
CREATE INDEX idx_logs_pillar ON logs(pillar);
CREATE INDEX idx_logs_is_win ON logs(is_win);

-- ============================================
-- CTF ENTRIES TABLE
-- ============================================

CREATE TABLE ctf_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('PicoCTF', 'HackTheBox', 'TryHackMe', 'CTFtime', 'Other')),
    date DATE NOT NULL DEFAULT current_date,
    category TEXT NOT NULL CHECK (category IN ('Web', 'Crypto', 'Forensics', 'Pwn', 'Misc')),
    solved BOOLEAN NOT NULL DEFAULT false,
    flag_notes TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for ctf_entries
CREATE INDEX idx_ctf_entries_user_id ON ctf_entries(user_id);
CREATE INDEX idx_ctf_entries_date ON ctf_entries(date);
CREATE INDEX idx_ctf_entries_platform ON ctf_entries(platform);
CREATE INDEX idx_ctf_entries_solved ON ctf_entries(solved);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- TASKS: Users can only access their own tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- USER_PROGRESS: Users can only access their own progress
CREATE POLICY "Users can view their own progress"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON user_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- LOGS: Users can only access their own logs
CREATE POLICY "Users can view their own logs"
    ON logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
    ON logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
    ON logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
    ON logs FOR DELETE
    USING (auth.uid() = user_id);

-- CTF_ENTRIES: Users can only access their own CTF entries
CREATE POLICY "Users can view their own ctf entries"
    ON ctf_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ctf entries"
    ON ctf_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ctf entries"
    ON ctf_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ctf entries"
    ON ctf_entries FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Handle new user creation
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress (user_id, current_month, start_date)
    VALUES (NEW.id, 1, current_date);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user progress on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMIT;

-- ============================================
-- Verify setup
-- ============================================

SELECT 'Tasks table created' as status, count(*) as columns
FROM information_schema.columns WHERE table_name = 'tasks';

SELECT 'RLS enabled' as status FROM pg_tables WHERE tablename = 'tasks' AND rowsecurity = true;