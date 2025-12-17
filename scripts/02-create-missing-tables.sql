-- ===============================================
-- إنشاء الجداول المفقودة في قاعدة البيانات
-- Missing Tables: students, teachers, classes, trial_classes
-- ===============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types (if not exist)
DO $$ BEGIN
  CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ===============================================
-- STUDENTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  age INTEGER,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  address TEXT,
  status student_status NOT NULL DEFAULT 'active',
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- TEACHERS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status teacher_status NOT NULL DEFAULT 'active',
  bio TEXT,
  zoom_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- TRIAL CLASSES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS trial_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status trial_class_status NOT NULL DEFAULT 'scheduled',
  outcome trial_class_outcome NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- CLASSES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  status class_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- CREATE INDEXES
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);

CREATE INDEX IF NOT EXISTS idx_trial_classes_date ON trial_classes(date);
CREATE INDEX IF NOT EXISTS idx_trial_classes_status ON trial_classes(status);
CREATE INDEX IF NOT EXISTS idx_trial_classes_teacher_id ON trial_classes(teacher_id);

CREATE INDEX IF NOT EXISTS idx_classes_student_id ON classes(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_class_date ON classes(class_date);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

-- ===============================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- ===============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trial_classes_updated_at ON trial_classes;
CREATE TRIGGER update_trial_classes_updated_at BEFORE UPDATE ON trial_classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- ENABLE ROW LEVEL SECURITY
-- ===============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (can be customized later)
DROP POLICY IF EXISTS "Allow all operations on students" ON students;
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on teachers" ON teachers;
CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on trial_classes" ON trial_classes;
CREATE POLICY "Allow all operations on trial_classes" ON trial_classes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on classes" ON classes;
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);

-- ===============================================
-- INSERT SAMPLE DATA
-- ===============================================

-- Insert 5 sample teachers
INSERT INTO teachers (name, email, phone, subject, subjects, hourly_rate, status) VALUES
('أحمد محمود', 'ahmed.mahmoud@alazhar.school', '+201001234567', 'قرآن كريم', ARRAY['قرآن كريم', 'تجويد'], 50.00, 'active'),
('فاطمة علي', 'fatma.ali@alazhar.school', '+201002345678', 'لغة عربية', ARRAY['لغة عربية', 'نحو'], 45.00, 'active'),
('محمد حسن', 'mohamed.hassan@alazhar.school', '+201003456789', 'دراسات إسلامية', ARRAY['فقه', 'حديث', 'سيرة'], 55.00, 'active'),
('سارة إبراهيم', 'sara.ibrahim@alazhar.school', '+201004567890', 'رياضيات', ARRAY['رياضيات'], 40.00, 'active'),
('خالد عمر', 'khaled.omar@alazhar.school', '+201005678901', 'علوم', ARRAY['علوم', 'أحياء'], 42.00, 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert 30 sample students
INSERT INTO students (name, email, phone, grade, subject, parent_name, parent_phone, status) VALUES
('محمد أحمد', 'student1@example.com', '+201101234567', 'Grade 5', 'قرآن كريم', 'أحمد والد', '+201201234567', 'active'),
('فاطمة محمد', 'student2@example.com', '+201102345678', 'Grade 6', 'لغة عربية', 'محمد والد', '+201202345678', 'active'),
('علي حسن', 'student3@example.com', '+201103456789', 'Grade 7', 'رياضيات', 'حسن والد', '+201203456789', 'active'),
('مريم خالد', 'student4@example.com', '+201104567890', 'Grade 5', 'قرآن كريم', 'خالد والد', '+201204567890', 'active'),
('أحمد علي', 'student5@example.com', '+201105678901', 'Grade 8', 'علوم', 'علي والد', '+201205678901', 'active'),
('سارة محمود', 'student6@example.com', '+201106789012', 'Grade 6', 'لغة عربية', 'محمود والد', '+201206789012', 'active'),
('يوسف إبراهيم', 'student7@example.com', '+201107890123', 'Grade 7', 'دراسات إسلامية', 'إبراهيم والد', '+201207890123', 'active'),
('نور الدين', 'student8@example.com', '+201108901234', 'Grade 5', 'قرآن كريم', 'الدين والد', '+201208901234', 'active'),
('ليلى أحمد', 'student9@example.com', '+201109012345', 'Grade 8', 'رياضيات', 'أحمد والد', '+201209012345', 'active'),
('عمر محمد', 'student10@example.com', '+201110123456', 'Grade 6', 'علوم', 'محمد والد', '+201210123456', 'active'),
('زينب حسن', 'student11@example.com', '+201111234567', 'Grade 7', 'لغة عربية', 'حسن والد', '+201211234567', 'active'),
('حمزة علي', 'student12@example.com', '+201112345678', 'Grade 5', 'قرآن كريم', 'علي والد', '+201212345678', 'active'),
('هدى خالد', 'student13@example.com', '+201113456789', 'Grade 8', 'دراسات إسلامية', 'خالد والد', '+201213456789', 'active'),
('طارق محمود', 'student14@example.com', '+201114567890', 'Grade 6', 'رياضيات', 'محمود والد', '+201214567890', 'active'),
('أمينة إبراهيم', 'student15@example.com', '+201115678901', 'Grade 7', 'علوم', 'إبراهيم والد', '+201215678901', 'active'),
('كريم أحمد', 'student16@example.com', '+201116789012', 'Grade 5', 'لغة عربية', 'أحمد والد', '+201216789012', 'active'),
('ياسمين محمد', 'student17@example.com', '+201117890123', 'Grade 8', 'قرآن كريم', 'محمد والد', '+201217890123', 'active'),
('سالم حسن', 'student18@example.com', '+201118901234', 'Grade 6', 'دراسات إسلامية', 'حسن والد', '+201218901234', 'active'),
('ريم علي', 'student19@example.com', '+201119012345', 'Grade 7', 'رياضيات', 'علي والد', '+201219012345', 'active'),
('بلال خالد', 'student20@example.com', '+201120123456', 'Grade 5', 'علوم', 'خالد والد', '+201220123456', 'active'),
('دينا محمود', 'student21@example.com', '+201121234567', 'Grade 8', 'لغة عربية', 'محمود والد', '+201221234567', 'active'),
('عبدالله إبراهيم', 'student22@example.com', '+201122345678', 'Grade 6', 'قرآن كريم', 'إبراهيم والد', '+201222345678', 'active'),
('ندى أحمد', 'student23@example.com', '+201123456789', 'Grade 7', 'دراسات إسلامية', 'أحمد والد', '+201223456789', 'active'),
('ماجد محمد', 'student24@example.com', '+201124567890', 'Grade 5', 'رياضيات', 'محمد والد', '+201224567890', 'active'),
('سلمى حسن', 'student25@example.com', '+201125678901', 'Grade 8', 'علوم', 'حسن والد', '+201225678901', 'active'),
('وليد علي', 'student26@example.com', '+201126789012', 'Grade 6', 'لغة عربية', 'علي والد', '+201226789012', 'active'),
('رنا خالد', 'student27@example.com', '+201127890123', 'Grade 7', 'قرآن كريم', 'خالد والد', '+201227890123', 'active'),
('عادل محمود', 'student28@example.com', '+201128901234', 'Grade 5', 'دراسات إسلامية', 'محمود والد', '+201228901234', 'active'),
('منى إبراهيم', 'student29@example.com', '+201129012345', 'Grade 8', 'رياضيات', 'إبراهيم والد', '+201229012345', 'active'),
('زياد أحمد', 'student30@example.com', '+201130123456', 'Grade 6', 'علوم', 'أحمد والد', '+201230123456', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample classes (linking students and teachers)
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status)
SELECT 
  s.id,
  t.id,
  s.subject,
  CURRENT_DATE,
  (ARRAY['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'])[floor(random() * 10 + 1)]::TIME,
  (ARRAY['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'])[floor(random() * 10 + 1)]::TIME,
  60,
  'scheduled'
FROM students s
CROSS JOIN teachers t
WHERE s.subject = t.subject
LIMIT 50;

-- Insert sample trial classes
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, teacher_id, subject, date, time, duration, status, outcome)
SELECT 
  'طالب تجريبي ' || generate_series,
  'trial' || generate_series || '@example.com',
  '+2011' || lpad((30000000 + generate_series)::TEXT, 8, '0'),
  'ولي أمر ' || generate_series,
  '+2012' || lpad((30000000 + generate_series)::TEXT, 8, '0'),
  t.id,
  t.subject,
  CURRENT_DATE + (generate_series % 7),
  (ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])[floor(random() * 6 + 1)]::TIME,
  30,
  'scheduled',
  'pending'
FROM generate_series(1, 10) AS generate_series
CROSS JOIN (SELECT id, subject FROM teachers LIMIT 1) AS t;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================
DO $$
DECLARE
  students_count INTEGER;
  teachers_count INTEGER;
  classes_count INTEGER;
  trial_classes_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO students_count FROM students;
  SELECT COUNT(*) INTO teachers_count FROM teachers;
  SELECT COUNT(*) INTO classes_count FROM classes;
  SELECT COUNT(*) INTO trial_classes_count FROM trial_classes;
  
  RAISE NOTICE '✅ إنشاء الجداول المفقودة تم بنجاح!';
  RAISE NOTICE '✅ Created students table with % records', students_count;
  RAISE NOTICE '✅ Created teachers table with % records', teachers_count;
  RAISE NOTICE '✅ Created classes table with % records', classes_count;
  RAISE NOTICE '✅ Created trial_classes table with % records', trial_classes_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔐 الخطوة التالية: إنشاء حساب Admin في Supabase Auth';
  RAISE NOTICE '   البريد الإلكتروني: admin@alazhar.school';
  RAISE NOTICE '   كلمة المرور: mbanora1983';
  RAISE NOTICE '';
  RAISE NOTICE '📊 يمكنك الآن تسجيل الدخول وعرض Dashboard';
END $$;
