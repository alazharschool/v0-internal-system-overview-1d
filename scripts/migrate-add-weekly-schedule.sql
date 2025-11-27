-- Migration: Add weekly_schedule column to students table
-- Description: Add support for storing student weekly class schedules

-- Check if column already exists
ALTER TABLE students
ADD COLUMN IF NOT EXISTS weekly_schedule jsonb DEFAULT null;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_students_weekly_schedule ON students USING GIN (weekly_schedule);

-- Add comment to document the column
COMMENT ON COLUMN students.weekly_schedule IS 'JSON array containing weekly class schedule (day, time, teacher assignments)';
