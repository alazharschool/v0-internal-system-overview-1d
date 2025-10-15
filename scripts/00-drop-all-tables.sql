-- Drop all tables in reverse order of dependencies
-- This script is safe to run even if tables don't exist

DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS trial_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Also drop any custom types if they exist
DROP TYPE IF EXISTS student_status CASCADE;
DROP TYPE IF EXISTS teacher_status CASCADE;
DROP TYPE IF EXISTS class_status CASCADE;
DROP TYPE IF EXISTS trial_class_status CASCADE;
DROP TYPE IF EXISTS trial_class_outcome CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop extension if needed (optional - usually keep it)
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All tables and types have been dropped successfully';
END $$;
