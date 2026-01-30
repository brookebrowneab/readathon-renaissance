-- Add timezone column to events table for phase calculations
ALTER TABLE events 
ADD COLUMN timezone TEXT NOT NULL DEFAULT 'America/New_York';

-- Add verification columns to children table
ALTER TABLE children 
ADD COLUMN total_verified BOOLEAN DEFAULT false,
ADD COLUMN verified_at TIMESTAMPTZ,
ADD COLUMN verified_by UUID;

-- Add final amount columns to pledges for payment finalization
ALTER TABLE pledges 
ADD COLUMN final_amount NUMERIC,
ADD COLUMN finalized_at TIMESTAMPTZ;

-- Create event_winners table
CREATE TABLE event_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  grade_info TEXT NOT NULL,
  winner_type TEXT NOT NULL CHECK (winner_type IN ('student', 'class')),
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  class_name TEXT,
  total_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, grade_info, winner_type)
);

-- Enable RLS on event_winners
ALTER TABLE event_winners ENABLE ROW LEVEL SECURITY;

-- Anyone can view winners (public results)
CREATE POLICY "Anyone can view event winners"
ON event_winners FOR SELECT
USING (true);

-- Only admins can manage winners
CREATE POLICY "Admins can manage event winners"
ON event_winners FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));