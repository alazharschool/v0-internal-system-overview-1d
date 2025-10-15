-- ===========================================
-- COMPLETE DATABASE SETUP FOR AL-AZHAR SCHOOL
-- Run this entire script in Supabase SQL Editor
-- ===========================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS trial_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS student_status CASCADE;
DROP TYPE IF EXISTS teacher_status CASCADE;
DROP TYPE IF EXISTS class_status CASCADE;
DROP TYPE IF EXISTS trial_class_status CASCADE;
DROP TYPE IF EXISTS trial_class_outcome CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
CREATE TYPE course_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');

-- ===========================================
-- CREATE TABLES
-- ===========================================

-- Students Table
CREATE TABLE students (
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

-- Teachers Table
CREATE TABLE teachers (
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

-- Trial Classes Table
CREATE TABLE trial_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- CREATE INDEXES
-- ===========================================

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

-- ===========================================
-- CREATE TRIGGER FUNCTION
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
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

-- ===========================================
-- ENABLE ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on trial_classes" ON trial_classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on courses" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- INSERT SAMPLE DATA
-- ===========================================

-- Insert Teachers
INSERT INTO teachers (name, email, phone, subject, subjects, hourly_rate, join_date, status, bio, zoom_link) VALUES
('Dr. Mohamed Abdelrahman', 'mohamed.abdelrahman@alazhar.edu', '+20-100-111-2222', 'Quran Memorization', ARRAY['Quran Memorization', 'Tajweed', 'Tafsir'], 150.00, '2023-09-01', 'active', 'Ph.D. in Quranic Sciences from Al-Azhar University with 15 years of teaching experience', 'https://zoom.us/j/1234567890'),
('Prof. Aisha Ahmed', 'aisha.ahmed@alazhar.edu', '+20-100-222-3333', 'Arabic Language', ARRAY['Arabic Language', 'Grammar', 'Literature'], 120.00, '2023-09-15', 'active', 'Professor of Arabic Language with specialization in classical and modern literature', 'https://zoom.us/j/2345678901'),
('Dr. Ahmed Hassan', 'ahmed.hassan@alazhar.edu', '+20-100-333-4444', 'Islamic Studies', ARRAY['Islamic Studies', 'Fiqh', 'Aqeedah'], 140.00, '2023-10-01', 'active', 'Expert in Islamic jurisprudence and theology with international teaching experience', 'https://zoom.us/j/3456789012'),
('Prof. Fatima Salem', 'fatima.salem@alazhar.edu', '+20-100-444-5555', 'Hadith Studies', ARRAY['Hadith Studies', 'Hadith Sciences', 'Seerah'], 130.00, '2023-10-15', 'active', 'Specialized in Hadith authentication and prophetic biography', 'https://zoom.us/j/4567890123'),
('Sheikh Khaled Mohamed', 'khaled.mohamed@alazhar.edu', '+20-100-555-6666', 'Tajweed', ARRAY['Tajweed', 'Quranic Recitation'], 110.00, '2023-11-01', 'active', 'Certified Quran reciter with Ijazah in multiple Qiraat', 'https://zoom.us/j/5678901234');

-- Insert Students
INSERT INTO students (name, email, phone, age, grade, subject, parent_name, parent_phone, parent_email, address, status, enrollment_date, notes) VALUES
('Ahmed Mohamed Ali', 'ahmed.ali@example.com', '+20-100-123-4567', 15, 'Grade 10', 'Quran Memorization', 'Mohamed Ali', '+20-100-123-4568', 'mohamed.ali@example.com', 'Cairo, Egypt', 'active', '2024-01-15', 'Excellent student with strong memorization skills'),
('Fatima Abdullah', 'fatima.abdullah@example.com', '+966-555-123-4567', 14, 'Grade 9', 'Arabic Language', 'Abdullah Hassan', '+966-555-123-4568', 'abdullah.hassan@example.com', 'Riyadh, Saudi Arabia', 'active', '2024-02-01', 'Very attentive and participates actively'),
('Omar Hassan', 'omar.hassan@example.com', '+971-50-123-4567', 16, 'Grade 11', 'Islamic Studies', 'Hassan Ahmed', '+971-50-123-4568', 'hassan.ahmed@example.com', 'Dubai, UAE', 'active', '2024-01-20', 'Shows great interest in Islamic history'),
('Khadija Salem', 'khadija.salem@example.com', '+20-110-123-4567', 13, 'Grade 8', 'Hadith Studies', 'Salem Ibrahim', '+20-110-123-4568', 'salem.ibrahim@example.com', 'Alexandria, Egypt', 'active', '2024-02-10', 'Quick learner with excellent comprehension'),
('Youssef Ibrahim', 'youssef.ibrahim@example.com', '+20-120-123-4567', 12, 'Grade 7', 'Tajweed', 'Ibrahim Mahmoud', '+20-120-123-4568', 'ibrahim.mahmoud@example.com', 'Giza, Egypt', 'active', '2024-01-25', 'Needs encouragement but making good progress');

-- Insert Trial Classes
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, parent_email, teacher_id, subject, date, time, duration, status, outcome, notes)
SELECT 
  'Sarah Ahmed', 
  'sarah.ahmed@example.com', 
  '+20-100-777-8888', 
  'Ahmed Mohamed', 
  '+20-100-777-8889', 
  'ahmed.mohamed@example.com',
  id, 
  'Quran Memorization', 
  CURRENT_DATE + INTERVAL '1 day', 
  '16:00:00', 
  30, 
  'scheduled', 
  'pending', 
  'First trial class for new student'
FROM teachers WHERE email = 'mohamed.abdelrahman@alazhar.edu';

-- Insert Classes
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status, notes)
SELECT 
  s.id,
  t.id,
  'Quran Memorization',
  CURRENT_DATE,
  '09:00:00',
  '10:00:00',
  60,
  'scheduled',
  'Review Surah Al-Baqarah'
FROM students s, teachers t 
WHERE s.email = 'ahmed.ali@example.com' AND t.email = 'mohamed.abdelrahman@alazhar.edu';

-- Insert Courses
INSERT INTO courses (student_id, teacher_id, subject, start_date, end_date, total_classes, completed_classes, remaining_classes, progress_percentage, monthly_fee, status)
SELECT 
  s.id,
  t.id,
  'Quran Memorization',
  '2024-01-15',
  '2024-12-15',
  48,
  12,
  36,
  25.00,
  300.00,
  'active'
FROM students s, teachers t 
WHERE s.email = 'ahmed.ali@example.com' AND t.email = 'mohamed.abdelrahman@alazhar.edu';

-- Insert Payments
INSERT INTO payments (student_id, amount, currency, payment_date, payment_method, status, notes)
SELECT 
  id,
  300.00,
  'USD',
  CURRENT_DATE - INTERVAL '5 days',
  'Credit Card',
  'paid',
  'Monthly tuition payment'
FROM students WHERE email = 'ahmed.ali@example.com';

-- Insert Activities
INSERT INTO activities (action_type, description, metadata) VALUES
('student_added', 'New student Ahmed Mohamed Ali was added to the system', '{"student_id": "1", "student_name": "Ahmed Mohamed Ali"}'::jsonb),
('class_scheduled', 'Class scheduled for Fatima Abdullah', '{"class_id": "1"}'::jsonb),
('payment_received', 'Payment received from Omar Hassan', '{"payment_id": "1", "amount": 300}'::jsonb);

-- Success message
SELECT 'Database setup completed successfully!' as message;
