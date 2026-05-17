-- Era OS Database Migration
-- Roadmap persistence tables
-- Version: 004_roadmap_persistence

BEGIN;

-- ============================================
-- YEARLY ROADMAPS TABLE
-- ============================================

CREATE TABLE yearly_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    year INTEGER NOT NULL DEFAULT 1 CHECK (year >= 1 AND year <= 10),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for yearly_roadmaps
CREATE INDEX idx_yearly_roadmaps_user_id ON yearly_roadmaps(user_id);
CREATE INDEX idx_yearly_roadmaps_year ON yearly_roadmaps(year);
CREATE INDEX idx_yearly_roadmaps_active ON yearly_roadmaps(user_id, is_active) WHERE is_active = true;

-- ============================================
-- ROADMAP MONTHS TABLE
-- ============================================

CREATE TABLE roadmap_months (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES yearly_roadmaps(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 48),
    title TEXT NOT NULL,
    description TEXT,
    focus_areas JSONB NOT NULL DEFAULT '[]',
    deliverables JSONB NOT NULL DEFAULT '[]',
    suggested_tasks JSONB NOT NULL DEFAULT '[]',
    estimated_hours INTEGER DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(roadmap_id, month)
);

-- Indexes for roadmap_months
CREATE INDEX idx_roadmap_months_roadmap_id ON roadmap_months(roadmap_id);
CREATE INDEX idx_roadmap_months_month ON roadmap_months(month);
CREATE INDEX idx_roadmap_months_completed ON roadmap_months(roadmap_id, is_completed);

-- ============================================
-- ROADMAP MILESTONES TABLE
-- ============================================

CREATE TABLE roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES yearly_roadmaps(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 48),
    name TEXT NOT NULL,
    description TEXT,
    xp_required INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(roadmap_id, month, name)
);

-- Index for roadmap_milestones
CREATE INDEX idx_roadmap_milestones_roadmap_id ON roadmap_milestones(roadmap_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE yearly_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;

-- YEARLY_ROADMAPS: Users can only access their own roadmaps
CREATE POLICY "Users can view their own roadmaps"
    ON yearly_roadmaps FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps"
    ON yearly_roadmaps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps"
    ON yearly_roadmaps FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps"
    ON yearly_roadmaps FOR DELETE
    USING (auth.uid() = user_id);

-- ROADMAP_MONTHS: Access through parent roadmap
CREATE POLICY "Users can view their own roadmap months"
    ON roadmap_months FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_months.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own roadmap months"
    ON roadmap_months FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_months.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own roadmap months"
    ON roadmap_months FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_months.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own roadmap months"
    ON roadmap_months FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_months.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

-- ROADMAP_MILESTONES: Access through parent roadmap
CREATE POLICY "Users can view their own milestones"
    ON roadmap_milestones FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_milestones.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own milestones"
    ON roadmap_milestones FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_milestones.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own milestones"
    ON roadmap_milestones FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_milestones.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own milestones"
    ON roadmap_milestones FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM yearly_roadmaps 
        WHERE yearly_roadmaps.id = roadmap_milestones.roadmap_id 
        AND yearly_roadmaps.user_id = auth.uid()
    ));

-- ============================================
-- FUNCTION: Deactivate other roadmaps when setting one as active
-- ============================================

CREATE OR REPLACE FUNCTION set_active_roadmap(p_roadmap_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE yearly_roadmaps 
    SET is_active = false, updated_at = now()
    WHERE user_id = (SELECT user_id FROM yearly_roadmaps WHERE id = p_roadmap_id)
    AND id != p_roadmap_id;
    
    UPDATE yearly_roadmaps 
    SET is_active = true, updated_at = now()
    WHERE id = p_roadmap_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- Verify migration
SELECT 'Roadmap tables created' as status, 
       (SELECT count(*) FROM information_schema.tables WHERE table_name = 'yearly_roadmaps') +
       (SELECT count(*) FROM information_schema.tables WHERE table_name = 'roadmap_months') as tables_count;