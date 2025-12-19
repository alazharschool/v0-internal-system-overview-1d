-- ===============================================
-- إصلاح شامل لقاعدة البيانات - الإصدار الثالث
-- ===============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. تحديث جدول students
ALTER TABLE students ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS assigned_teacher TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS study_days TEXT[];
ALTER TABLE students ADD COLUMN IF NOT EXISTS study_time TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS lesson_duration INTEGER DEFAULT 60;
ALTER TABLE students ADD COLUMN IF NOT EXISTS monthly_payments DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS custom_notes TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. تحديث جدول teachers
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS assigned_students TEXT[];
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS monthly_salary DECIMAL(10, 2);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. إنشاء جدول classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL DEFAULT 'قرآن كريم',
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. إنشاء جدول trial_classes
CREATE TABLE IF NOT EXISTS trial_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. إضافة بيانات تجريبية للحصص
INSERT INTO trial_classes (student_name, student_email, date, start_time, duration, status, notes)
VALUES 
('أحمد علي', 'ahmed@test.com', CURRENT_DATE + 1, '10:00:00', 30, 'scheduled', 'حصة تجريبية جديدة'),
('ليلى محمد', 'laila@test.com', CURRENT_DATE + 2, '14:30:00', 30, 'scheduled', 'حصة تجريبية جديدة')
ON CONFLICT DO NOTHING;
