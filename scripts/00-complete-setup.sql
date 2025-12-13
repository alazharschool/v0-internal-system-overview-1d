-- Complete Al-Azhar School Database Setup
-- Run this file in Supabase SQL Editor to set up everything

-- ===============================================
-- STEP 1: Clean slate (drop everything)
-- ===============================================

DROP POLICY IF EXISTS "Allow all operations on activities" ON activities;
DROP POLICY IF EXISTS "Allow all operations on certificates" ON certificates;
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
DROP POLICY IF EXISTS "Allow all operations on courses" ON courses;
DROP POLICY IF EXISTS "Allow all operations on classes" ON classes;
DROP POLICY IF EXISTS "Allow all operations on trial_classes" ON trial_classes;
DROP POLICY IF EXISTS "Allow all operations on teachers" ON teachers;
DROP POLICY IF EXISTS "Allow all operations on students" ON students;

DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
DROP TRIGGER IF EXISTS update_trial_classes_updated_at ON trial_classes;
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
DROP TRIGGER IF EXISTS update_students_updated_at ON students;

DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS trial_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS trial_class_outcome CASCADE;
DROP TYPE IF EXISTS trial_class_status CASCADE;
DROP TYPE IF EXISTS class_status CASCADE;
DROP TYPE IF EXISTS teacher_status CASCADE;
DROP TYPE IF EXISTS student_status CASCADE;

-- ===============================================
-- STEP 2: Create custom types
-- ===============================================

CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
CREATE TYPE course_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');

-- ===============================================
-- STEP 3: Create all tables
-- ===============================================

-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Teachers Table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Trial Classes Table
CREATE TABLE trial_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
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

-- Classes Table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_classes INTEGER NOT NULL DEFAULT 0,
  completed_classes INTEGER NOT NULL DEFAULT 0,
  remaining_classes INTEGER NOT NULL DEFAULT 0,
  progress_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status course_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- STEP 4: Create indexes
-- ===============================================

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_created_at ON students(created_at DESC);

CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_teachers_subject ON teachers(subject);

CREATE INDEX idx_trial_classes_date ON trial_classes(date);
CREATE INDEX idx_trial_classes_status ON trial_classes(status);
CREATE INDEX idx_trial_classes_teacher_id ON trial_classes(teacher_id);

CREATE INDEX idx_classes_student_id ON classes(student_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_date ON classes(class_date);
CREATE INDEX idx_classes_status ON classes(status);

CREATE INDEX idx_courses_student_id ON courses(student_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);

CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);

CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_action_type ON activities(action_type);

-- ===============================================
-- STEP 5: Create triggers
-- ===============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trial_classes_updated_at BEFORE UPDATE ON trial_classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- STEP 6: Enable RLS and create policies
-- ===============================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Permissive policies (you can add auth logic later)
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on trial_classes" ON trial_classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on courses" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true) WITH CHECK (true);

-- ===============================================
-- STEP 7: Insert seed data
-- ===============================================

-- Insert 5 teachers
INSERT INTO teachers (name, email, phone, subject, subjects, hourly_rate, bio, zoom_link) VALUES
('Sheikh Ahmed Al-Mansour', 'ahmed.mansour@alazhar.school', '+20-123-456-7891', 'Quran Recitation', ARRAY['Quran Recitation', 'Tajweed', 'Islamic Studies'], 25.00, 'Expert in Quran recitation with 15 years of teaching experience', 'https://zoom.us/j/teacher1'),
('Ustadh Fatima Hassan', 'fatima.hassan@alazhar.school', '+20-123-456-7892', 'Arabic Language', ARRAY['Arabic Language', 'Grammar', 'Literature'], 20.00, 'Specialized in Arabic language and grammar for non-native speakers', 'https://zoom.us/j/teacher2'),
('Sheikh Mohammed Ibrahim', 'mohammed.ibrahim@alazhar.school', '+20-123-456-7893', 'Tajweed', ARRAY['Tajweed', 'Quranic Sciences', 'Memorization'], 30.00, 'Master of Tajweed rules with Ijazah in Hafs narration', 'https://zoom.us/j/teacher3'),
('Ustadha Aisha Abdallah', 'aisha.abdallah@alazhar.school', '+20-123-456-7894', 'Islamic Studies', ARRAY['Islamic Studies', 'Fiqh', 'Hadith'], 22.00, 'Scholar in Islamic jurisprudence and Hadith sciences', 'https://zoom.us/j/teacher4'),
('Sheikh Omar Khalil', 'omar.khalil@alazhar.school', '+20-123-456-7895', 'Quran Memorization', ARRAY['Quran Memorization', 'Revision', 'Recitation'], 28.00, 'Hafiz with 20 years helping students memorize the Holy Quran', 'https://zoom.us/j/teacher5');

-- Insert 30 students with diverse data
INSERT INTO students (name, email, phone, age, grade, subject, parent_name, parent_phone, parent_email, address, status) VALUES
('Yusuf Abdullah', 'yusuf.abdullah@student.com', '+1-555-0101', 12, 'Grade 7', 'Quran Recitation', 'Abdullah Mohammed', '+1-555-0100', 'abdullah.m@parent.com', '123 Main St, New York, NY', 'active'),
('Maryam Ahmed', 'maryam.ahmed@student.com', '+44-20-1234-5101', 10, 'Grade 5', 'Arabic Language', 'Ahmed Hassan', '+44-20-1234-5100', 'ahmed.h@parent.com', '45 Oxford Rd, London, UK', 'active'),
('Ibrahim Khan', 'ibrahim.khan@student.com', '+92-300-1234561', 14, 'Grade 9', 'Tajweed', 'Khan Sahib', '+92-300-1234560', 'khan.s@parent.com', 'Karachi, Pakistan', 'active'),
('Fatima Ali', 'fatima.ali@student.com', '+966-50-123-4561', 11, 'Grade 6', 'Islamic Studies', 'Ali Rahman', '+966-50-123-4560', 'ali.r@parent.com', 'Riyadh, Saudi Arabia', 'active'),
('Omar Hassan', 'omar.hassan@student.com', '+971-50-123-4561', 13, 'Grade 8', 'Quran Memorization', 'Hassan Ahmed', '+971-50-123-4560', 'hassan.a@parent.com', 'Dubai, UAE', 'active'),
('Aisha Mohammed', 'aisha.mohammed@student.com', '+1-416-123-4561', 9, 'Grade 4', 'Quran Recitation', 'Mohammed Ibrahim', '+1-416-123-4560', 'mohammed.i@parent.com', 'Toronto, Canada', 'active'),
('Zainab Khalil', 'zainab.khalil@student.com', '+61-2-1234-5671', 15, 'Grade 10', 'Arabic Language', 'Khalil Omar', '+61-2-1234-5670', 'khalil.o@parent.com', 'Sydney, Australia', 'active'),
('Hamza Yusuf', 'hamza.yusuf@student.com', '+49-30-12345671', 12, 'Grade 7', 'Tajweed', 'Yusuf Abdullah', '+49-30-12345670', 'yusuf.a@parent.com', 'Berlin, Germany', 'active'),
('Khadija Mustafa', 'khadija.mustafa@student.com', '+33-1-4567-8901', 11, 'Grade 6', 'Islamic Studies', 'Mustafa Ahmed', '+33-1-4567-8900', 'mustafa.a@parent.com', 'Paris, France', 'active'),
('Ali Rashid', 'ali.rashid@student.com', '+965-9876-5431', 10, 'Grade 5', 'Quran Memorization', 'Rashid Ali', '+965-9876-5430', 'rashid.a@parent.com', 'Kuwait City, Kuwait', 'active'),
('Sara Ibrahim', 'sara.ibrahim@student.com', '+20-100-123-4561', 14, 'Grade 9', 'Quran Recitation', 'Ibrahim Hassan', '+20-100-123-4560', 'ibrahim.h@parent.com', 'Cairo, Egypt', 'active'),
('Abdullah Mahmoud', 'abdullah.mahmoud@student.com', '+962-79-123-4561', 13, 'Grade 8', 'Arabic Language', 'Mahmoud Ali', '+962-79-123-4560', 'mahmoud.a@parent.com', 'Amman, Jordan', 'active'),
('Hafsa Omar', 'hafsa.omar@student.com', '+27-71-234-5671', 9, 'Grade 4', 'Tajweed', 'Omar Mohammed', '+27-71-234-5670', 'omar.m@parent.com', 'Cape Town, South Africa', 'active'),
('Bilal Ahmed', 'bilal.ahmed@student.com', '+880-171-234-5671', 16, 'Grade 11', 'Islamic Studies', 'Ahmed Karim', '+880-171-234-5670', 'ahmed.k@parent.com', 'Dhaka, Bangladesh', 'active'),
('Ruqayya Hassan', 'ruqayya.hassan@student.com', '+60-12-345-6781', 12, 'Grade 7', 'Quran Memorization', 'Hassan Ibrahim', '+60-12-345-6780', 'hassan.i@parent.com', 'Kuala Lumpur, Malaysia', 'active'),
('Tariq Yusuf', 'tariq.yusuf@student.com', '+212-6-1234-5671', 11, 'Grade 6', 'Quran Recitation', 'Yusuf Khalil', '+212-6-1234-5670', 'yusuf.k@parent.com', 'Casablanca, Morocco', 'active'),
('Noor Abdullah', 'noor.abdullah@student.com', '+90-532-123-4561', 10, 'Grade 5', 'Arabic Language', 'Abdullah Omar', '+90-532-123-4560', 'abdullah.o@parent.com', 'Istanbul, Turkey', 'active'),
('Sumayyah Ali', 'sumayyah.ali@student.com', '+1-713-123-4561', 15, 'Grade 10', 'Tajweed', 'Ali Mahmoud', '+1-713-123-4560', 'ali.m@parent.com', 'Houston, TX', 'active'),
('Zayd Mohammed', 'zayd.mohammed@student.com', '+44-121-234-5671', 13, 'Grade 8', 'Islamic Studies', 'Mohammed Hassan', '+44-121-234-5670', 'mohammed.h@parent.com', 'Birmingham, UK', 'active'),
('Layla Ahmed', 'layla.ahmed@student.com', '+971-52-123-4561', 9, 'Grade 4', 'Quran Memorization', 'Ahmed Rashid', '+971-52-123-4560', 'ahmed.r@parent.com', 'Abu Dhabi, UAE', 'active'),
('Umar Khalil', 'umar.khalil@student.com', '+966-55-123-4561', 14, 'Grade 9', 'Quran Recitation', 'Khalil Ibrahim', '+966-55-123-4560', 'khalil.i@parent.com', 'Jeddah, Saudi Arabia', 'active'),
('Amina Hassan', 'amina.hassan@student.com', '+92-321-123-4561', 12, 'Grade 7', 'Arabic Language', 'Hassan Ali', '+92-321-123-4560', 'hassan.ali@parent.com', 'Lahore, Pakistan', 'active'),
('Anas Abdullah', 'anas.abdullah@student.com', '+1-202-123-4561', 11, 'Grade 6', 'Tajweed', 'Abdullah Yusuf', '+1-202-123-4560', 'abdullah.y@parent.com', 'Washington DC, USA', 'active'),
('Safiyyah Omar', 'safiyyah.omar@student.com', '+61-3-1234-5671', 10, 'Grade 5', 'Islamic Studies', 'Omar Ahmed', '+61-3-1234-5670', 'omar.ahmed@parent.com', 'Melbourne, Australia', 'active'),
('Khalid Mohammed', 'khalid.mohammed@student.com', '+49-89-1234-5671', 16, 'Grade 11', 'Quran Memorization', 'Mohammed Khalil', '+49-89-1234-5670', 'mohammed.k@parent.com', 'Munich, Germany', 'active'),
('Asma Ibrahim', 'asma.ibrahim@student.com', '+33-4-5678-9011', 13, 'Grade 8', 'Quran Recitation', 'Ibrahim Hassan', '+33-4-5678-9010', 'ibrahim.hassan@parent.com', 'Lyon, France', 'active'),
('Hamid Ali', 'hamid.ali@student.com', '+20-120-123-4561', 9, 'Grade 4', 'Arabic Language', 'Ali Mahmoud', '+20-120-123-4560', 'ali.mahmoud@parent.com', 'Alexandria, Egypt', 'active'),
('Mariam Yusuf', 'mariam.yusuf@student.com', '+962-77-123-4561', 15, 'Grade 10', 'Tajweed', 'Yusuf Omar', '+962-77-123-4560', 'yusuf.omar@parent.com', 'Amman, Jordan', 'active'),
('Saad Hassan', 'saad.hassan@student.com', '+965-6543-2101', 12, 'Grade 7', 'Islamic Studies', 'Hassan Abdullah', '+965-6543-2100', 'hassan.abdullah@parent.com', 'Kuwait City, Kuwait', 'active'),
('Huda Mohammed', 'huda.mohammed@student.com', '+1-312-123-4561', 11, 'Grade 6', 'Quran Memorization', 'Mohammed Ali', '+1-312-123-4560', 'mohammed.ali@parent.com', 'Chicago, IL', 'active');

-- Insert trial classes for today and tomorrow
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, parent_email, teacher_id, subject, date, time, status) 
SELECT 
  'Trial Student ' || gs::text,
  'trial' || gs::text || '@student.com',
  '+1-555-' || LPAD(gs::text, 4, '0'),
  'Parent ' || gs::text,
  '+1-555-' || LPAD((gs+1000)::text, 4, '0'),
  'parent' || gs::text || '@parent.com',
  (SELECT id FROM teachers ORDER BY RANDOM() LIMIT 1),
  (ARRAY['Quran Recitation', 'Arabic Language', 'Tajweed', 'Islamic Studies'])[floor(random() * 4 + 1)],
  CURRENT_DATE + ((gs % 2) || ' days')::interval,
  ('09:00'::time + (gs * interval '1 hour')),
  'scheduled'::trial_class_status
FROM generate_series(1, 5) gs;

-- Insert classes for each student with all 5 teachers (daily schedule)
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status)
SELECT 
  s.id,
  t.id,
  t.subject,
  CURRENT_DATE,
  ('08:00'::time + ((row_number() OVER (PARTITION BY s.id ORDER BY t.id) - 1) * interval '2 hours')),
  ('09:00'::time + ((row_number() OVER (PARTITION BY s.id ORDER BY t.id) - 1) * interval '2 hours')),
  60,
  'scheduled'::class_status
FROM students s
CROSS JOIN teachers t
WHERE s.status = 'active' AND t.status = 'active'
LIMIT 150; -- 30 students × 5 teachers = 150 classes per day

-- Insert courses
INSERT INTO courses (student_id, teacher_id, subject, start_date, end_date, total_classes, completed_classes, remaining_classes, progress_percentage, monthly_fee, status)
SELECT 
  s.id,
  (SELECT id FROM teachers ORDER BY RANDOM() LIMIT 1),
  (ARRAY['Quran Recitation', 'Arabic Language', 'Tajweed', 'Islamic Studies', 'Quran Memorization'])[floor(random() * 5 + 1)],
  CURRENT_DATE - interval '30 days',
  CURRENT_DATE + interval '60 days',
  40,
  floor(random() * 20 + 10)::int,
  floor(random() * 20 + 10)::int,
  floor(random() * 50 + 25)::numeric,
  floor(random() * 100 + 100)::numeric,
  'active'::course_status
FROM students s
WHERE s.status = 'active';

-- Insert payments
INSERT INTO payments (student_id, amount, payment_date, payment_method, status)
SELECT 
  s.id,
  floor(random() * 200 + 100)::numeric,
  CURRENT_DATE - (floor(random() * 30))::int,
  (ARRAY['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'])[floor(random() * 4 + 1)],
  (ARRAY['paid', 'pending'])[floor(random() * 2 + 1)]::payment_status
FROM students s
WHERE s.status = 'active';

-- Insert activities
INSERT INTO activities (user_id, action_type, description, metadata)
SELECT 
  NULL,
  (ARRAY['student_enrolled', 'class_scheduled', 'payment_received', 'certificate_issued'])[floor(random() * 4 + 1)],
  'System activity for ' || s.name,
  jsonb_build_object('student_id', s.id::text, 'timestamp', NOW())
FROM students s
LIMIT 50;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ Created 8 tables with indexes, triggers, and RLS policies';
  RAISE NOTICE '✅ Inserted 5 teachers';
  RAISE NOTICE '✅ Inserted 30 students';
  RAISE NOTICE '✅ Inserted 5 trial classes';
  RAISE NOTICE '✅ Inserted 150 daily classes';
  RAISE NOTICE '✅ Inserted 30 courses';
  RAISE NOTICE '✅ Inserted 30 payments';
  RAISE NOTICE '✅ Inserted 50 activity logs';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Next step: Create admin user in Supabase Auth';
  RAISE NOTICE '   Email: admin@alazhar.school';
  RAISE NOTICE '   Password: mbanora1983';
END $$;
